import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getNextServiceDate,
  getSeasonalWindow,
  isInSeasonalWindow,
  isServiceDue,
} from "@/lib/recurring-scheduler";

interface GeneratedBookingSummary {
  serviceId: string;
  scheduledDate: string;
  bookingId: string;
}

interface SubscriptionResult {
  subscriptionId: string;
  profileId: string;
  created: GeneratedBookingSummary[];
  skipped: string[];
  errors: string[];
}

/**
 * POST /api/scheduler/generate
 *
 * Generate recurring bookings for active subscriptions.
 *
 * Auth: admin user or cron job with CRON_SECRET header.
 *
 * Body (optional):
 *   { subscriptionId: string }  - process a single subscription
 *   {} or no body              - process ALL active subscriptions
 *
 * For each active subscription:
 *   - Get subscription_services
 *   - For each service, check if it's due based on last completed booking
 *   - If due, create a new booking (scheduled status, no contractor yet)
 *   - Log what was created
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // ---- Auth check: admin or cron secret ----
    const cronSecret = req.headers.get("x-cron-secret");
    const isValidCron =
      cronSecret && process.env.CRON_SECRET && cronSecret === process.env.CRON_SECRET;

    if (!isValidCron) {
      // Fall back to user auth - check if admin
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Check if user is an admin (you can customize this check)
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .single();

      // For now, only allow admin-type operations from authenticated users
      // In production you'd have a proper admin role
      if (!profile) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // ---- Parse body ----
    let targetSubscriptionId: string | null = null;
    try {
      const body = await req.json();
      if (body?.subscriptionId) {
        targetSubscriptionId = body.subscriptionId;
      }
    } catch {
      // No body or invalid JSON - process all
    }

    // ---- Fetch subscriptions to process ----
    let subscriptionsQuery = supabase
      .from("subscriptions")
      .select("*, subscription_services(*)")
      .in("status", ["active", "trialing"]);

    if (targetSubscriptionId) {
      subscriptionsQuery = subscriptionsQuery.eq("id", targetSubscriptionId);
    }

    const { data: subscriptions, error: subErr } = await subscriptionsQuery;

    if (subErr) {
      return NextResponse.json(
        { error: "Failed to fetch subscriptions", detail: subErr.message },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        message: "No active subscriptions found",
        results: [],
      });
    }

    // ---- Process each subscription ----
    const results: SubscriptionResult[] = [];

    for (const sub of subscriptions) {
      const result: SubscriptionResult = {
        subscriptionId: sub.id,
        profileId: sub.profile_id,
        created: [],
        skipped: [],
        errors: [],
      };

      const propertyId = sub.property_id;
      if (!propertyId) {
        result.errors.push("Subscription has no property_id");
        results.push(result);
        continue;
      }

      const services = (sub.subscription_services ?? []) as {
        service_id: string;
        frequency: string;
        calculated_monthly_price: number;
      }[];

      if (services.length === 0) {
        result.skipped.push("No services on subscription");
        results.push(result);
        continue;
      }

      for (const svc of services) {
        // Check seasonal window - skip if out of season
        const seasonalWindow = getSeasonalWindow(svc.service_id);
        if (seasonalWindow && !isInSeasonalWindow(seasonalWindow)) {
          result.skipped.push(
            `${svc.service_id}: out of seasonal window`
          );
          continue;
        }

        // Find the last completed booking for this service
        const { data: lastBookings } = await supabase
          .from("service_bookings")
          .select("scheduled_date, completed_at")
          .eq("subscription_id", sub.id)
          .eq("service_id", svc.service_id)
          .in("status", ["completed", "scheduled", "confirmed", "in_progress"])
          .order("scheduled_date", { ascending: false })
          .limit(1);

        const lastBooking = lastBookings?.[0] ?? null;

        if (lastBooking) {
          // Check if the service is due based on the last booking date
          const lastDate = lastBooking.completed_at
            ? lastBooking.completed_at.split("T")[0]
            : lastBooking.scheduled_date;

          if (!isServiceDue(lastDate, svc.frequency)) {
            result.skipped.push(
              `${svc.service_id}: not yet due (last: ${lastDate})`
            );
            continue;
          }

          // Calculate the next date from the last booking
          const nextDate = getNextServiceDate(lastDate, svc.frequency);

          // Check for duplicates - don't create if a booking already exists for this date
          const { data: existing } = await supabase
            .from("service_bookings")
            .select("id")
            .eq("subscription_id", sub.id)
            .eq("service_id", svc.service_id)
            .eq("scheduled_date", nextDate)
            .limit(1);

          if (existing && existing.length > 0) {
            result.skipped.push(
              `${svc.service_id}: booking already exists for ${nextDate}`
            );
            continue;
          }

          // Create the booking
          const { data: newBooking, error: createErr } = await supabase
            .from("service_bookings")
            .insert({
              property_id: propertyId,
              service_id: svc.service_id,
              scheduled_date: nextDate,
              scheduled_time: "Morning",
              subscription_id: sub.id,
              status: "scheduled",
              price: svc.calculated_monthly_price,
              notes: "Auto-generated by recurring scheduler",
            })
            .select("id")
            .single();

          if (createErr) {
            result.errors.push(
              `${svc.service_id}: failed to create booking - ${createErr.message}`
            );
          } else {
            result.created.push({
              serviceId: svc.service_id,
              scheduledDate: nextDate,
              bookingId: newBooking.id,
            });
          }
        } else {
          // No previous booking - create the first one for today
          const today = new Date().toISOString().split("T")[0];

          const { data: newBooking, error: createErr } = await supabase
            .from("service_bookings")
            .insert({
              property_id: propertyId,
              service_id: svc.service_id,
              scheduled_date: today,
              scheduled_time: "Morning",
              subscription_id: sub.id,
              status: "scheduled",
              price: svc.calculated_monthly_price,
              notes: "Auto-generated by recurring scheduler (initial booking)",
            })
            .select("id")
            .single();

          if (createErr) {
            result.errors.push(
              `${svc.service_id}: failed to create initial booking - ${createErr.message}`
            );
          } else {
            result.created.push({
              serviceId: svc.service_id,
              scheduledDate: today,
              bookingId: newBooking.id,
            });
          }
        }
      }

      results.push(result);
    }

    // ---- Summary ----
    const totalCreated = results.reduce((sum, r) => sum + r.created.length, 0);
    const totalSkipped = results.reduce((sum, r) => sum + r.skipped.length, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);

    return NextResponse.json({
      message: `Processed ${results.length} subscription(s)`,
      summary: {
        subscriptionsProcessed: results.length,
        bookingsCreated: totalCreated,
        servicesSkipped: totalSkipped,
        errors: totalErrors,
      },
      results,
    });
  } catch (error) {
    console.error("Scheduler generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate recurring bookings" },
      { status: 500 }
    );
  }
}
