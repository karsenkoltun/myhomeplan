"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  Home, Settings, CreditCard, Calendar, ArrowRight,
  CheckCircle2, Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair, type LucideIcon,
} from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { usePropertyStore } from "@/stores/property-store";
import { usePlanStore } from "@/stores/plan-store";
import { SERVICES, PLAN_DISCOUNTS } from "@/data/services";
import { calculateServicePrice } from "@/lib/pricing";
import { FadeIn, StaggerContainer, StaggerItem, SpringNumber } from "@/components/ui/motion";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
};

export default function AccountPage() {
  const router = useRouter();
  const { account, onboardingComplete, userType } = useUserStore();
  const { property, serviceSpecs } = usePropertyStore();
  const { selectedServices, planInterval } = usePlanStore();

  useEffect(() => {
    if (!onboardingComplete) {
      router.push("/onboarding");
    }
  }, [onboardingComplete, router]);

  if (!onboardingComplete || !account) return null;

  const selectedServiceData = SERVICES.filter((s) => selectedServices.includes(s.id));
  const subtotal = selectedServiceData.reduce(
    (sum, s) => sum + calculateServicePrice(s, property.homeSqft, property.lotSqft, serviceSpecs[s.id]),
    0
  );
  const discount = PLAN_DISCOUNTS[planInterval].discount;
  const total = subtotal * (1 - discount);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Welcome */}
      <FadeIn>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold sm:text-3xl">
            Welcome, {account.name.split(" ")[0]}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s your plan overview. Everything in one place.
          </p>
        </motion.div>
      </FadeIn>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Plan Summary */}
        <FadeIn delay={0.1}>
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Your Plan</CardTitle>
                <Badge className="bg-primary/10 text-primary">
                  {PLAN_DISCOUNTS[planInterval].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">
                  $<SpringNumber value={Math.round(total)} />
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {selectedServices.length} services included
              </p>

              <Separator className="my-4" />

              <div className="space-y-2">
                {selectedServiceData.slice(0, 5).map((service) => {
                  const Icon = ICON_MAP[service.icon] || CheckCircle2;
                  const price = calculateServicePrice(service, property.homeSqft, property.lotSqft, serviceSpecs[service.id]);
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
                  <p className="text-xs text-muted-foreground">
                    +{selectedServiceData.length - 5} more services
                  </p>
                )}
              </div>

              <Button variant="outline" className="mt-4 w-full" size="sm" asChild>
                <Link href="/plan-builder">Modify Plan</Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Property Card */}
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Your Property</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/account/property">
                    <Settings className="mr-1 h-3.5 w-3.5" /> Edit
                  </Link>
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

        {/* Quick Actions */}
        <FadeIn delay={0.3}>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Calendar, label: "Schedule Service", desc: "Coming soon" },
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
      <FadeIn delay={0.4}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{account.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{account.email}</p>
              </div>
              {account.phone && (
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{account.phone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
