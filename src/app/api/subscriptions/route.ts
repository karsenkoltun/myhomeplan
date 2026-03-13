import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

/**
 * Service role client for writes that need to bypass RLS.
 * The user is still authenticated via the server client above.
 */
function getServiceDb() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * POST /api/subscriptions
 *
 * Creates a subscription + subscription_services rows.
 * Used by onboarding (step-review) and dashboard (SavePlan).
 *
 * Body: {
 *   propertyId: string | null;
 *   planInterval: "monthly" | "quarterly" | "annual";
 *   monthlyTotal: number;
 *   discountPct: number;
 *   services: { serviceId: string; frequency: string; specs: object; monthlyPrice: number }[];
 *   status?: "trialing" | "draft";
 *   propertyData?: object;  // optional - upsert property in same request
 *   profileData?: object;   // optional - update profile in same request
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate user via server client (reads session cookies)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      propertyId,
      planInterval,
      monthlyTotal,
      discountPct,
      services,
      status = "trialing",
      propertyData,
      profileData,
    } = body as {
      propertyId: string | null;
      planInterval: "monthly" | "quarterly" | "annual";
      monthlyTotal: number;
      discountPct: number;
      services: {
        serviceId: string;
        frequency: string;
        specs: Record<string, unknown>;
        monthlyPrice: number;
      }[];
      status?: string;
      propertyData?: Record<string, unknown>;
      profileData?: Record<string, unknown>;
    };

    if (!planInterval || monthlyTotal == null || !services?.length) {
      return NextResponse.json(
        { error: "Missing required fields (planInterval, monthlyTotal, services)" },
        { status: 400 }
      );
    }

    const db = getServiceDb();
    let resolvedPropertyId = propertyId;

    // --- Optional: update profile ---
    if (profileData && Object.keys(profileData).length > 0) {
      const { error: profileErr } = await db
        .from("profiles")
        .update(profileData)
        .eq("id", user.id);
      if (profileErr) {
        console.error("Profile update failed:", profileErr);
        return NextResponse.json(
          { error: "Failed to update profile" },
          { status: 500 }
        );
      }
    }

    // --- Optional: upsert property ---
    if (propertyData && Object.keys(propertyData).length > 0) {
      // Check for existing property
      const { data: existing } = await db
        .from("homeowner_properties")
        .select("id")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        const { data: prop, error: propErr } = await db
          .from("homeowner_properties")
          .update(propertyData)
          .eq("id", existing.id)
          .select("id")
          .single();
        if (propErr) {
          console.error("Property update failed:", propErr);
          return NextResponse.json(
            { error: "Failed to update property" },
            { status: 500 }
          );
        }
        resolvedPropertyId = prop.id;
      } else {
        const { data: prop, error: propErr } = await db
          .from("homeowner_properties")
          .insert({ ...propertyData, profile_id: user.id })
          .select("id")
          .single();
        if (propErr) {
          console.error("Property insert failed:", propErr);
          return NextResponse.json(
            { error: "Failed to create property" },
            { status: 500 }
          );
        }
        resolvedPropertyId = prop.id;
      }
    }

    // --- Create subscription ---
    const subStatus =
      status === "draft" ? "trialing" : status === "trialing" ? "trialing" : "trialing";

    const { data: sub, error: subErr } = await db
      .from("subscriptions")
      .insert({
        profile_id: user.id,
        property_id: resolvedPropertyId,
        plan_interval: planInterval,
        monthly_total: monthlyTotal,
        discount_pct: discountPct,
        status: subStatus,
      })
      .select()
      .single();

    if (subErr) {
      console.error("Subscription insert failed:", subErr);
      return NextResponse.json(
        { error: "Failed to create subscription" },
        { status: 500 }
      );
    }

    // --- Create subscription_services ---
    if (services.length > 0) {
      const { error: svcErr } = await db
        .from("subscription_services")
        .insert(
          services.map((s) => ({
            subscription_id: sub.id,
            service_id: s.serviceId,
            frequency: s.frequency,
            specs: s.specs,
            calculated_monthly_price: s.monthlyPrice,
          }))
        );

      if (svcErr) {
        console.error("Subscription services insert failed:", svcErr);
        // Clean up the subscription row
        await db.from("subscriptions").delete().eq("id", sub.id);
        return NextResponse.json(
          { error: "Failed to save subscription services" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      subscription: sub,
      propertyId: resolvedPropertyId,
    });
  } catch (error) {
    console.error("Subscription API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
