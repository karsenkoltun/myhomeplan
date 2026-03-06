"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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
import { Separator } from "@/components/ui/separator";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { motion, AnimatePresence } from "framer-motion";
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
  ShoppingCart,
  X,
  ChevronUp,
  Check,
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
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
};

export default function PlanBuilderPage() {
  const [propertySqft, setPropertySqft] = useState(1500);
  const [lotSqft, setLotSqft] = useState(5000);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [planInterval, setPlanInterval] = useState<PlanInterval>("monthly");
  const [mobileReceiptOpen, setMobileReceiptOpen] = useState(false);

  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const receipt = useMemo(() => {
    const items = SERVICES.filter((s) => selectedServices.has(s.id)).map((service) => ({
      service,
      monthlyPrice: calculateMonthlyPrice(service, propertySqft, lotSqft),
    }));
    const subtotal = items.reduce((sum, item) => sum + item.monthlyPrice, 0);
    const discount = PLAN_DISCOUNTS[planInterval].discount;
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;
    const withoutPlan = subtotal * 1.25;
    const annualSavings = (withoutPlan - total) * 12;
    return { items, subtotal, discount, discountAmount, total, withoutPlan, annualSavings };
  }, [selectedServices, propertySqft, lotSqft, planInterval]);

  const categories = Object.keys(SERVICE_CATEGORIES) as ServiceCategory[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Header */}
      <FadeIn>
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary/10 text-primary">
            Interactive Plan Builder
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Build Your Custom Home Plan
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base md:text-lg">
            Enter your property details, select your services, and see your
            monthly price build in real-time.
          </p>
        </div>
      </FadeIn>

      <div className="mt-8 grid gap-6 sm:mt-12 sm:gap-8 lg:grid-cols-3">
        {/* Left Column - Property & Services */}
        <div className="space-y-6 sm:space-y-8 lg:col-span-2">
          {/* Property Details */}
          <FadeIn>
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="property-size" className="text-sm">Home Size (sq ft)</Label>
                  <Input
                    id="property-size"
                    type="number"
                    value={propertySqft}
                    onChange={(e) => setPropertySqft(Number(e.target.value))}
                    min={0}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">Affects indoor service pricing</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lot-size" className="text-sm">Lot Size (sq ft)</Label>
                  <Input
                    id="lot-size"
                    type="number"
                    value={lotSqft}
                    onChange={(e) => setLotSqft(Number(e.target.value))}
                    min={0}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">Affects outdoor service pricing</p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Services Selection */}
          {categories.map((category, catIdx) => {
            const categoryServices = SERVICES.filter((s) => s.category === category);
            const info = SERVICE_CATEGORIES[category];
            const selectedInCategory = categoryServices.filter((s) => selectedServices.has(s.id)).length;

            return (
              <FadeIn key={category} delay={catIdx * 0.1}>
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base sm:text-lg">{info.label}</CardTitle>
                        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{info.description}</p>
                      </div>
                      {selectedInCategory > 0 && (
                        <Badge className="bg-primary/10 text-primary">
                          {selectedInCategory} selected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                      {categoryServices.map((service) => {
                        const Icon = ICON_MAP[service.icon] || CheckCircle2;
                        const isSelected = selectedServices.has(service.id);
                        const monthlyPrice = calculateMonthlyPrice(service, propertySqft, lotSqft);

                        return (
                          <motion.div
                            key={service.id}
                            layout
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleService(service.id)}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors sm:p-4 ${
                              isSelected
                                ? "border-primary bg-primary/[0.04] shadow-sm"
                                : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
                            }`}
                          >
                            <motion.div
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                                isSelected
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/30"
                              }`}
                              animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 0.2 }}
                            >
                              {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                            </motion.div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <Icon className="h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
                                <span className="text-xs font-semibold sm:text-sm truncate">{service.name}</span>
                                {service.popular && (
                                  <Badge variant="secondary" className="bg-amber-100 px-1 py-0 text-[9px] text-amber-700 sm:px-1.5 sm:text-[10px]">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="hidden text-xs text-muted-foreground sm:line-clamp-1">{service.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground sm:text-xs">{service.frequencyLabel}</span>
                                <span className="text-xs font-semibold text-primary sm:text-sm">${monthlyPrice.toFixed(0)}/mo</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>

        {/* Right Column - Desktop Live Receipt */}
        <div className="hidden lg:col-span-1 lg:block">
          <div className="sticky top-20">
            <ReceiptPanel
              receipt={receipt}
              planInterval={planInterval}
              setPlanInterval={setPlanInterval}
              selectedCount={selectedServices.size}
            />
          </div>
        </div>
      </div>

      {/* Mobile Floating Receipt Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <AnimatePresence>
          {mobileReceiptOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="rounded-t-2xl border-t bg-background shadow-2xl"
            >
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="font-bold">Your Plan Summary</h3>
                <Button variant="ghost" size="icon" onClick={() => setMobileReceiptOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-4">
                <ReceiptPanel
                  receipt={receipt}
                  planInterval={planInterval}
                  setPlanInterval={setPlanInterval}
                  selectedCount={selectedServices.size}
                  isMobile
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!mobileReceiptOpen && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="border-t bg-background/95 px-4 py-3 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setMobileReceiptOpen(true)}
                className="flex flex-1 items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">
                    {selectedServices.size} service{selectedServices.size !== 1 ? "s" : ""}
                  </p>
                  <p className="text-lg font-bold">
                    <motion.span
                      key={receipt.total}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      ${receipt.total.toFixed(0)}
                    </motion.span>
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              </button>
              <Button
                size="lg"
                disabled={selectedServices.size === 0}
                className="shrink-0"
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom padding for mobile bar */}
      <div className="h-24 lg:hidden" />
    </div>
  );
}

function ReceiptPanel({
  receipt,
  planInterval,
  setPlanInterval,
  selectedCount,
  isMobile = false,
}: {
  receipt: {
    items: { service: { id: string; name: string; icon: string }; monthlyPrice: number }[];
    subtotal: number;
    discount: number;
    discountAmount: number;
    total: number;
    withoutPlan: number;
    annualSavings: number;
  };
  planInterval: PlanInterval;
  setPlanInterval: (v: PlanInterval) => void;
  selectedCount: number;
  isMobile?: boolean;
}) {
  const Wrapper = isMobile ? "div" : Card;

  const content = (
    <>
      {!isMobile && (
        <div className="bg-gradient-to-r from-primary to-blue-700 p-5 text-primary-foreground">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            <h3 className="font-bold">Your Plan Summary</h3>
          </div>
          <p className="mt-1 text-sm opacity-80">
            {selectedCount} service{selectedCount !== 1 ? "s" : ""} selected
          </p>
        </div>
      )}

      <div className={isMobile ? "" : "p-5"}>
        {/* Payment interval */}
        <div className="mb-4">
          <Label className="text-xs text-muted-foreground">Payment Frequency</Label>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {(Object.entries(PLAN_DISCOUNTS) as [PlanInterval, typeof PLAN_DISCOUNTS[PlanInterval]][]).map(
              ([key, val]) => (
                <button
                  key={key}
                  onClick={() => setPlanInterval(key)}
                  className={`rounded-lg border px-2 py-2 text-center text-xs font-medium transition-all ${
                    planInterval === key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  {val.label}
                  {val.discount > 0 && (
                    <span className="block text-[10px] text-primary">{val.description}</span>
                  )}
                </button>
              )
            )}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Line items */}
        {receipt.items.length === 0 ? (
          <div className="py-8 text-center">
            <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">Select services to build your plan</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {receipt.items.map(({ service, monthlyPrice }) => {
                const Icon = ICON_MAP[service.icon] || CheckCircle2;
                return (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between overflow-hidden"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{service.name}</span>
                    </div>
                    <motion.span
                      key={monthlyPrice}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium"
                    >
                      ${monthlyPrice.toFixed(0)}
                    </motion.span>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <Separator className="my-3" />

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <motion.span key={receipt.subtotal} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                ${receipt.subtotal.toFixed(0)}/mo
              </motion.span>
            </div>

            {receipt.discount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center justify-between text-sm text-primary"
              >
                <span>{PLAN_DISCOUNTS[planInterval].label} discount</span>
                <span>-${receipt.discountAmount.toFixed(0)}/mo</span>
              </motion.div>
            )}

            <Separator className="my-3" />

            <div className="flex items-center justify-between">
              <span className="text-base font-bold sm:text-lg">Monthly Total</span>
              <motion.span
                key={receipt.total}
                initial={{ scale: 1.1, color: "hsl(var(--primary))" }}
                animate={{ scale: 1 }}
                className="text-xl font-bold text-primary sm:text-2xl"
              >
                ${receipt.total.toFixed(0)}
                <span className="text-xs font-normal text-muted-foreground sm:text-sm">/mo</span>
              </motion.span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-3 rounded-lg bg-primary/[0.06] p-3"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <TrendingDown className="h-4 w-4" />
                <span>You save ~${receipt.annualSavings.toFixed(0)}/year</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Compared to hiring contractors individually
              </p>
            </motion.div>
          </div>
        )}

        {!isMobile && (
          <>
            <Button className="mt-6 w-full" size="lg" disabled={selectedCount === 0}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              No commitment - cancel anytime on monthly plans
            </p>
          </>
        )}
      </div>
    </>
  );

  if (isMobile) return <div>{content}</div>;

  return (
    <Card className="overflow-hidden border-primary/20 shadow-lg">
      {content}
    </Card>
  );
}
