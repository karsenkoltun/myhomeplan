"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { PLAN_TIERS, PLAN_DISCOUNTS, type PlanInterval } from "@/data/services";

export default function PricingPage() {
  const [interval, setInterval] = useState<PlanInterval>("monthly");

  const getPrice = (basePrice: number) => {
    const discount = PLAN_DISCOUNTS[interval].discount;
    return Math.round(basePrice * (1 - discount));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <Badge
          variant="secondary"
          className="mb-4 border-primary/20 bg-primary/10 text-primary"
        >
          Simple, Transparent Pricing
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Choose Your Plan
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Pre-built plans for every homeowner, or build your own custom plan.
        </p>
      </div>

      {/* Interval Toggle */}
      <div className="mt-8 flex justify-center">
        <Tabs
          value={interval}
          onValueChange={(v) => setInterval(v as PlanInterval)}
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">
              Quarterly
              <Badge className="ml-1.5 bg-primary/20 px-1.5 py-0 text-[10px] text-primary">
                -5%
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="annual">
              Annual
              <Badge className="ml-1.5 bg-primary/20 px-1.5 py-0 text-[10px] text-primary">
                -15%
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Plan Cards */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {PLAN_TIERS.map((plan) => (
          <Card
            key={plan.id}
            className={`relative overflow-hidden transition-shadow hover:shadow-lg ${
              plan.highlighted
                ? "border-primary shadow-lg shadow-primary/10"
                : "border-border/50"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute right-4 top-4">
                <Badge className="gap-1 bg-primary text-primary-foreground">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="pb-4">
              <p className="text-sm font-medium text-muted-foreground">
                {plan.tagline}
              </p>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">
                  ${getPrice(plan.startingPrice)}
                </span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              {interval !== "monthly" && (
                <p className="text-sm text-primary">
                  {PLAN_DISCOUNTS[interval].description} vs monthly
                </p>
              )}
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={plan.highlighted ? "default" : "outline"}
                asChild
              >
                <Link href="/plan-builder">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Plan CTA */}
      <div className="mx-auto mt-12 max-w-2xl">
        <Card className="border-dashed border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <h3 className="text-xl font-bold">Need Something Custom?</h3>
            <p className="text-muted-foreground">
              Use our interactive plan builder to pick exactly the services you
              need and see your price in real-time.
            </p>
            <Button size="lg" asChild>
              <Link href="/plan-builder">
                Build Your Custom Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Guarantees */}
      <div className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-center text-2xl font-bold">
          Every Plan Includes
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Scheduling Guarantee",
              desc: "Service happens in your scheduled window, or the next one is free.",
            },
            {
              title: "Quality Guarantee",
              desc: "Not satisfied? We send another contractor at no extra cost.",
            },
            {
              title: "Price Lock",
              desc: "Your subscription rate is locked for 12 months. No surprises.",
            },
            {
              title: "Cancel Anytime",
              desc: "Monthly plans have no contracts. Quarterly and annual are prorated.",
            },
          ].map((g) => (
            <div key={g.title} className="rounded-xl border bg-card p-4">
              <h4 className="font-semibold">{g.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
