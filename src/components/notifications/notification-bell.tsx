"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarCheck,
  CalendarX,
  Clock,
  Play,
  CheckCircle,
  CreditCard,
  Star,
  Briefcase,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/auth/auth-provider";
import { useNotificationStore } from "@/stores/notification-store";
import { NotificationType } from "@/lib/notification-types";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";

const POLL_INTERVAL = 30_000; // 30 seconds

/** Map notification type strings to lucide icon components */
const iconMap: Record<string, LucideIcon> = {
  [NotificationType.BOOKING_CONFIRMED]: CalendarCheck,
  [NotificationType.BOOKING_CANCELLED]: CalendarX,
  [NotificationType.BOOKING_REMINDER]: Clock,
  [NotificationType.JOB_STARTED]: Play,
  [NotificationType.JOB_COMPLETED]: CheckCircle,
  [NotificationType.PAYMENT_PROCESSED]: CreditCard,
  [NotificationType.REVIEW_RECEIVED]: Star,
  [NotificationType.NEW_JOB_ASSIGNED]: Briefcase,
  [NotificationType.JOB_ACCEPTED]: ThumbsUp,
  [NotificationType.JOB_DECLINED]: ThumbsDown,
  [NotificationType.PLAN_RENEWED]: RefreshCw,
  [NotificationType.WELCOME]: Sparkles,
};

/** Color accents per notification type */
const colorMap: Record<string, string> = {
  [NotificationType.BOOKING_CONFIRMED]: "text-emerald-500",
  [NotificationType.BOOKING_CANCELLED]: "text-red-500",
  [NotificationType.BOOKING_REMINDER]: "text-amber-500",
  [NotificationType.JOB_STARTED]: "text-blue-500",
  [NotificationType.JOB_COMPLETED]: "text-emerald-500",
  [NotificationType.PAYMENT_PROCESSED]: "text-violet-500",
  [NotificationType.REVIEW_RECEIVED]: "text-amber-500",
  [NotificationType.NEW_JOB_ASSIGNED]: "text-blue-500",
  [NotificationType.JOB_ACCEPTED]: "text-emerald-500",
  [NotificationType.JOB_DECLINED]: "text-red-500",
  [NotificationType.PLAN_RENEWED]: "text-violet-500",
  [NotificationType.WELCOME]: "text-amber-500",
};

/** Inline relative time helper - no external dependencies */
function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 4) return `${diffWeek}w ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface NotificationItemProps {
  notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    created_at: string;
  };
  onRead: (id: string) => void;
}

function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const Icon = iconMap[notification.type] ?? Bell;
  const iconColor = colorMap[notification.type] ?? "text-muted-foreground";

  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      onClick={() => {
        if (!notification.read) onRead(notification.id);
      }}
      className={cn(
        "flex w-full items-start gap-3 border-b border-border/50 px-4 py-3 text-left transition-colors last:border-0",
        "min-h-[56px] hover:bg-muted/50",
        !notification.read && "bg-primary/5"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          !notification.read ? "bg-primary/10" : "bg-muted"
        )}
      >
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm leading-tight",
              !notification.read ? "font-semibold" : "font-medium"
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground/70">
          {getRelativeTime(notification.created_at)}
        </p>
      </div>
    </motion.button>
  );
}

export function NotificationBell({ collapsed }: { collapsed?: boolean }) {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    setNotifications,
    setUnreadCount,
    setLoading,
    markRead,
    markAllRead,
  } = useNotificationStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [data, count] = await Promise.all([
        getNotifications(user.id),
        getUnreadCount(user.id),
      ]);
      setNotifications(
        data.map((n) => ({
          id: n.id,
          user_id: n.user_id,
          title: n.title,
          message: n.message,
          type: n.type,
          read: n.read,
          metadata: n.metadata as Record<string, unknown> | null,
          created_at: n.created_at,
        }))
      );
      setUnreadCount(count);
    } catch {
      // silent - network errors shouldn't crash the UI
    } finally {
      setLoading(false);
    }
  }, [user, setNotifications, setUnreadCount, setLoading]);

  // Initial load + polling
  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  const handleMarkRead = useCallback(
    async (id: string) => {
      markRead(id);
      try {
        await markNotificationRead(id);
      } catch {
        // optimistic update already applied
      }
    },
    [markRead]
  );

  const handleMarkAllRead = useCallback(async () => {
    if (!user) return;
    markAllRead();
    try {
      await markAllNotificationsRead(user.id);
    } catch {
      // optimistic update already applied
    }
  }, [user, markAllRead]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 min-h-[36px] min-w-[36px]"
          title="Notifications"
        >
          <Bell className="h-[18px] w-[18px] text-sidebar-foreground/60" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="right"
        sideOffset={8}
        className="w-[360px] max-w-[calc(100vw-2rem)] p-0"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="xs"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={handleMarkAllRead}
              >
                Mark all read
              </Button>
            )}
          </div>

          {/* List */}
          <ScrollArea className="max-h-[400px]">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="mb-2 h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No notifications yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60">
                  You&apos;ll see updates about your bookings and services here
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {notifications.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onRead={handleMarkRead}
                  />
                ))}
              </AnimatePresence>
            )}
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t px-4 py-2.5">
              <Link
                href="/account/notifications"
                className="block w-full text-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                View all notifications
              </Link>
            </div>
          )}
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
