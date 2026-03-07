"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  Home, Settings, CreditCard, Calendar,
  CheckCircle2, Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair, ClipboardList, DollarSign,
  Phone, ShoppingCart, AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { usePropertyStore } from "@/stores/property-store";
import { usePlanStore } from "@/stores/plan-store";
import {
  getProperty,
  getBookingsForProperty,
  getSubscription,
  getSubscriptionWithUsage,
  getRecentActivity,
  getServiceCredits,
} from "@/lib/supabase/queries";
import { SERVICES, PLAN_DISCOUNTS, PLAN_TIERS } from "@/data/services";
import { calculateServicePrice } from "@/lib/pricing";
import { DashboardShell } from "./dashboard-shell";
import { StatCard } from "./stat-card";
import { BookingList } from "./booking-list";
import { UsageOverview } from "./usage-overview";
import { ActivityFeed } from "./activity-feed";
import { CreditBalance } from "./credit-balance";
import { FadeIn, SpringNumber } from "@/components/ui/motion";
import type { Database } from "@/lib/supabase/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
};

type Booking = Database["public"]["Tables"]["service_bookings"]["Row"];

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
  const { selectedServices, planInterval } = usePlanStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [usedCredits, setUsedCredits] = useState(0);
  const [planTierName, setPlanTierName] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const userId = profile.id as string;
        const prop = await getProperty(userId);

        if (prop) {
          const data = await getBookingsForProperty(prop.id);
          setBookings(data);

          const activityData = await getRecentActivity(userId, prop.id);
          setActivities(activityData);
        }

        // Load usage data from subscription
        const usageResult = await getSubscriptionWithUsage(userId);
        if (usageResult) {
          setUsageData(usageResult.usageMap);
          setPeriodStart(usageResult.periodStart);
          setPeriodEnd(usageResult.periodEnd);

          // Find plan tier name
          const sub = usageResult.subscription;
          if (sub.plan_tier_id) {
            const tier = PLAN_TIERS.find((t) => t.id === sub.plan_tier_id);
            if (tier) setPlanTierName(tier.name);
          }

          // Load credits
          const credits = await getServiceCredits(sub.id);
          const total = credits.reduce((s, c) => s + c.total_credits, 0);
          const used = credits.reduce((s, c) => s + c.used_credits, 0);
          setTotalCredits(total);
          setUsedCredits(used);
        }
      } catch {
        // silent
      }
    }
    loadData();
  }, [profile.id]);

  const displayName = (profile.first_name as string) || "there";
  const selectedServiceData = SERVICES.filter((s) => selectedServices.includes(s.id));
  const subtotal = selectedServiceData.reduce(
    (sum, s) => sum + calculateServicePrice(s, property.homeSqft, property.lotSqft, serviceSpecs[s.id], property),
    0
  );
  const discount = PLAN_DISCOUNTS[planInterval].discount;
  const total = subtotal * (1 - discount);

  const upcomingBookings = bookings.filter(
    (b) => b.status !== "completed" && b.status !== "cancelled"
  );
  const completedCount = bookings.filter((b) => b.status === "completed").length;

  return (
    <DashboardShell
      title={`Welcome, ${displayName}!`}
      subtitle="Here's your plan overview. Everything in one place."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={ClipboardList} label="Active Services" value={selectedServices.length} delay={0.05} />
        <StatCard icon={Calendar} label="Upcoming" value={upcomingBookings.length} delay={0.1} />
        <StatCard icon={DollarSign} label="Monthly Cost" value={Math.round(total)} prefix="$" delay={0.15} />
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
                  <Badge className="bg-primary/10 text-primary">{PLAN_DISCOUNTS[planInterval].label}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">$<SpringNumber value={Math.round(total)} /></span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{selectedServices.length} services included</p>
              <Separator className="my-4" />
              <div className="space-y-2">
                {selectedServiceData.slice(0, 5).map((service) => {
                  const Icon = ICON_MAP[service.icon] || CheckCircle2;
                  const price = calculateServicePrice(service, property.homeSqft, property.lotSqft, serviceSpecs[service.id], property);
                  return (
                    <div key={service.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{service.name}</span>
                      </div>
                      <span className="font-medium">${price.toFixed(0)}/mo</span>
                    </div>
                  );
                })}
                {selectedServiceData.length > 5 && (
                  <p className="text-xs text-muted-foreground">+{selectedServiceData.length - 5} more services</p>
                )}
              </div>
              <Button variant="outline" className="mt-4 w-full" size="sm" asChild>
                <Link href="/plan-builder">Modify Plan</Link>
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
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {[
                  { icon: Calendar, label: "Book Service", href: "/account/book" },
                  { icon: ShoppingCart, label: "Buy Credits", desc: "Add-on services" },
                  { icon: CreditCard, label: "Billing", desc: "Coming soon" },
                  { icon: Settings, label: "Edit Property", href: "/account/property" },
                  { icon: Home, label: "Browse Services", href: "/plan-builder" },
                ].map((action) => (
                  <Link key={action.label} href={action.href || "#"}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors hover:border-primary/30 hover:bg-muted/50"
                    >
                      <action.icon className="h-6 w-6 text-primary" />
                      <span className="text-xs font-semibold">{action.label}</span>
                      {action.desc && <span className="text-[10px] text-muted-foreground">{action.desc}</span>}
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
