import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getBookingById,
  getContractorProfile,
  createNotification,
  getPropertyOwnerId,
  getContractorProfileById,
} from "@/lib/supabase/queries";

/** Minimum hours of notice required to reschedule based on the current date. */
const RESCHEDULE_NOTICE_HOURS = 24;

/**
 * PATCH /api/bookings/[id]/reschedule
 *
 * Reschedule a booking to a new date/time.
 * Both homeowners and contractors can reschedule.
 * Validates the new date is in the future and that at least 24 hours notice
 * is given relative to the currently scheduled date.
 * Creates notifications for both parties.
 *
 * Body: { scheduled_date: string; scheduled_time: string; reason?: string }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params;
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
    const { scheduled_date, scheduled_time, reason } = body as {
      scheduled_date: string;
      scheduled_time: string;
      reason?: string;
    };

    if (!scheduled_date || !scheduled_time) {
      return NextResponse.json(
        { error: "Missing required fields: scheduled_date, scheduled_time" },
        { status: 400 }
      );
    }

    // ---- Get the booking ----
    let booking;
    try {
      booking = await getBookingById(bookingId);
    } catch {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // ---- Verify authorization (assigned contractor or property owner) ----
    let isAuthorized = false;
    let userRole: "contractor" | "homeowner" = "homeowner";

    // Check if user is the assigned contractor
    if (booking.contractor_profile_id) {
      const contractorProfile = await getContractorProfile(user.id);
      if (
        contractorProfile &&
        contractorProfile.id === booking.contractor_profile_id
      ) {
        isAuthorized = true;
        userRole = "contractor";
      }
    }

    // Check if user is the property owner
    if (!isAuthorized) {
      const ownerId = await getPropertyOwnerId(booking.property_id);
      if (ownerId === user.id) {
        isAuthorized = true;
        userRole = "homeowner";
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Not authorized to reschedule this booking" },
        { status: 403 }
      );
    }

    // ---- Validate booking can be rescheduled ----
    if (
      booking.status !== "scheduled" &&
      booking.status !== "confirmed"
    ) {
      return NextResponse.json(
        {
          error: `Cannot reschedule booking with status '${booking.status}'. Must be 'scheduled' or 'confirmed'.`,
        },
        { status: 400 }
      );
    }

    // ---- Validate new date is in the future ----
    const newDateTime = new Date(`${scheduled_date}T${scheduled_time}`);
    const now = new Date();

    if (isNaN(newDateTime.getTime())) {
      return NextResponse.json(
        { error: "Invalid date or time format. Use YYYY-MM-DD for date and HH:MM for time." },
        { status: 400 }
      );
    }

    if (newDateTime <= now) {
      return NextResponse.json(
        { error: "New scheduled date must be in the future" },
        { status: 400 }
      );
    }

    // ---- Validate 24-hour notice for current scheduled date ----
    const currentDateTime = new Date(
      `${booking.scheduled_date}T${booking.scheduled_time || "00:00"}`
    );
    const hoursUntilCurrent =
      (currentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilCurrent > 0 && hoursUntilCurrent < RESCHEDULE_NOTICE_HOURS) {
      return NextResponse.json(
        {
          error: `Rescheduling requires at least ${RESCHEDULE_NOTICE_HOURS} hours notice. The current service is scheduled in ${Math.round(hoursUntilCurrent)} hours.`,
        },
        { status: 400 }
      );
    }

    // ---- Update the booking ----
    const noteAddition = reason
      ? `[Rescheduled by ${userRole}: ${reason}] ${booking.scheduled_date} ${booking.scheduled_time} -> ${scheduled_date} ${scheduled_time}`
      : `[Rescheduled by ${userRole}] ${booking.scheduled_date} ${booking.scheduled_time} -> ${scheduled_date} ${scheduled_time}`;

    const updatedNotes = booking.notes
      ? `${booking.notes}\n${noteAddition}`
      : noteAddition;

    const { data: updated, error: updateErr } = await supabase
      .from("service_bookings")
      .update({
        scheduled_date,
        scheduled_time,
        notes: updatedNotes,
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json(
        { error: "Failed to reschedule booking" },
        { status: 500 }
      );
    }

    // ---- Get service name for notifications ----
    let serviceName = "Service";
    try {
      const { data: service } = await supabase
        .from("services")
        .select("name")
        .eq("id", booking.service_id)
        .single();
      if (service) serviceName = service.name;
    } catch {
      // Use default
    }

    // ---- Notify both parties ----
    try {
      const homeownerId = await getPropertyOwnerId(booking.property_id);

      // Get contractor's auth user profile_id
      let contractorUserId: string | null = null;
      if (booking.contractor_profile_id) {
        try {
          const cp = await getContractorProfileById(
            booking.contractor_profile_id
          );
          contractorUserId = cp?.profile_id ?? null;
        } catch {
          // Contractor lookup failure is non-blocking
        }
      }

      const rescheduleMessage = `Your ${serviceName} has been rescheduled from ${booking.scheduled_date} to ${scheduled_date} at ${scheduled_time}.${reason ? ` Reason: ${reason}` : ""}`;

      // Notify homeowner (if they didn't initiate)
      if (homeownerId && homeownerId !== user.id) {
        await createNotification({
          user_id: homeownerId,
          title: "Booking Rescheduled",
          message: rescheduleMessage,
          type: "booking_rescheduled",
          metadata: {
            booking_id: bookingId,
            service_id: booking.service_id,
            old_date: booking.scheduled_date,
            old_time: booking.scheduled_time,
            new_date: scheduled_date,
            new_time: scheduled_time,
            rescheduled_by: userRole,
          },
        });
      }

      // Notify contractor (if they didn't initiate)
      if (contractorUserId && contractorUserId !== user.id) {
        await createNotification({
          user_id: contractorUserId,
          title: "Job Rescheduled",
          message: rescheduleMessage,
          type: "booking_rescheduled",
          metadata: {
            booking_id: bookingId,
            service_id: booking.service_id,
            old_date: booking.scheduled_date,
            old_time: booking.scheduled_time,
            new_date: scheduled_date,
            new_time: scheduled_time,
            rescheduled_by: userRole,
          },
        });
      }
    } catch {
      // Notification failures should not block the reschedule
    }

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error("Reschedule booking error:", error);
    return NextResponse.json(
      { error: "Failed to reschedule booking" },
      { status: 500 }
    );
  }
}
