"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
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
  ArrowRight,
  Receipt,
  TrendingDown,
  type LucideIcon,
  Armchair,
} from "lucide-react";
import {
  SERVICES,
  SERVICE_CATEGORIES,
  PLAN_DISCOUNTS,
  calculateMonthlyPrice,
  type PlanInterval,
  type ServiceCategory,
} from "@/data/services";

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

export default function PlanBuilderPage() {
  const [propertySqft, setPropertySqft] = useState(1500);
  const [lotSqft, setLotSqft] = useState(5000);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set()
  );
  const [planInterval, setPlanInterval] = useState<PlanInterval>("monthly");

  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const receipt = useMemo(() => {
    const items = SERVICES.filter((s) => selectedServices.has(s.id)).map(
      (service) => ({
        service,
        monthlyPrice: calculateMonthlyPrice(service, propertySqft, lotSqft),
      })
    );

    const subtotal = items.reduce((sum, item) => sum + item.monthlyPrice, 0);
    const discount = PLAN_DISCOUNTS[planInterval].discount;
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;

    // Estimated cost without bundling (30% more)
    const withoutPlan = subtotal * 1.25;
    const annualSavings = (withoutPlan - total) * 12;

    return { items, subtotal, discount, discountAmount, total, withoutPlan, annualSavings };
  }, [selectedServices, propertySqft, lotSqft, planInterval]);

  const categories = Object.keys(SERVICE_CATEGORIES) as ServiceCategory[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <Badge
          variant="secondary"
          className="mb-4 border-primary/20 bg-primary/10 text-primary"
        >
          Interactive Plan Builder
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Build Your Custom Home Plan
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Enter your property details, select your services, and see your
          monthly price build in real-time.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {/* Left Column - Property & Services */}
        <div className="space-y-8 lg:col-span-2">
          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="property-size">Home Size (sq ft)</Label>
                <Input
                  id="property-size"
                  type="number"
                  value={propertySqft}
                  onChange={(e) => setPropertySqft(Number(e.target.value))}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">
                  Affects indoor service pricing
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lot-size">Lot Size (sq ft)</Label>
                <Input
                  id="lot-size"
                  type="number"
                  value={lotSqft}
                  onChange={(e) => setLotSqft(Number(e.target.value))}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">
                  Affects outdoor service pricing
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Services Selection */}
          {categories.map((category) => {
            const categoryServices = SERVICES.filter(
              (s) => s.category === category
            );
            const info = SERVICE_CATEGORIES[category];

            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">{info.label}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {info.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {categoryServices.map((service) => {
                      const Icon = ICON_MAP[service.icon] || CheckCircle2;
                      const isSelected = selectedServices.has(service.id);
                      const monthlyPrice = calculateMonthlyPrice(
                        service,
                        propertySqft,
                        lotSqft
                      );

                      return (
                        <div
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            className="mt-0.5"
                            onCheckedChange={() => toggleService(service.id)}
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-primary" />
                              <span className="text-sm font-semibold">
                                {service.name}
                              </span>
                              {service.popular && (
                                <Badge
                                  variant="secondary"
                                  className="bg-amber-100 px-1.5 py-0 text-[10px] text-amber-700"
                                >
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {service.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {service.frequencyLabel}
                              </span>
                              <span className="text-sm font-semibold text-primary">
                                ${monthlyPrice.toFixed(0)}/mo
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Right Column - Live Receipt */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card className="overflow-hidden border-primary/20 shadow-lg">
              <div className="bg-gradient-to-r from-primary to-emerald-600 p-5 text-primary-foreground">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  <h3 className="font-bold">Your Plan Summary</h3>
                </div>
                <p className="mt-1 text-sm opacity-80">
                  {selectedServices.size} service
                  {selectedServices.size !== 1 ? "s" : ""} selected
                </p>
              </div>

              <CardContent className="p-5">
                {/* Payment interval toggle */}
                <div className="mb-4">
                  <Label className="text-xs text-muted-foreground">
                    Payment Frequency
                  </Label>
                  <Select
                    value={planInterval}
                    onValueChange={(v) => setPlanInterval(v as PlanInterval)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PLAN_DISCOUNTS).map(([key, val]) => (
                        <SelectItem key={key} value={key}>
                          {val.label}{" "}
                          {val.discount > 0 && `(${val.description})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                {/* Line items */}
                {receipt.items.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Select services to build your plan
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {receipt.items.map(({ service, monthlyPrice }) => {
                      const Icon = ICON_MAP[service.icon] || CheckCircle2;
                      return (
                        <div
                          key={service.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{service.name}</span>
                          </div>
                          <span className="text-sm font-medium">
                            ${monthlyPrice.toFixed(0)}
                          </span>
                        </div>
                      );
                    })}

                    <Separator className="my-3" />

                    {/* Subtotal */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${receipt.subtotal.toFixed(0)}/mo</span>
                    </div>

                    {/* Discount */}
                    {receipt.discount > 0 && (
                      <div className="flex items-center justify-between text-sm text-primary">
                        <span>
                          {PLAN_DISCOUNTS[planInterval].label} discount
                        </span>
                        <span>-${receipt.discountAmount.toFixed(0)}/mo</span>
                      </div>
                    )}

                    <Separator className="my-3" />

                    {/* Total */}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">Monthly Total</span>
                      <span className="text-2xl font-bold text-primary">
                        ${receipt.total.toFixed(0)}
                        <span className="text-sm font-normal text-muted-foreground">
                          /mo
                        </span>
                      </span>
                    </div>

                    {/* Savings */}
                    <div className="mt-3 rounded-lg bg-primary/5 p-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <TrendingDown className="h-4 w-4" />
                        <span>
                          You save ~${receipt.annualSavings.toFixed(0)}/year
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Compared to hiring contractors individually
                      </p>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Button
                  className="mt-6 w-full"
                  size="lg"
                  disabled={selectedServices.size === 0}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  No commitment - cancel anytime on monthly plans
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
