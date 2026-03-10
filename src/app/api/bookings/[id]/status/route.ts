import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getBookingById,
  getContractorProfile,
  updateBookingStatus,
  createNotification,
  getPropertyOwnerId,
  getContractorProfileById,
} from "@/lib/supabase/queries";

/**
 * Valid booking statuses that can be set via this endpoint.
 */
const VALID_STATUSES = [
  "scheduled",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
] as const;

type ValidStatus = (typeof VALID_STATUSES)[number];

/**
 * Valid state transitions for bookings:
 *   scheduled   -> confirmed | cancelled
 *   confirmed   -> in_progress | cancelled
 *   in_progress -> completed | cancelled
 */
const VALID_TRANSITIONS: Record<string, string[]> = {
  scheduled: ["confirmed", "cancelled"],
  confirmed: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
};

/** Minimum hours of notice required for cancellation. */
const CANCELLATION_NOTICE_HOURS = 24;

/**
 * PATCH /api/bookings/[id]/status
 *
 * Update a booking's status with validation of allowed state transitions.
 * Enforces a 24-hour cancellation notice policy.
 * Creates appropriate notifications for each transition.
 *
 * Body: { status: string; notes?: string }
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
    const { status: newStatus, notes } = body as {
      status: string;
      notes?: string;
    };

    if (!newStatus) {
      return NextResponse.json(
        { error: "Missing required field: status" },
        { status: 400 }
      );
    }

    // ---- Validate status value ----
    if (!VALID_STATUSES.includes(newStatus as ValidStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status '${newStatus}'. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
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
        { error: "Not authorized to update this booking" },
        { status: 403 }
      );
    }

    // ---- Validate state transition ----
    const currentStatus = booking.status;
    const allowed = VALID_TRANSITIONS[currentStatus];

    if (!allowed || !allowed.includes(newStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status transition: '${currentStatus}' -> '${newStatus}'. Allowed: ${(allowed ?? []).join(", ") || "none"}`,
        },
        { status: 400 }
      );
    }

    // ---- Cancellation: enforce 24-hour notice policy ----
    if (newStatus === "cancelled") {
      const scheduledDateTime = new Date(
        `${booking.scheduled_date}T${booking.scheduled_time || "00:00"}`
      );
      const now = new Date();
      const hoursUntilService =
        (scheduledDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilService > 0 && hoursUntilService < CANCELLATION_NOTICE_HOURS) {
        return NextResponse.json(
          {
            error: `Cancellations require at least ${CANCELLATION_NOTICE_HOURS} hours notice. The service is scheduled in ${Math.round(hoursUntilService)} hours.`,
          },
          { status: 400 }
        );
      }
    }

    // ---- Append notes if provided ----
    if (notes) {
      const updatedNotes = booking.notes
        ? `${booking.notes}\n${notes}`
        : notes;

      await supabase
        .from("service_bookings")
        .update({ notes: updatedNotes })
        .eq("id", bookingId);
    }

    // ---- Update the booking status ----
    const updated = await updateBookingStatus(
      bookingId,
      newStatus as "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled"
    );

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

    // ---- Create notifications based on the new status ----
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

      switch (newStatus) {
        case "in_progress":
          if (homeownerId) {
            await createNotification({
              user_id: homeownerId,
              title: "Service In Progress",
              message: `Your ${serviceName} has started.`,
              type: "booking_in_progress",
              metadata: {
                booking_id: bookingId,
                service_id: booking.service_id,
              },
            });
          }
          break;

        case "completed":
          if (homeownerId) {
            await createNotification({
              user_id: homeownerId,
              title: "Service Completed",
              message: `Your ${serviceName} has been completed. Please leave a review!`,
              type: "booking_completed",
              metadata: {
                booking_id: bookingId,
                service_id: booking.service_id,
              },
            });
          }
          break;

        case "cancelled": {
          // Notify homeowner
          if (homeownerId) {
            await createNotification({
              user_id: homeownerId,
              title: "Booking Cancelled",
              message: `Your ${serviceName} on ${booking.scheduled_date} has been cancelled.${notes ? ` Reason: ${notes}` : ""}`,
              type: "booking_cancelled",
              metadata: {
                booking_id: bookingId,
                service_id: booking.service_id,
                cancelled_by: userRole,
              },
            });
          }
          // Notify contractor if they didn't initiate the cancellation
          if (contractorUserId && contractorUserId !== user.id) {
            await createNotification({
              user_id: contractorUserId,
              title: "Job Cancelled",
              message: `The ${serviceName} on ${booking.scheduled_date} has been cancelled by the homeowner.`,
              type: "booking_cancelled",
              metadata: {
                booking_id: bookingId,
                service_id: booking.service_id,
              },
            });
          }
          break;
        }
      }
    } catch {
      // Notification failures should not block the status update
    }

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error("Update booking status error:", error);
    return NextResponse.json(
      { error: "Failed to update booking status" },
      { status: 500 }
    );
  }
}
