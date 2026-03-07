"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase, CheckCircle2, DollarSign, Star, Calendar as CalendarIcon, Clock,
} from "lucide-react";
import {
  getContractorProfile,
  getBookingsForContractor,
  updateBookingStatus,
} from "@/lib/supabase/queries";
import { SERVICES } from "@/data/services";
import { DashboardShell } from "./dashboard-shell";
import { StatCard } from "./stat-card";
import { BookingList } from "./booking-list";
import { FadeIn } from "@/components/ui/motion";
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar";
import { format, parseISO, isSameMonth, startOfToday } from "date-fns";
import type { Database } from "@/lib/supabase/types";

type Booking = Database["public"]["Tables"]["service_bookings"]["Row"];
type ContractorProfile = Database["public"]["Tables"]["contractor_profiles"]["Row"];

export function ContractorDashboard({
  profile,
}: {
  profile: Record<string, unknown>;
}) {
  const [contractor, setContractor] = useState<ContractorProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const loadData = useCallback(async () => {
    try {
      const cp = await getContractorProfile(profile.id as string);
      if (cp) {
        setContractor(cp);
        const data = await getBookingsForContractor(cp.id);
        setBookings(data);
      }
    } catch {
      // silent
    }
  }, [profile.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const displayName = contractor?.business_name || (profile.first_name as string) || "there";

  const activeJobs = bookings.filter(
    (b) => b.status !== "completed" && b.status !== "cancelled"
  );
  const completedThisMonth = bookings.filter(
    (b) => b.status === "completed" && isSameMonth(parseISO(b.scheduled_date), startOfToday())
  );
  const totalEarnings = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.price || 0), 0);

  const getServiceName = (serviceId: string) =>
    SERVICES.find((s) => s.id === serviceId)?.name ?? serviceId;

  async function handleStatusUpdate(bookingId: string, status: Booking["status"]) {
    try {
      await updateBookingStatus(bookingId, status);
      await loadData();
    } catch {
      // silent
    }
  }

  // Map bookings to calendar events
  const calendarData = bookings
    .filter((b) => b.status !== "cancelled")
    .map((b) => ({
      day: parseISO(b.scheduled_date),
      events: [{
        id: Math.random(),
        name: getServiceName(b.service_id),
        time: b.scheduled_time,
        datetime: b.scheduled_date,
      }],
    }));

  const vettingStatus = contractor?.vetting_status ?? "pending";
  const vettingColor =
    vettingStatus === "approved" ? "bg-green-100 text-green-800" :
    vettingStatus === "rejected" ? "bg-red-100 text-red-800" :
    "bg-yellow-100 text-yellow-800";

  return (
    <DashboardShell
      title={`Welcome, ${displayName}!`}
      subtitle="Manage your jobs, schedule, and earnings."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Briefcase} label="Active Jobs" value={activeJobs.length} delay={0.05} />
        <StatCard icon={CheckCircle2} label="Completed (Month)" value={completedThisMonth.length} delay={0.1} />
        <StatCard icon={DollarSign} label="Total Earnings" value={Math.round(totalEarnings)} prefix="$" delay={0.15} />
        <StatCard icon={Star} label="Rating" value={contractor?.rating ?? 0} suffix="/5" delay={0.2} />
      </div>

      {/* Main Tabs */}
      <FadeIn delay={0.25}>
        <Tabs defaultValue="jobs" className="mt-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="mt-4">
            <BookingList
              bookings={activeJobs}
              title="Active Jobs"
              emptyMessage="No active jobs right now"
              actions={(booking) => {
                const actions: { label: string; onClick: () => void; variant?: "default" | "outline" | "destructive" }[] = [];
                if (booking.status === "scheduled") {
                  actions.push({ label: "Confirm", onClick: () => handleStatusUpdate(booking.id, "confirmed") });
                }
                if (booking.status === "confirmed") {
                  actions.push({ label: "Start", onClick: () => handleStatusUpdate(booking.id, "in_progress"), variant: "default" });
                }
                if (booking.status === "in_progress") {
                  actions.push({ label: "Complete", onClick: () => handleStatusUpdate(booking.id, "completed"), variant: "default" });
                }
                if (booking.status !== "completed" && booking.status !== "cancelled") {
                  actions.push({ label: "Cancel", onClick: () => handleStatusUpdate(booking.id, "cancelled"), variant: "destructive" });
                }
                return actions;
              }}
            />

            {completedThisMonth.length > 0 && (
              <div className="mt-4">
                <BookingList
                  bookings={completedThisMonth}
                  title="Completed This Month"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <FullScreenCalendar data={calendarData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Earnings Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.filter((b) => b.status === "completed").length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No completed jobs yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {bookings
                      .filter((b) => b.status === "completed")
                      .map((b) => (
                        <div key={b.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                          <div>
                            <p className="font-medium">{getServiceName(b.service_id)}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(parseISO(b.scheduled_date), "MMM d, yyyy")}
                            </p>
                          </div>
                          <span className="font-semibold text-green-600">${(b.price || 0).toFixed(0)}</span>
                        </div>
                      ))}
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-green-600">${totalEarnings.toFixed(0)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </FadeIn>

      {/* Profile Status */}
      <FadeIn delay={0.3}>
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Profile Status</CardTitle>
              <Badge className={vettingColor}>{vettingStatus}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Business Name</p>
                <p className="font-medium">{contractor?.business_name || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Years in Business</p>
                <p className="font-medium">{contractor?.years_in_business ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Jobs</p>
                <p className="font-medium">{contractor?.total_jobs ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available Days</p>
                <p className="font-medium">
                  {Array.isArray(contractor?.available_days)
                    ? (contractor.available_days as string[]).join(", ")
                    : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </DashboardShell>
  );
}
