"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  Lock,
  XCircle,
  HelpCircle,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  ScaleOnHover,
} from "@/components/ui/motion";
import { PLAN_TIERS, PLAN_DISCOUNTS, type PlanInterval } from "@/data/services";
import { CostComparison } from "@/components/marketing/cost-comparison";

const FAQ_ITEMS = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. When you upgrade, we prorate the difference so you only pay for what you use. Downgrades take effect at the start of your next billing cycle.",
  },
  {
    question: "What happens if I need a service outside my plan?",
    answer:
      "You can add individual services a la carte at any time, or upgrade to a plan that includes the service you need. One-off services are billed separately and do not affect your subscription price.",
  },
  {
    question: "Are there any hidden fees or contracts?",
    answer:
      "No hidden fees, ever. Monthly plans have zero contracts - cancel anytime with no penalties. Quarterly and annual plans are prorated if you cancel early, so you only pay for the time you have used.",
  },
  {
    question: "How does the Price Lock Guarantee work?",
    answer:
      "Once you subscribe, your rate is locked for 12 months regardless of any price changes. When your lock period ends, we will notify you 30 days in advance of any adjustments.",
  },
  {
    question: "What area do you serve?",
    answer:
      "We currently serve the Okanagan Valley in British Columbia, including Kelowna, West Kelowna, Lake Country, Peachland, and Penticton. We are expanding to new areas - sign up to be notified when we reach your neighbourhood.",
  },
  {
    question: "How are the contractors vetted?",
    answer:
      "Every contractor in our network is licensed, insured, and background-checked. We review qualifications, verify references, and conduct ongoing quality audits based on customer feedback.",
  },
];

export default function PricingPage() {
  const [interval, setInterval] = useState<PlanInterval>("monthly");

  const getPrice = (basePrice: number) => {
    const discount = PLAN_DISCOUNTS[interval].discount;
    return Math.round(basePrice * (1 - discount));
  };

  const getSavings = (basePrice: number) => {
    const monthlyTotal = basePrice * 12;
    const discount = PLAN_DISCOUNTS[interval].discount;
    const discountedAnnual = monthlyTotal * (1 - discount);
    return Math.round(monthlyTotal - discountedAnnual);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <FadeIn>
        <div className="mx-auto max-w-2xl text-center">
          <Badge
            variant="secondary"
            className="mb-4 border-primary/20 bg-primary/10 text-primary"
          >
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Pricing Packages
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base md:text-lg">
            Pre-built packages for every homeowner. Pick the level of care that
            fits your home and budget.
          </p>
        </div>
      </FadeIn>

      {/* Cost Comparison */}
      <div className="mt-12">
        <CostComparison compact />
      </div>

      {/* Interval Toggle */}
      <FadeIn delay={0.2}>
        <div className="mx-auto mt-6 flex max-w-sm justify-center sm:mt-8">
          <div className="inline-flex rounded-xl border bg-muted/50 p-1">
            {(
              Object.entries(PLAN_DISCOUNTS) as [
                PlanInterval,
                (typeof PLAN_DISCOUNTS)[PlanInterval],
              ][]
            ).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setInterval(key)}
                className={`relative rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-5 sm:py-2.5 sm:text-sm ${
                  interval === key
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {interval === key && (
                  <motion.div
                    layoutId="pricing-tab"
                    className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {val.label}
                  {val.discount > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold sm:text-[10px] ${
                        interval === key
                          ? "bg-white/20"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      -{val.discount * 100}%
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Plan Cards */}
      <StaggerContainer
        className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3"
        staggerDelay={0.12}
      >
        {PLAN_TIERS.map((plan) => (
          <StaggerItem key={plan.id}>
            <ScaleOnHover scale={1.02}>
              <Card
                className={`relative flex h-full flex-col overflow-hidden transition-shadow ${
                  plan.highlighted
                    ? "border-primary shadow-xl shadow-primary/15 ring-1 ring-primary/20"
                    : "border-border/50 hover:shadow-lg"
                }`}
              >
                {/* Most Popular badge */}
                {plan.highlighted && (
                  <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
                    <Badge className="gap-1 bg-primary text-primary-foreground shadow-md shadow-primary/20">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Priority Scheduling badge for Premium */}
                {plan.id === "premium" && (
                  <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
                    <Badge
                      variant="secondary"
                      className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    >
                      <Clock className="h-3 w-3" />
                      Priority Scheduling
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-xl sm:text-2xl">
                    {plan.name}
                  </CardTitle>
                  <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">From</span>
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

                  {/* Savings row */}
                  {interval !== "monthly" && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`savings-${plan.id}-${interval}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1"
                      >
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 sm:text-sm">
                          Save ${getSavings(plan.startingPrice)}/year
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  {/* Features list */}
                  <ul className="flex-1 space-y-2 sm:space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-xs sm:text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Best for */}
                  <div className="mt-4 rounded-lg bg-muted/50 px-3 py-2">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Best for:
                      </span>{" "}
                      {plan.bestFor}
                    </p>
                  </div>

                  {/* CTA */}
                  <Button
                    className="mt-5 w-full sm:mt-6"
                    variant={plan.highlighted ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <Link href="/onboarding">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </ScaleOnHover>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Not sure which plan? CTA */}
      <FadeIn delay={0.3}>
        <div className="mx-auto mt-8 max-w-2xl sm:mt-12">
          <Card className="border-dashed border-primary/30 bg-primary/[0.04]">
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:gap-4 sm:p-8">
              <HelpCircle className="h-8 w-8 text-primary/60" />
              <h3 className="text-lg font-bold sm:text-xl">
                Not sure which plan is right for you?
              </h3>
              <p className="text-sm text-muted-foreground">
                Answer a few questions about your home and we will recommend the
                perfect package - or build a fully custom plan just for you.
              </p>
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/onboarding">
                  Build Your Custom Plan{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Guarantees */}
      <FadeIn delay={0.4}>
        <div className="mx-auto mt-12 max-w-3xl sm:mt-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            Every Package Includes
          </h2>
          <StaggerContainer
            className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4"
          >
            {[
              {
                title: "Price Lock Guarantee",
                desc: "Your subscription rate is locked for 12 months. No surprises, no hidden fees.",
                icon: Lock,
              },
              {
                title: "Satisfaction Guarantee",
                desc: "Not satisfied? We send another contractor at no extra cost. Your happiness is non-negotiable.",
                icon: Shield,
              },
              {
                title: "Cancel Anytime",
                desc: "Monthly plans have zero contracts. Quarterly and annual plans are prorated if you cancel.",
                icon: XCircle,
              },
            ].map((g) => (
              <StaggerItem key={g.title}>
                <div className="flex flex-col items-center rounded-xl border bg-card p-4 text-center sm:p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <g.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-sm font-semibold">{g.title}</h4>
                  <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                    {g.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </FadeIn>

      {/* FAQ Section */}
      <FadeIn delay={0.5}>
        <div className="mx-auto mt-12 max-w-2xl sm:mt-16">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground sm:text-base">
            Everything you need to know about our pricing packages.
          </p>
          <div className="mt-6 sm:mt-8">
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-sm font-medium sm:text-base">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
