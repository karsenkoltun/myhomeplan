"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2, ClipboardList, DollarSign, Calendar, Users, Wrench,
  Shield, FileText, Flame, AlertTriangle,
} from "lucide-react";
import { parseISO } from "date-fns";
import { getStrataProperty, getSubscriptionWithUsage, getBookingsForProperty } from "@/lib/supabase/queries";
import { SERVICES } from "@/data/services";
import { DashboardShell } from "./dashboard-shell";
import { StatCard } from "./stat-card";
import { UsageOverview } from "./usage-overview";
import { StrataServiceProviders } from "./strata-service-providers";
import { FadeIn } from "@/components/ui/motion";
import type { Database, Json } from "@/lib/supabase/types";
import type { CalendarData } from "@/components/ui/fullscreen-calendar";

const FullScreenCalendar = dynamic(
  () =>
    import("@/components/ui/fullscreen-calendar").then((mod) => ({
      default: mod.FullScreenCalendar,
    })),
  { ssr: false }
);

type Booking = Database["public"]["Tables"]["service_bookings"]["Row"];
type StrataProperty = Database["public"]["Tables"]["strata_properties"]["Row"];

interface CouncilContact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

function getExpiryBadge(date: string | null, label: string) {
  if (!date) return <Badge variant="secondary" className="text-[10px]">{label}: Not set</Badge>;
  const d = new Date(date);
  const now = new Date();
  const daysLeft = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return <Badge variant="destructive" className="text-[10px]">{label}: Expired</Badge>;
  if (daysLeft < 30) return <Badge className="bg-red-100 text-red-800 text-[10px]">{label}: {daysLeft}d left</Badge>;
  if (daysLeft < 90) return <Badge className="bg-amber-100 text-amber-800 text-[10px]">{label}: {daysLeft}d left</Badge>;
  return <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">{label}: Valid</Badge>;
}

export function StrataDashboard({
  profile,
}: {
  profile: Record<string, unknown>;
}) {
  const [strata, setStrata] = useState<StrataProperty | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [usageData, setUsageData] = useState<{ serviceId: string; frequency: string; monthlyPrice: number; used: number }[]>([]);
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const userId = profile.id as string;
        const data = await getStrataProperty(userId);
        setStrata(data);

        // Load bookings for the strata property
        if (data) {
          const bookingsData = await getBookingsForProperty(data.id);
          setBookings(bookingsData);
        }

        const usage = await getSubscriptionWithUsage(userId);
        if (usage) {
          setUsageData(usage.usageMap);
          setPeriodStart(usage.periodStart);
          setPeriodEnd(usage.periodEnd);
        }
      } catch {
        // silent
      }
    }
    load();
  }, [profile.id]);

  const displayName = strata?.corporation_name || (profile.first_name as string) || "there";
  const councilContacts = (strata?.council_contacts as CouncilContact[] | null) ?? [];
  const amenities = (strata?.amenities as string[] | null) ?? [];
  const priorityAreas = (strata?.priority_areas as string[] | null) ?? [];
  const currentProviders = strata?.current_providers as Record<string, string> | null;
  const contractEndDates = strata?.current_contract_end_dates as Record<string, string> | null;

  // Map bookings to calendar events
  const calendarData: CalendarData[] = useMemo(() => {
    return bookings
      .filter((b) => b.status !== "cancelled")
      .map((b, i) => {
        const serviceName = SERVICES.find((s) => s.id === b.service_id)?.name ?? b.service_id;
        return {
          day: parseISO(b.scheduled_date),
          events: [{
            id: i,
            name: serviceName,
            time: b.scheduled_time,
            datetime: b.scheduled_date,
          }],
        };
      });
  }, [bookings]);

  const upcomingBookingCount = bookings.filter(
    (b) => b.status !== "completed" && b.status !== "cancelled"
  ).length;

  return (
    <DashboardShell
      title={`Welcome, ${displayName}!`}
      subtitle="Your strata management overview."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Building2} label="Total Units" value={strata?.unit_count ?? 0} delay={0.05} />
        <StatCard icon={ClipboardList} label="Buildings" value={strata?.building_count ?? 0} delay={0.1} />
        <StatCard icon={DollarSign} label="Annual Budget" value={strata?.annual_maintenance_budget ?? 0} prefix="$" delay={0.15} />
        <StatCard icon={Calendar} label="Year Built" value={strata?.year_built ?? 0} delay={0.2} />
      </div>

      {/* Usage Overview */}
      {usageData.length > 0 && (
        <div className="mt-6">
          <UsageOverview usageData={usageData} periodStart={periodStart} periodEnd={periodEnd} delay={0.22} />
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Building Overview */}
        <FadeIn delay={0.25}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Building Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Strata Plan #</p>
                  <p className="font-medium">{strata?.strata_plan_number || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Management Co.</p>
                  <p className="font-medium">{strata?.management_company || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Common Area</p>
                  <p className="font-medium">{(strata?.common_area_sqft ?? 0).toLocaleString()} sq ft</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Elevator Count</p>
                  <p className="font-medium">{strata?.elevator_count ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Parking Type</p>
                  <p className="font-medium capitalize">{strata?.parking_type || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Parking Stalls</p>
                  <p className="font-medium">{(strata?.parking_stall_count ?? 0) + (strata?.visitor_parking_count ?? 0)}</p>
                </div>
              </div>
              {strata?.address && (
                <>
                  <Separator className="my-3" />
                  <p className="text-sm text-muted-foreground">
                    {strata.address}, {strata.city}, {strata.province} {strata.postal_code}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Financial Overview (expanded) */}
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Reserve Fund</p>
                  <p className="font-medium">${(strata?.reserve_fund_balance ?? 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Annual Contribution</p>
                  <p className="font-medium">${(strata?.annual_reserve_contribution ?? 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Insurance Provider</p>
                  <p className="font-medium">{strata?.insurance_provider || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Coverage</p>
                  <p className="font-medium">${(strata?.insurance_coverage_amount ?? 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Maintenance Budget</p>
                  <p className="font-medium">${(strata?.annual_maintenance_budget ?? 0).toLocaleString()}/yr</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Per Unit/Month</p>
                  <p className="font-medium">
                    ${strata?.unit_count ? Math.round((strata.annual_maintenance_budget ?? 0) / strata.unit_count / 12).toLocaleString() : "0"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Document Status */}
        <FadeIn delay={0.33}>
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Document Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {getExpiryBadge(strata?.insurance_expiry ?? null, "Insurance")}
                {getExpiryBadge(strata?.depreciation_report_date ?? null, "Depreciation Report")}
                {getExpiryBadge(strata?.last_fire_inspection ?? null, "Fire Inspection")}
                {getExpiryBadge(strata?.roof_warranty_expiry ?? null, "Roof Warranty")}
              </div>
              <Separator className="my-3" />
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Fire System</p>
                  <p className="font-medium capitalize">{strata?.fire_system_type || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Roof Age</p>
                  <p className="font-medium">{strata?.roof_age ?? 0} years</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">AGM Month</p>
                  <p className="font-medium">
                    {strata?.agm_month ? new Date(2024, (strata.agm_month - 1)).toLocaleString("default", { month: "long" }) : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Service Providers */}
        <div className="md:col-span-2">
          <StrataServiceProviders
            currentProviders={currentProviders}
            contractEndDates={contractEndDates}
          />
        </div>

        {/* Maintenance Calendar */}
        <FadeIn delay={0.34} className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Maintenance Schedule</CardTitle>
                {upcomingBookingCount > 0 && (
                  <Badge variant="secondary" className="ml-auto text-[10px]">
                    {upcomingBookingCount} scheduled
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <FullScreenCalendar data={calendarData} />
            </CardContent>
          </Card>
        </FadeIn>

        {/* Priority Areas */}
        {priorityAreas.length > 0 && (
          <FadeIn delay={0.35}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Priority Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {priorityAreas.map((area) => (
                    <Badge key={area} variant="secondary">{area}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {/* Amenities */}
        {amenities.length > 0 && (
          <FadeIn delay={0.4}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline">{amenity}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {/* Council Contacts */}
        {councilContacts.length > 0 && (
          <FadeIn delay={0.45}>
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Council Contacts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {councilContacts.map((contact, i) => (
                    <div key={i} className="flex flex-col gap-1 rounded-lg border p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.role}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p>{contact.email}</p>
                        <p>{contact.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )}
      </div>

      {/* Account info */}
      <FadeIn delay={0.5}>
        <Card className="mt-6">
          <CardHeader><CardTitle className="text-base">Account</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Contact</p>
                <p className="font-medium">{strata?.contact_name || `${profile.first_name} ${profile.last_name}`}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{strata?.contact_email || (profile.email as string)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium">{strata?.contact_phone || (profile.phone as string) || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </DashboardShell>
  );
}
