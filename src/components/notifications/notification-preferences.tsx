"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Mail } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  NotificationType,
  NotificationTypeLabel,
  type NotificationTypeValue,
} from "@/lib/notification-types";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "mhp_notification_preferences";

interface NotificationPreferences {
  /** Master toggle for all email notifications */
  emailEnabled: boolean;
  /** Per-type email notification toggles */
  emailByType: Record<string, boolean>;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  emailEnabled: true,
  emailByType: Object.values(NotificationType).reduce(
    (acc, type) => {
      acc[type] = true;
      return acc;
    },
    {} as Record<string, boolean>
  ),
};

function loadPreferences(): NotificationPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<NotificationPreferences>;
    return {
      emailEnabled: parsed.emailEnabled ?? DEFAULT_PREFERENCES.emailEnabled,
      emailByType: {
        ...DEFAULT_PREFERENCES.emailByType,
        ...(parsed.emailByType ?? {}),
      },
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function savePreferences(prefs: NotificationPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // storage full or unavailable
  }
}

/** Group notification types by category for a cleaner layout */
const NOTIFICATION_GROUPS: {
  label: string;
  description: string;
  types: NotificationTypeValue[];
}[] = [
  {
    label: "Bookings",
    description: "Updates about your scheduled services",
    types: [
      NotificationType.BOOKING_CONFIRMED,
      NotificationType.BOOKING_CANCELLED,
      NotificationType.BOOKING_REMINDER,
    ],
  },
  {
    label: "Jobs",
    description: "Status updates on active work",
    types: [
      NotificationType.JOB_STARTED,
      NotificationType.JOB_COMPLETED,
      NotificationType.NEW_JOB_ASSIGNED,
      NotificationType.JOB_ACCEPTED,
      NotificationType.JOB_DECLINED,
    ],
  },
  {
    label: "Billing & Account",
    description: "Payment confirmations and plan updates",
    types: [
      NotificationType.PAYMENT_PROCESSED,
      NotificationType.PLAN_RENEWED,
    ],
  },
  {
    label: "Other",
    description: "Reviews, welcome messages, and more",
    types: [
      NotificationType.REVIEW_RECEIVED,
      NotificationType.WELCOME,
    ],
  },
];

export function NotificationPreferences() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setPrefs(loadPreferences());
    setMounted(true);
  }, []);

  // Persist on change (skip first render)
  useEffect(() => {
    if (mounted) {
      savePreferences(prefs);
    }
  }, [prefs, mounted]);

  const updateEmailEnabled = (enabled: boolean) => {
    setPrefs((prev) => ({ ...prev, emailEnabled: enabled }));
  };

  const updateTypeEnabled = (type: string, enabled: boolean) => {
    setPrefs((prev) => ({
      ...prev,
      emailByType: { ...prev.emailByType, [type]: enabled },
    }));
  };

  const enabledCount = Object.values(prefs.emailByType).filter(Boolean).length;
  const totalCount = Object.keys(prefs.emailByType).length;

  return (
    <div className="space-y-6">
      {/* Master toggle card */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                prefs.emailEnabled
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {prefs.emailEnabled ? (
                <Mail className="h-5 w-5" />
              ) : (
                <BellOff className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Email Notifications
              </p>
              <p className="text-xs text-muted-foreground">
                {prefs.emailEnabled
                  ? `${enabledCount} of ${totalCount} notification types enabled`
                  : "All email notifications are paused"}
              </p>
            </div>
          </div>
          <Switch
            checked={prefs.emailEnabled}
            onCheckedChange={updateEmailEnabled}
          />
        </div>
      </div>

      {/* Per-type toggles grouped by category */}
      <div
        className={cn(
          "space-y-4 transition-opacity duration-200",
          !prefs.emailEnabled && "pointer-events-none opacity-40"
        )}
      >
        {NOTIFICATION_GROUPS.map((group) => (
          <div
            key={group.label}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            {/* Group header */}
            <div className="border-b border-border/50 bg-muted/30 px-5 py-3">
              <p className="text-sm font-semibold text-foreground">
                {group.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {group.description}
              </p>
            </div>

            {/* Type rows */}
            <div className="divide-y divide-border/50">
              {group.types.map((type) => (
                <div
                  key={type}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-muted-foreground/60" />
                    <span className="text-sm text-foreground">
                      {NotificationTypeLabel[type]}
                    </span>
                  </div>
                  <Switch
                    size="sm"
                    checked={prefs.emailByType[type] ?? true}
                    onCheckedChange={(checked) =>
                      updateTypeEnabled(type, checked)
                    }
                    disabled={!prefs.emailEnabled}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Info footer */}
      <p className="text-xs text-muted-foreground/60 text-center px-4">
        In-app notifications will always appear regardless of these settings.
        Email preferences are saved locally and will sync to your profile in a
        future update.
      </p>
    </div>
  );
}
