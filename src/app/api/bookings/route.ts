import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { findBestContractorsServer } from "@/lib/contractor-matching";
import { calculateContractorPayout } from "@/lib/pricing";
import {
  getContractorProfile,
  getAllProperties,
  getBookingsForProperties,
  getContractorBookings,
  createBooking,
  assignContractorToBooking,
  createNotification,
  getContractorProfileById,
} from "@/lib/supabase/queries";

/**
 * GET /api/bookings
 *
 * List bookings for the authenticated user.
 * Automatically detects whether the user is a homeowner or contractor
 * and returns the appropriate bookings.
 *
 * Query params:
 *   status?: string - filter by booking status
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // ---- Auth ----
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const statusFilter = req.nextUrl.searchParams.get("status") ?? undefined;

    // ---- Determine user type ----
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    let bookings;

    if (profile.user_type === "contractor") {
      // ---- Contractor: get bookings assigned to them ----
      const contractorProfile = await getContractorProfile(user.id);
      if (!contractorProfile) {
        return NextResponse.json({ bookings: [] });
      }
      bookings = await getContractorBookings(
        contractorProfile.id,
        statusFilter
      );
    } else {
      // ---- Homeowner / other: get bookings for their properties ----
      const properties = await getAllProperties(user.id);
      if (properties.length === 0) {
        return NextResponse.json({ bookings: [] });
      }

      const propertyIds = properties.map((p) => p.id);
      bookings = await getBookingsForProperties(propertyIds);

      // Apply status filter if provided
      if (statusFilter) {
        bookings = bookings.filter((b) => b.status === statusFilter);
      }
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("List bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bookings
 *
 * Create a new service booking.
 * Automatically matches the best contractor using the matching engine.
 * Creates notifications for both the homeowner and the assigned contractor.
 *
 * Body: {
 *   property_id: string;
 *   service_id: string;
 *   scheduled_date: string;       // YYYY-MM-DD
 *   scheduled_time: string;       // e.g. "Morning", "09:00"
 *   notes?: string;
 *   preferred_contractor_id?: string;
 *   subscription_id?: string;
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // ---- Auth ----
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ---- Parse body ----
    const body = await req.json();
    const {
      property_id,
      service_id,
      scheduled_date,
      scheduled_time,
      notes,
      preferred_contractor_id,
      subscription_id,
    } = body as {
      property_id: string;
      service_id: string;
      scheduled_date: string;
      scheduled_time: string;
      notes?: string;
      preferred_contractor_id?: string;
      subscription_id?: string;
    };

    // ---- Validate required fields ----
    if (!property_id || !service_id || !scheduled_date || !scheduled_time) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: property_id, service_id, scheduled_date, scheduled_time",
        },
        { status: 400 }
      );
    }

    // ---- Validate the property belongs to this user ----
    const { data: property, error: propErr } = await supabase
      .from("homeowner_properties")
      .select("id, profile_id")
      .eq("id", property_id)
      .single();

    if (propErr || !property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (property.profile_id !== user.id) {
      return NextResponse.json(
        { error: "Property does not belong to you" },
        { status: 403 }
      );
    }

    // ---- Validate the service exists ----
    const { data: service, error: svcErr } = await supabase
      .from("services")
      .select("id, name, base_price")
      .eq("id", service_id)
      .eq("active", true)
      .single();

    if (svcErr || !service) {
      return NextResponse.json(
        { error: "Service not found or is inactive" },
        { status: 404 }
      );
    }

    // ---- Validate date is in the future ----
    const scheduledDateTime = new Date(
      `${scheduled_date}T${scheduled_time || "00:00"}`
    );
    if (isNaN(scheduledDateTime.getTime())) {
      return NextResponse.json(
        {
          error:
            "Invalid date or time format. Use YYYY-MM-DD for date and HH:MM for time.",
        },
        { status: 400 }
      );
    }

    if (scheduledDateTime <= new Date()) {
      return NextResponse.json(
        { error: "Scheduled date must be in the future" },
        { status: 400 }
      );
    }

    // ---- Match a contractor ----
    let assignedContractorId: string | null = null;
    let contractorPayout: number | null = null;

    try {
      const matches = await findBestContractorsServer(supabase as never, {
        serviceId: service_id,
        date: scheduled_date,
        timeSlot: scheduled_time,
        propertyId: property_id,
        preferredContractorId: preferred_contractor_id,
      });

      if (matches.length > 0) {
        assignedContractorId = matches[0].contractorId;
        contractorPayout = calculateContractorPayout(service.base_price);
      }
    } catch {
      // Matching failure is non-blocking - booking proceeds without a contractor
    }

    // ---- Create the booking ----
    const booking = await createBooking({
      property_id,
      service_id,
      scheduled_date,
      scheduled_time,
      notes,
      contractor_profile_id: assignedContractorId ?? undefined,
      price: service.base_price,
      contractor_payout: contractorPayout ?? undefined,
      subscription_id,
    });

    // If we found a contractor but createBooking didn't set it (because it may not accept contractor_profile_id),
    // assign separately
    if (assignedContractorId && !booking.contractor_profile_id) {
      await assignContractorToBooking(
        booking.id,
        assignedContractorId,
        contractorPayout!
      );
    }

    // ---- Notify the homeowner ----
    try {
      await createNotification({
        user_id: user.id,
        title: "Booking Created",
        message: `Your ${service.name} has been scheduled for ${scheduled_date} at ${scheduled_time}.${assignedContractorId ? " A contractor has been assigned." : " We're finding a contractor for you."}`,
        type: "booking_created",
        metadata: {
          booking_id: booking.id,
          service_id,
          contractor_assigned: !!assignedContractorId,
        },
      });
    } catch {
      // Notification failure is non-blocking
    }

    // ---- Notify the assigned contractor ----
    if (assignedContractorId) {
      try {
        const contractor = await getContractorProfileById(assignedContractorId);
        if (contractor) {
          await createNotification({
            user_id: contractor.profile_id,
            title: "New Job Assigned",
            message: `${service.name} on ${scheduled_date} at ${scheduled_time}. Please review and accept.`,
            type: "booking_assigned",
            metadata: {
              booking_id: booking.id,
              service_id,
              property_id,
            },
          });
        }
      } catch {
        // Contractor notification failure is non-blocking
      }
    }

    // ---- If no contractor was found, create admin notification ----
    if (!assignedContractorId) {
      try {
        await createNotification({
          user_id: "00000000-0000-0000-0000-000000000000",
          title: "Unassigned Booking - Needs Contractor",
          message: `New booking ${booking.id} for ${service.name} on ${scheduled_date} has no available contractor. Manual assignment needed.`,
          type: "admin_booking_unassigned",
          metadata: {
            booking_id: booking.id,
            service_id,
            property_id,
          },
        });
      } catch {
        console.error(
          "Failed to create admin notification for unassigned booking:",
          booking.id
        );
      }
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
