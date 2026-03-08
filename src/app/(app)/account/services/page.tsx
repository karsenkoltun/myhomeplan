"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/ui/motion";
import {
  ArrowLeft,
  ClipboardList,
  Calendar,
  Percent,
  Package,
  Scissors,
  Snowflake,
  Thermometer,
  Sparkles,
  Bug,
  Hammer,
  Wrench,
  Zap,
  Sprout,
  Leaf,
  Droplets,
  Waves,
  Sun,
  Paintbrush,
  Armchair,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { usePlanStore } from "@/stores/plan-store";
import { usePropertyStore } from "@/stores/property-store";
import {
  SERVICES,
  SERVICE_FREQUENCY_OPTIONS,
  PLAN_DISCOUNTS,
} from "@/data/services";
import { calculateServicePrice } from "@/lib/pricing";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors,
  Snowflake,
  Thermometer,
  Sparkles,
  Bug,
  Hammer,
  Wrench,
  Zap,
  Sprout,
  Leaf,
  Droplets,
  Waves,
  Sun,
  Paintbrush,
  Armchair,
};

export default function ServicesPage() {
  const { user } = useAuth();
  const { selectedServices, planInterval, serviceFrequencies } = usePlanStore();
  const { property, serviceSpecs } = usePropertyStore();

  const activeServices = useMemo(
    () => SERVICES.filter((s) => selectedServices.includes(s.id)),
    [selectedServices]
  );

  const servicePrices = useMemo(() => {
    const prices: Record<string, number> = {};
    for (const service of activeServices) {
      const raw = calculateServicePrice(
        service,
        property.homeSqft,
        property.lotSqft,
        serviceSpecs[service.id],
        property,
        serviceFrequencies[service.id]
      );
      prices[service.id] = Number.isFinite(raw) ? raw : 0;
    }
    return prices;
  }, [activeServices, property, serviceSpecs, serviceFrequencies]);

  const monthlySubtotal = useMemo(
    () => Object.values(servicePrices).reduce((sum, p) => sum + p, 0),
    [servicePrices]
  );

  const planInfo = PLAN_DISCOUNTS[planInterval];
  const discountAmount = monthlySubtotal * planInfo.discount;
  const monthlyTotal = monthlySubtotal - discountAmount;

  function getFrequencyLabel(serviceId: string): string {
    const customFreq = serviceFrequencies[serviceId];
    if (customFreq) {
      const options = SERVICE_FREQUENCY_OPTIONS[serviceId];
      const match = options?.find((o) => o.value === customFreq);
      if (match) return match.label;
    }
    const service = SERVICES.find((s) => s.id === serviceId);
    return service?.frequencyLabel ?? "";
  }

  if (activeServices.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <FadeIn>
          <Button variant="ghost" className="mb-4 gap-2" asChild>
            <Link href="/account">
              <ArrowLeft className="h-4 w-4" /> Back to Account
            </Link>
          </Button>

          <h1 className="text-2xl font-bold">My Services</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and view your active home services.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold">No services yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Build your plan to get started with home maintenance!
              </p>
              <Button className="mt-6" asChild>
                <Link href="/plan-builder">Build Your Plan</Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <FadeIn>
        <Button variant="ghost" className="mb-4 gap-2" asChild>
          <Link href="/account">
            <ArrowLeft className="h-4 w-4" /> Back to Account
          </Link>
        </Button>

        <h1 className="text-2xl font-bold">My Services</h1>
        <p className="mt-1 text-muted-foreground">
          Manage and view your active home services.
        </p>
      </FadeIn>

      {/* Active Plan Summary */}
      <FadeIn delay={0.1}>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-4 w-4" />
              Active Plan Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Plan Type</span>
              <Badge variant="secondary" className="capitalize">
                {planInfo.label}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Services</span>
              <span className="text-sm font-medium">
                {activeServices.length} active
              </span>
            </div>
            {planInfo.discount > 0 && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Percent className="h-3 w-3" />
                  Discount
                </span>
                <span className="text-sm font-medium text-green-600">
                  {planInfo.description} (-$
                  {(Number.isFinite(discountAmount) ? discountAmount : 0).toFixed(2)}/mo)
                </span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Monthly Total</span>
              <span className="text-lg font-bold">
                ${(Number.isFinite(monthlyTotal) ? monthlyTotal : 0).toFixed(2)}
                <span className="text-xs font-normal text-muted-foreground">
                  /mo
                </span>
              </span>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Service List */}
      <FadeIn delay={0.2}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Your Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {activeServices.map((service, index) => {
              const Icon = ICON_MAP[service.icon];
              const price = servicePrices[service.id] ?? 0;
              const freqLabel = getFrequencyLabel(service.id);

              return (
                <div key={service.id}>
                  {index > 0 && <Separator className="my-3" />}
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      {Icon ? (
                        <Icon className="h-4 w-4 text-primary" />
                      ) : (
                        <Package className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">
                        {service.name}
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-1 text-[10px] font-normal"
                      >
                        {freqLabel}
                      </Badge>
                    </div>
                    <span className="shrink-0 text-sm font-semibold">
                      ${(Number.isFinite(price) ? price : 0).toFixed(2)}
                      <span className="text-xs font-normal text-muted-foreground">
                        /mo
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Quick Actions */}
      <FadeIn delay={0.3}>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/plan-builder">
              <ClipboardList className="h-4 w-4" />
              Modify Plan
            </Link>
          </Button>
          <Button className="gap-2" asChild>
            <Link href="/account/book">
              <Calendar className="h-4 w-4" />
              Book Service
            </Link>
          </Button>
        </div>
      </FadeIn>
    </div>
  );
}
