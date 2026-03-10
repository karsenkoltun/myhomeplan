"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  message: string;
  message_type: "text" | "system" | "photo";
  read: boolean;
  created_at: string;
}

interface BookingChatProps {
  bookingId: string;
  currentUserId: string;
}

/**
 * Format a timestamp into a relative time string.
 */
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function BookingChat({ bookingId, currentUserId }: BookingChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const effectiveUserId = user?.id ?? currentUserId;

  /**
   * Fetch messages for this booking.
   */
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages?bookingId=${bookingId}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch messages");
      }
      const data = await res.json();
      setMessages(data.messages ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  /**
   * Initial fetch and polling every 10 seconds.
   */
  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  /**
   * Auto-scroll to the bottom when messages change.
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Send a new message.
   */
  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text || sending) return;

    setSending(true);
    setNewMessage("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: bookingId,
          message: text,
          message_type: "text",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
      // Put the message back in the input so the user can retry
      setNewMessage(text);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  /**
   * Handle Enter key press.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Messages</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Message list */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
        >
          {loading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
              Loading messages...
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
              No messages yet. Start the conversation!
            </div>
          )}

          {messages.map((msg) => {
            // System messages are centered
            if (msg.message_type === "system") {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="bg-muted/50 text-muted-foreground text-xs px-3 py-1.5 rounded-full max-w-[80%] text-center">
                    {msg.message}
                    <span className="ml-2 opacity-70">
                      {formatRelativeTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              );
            }

            const isMine = msg.sender_id === effectiveUserId;

            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isMine
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.message_type === "photo" ? (
                    <div className="space-y-1">
                      <img
                        src={msg.message}
                        alt="Shared photo"
                        className="rounded-lg max-w-full max-h-64 object-cover"
                      />
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {msg.message}
                    </p>
                  )}
                  <p
                    className={`text-[10px] mt-1 ${
                      isMine
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatRelativeTime(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error display */}
        {error && (
          <div className="px-4 py-2 bg-destructive/10 text-destructive text-xs text-center">
            {error}
          </div>
        )}

        {/* Input area */}
        <div className="border-t px-4 py-3 flex gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            size="default"
          >
            {sending ? "..." : "Send"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
