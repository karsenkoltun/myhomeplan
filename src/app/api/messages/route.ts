import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/messages?bookingId=X
 *
 * Fetch all messages for a booking.
 * Auth: user must be the property owner or the assigned contractor.
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

    // ---- Params ----
    const bookingId = req.nextUrl.searchParams.get("bookingId");
    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing required query param: bookingId" },
        { status: 400 }
      );
    }

    // ---- Get the booking and verify access ----
    const { data: booking, error: bookingErr } = await supabase
      .from("service_bookings")
      .select("id, property_id, contractor_profile_id")
      .eq("id", bookingId)
      .single();

    if (bookingErr || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if user is the property owner
    const { data: property } = await supabase
      .from("homeowner_properties")
      .select("profile_id")
      .eq("id", booking.property_id)
      .single();

    const isOwner = property?.profile_id === user.id;

    // Check if user is the assigned contractor
    let isContractor = false;
    if (booking.contractor_profile_id) {
      const { data: contractorProfile } = await supabase
        .from("contractor_profiles")
        .select("profile_id")
        .eq("id", booking.contractor_profile_id)
        .single();
      isContractor = contractorProfile?.profile_id === user.id;
    }

    if (!isOwner && !isContractor) {
      return NextResponse.json(
        { error: "You are not a party to this booking" },
        { status: 403 }
      );
    }

    // ---- Fetch messages ----
    const { data: messages, error: msgErr } = await supabase
      .from("messages")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: true });

    if (msgErr) {
      throw msgErr;
    }

    // ---- Mark messages from the other party as read ----
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("booking_id", bookingId)
      .neq("sender_id", user.id)
      .eq("read", false);

    return NextResponse.json({ messages: messages ?? [] });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages
 *
 * Send a message in a booking conversation.
 * Auth: user must be the property owner or the assigned contractor.
 *
 * Body:
 *   { booking_id: string, message: string, message_type?: "text" | "system" | "photo" }
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
    const { booking_id, message, message_type } = body as {
      booking_id: string;
      message: string;
      message_type?: "text" | "system" | "photo";
    };

    if (!booking_id || !message?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields: booking_id, message" },
        { status: 400 }
      );
    }

    // ---- Get the booking and verify access ----
    const { data: booking, error: bookingErr } = await supabase
      .from("service_bookings")
      .select("id, property_id, contractor_profile_id, service_id")
      .eq("id", booking_id)
      .single();

    if (bookingErr || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if user is the property owner
    const { data: property } = await supabase
      .from("homeowner_properties")
      .select("profile_id")
      .eq("id", booking.property_id)
      .single();

    const isOwner = property?.profile_id === user.id;
    const ownerId = property?.profile_id ?? null;

    // Check if user is the assigned contractor
    let isContractor = false;
    let contractorUserId: string | null = null;
    if (booking.contractor_profile_id) {
      const { data: contractorProfile } = await supabase
        .from("contractor_profiles")
        .select("profile_id")
        .eq("id", booking.contractor_profile_id)
        .single();
      isContractor = contractorProfile?.profile_id === user.id;
      contractorUserId = contractorProfile?.profile_id ?? null;
    }

    if (!isOwner && !isContractor) {
      return NextResponse.json(
        { error: "You are not a party to this booking" },
        { status: 403 }
      );
    }

    // ---- Insert message ----
    const { data: newMessage, error: insertErr } = await supabase
      .from("messages")
      .insert({
        booking_id,
        sender_id: user.id,
        message: message.trim(),
        message_type: message_type ?? "text",
        read: false,
      })
      .select()
      .single();

    if (insertErr) {
      throw insertErr;
    }

    // ---- Create notification for the other party ----
    const recipientId = isOwner ? contractorUserId : ownerId;

    if (recipientId) {
      // Get the sender's name for the notification
      const { data: senderProfile } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();

      const senderName = senderProfile
        ? `${senderProfile.first_name} ${senderProfile.last_name}`
        : "Someone";

      // Get the service name for context
      const { data: service } = await supabase
        .from("services")
        .select("name")
        .eq("id", booking.service_id)
        .single();

      const serviceName = service?.name ?? "Service";

      try {
        await supabase.from("notifications").insert({
          user_id: recipientId,
          title: "New Message",
          message: `${senderName} sent a message about your ${serviceName} booking`,
          type: "new_message",
          metadata: {
            booking_id,
            sender_id: user.id,
            message_preview: message.trim().substring(0, 100),
          },
        });
      } catch {
        // Notification failure should not block message sending
      }
    }

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
