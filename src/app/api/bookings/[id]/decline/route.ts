import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { findBestContractorsServer } from "@/lib/contractor-matching";
import { calculateContractorPayout } from "@/lib/pricing";
import {
  getBookingById,
  getContractorProfile,
  declineBooking,
  assignContractorToBooking,
  createNotification,
  getPropertyOwnerId,
  getContractorProfileById,
} from "@/lib/supabase/queries";

/**
 * POST /api/bookings/[id]/decline
 *
 * Contractor declines a job assigned to them.
 * Clears the assignment, tries to auto-reassign to the next best contractor.
 * Notifies the homeowner about the reassignment status.
 *
 * Body: { reason?: string }
 */
export async function POST(
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

    // ---- Parse optional reason ----
    let reason: string | undefined;
    try {
      const body = await req.json();
      reason = body.reason;
    } catch {
      // No body or invalid JSON - reason is optional
    }

    // ---- Verify contractor profile ----
    const contractorProfile = await getContractorProfile(user.id);
    if (!contractorProfile) {
      return NextResponse.json(
        { error: "No contractor profile found" },
        { status: 403 }
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

    // ---- Validate contractor is assigned ----
    if (booking.contractor_profile_id !== contractorProfile.id) {
      return NextResponse.json(
        { error: "You are not assigned to this booking" },
        { status: 403 }
      );
    }

    // ---- Validate booking can be declined ----
    if (booking.status !== "scheduled" && booking.status !== "confirmed") {
      return NextResponse.json(
        {
          error: `Cannot decline booking with status '${booking.status}'. Must be 'scheduled' or 'confirmed'.`,
        },
        { status: 400 }
      );
    }

    // ---- Decline the booking (clears contractor assignment) ----
    await declineBooking(bookingId, contractorProfile.id, reason);

    // ---- Try to auto-reassign to the next best contractor ----
    let reassigned = false;
    let newContractorId: string | null = null;

    try {
      const matches = await findBestContractorsServer(supabase as never, {
        serviceId: booking.service_id,
        date: booking.scheduled_date,
        timeSlot: booking.scheduled_time,
        propertyId: booking.property_id,
      });

      // Exclude the contractor who just declined
      const validMatches = matches.filter(
        (m) => m.contractorId !== contractorProfile.id
      );

      if (validMatches.length > 0) {
        const bestMatch = validMatches[0];
        const payout = calculateContractorPayout(booking.price);

        await assignContractorToBooking(
          bookingId,
          bestMatch.contractorId,
          payout
        );

        reassigned = true;
        newContractorId = bestMatch.contractorId;

        // Notify the new contractor
        try {
          const newContractor = await getContractorProfileById(
            bestMatch.contractorId
          );
          if (newContractor) {
            const { data: service } = await supabase
              .from("services")
              .select("name")
              .eq("id", booking.service_id)
              .single();

            await createNotification({
              user_id: newContractor.profile_id,
              title: "New Job Assigned",
              message: `${service?.name ?? "Service"} on ${booking.scheduled_date} at ${booking.scheduled_time}`,
              type: "booking_assigned",
              metadata: {
                booking_id: bookingId,
                service_id: booking.service_id,
              },
            });
          }
        } catch {
          // New contractor notification failure is non-blocking
        }
      }
    } catch {
      // Reassignment failure - will fall through to admin notification
    }

    // ---- Notify the homeowner ----
    try {
      const ownerId = await getPropertyOwnerId(booking.property_id);
      if (ownerId) {
        const { data: service } = await supabase
          .from("services")
          .select("name")
          .eq("id", booking.service_id)
          .single();

        const serviceName = service?.name ?? "Service";

        if (reassigned) {
          await createNotification({
            user_id: ownerId,
            title: "Contractor Reassigned",
            message: `Your ${serviceName} on ${booking.scheduled_date} has been reassigned to a new contractor. Service will proceed as scheduled.`,
            type: "booking_reassigned",
            metadata: {
              booking_id: bookingId,
              service_id: booking.service_id,
              new_contractor_id: newContractorId,
            },
          });
        } else {
          await createNotification({
            user_id: ownerId,
            title: "Booking Update",
            message: `Your ${serviceName} on ${booking.scheduled_date} is being rescheduled. We're finding a new contractor for you.`,
            type: "booking_pending_reassignment",
            metadata: {
              booking_id: bookingId,
              service_id: booking.service_id,
            },
          });
        }
      }
    } catch {
      // Homeowner notification failure is non-blocking
    }

    // ---- Admin notification if no reassignment was possible ----
    if (!reassigned) {
      try {
        await createNotification({
          user_id: "00000000-0000-0000-0000-000000000000",
          title: "Unassigned Booking - Needs Attention",
          message: `Booking ${bookingId} for ${booking.scheduled_date} has no available contractor after decline. Manual assignment needed.`,
          type: "admin_booking_unassigned",
          metadata: {
            booking_id: bookingId,
            service_id: booking.service_id,
            property_id: booking.property_id,
            declined_by: contractorProfile.id,
            reason: reason ?? null,
          },
        });
      } catch {
        console.error(
          "Failed to create admin notification for unassigned booking:",
          bookingId
        );
      }
    }

    return NextResponse.json({
      success: true,
      reassigned,
      newContractorId,
    });
  } catch (error) {
    console.error("Decline booking error:", error);
    return NextResponse.json(
      { error: "Failed to decline booking" },
      { status: 500 }
    );
  }
}
