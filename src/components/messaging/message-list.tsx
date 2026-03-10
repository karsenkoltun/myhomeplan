"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Conversation {
  bookingId: string;
  serviceId: string;
  serviceName: string;
  otherPartyName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface MessageListProps {
  userId: string;
}

/**
 * Format a timestamp into a short relative time.
 */
function formatShortTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function MessageList({ userId }: MessageListProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const effectiveUserId = user?.id ?? userId;

  /**
   * Fetch all conversations (bookings that have messages) for the current user.
   * We query distinct booking_ids from the messages table, then enrich with
   * booking/service/profile data.
   */
  const fetchConversations = useCallback(async () => {
    try {
      const supabase = createClient();

      // Get the user's profile to determine their role
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", effectiveUserId)
        .single();

      if (!profile) return;

      // Approach: find all bookings this user is party to that have messages
      let bookingIds: string[] = [];

      if (profile.user_type === "contractor") {
        // Get the contractor profile
        const { data: contractorProfile } = await supabase
          .from("contractor_profiles")
          .select("id")
          .eq("profile_id", effectiveUserId)
          .limit(1)
          .single();

        if (contractorProfile) {
          const { data: bookings } = await supabase
            .from("service_bookings")
            .select("id")
            .eq("contractor_profile_id", contractorProfile.id);
          bookingIds = (bookings ?? []).map((b) => b.id);
        }
      } else {
        // Homeowner / strata / PM - get properties
        const { data: properties } = await supabase
          .from("homeowner_properties")
          .select("id")
          .eq("profile_id", effectiveUserId);

        const propIds = (properties ?? []).map((p) => p.id);

        if (propIds.length > 0) {
          const { data: bookings } = await supabase
            .from("service_bookings")
            .select("id")
            .in("property_id", propIds);
          bookingIds = (bookings ?? []).map((b) => b.id);
        }
      }

      if (bookingIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Get messages for those bookings, grouped by booking_id
      // We want: last message, unread count, booking details
      const { data: allMessages } = await supabase
        .from("messages")
        .select("*")
        .in("booking_id", bookingIds)
        .order("created_at", { ascending: false });

      if (!allMessages || allMessages.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // Group messages by booking_id
      const messagesByBooking: Record<
        string,
        { lastMsg: typeof allMessages[0]; unread: number }
      > = {};

      for (const msg of allMessages) {
        if (!messagesByBooking[msg.booking_id]) {
          messagesByBooking[msg.booking_id] = {
            lastMsg: msg,
            unread: 0,
          };
        }
        // Count unread messages sent by others
        if (!msg.read && msg.sender_id !== effectiveUserId) {
          messagesByBooking[msg.booking_id].unread++;
        }
      }

      // Build conversation objects - fetch booking/service/other party data
      const convos: Conversation[] = [];

      for (const [bookingId, { lastMsg, unread }] of Object.entries(
        messagesByBooking
      )) {
        // Fetch booking with service name
        const { data: booking } = await supabase
          .from("service_bookings")
          .select("service_id, property_id, contractor_profile_id")
          .eq("id", bookingId)
          .single();

        if (!booking) continue;

        // Fetch service name
        const { data: service } = await supabase
          .from("services")
          .select("name")
          .eq("id", booking.service_id)
          .single();

        // Determine the other party
        let otherPartyName = "Unknown";

        if (profile.user_type === "contractor") {
          // Other party is the property owner
          const { data: property } = await supabase
            .from("homeowner_properties")
            .select("profile_id")
            .eq("id", booking.property_id)
            .single();

          if (property?.profile_id) {
            const { data: ownerProfile } = await supabase
              .from("profiles")
              .select("first_name, last_name")
              .eq("id", property.profile_id)
              .single();
            if (ownerProfile) {
              otherPartyName = `${ownerProfile.first_name} ${ownerProfile.last_name}`;
            }
          }
        } else {
          // Other party is the contractor
          if (booking.contractor_profile_id) {
            const { data: contractorProfile } = await supabase
              .from("contractor_profiles")
              .select("profile_id")
              .eq("id", booking.contractor_profile_id)
              .single();

            if (contractorProfile?.profile_id) {
              const { data: contractorUserProfile } = await supabase
                .from("profiles")
                .select("first_name, last_name")
                .eq("id", contractorProfile.profile_id)
                .single();
              if (contractorUserProfile) {
                otherPartyName = `${contractorUserProfile.first_name} ${contractorUserProfile.last_name}`;
              }
            }
          } else {
            otherPartyName = "Unassigned";
          }
        }

        convos.push({
          bookingId,
          serviceId: booking.service_id,
          serviceName: service?.name ?? booking.service_id,
          otherPartyName,
          lastMessage: lastMsg.message,
          lastMessageTime: lastMsg.created_at,
          unreadCount: unread,
        });
      }

      // Sort by most recent message first
      convos.sort(
        (a, b) =>
          new Date(b.lastMessageTime).getTime() -
          new Date(a.lastMessageTime).getTime()
      );

      setConversations(convos);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setLoading(false);
    }
  }, [effectiveUserId]);

  useEffect(() => {
    fetchConversations();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  const handleClick = (bookingId: string) => {
    router.push(`/account/bookings/${bookingId}`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
            Loading conversations...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-muted-foreground text-sm">
              No conversations yet
            </div>
            <p className="text-muted-foreground/70 text-xs mt-1">
              Messages will appear here once you or a contractor starts a
              conversation about a booking.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {conversations.map((convo) => (
            <button
              key={convo.bookingId}
              onClick={() => handleClick(convo.bookingId)}
              className="w-full px-6 py-4 text-left hover:bg-muted/50 transition-colors flex items-start gap-3"
            >
              {/* Avatar placeholder */}
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                {convo.otherPartyName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm truncate">
                    {convo.otherPartyName}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatShortTime(convo.lastMessageTime)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {convo.serviceName}
                </p>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {convo.lastMessage}
                </p>
              </div>

              {/* Unread badge */}
              {convo.unreadCount > 0 && (
                <Badge
                  variant="default"
                  className="shrink-0 self-center ml-1"
                >
                  {convo.unreadCount}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
