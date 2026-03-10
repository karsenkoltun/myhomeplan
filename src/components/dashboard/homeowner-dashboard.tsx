"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  Home, Settings, CreditCard, Calendar,
  CheckCircle2, Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair, ClipboardList, DollarSign,
  Phone, AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { usePropertyStore } from "@/stores/property-store";
import { useUserStore } from "@/stores/user-store";
import {
  getAllProperties,
  getBookingsForProperty,
  getSubscriptionWithUsageForProperty,
  getRecentActivity,
  getServiceCredits,
} from "@/lib/supabase/queries";
import { parseISO } from "date-fns";
import { SERVICES, PLAN_DISCOUNTS, PLAN_TIERS } from "@/data/services";
import { calculateServicePrice } from "@/lib/pricing";
import { DashboardShell } from "./dashboard-shell";
import { StatCard } from "./stat-card";
import { BookingList } from "./booking-list";
import { UsageOverview } from "./usage-overview";
import { ActivityFeed } from "./activity-feed";
import { CreditBalance } from "./credit-balance";
import { PropertySelector } from "./property-selector";
import { FadeIn, SpringNumber } from "@/components/ui/motion";
import type { Database } from "@/lib/supabase/types";
import type { CalendarData } from "@/components/ui/fullscreen-calendar";

const FullScreenCalendar = dynamic(
  () =>
    import("@/components/ui/fullscreen-calendar").then((mod) => ({
      default: mod.FullScreenCalendar,
    })),
  { ssr: false }
);

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
};

type Booking = Database["public"]["Tables"]["service_bookings"]["Row"];

interface Property {
  id: string;
  address?: string | null;
  city?: string | null;
  home_type?: string | null;
  home_sqft?: number | null;
  lot_sqft?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
}

interface UsageData {
  serviceId: string;
  frequency: string;
  monthlyPrice: number;
  used: number;
}

interface Activity {
  id: string;
  type: "notification" | "booking";
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export function HomeownerDashboard({
  profile,
}: {
  profile: Record<string, unknown>;
}) {
  const { property, serviceSpecs } = usePropertyStore();
  const { activePropertyId, setActivePropertyId } = useUserStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [usedCredits, setUsedCredits] = useState(0);
  const [planTierName, setPlanTierName] = useState<string | null>(null);
  const [dbPlanInterval, setDbPlanInterval] = useState<string | null>(null);
  const [dbMonthlyTotal, setDbMonthlyTotal] = useState<number | null>(null);
  const [dbServiceCount, setDbServiceCount] = useState<number | null>(null);
  const [dbServices, setDbServices] = useState<{ service_id: string; calculated_monthly_price: number }[]>([]);

  // Load properties once
  useEffect(() => {
    async function loadProperties() {
      const userId = profile.id as string;
      try {
        const props = await getAllProperties(userId);
        setProperties(props);
        if (props.length > 0 && !activePropertyId) {
          setActivePropertyId(props[0].id);
        }
      } catch {
        // silent
      }
    }
    loadProperties();
  }, [profile.id, activePropertyId, setActivePropertyId]);

  // Load data when active property changes
  useEffect(() => {
    async function loadData() {
      const userId = profile.id as string;
      const propId = activePropertyId || properties[0]?.id;
      if (!propId) return;

      try {
        // Load bookings + activity for active property
        const [bookingData, activityData] = await Promise.all([
          getBookingsForProperty(propId),
          getRecentActivity(userId, propId),
        ]);
        setBookings(bookingData);
        setActivities(activityData);

        // Load usage from DB subscription for this property
        const usageResult = await getSubscriptionWithUsageForProperty(propId);
        if (usageResult) {
          setUsageData(usageResult.usageMap);
          setPeriodStart(usageResult.periodStart);
          setPeriodEnd(usageResult.periodEnd);

          const sub = usageResult.subscription;
          setDbPlanInterval(sub.plan_interval as string | null);
          setDbMonthlyTotal(sub.monthly_total as number | null);
          setDbServiceCount((sub.subscription_services as unknown[])?.length ?? 0);
          setDbServices(
            ((sub.subscription_services ?? []) as { service_id: string; calculated_monthly_price: number }[])
          );

          if (sub.plan_tier_id) {
            const tier = PLAN_TIERS.find((t) => t.id === sub.plan_tier_id);
            if (tier) setPlanTierName(tier.name);
          } else {
            setPlanTierName(null);
          }

          const credits = await getServiceCredits(sub.id);
          setTotalCredits(credits.reduce((s, c) => s + c.total_credits, 0));
          setUsedCredits(credits.reduce((s, c) => s + c.used_credits, 0));
        } else {
          // No subscription for this property
          setUsageData([]);
          setPeriodStart("");
          setPeriodEnd("");
          setPlanTierName(null);
          setDbPlanInterval(null);
          setDbMonthlyTotal(null);
          setDbServiceCount(null);
          setDbServices([]);
          setTotalCredits(0);
          setUsedCredits(0);
        }
      } catch {
        // silent
      }
    }
    if (properties.length > 0) loadData();
  }, [profile.id, activePropertyId, properties]);

  const displayName = (profile.first_name as string) || "there";

  // Use DB subscription data if available, else fall back to Zustand planStore
  const hasSub = dbMonthlyTotal !== null;
  const planInterval = dbPlanInterval || "monthly";
  const planInfo = PLAN_DISCOUNTS[planInterval as keyof typeof PLAN_DISCOUNTS] || PLAN_DISCOUNTS.monthly;
  const total = hasSub ? dbMonthlyTotal! : 0;
  const serviceCount = hasSub ? (dbServiceCount ?? 0) : 0;

  const upcomingBookings = bookings.filter(
    (b) => b.status !== "completed" && b.status !== "cancelled"
  );
  const completedCount = bookings.filter((b) => b.status === "completed").length;

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

  return (
    <DashboardShell
      title={`Welcome, ${displayName}!`}
      subtitle="Here's your plan overview. Everything in one place."
    >
      {/* Property Selector */}
      {properties.length > 1 && (
        <div className="mb-4">
          <PropertySelector
            properties={properties}
            activePropertyId={activePropertyId}
            onSelect={setActivePropertyId}
          />
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={ClipboardList} label="Active Services" value={serviceCount} delay={0.05} />
        <StatCard icon={Calendar} label="Upcoming" value={upcomingBookings.length} delay={0.1} />
        <StatCard icon={DollarSign} label="Monthly Cost" value={Number.isFinite(total) ? Math.round(total) : 0} prefix="$" delay={0.15} />
        <StatCard icon={CheckCircle2} label="Completed" value={completedCount} delay={0.2} />
      </div>

      {/* Usage Overview */}
      {usageData.length > 0 && (
        <div className="mt-6">
          <UsageOverview usageData={usageData} periodStart={periodStart} periodEnd={periodEnd} delay={0.22} />
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Plan Summary */}
        <FadeIn delay={0.25}>
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Your Plan</CardTitle>
                <div className="flex items-center gap-2">
                  {planTierName && (
                    <Badge className="bg-primary text-primary-foreground">{planTierName}</Badge>
                  )}
                  <Badge className="bg-primary/10 text-primary">{planInfo.label}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {hasSub ? (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">$<SpringNumber value={Math.round(total)} /></span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{serviceCount} services included</p>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    {dbServices.slice(0, 5).map((svc) => {
                      const service = SERVICES.find((s) => s.id === svc.service_id);
                      if (!service) return null;
                      const Icon = ICON_MAP[service.icon] || CheckCircle2;
                      return (
                        <div key={svc.service_id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{service.name}</span>
                          </div>
                          <span className="font-medium">${(svc.calculated_monthly_price ?? 0).toFixed(0)}/mo</span>
                        </div>
                      );
                    })}
                    {dbServices.length > 5 && (
                      <p className="text-xs text-muted-foreground">+{dbServices.length - 5} more services</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No plan configured for this property.</p>
                </div>
              )}
              <Button variant="outline" className="mt-4 w-full" size="sm" asChild>
                <Link href="/account/services">{hasSub ? "Modify Plan" : "Build a Plan"}</Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Credits + Property Column */}
        <div className="flex flex-col gap-6">
          {/* Credit Balance */}
          <CreditBalance totalCredits={totalCredits} usedCredits={usedCredits} delay={0.28} />

          {/* Property Card */}
          <FadeIn delay={0.3}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Your Property</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/account/property"><Settings className="mr-1 h-3.5 w-3.5" /> Edit</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Home Size</p>
                    <p className="font-medium">{property.homeSqft.toLocaleString()} sq ft</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lot Size</p>
                    <p className="font-medium">{property.lotSqft.toLocaleString()} sq ft</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Bedrooms/Bathrooms</p>
                    <p className="font-medium">{property.bedrooms} bed / {property.bathrooms} bath</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Home Type</p>
                    <p className="font-medium capitalize">{property.homeType}</p>
                  </div>
                </div>
                {property.address && (
                  <>
                    <Separator className="my-3" />
                    <p className="text-sm text-muted-foreground">{property.address}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Activity Feed */}
        <ActivityFeed activities={activities} delay={0.33} />

        {/* Emergency Contact */}
        {(profile.emergency_contact_name as string) && (
          <FadeIn delay={0.35}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <CardTitle className="text-base">Emergency Contact</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">{profile.emergency_contact_name as string}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {profile.emergency_contact_phone as string}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {/* Service Calendar */}
        <FadeIn delay={0.36} className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Service Calendar</CardTitle>
                {upcomingBookings.length > 0 && (
                  <Badge variant="secondary" className="ml-auto text-[10px]">
                    {upcomingBookings.length} upcoming
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <FullScreenCalendar data={calendarData} />
            </CardContent>
          </Card>
        </FadeIn>

        {/* Bookings */}
        <div className="md:col-span-2">
          <BookingList
            bookings={upcomingBookings}
            title="Upcoming Bookings"
            emptyMessage="No upcoming bookings. Schedule your first service!"
            delay={0.38}
          />
        </div>

        {/* Quick Actions */}
        <FadeIn delay={0.4}>
          <Card className="md:col-span-2">
            <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                {[
                  { icon: Calendar, label: "Book Service", href: "/account/book" },
                  { icon: ClipboardList, label: "My Services", href: "/account/services" },
                  { icon: Settings, label: "Edit Property", href: "/account/property" },
                  { icon: Home, label: "Browse Plans", href: "/account/plan-builder" },
                  { icon: CreditCard, label: "Settings", href: "/account/settings" },
                ].map((action) => (
                  <Link key={action.label} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors hover:border-primary/30 hover:bg-muted/50"
                    >
                      <action.icon className="h-6 w-6 text-primary" />
                      <span className="text-xs font-semibold">{action.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Account info */}
      <FadeIn delay={0.45}>
        <Card className="mt-6">
          <CardHeader><CardTitle className="text-base">Account</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{profile.first_name as string} {profile.last_name as string}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{profile.email as string}</p>
              </div>
              {(profile.phone as string) && (
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{profile.phone as string}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </DashboardShell>
  );
}
