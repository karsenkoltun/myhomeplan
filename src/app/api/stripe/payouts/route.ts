import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createTransfer, getTransfers } from "@/lib/stripe-connect";
import { toCents } from "@/lib/stripe/helpers";

/**
 * GET /api/stripe/payouts
 * Returns the transfer (payout) history for the authenticated contractor.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: contractor, error: contractorError } = await supabase
      .from("contractor_profiles")
      .select("stripe_connect_id")
      .eq("profile_id", user.id)
      .single();

    if (contractorError || !contractor) {
      return NextResponse.json(
        { error: "Contractor profile not found" },
        { status: 404 }
      );
    }

    if (!contractor.stripe_connect_id) {
      return NextResponse.json({ transfers: [] });
    }

    const transfers = await getTransfers(contractor.stripe_connect_id);

    const formatted = transfers.map((t) => ({
      id: t.id,
      amount: t.amount / 100, // cents -> dollars
      currency: t.currency,
      description: t.description,
      created: new Date(t.created * 1000).toISOString(),
      metadata: t.metadata,
    }));

    return NextResponse.json({ transfers: formatted });
  } catch (error) {
    console.error("Stripe payouts GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve transfers" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stripe/payouts
 * Triggers a payout for a completed booking. Intended for admin/system use.
 * Body: { bookingId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is an admin or the system (check profile user_type)
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();

    // Only allow contractors viewing their own payouts or admins triggering payouts.
    // For now, restrict POST to non-contractor users (admins, property managers).
    if (
      profile?.user_type === "homeowner" ||
      profile?.user_type === "contractor"
    ) {
      return NextResponse.json(
        { error: "Forbidden: admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { bookingId } = body as { bookingId: string };

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing bookingId" },
        { status: 400 }
      );
    }

    // Fetch the booking
    const { data: booking, error: bookingError } = await supabase
      .from("service_bookings")
      .select(
        "id, status, contractor_payout, payment_status, contractor_profile_id"
      )
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.status !== "completed") {
      return NextResponse.json(
        { error: "Booking must be completed before payout" },
        { status: 400 }
      );
    }

    if (booking.payment_status === "succeeded") {
      return NextResponse.json(
        { error: "Payout already processed for this booking" },
        { status: 409 }
      );
    }

    if (!booking.contractor_payout || booking.contractor_payout <= 0) {
      return NextResponse.json(
        { error: "No payout amount set for this booking" },
        { status: 400 }
      );
    }

    if (!booking.contractor_profile_id) {
      return NextResponse.json(
        { error: "No contractor assigned to this booking" },
        { status: 400 }
      );
    }

    // Get the contractor's Connect account
    const { data: contractor, error: contractorError } = await supabase
      .from("contractor_profiles")
      .select("stripe_connect_id, business_name")
      .eq("id", booking.contractor_profile_id)
      .single();

    if (contractorError || !contractor) {
      return NextResponse.json(
        { error: "Contractor profile not found" },
        { status: 404 }
      );
    }

    if (!contractor.stripe_connect_id) {
      return NextResponse.json(
        { error: "Contractor has not connected their Stripe account" },
        { status: 400 }
      );
    }

    // Create the transfer (contractor_payout is in dollars, convert to cents)
    const amountInCents = toCents(booking.contractor_payout);

    const transfer = await createTransfer(
      amountInCents,
      contractor.stripe_connect_id,
      `Payout for booking ${booking.id}`,
      {
        booking_id: booking.id,
        contractor_profile_id: booking.contractor_profile_id,
      }
    );

    // Update booking payment status
    await supabase
      .from("service_bookings")
      .update({ payment_status: "succeeded" })
      .eq("id", booking.id);

    return NextResponse.json({
      transfer: {
        id: transfer.id,
        amount: transfer.amount / 100,
        currency: transfer.currency,
        destination: transfer.destination,
        description: transfer.description,
        created: new Date(transfer.created * 1000).toISOString(),
      },
    });
  } catch (error) {
    console.error("Stripe payout POST error:", error);
    return NextResponse.json(
      { error: "Failed to process payout" },
      { status: 500 }
    );
  }
}
