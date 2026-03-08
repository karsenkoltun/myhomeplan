"use client";

import { Bell, Calendar, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/motion";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: "notification" | "booking";
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export function ActivityFeed({
  activities,
  delay = 0,
}: {
  activities: Activity[];
  delay?: number;
}) {
  return (
    <FadeIn delay={delay}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Inbox className="h-10 w-10 text-muted-foreground/50" />
              <div>
                <p className="font-medium">No recent activity</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Notifications and booking updates will show up here.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-h-96 space-y-1 overflow-y-auto">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50 ${
                    !activity.read && activity.type === "notification"
                      ? "bg-primary/5"
                      : ""
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      activity.type === "booking"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
                    }`}
                  >
                    {activity.type === "booking" ? (
                      <Calendar className="h-3.5 w-3.5" />
                    ) : (
                      <Bell className="h-3.5 w-3.5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-tight">
                        {activity.title}
                      </p>
                      {!activity.read && activity.type === "notification" && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {activity.body}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}
