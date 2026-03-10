import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getBookingById,
  getContractorProfile,
  updateBookingStatus,
  createNotification,
  getPropertyOwnerId,
} from "@/lib/supabase/queries";

/**
 * POST /api/bookings/[id]/accept
 *
 * Contractor accepts a job assigned to them.
 * Updates booking status from "scheduled" to "confirmed".
 * Creates a notification for the property owner.
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

    // ---- Validate contractor is the one assigned ----
    if (booking.contractor_profile_id !== contractorProfile.id) {
      return NextResponse.json(
        { error: "You are not assigned to this booking" },
        { status: 403 }
      );
    }

    // ---- Validate booking is in "scheduled" status ----
    if (booking.status !== "scheduled") {
      return NextResponse.json(
        {
          error: `Cannot accept booking with status '${booking.status}'. Must be 'scheduled'.`,
        },
        { status: 400 }
      );
    }

    // ---- Update status to confirmed ----
    const updated = await updateBookingStatus(bookingId, "confirmed");

    // ---- Notify the property owner ----
    try {
      const ownerId = await getPropertyOwnerId(booking.property_id);
      if (ownerId) {
        const { data: service } = await supabase
          .from("services")
          .select("name")
          .eq("id", booking.service_id)
          .single();

        const serviceName = service?.name ?? "Service";

        await createNotification({
          user_id: ownerId,
          title: "Booking Confirmed",
          message: `Your ${serviceName} on ${booking.scheduled_date} has been confirmed by the contractor.`,
          type: "booking_confirmed",
          metadata: {
            booking_id: bookingId,
            service_id: booking.service_id,
          },
        });
      }
    } catch {
      // Notification failure should not block acceptance
    }

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error("Accept booking error:", error);
    return NextResponse.json(
      { error: "Failed to accept booking" },
      { status: 500 }
    );
  }
}
