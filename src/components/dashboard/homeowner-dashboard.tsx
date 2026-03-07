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
  type LucideIcon,
} from "lucide-react";
import { usePropertyStore } from "@/stores/property-store";
import { usePlanStore } from "@/stores/plan-store";
import { getProperty, getBookingsForProperty, getSubscription } from "@/lib/supabase/queries";
import { SERVICES, PLAN_DISCOUNTS } from "@/data/services";
import { calculateServicePrice } from "@/lib/pricing";
import { DashboardShell } from "./dashboard-shell";
import { StatCard } from "./stat-card";
import { BookingList } from "./booking-list";
import { FadeIn, SpringNumber } from "@/components/ui/motion";
import type { Database } from "@/lib/supabase/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
};

type Booking = Database["public"]["Tables"]["service_bookings"]["Row"];

export function HomeownerDashboard({
  profile,
}: {
  profile: Record<string, unknown>;
}) {
  const { property, serviceSpecs } = usePropertyStore();
  const { selectedServices, planInterval } = usePlanStore();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    async function loadBookings() {
      try {
        const prop = await getProperty(profile.id as string);
        if (prop) {
          const data = await getBookingsForProperty(prop.id);
          setBookings(data);
        }
      } catch {
        // silent
      }
    }
    loadBookings();
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

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Plan Summary */}
        <FadeIn delay={0.25}>
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Your Plan</CardTitle>
                <Badge className="bg-primary/10 text-primary">{PLAN_DISCOUNTS[planInterval].label}</Badge>
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
                <div>
                  <p className="text-xs text-muted-foreground">Year Built</p>
                  <p className="font-medium">{property.yearBuilt}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Heating</p>
                  <p className="font-medium capitalize">{property.heatingType.replace("-", " ")}</p>
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

        {/* Bookings */}
        <div className="md:col-span-2">
          <BookingList
            bookings={upcomingBookings}
            title="Upcoming Bookings"
            emptyMessage="No upcoming bookings. Schedule your first service!"
            delay={0.35}
          />
        </div>

        {/* Quick Actions */}
        <FadeIn delay={0.4}>
          <Card className="md:col-span-2">
            <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Calendar, label: "Book Service", href: "/account/book" },
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
