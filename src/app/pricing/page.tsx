"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/ui/motion";
import { PLAN_TIERS, PLAN_DISCOUNTS, type PlanInterval } from "@/data/services";

export default function PricingPage() {
  const [interval, setInterval] = useState<PlanInterval>("monthly");

  const getPrice = (basePrice: number) => {
    const discount = PLAN_DISCOUNTS[interval].discount;
    return Math.round(basePrice * (1 - discount));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <FadeIn>
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary/10 text-primary">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Choose Your Plan</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base md:text-lg">
            Pre-built plans for every homeowner, or build your own custom plan.
          </p>
        </div>
      </FadeIn>

      {/* Interval Toggle */}
      <FadeIn delay={0.2}>
        <div className="mx-auto mt-6 flex max-w-sm justify-center sm:mt-8">
          <div className="inline-flex rounded-xl border bg-muted/50 p-1">
            {(Object.entries(PLAN_DISCOUNTS) as [PlanInterval, typeof PLAN_DISCOUNTS[PlanInterval]][]).map(
              ([key, val]) => (
                <button
                  key={key}
                  onClick={() => setInterval(key)}
                  className={`relative rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-5 sm:py-2.5 sm:text-sm ${
                    interval === key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {interval === key && (
                    <motion.div
                      layoutId="pricing-tab"
                      className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {val.label}
                    {val.discount > 0 && (
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold sm:text-[10px] ${
                        interval === key ? "bg-white/20" : "bg-primary/10 text-primary"
                      }`}>
                        -{val.discount * 100}%
                      </span>
                    )}
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      </FadeIn>

      {/* Plan Cards */}
      <StaggerContainer className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3" staggerDelay={0.12}>
        {PLAN_TIERS.map((plan) => (
          <StaggerItem key={plan.id}>
            <ScaleOnHover scale={1.02}>
              <Card
                className={`relative h-full overflow-hidden transition-shadow ${
                  plan.highlighted
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-border/50 hover:shadow-lg"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
                    <Badge className="gap-1 bg-primary text-primary-foreground">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-3 sm:pb-4">
                  <p className="text-xs font-medium text-muted-foreground sm:text-sm">{plan.tagline}</p>
                  <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
                  <div className="mt-2 flex items-baseline gap-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${plan.id}-${interval}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="text-3xl font-bold sm:text-4xl"
                      >
                        ${getPrice(plan.startingPrice)}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  {interval !== "monthly" && (
                    <p className="text-xs text-primary sm:text-sm">
                      {PLAN_DISCOUNTS[interval].description} vs monthly
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-xs sm:text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-5 w-full sm:mt-6"
                    variant={plan.highlighted ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/plan-builder">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </ScaleOnHover>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Custom Plan CTA */}
      <FadeIn delay={0.3}>
        <div className="mx-auto mt-8 max-w-2xl sm:mt-12">
          <Card className="border-dashed border-primary/30 bg-primary/[0.04]">
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:gap-4 sm:p-8">
              <h3 className="text-lg font-bold sm:text-xl">Need Something Custom?</h3>
              <p className="text-sm text-muted-foreground">
                Use our interactive plan builder to pick exactly the services you need and see your price in real-time.
              </p>
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/plan-builder">
                  Build Your Custom Plan <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Guarantees */}
      <FadeIn delay={0.4}>
        <div className="mx-auto mt-12 max-w-3xl sm:mt-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">Every Plan Includes</h2>
          <StaggerContainer className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
            {[
              { title: "Scheduling Guarantee", desc: "Service happens in your scheduled window, or the next one is free." },
              { title: "Quality Guarantee", desc: "Not satisfied? We send another contractor at no extra cost." },
              { title: "Price Lock", desc: "Your subscription rate is locked for 12 months. No surprises." },
              { title: "Cancel Anytime", desc: "Monthly plans have no contracts. Quarterly and annual are prorated." },
            ].map((g) => (
              <StaggerItem key={g.title}>
                <div className="rounded-xl border bg-card p-3.5 sm:p-4">
                  <h4 className="text-sm font-semibold">{g.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{g.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </FadeIn>
    </div>
  );
}
