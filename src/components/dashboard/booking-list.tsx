"use client";

import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion";
import { Calendar, Clock } from "lucide-react";
import { SERVICES } from "@/data/services";
import type { Database } from "@/lib/supabase/types";

type Booking = Database["public"]["Tables"]["service_bookings"]["Row"];
type BookingStatus = Booking["status"];

const STATUS_COLORS: Record<BookingStatus, string> = {
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  completed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  no_show: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};

export function BookingList({
  bookings,
  title = "Upcoming Bookings",
  actions,
  emptyMessage = "No bookings yet",
  delay = 0,
}: {
  bookings: Booking[];
  title?: string;
  actions?: (booking: Booking) => { label: string; onClick: () => void; variant?: "default" | "outline" | "destructive" }[];
  emptyMessage?: string;
  delay?: number;
}) {
  const getServiceName = (serviceId: string) =>
    SERVICES.find((s) => s.id === serviceId)?.name ?? serviceId;

  return (
    <FadeIn delay={delay}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">
                        {getServiceName(booking.service_id)}
                      </p>
                      <Badge
                        variant="secondary"
                        className={STATUS_COLORS[booking.status]}
                      >
                        {STATUS_LABELS[booking.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(booking.scheduled_date), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {booking.scheduled_time}
                      </span>
                      {booking.price > 0 && (
                        <span>${booking.price.toFixed(0)}</span>
                      )}
                    </div>
                    {booking.notes && (
                      <p className="text-xs text-muted-foreground">{booking.notes}</p>
                    )}
                  </div>
                  {actions && (
                    <div className="flex gap-2">
                      {actions(booking).map((action) => (
                        <Button
                          key={action.label}
                          variant={action.variant ?? "outline"}
                          size="sm"
                          onClick={action.onClick}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}
