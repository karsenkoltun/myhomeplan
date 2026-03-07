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
  GlowCard,
  ShimmerButton,
} from "@/components/ui/motion";
import { SectionHeader } from "@/components/marketing/section-header";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { Testimonials3D } from "@/components/marketing/testimonials-3d";
import { PLAN_TIERS, PLAN_DISCOUNTS, type PlanInterval } from "@/data/services";
import { CostComparison } from "@/components/marketing/cost-comparison";

const FAQ_ITEMS = [
  { question: "Can I switch plans later?", answer: "Yes, upgrade or downgrade anytime. Upgrades are prorated so you only pay for what you use. Downgrades take effect at your next billing cycle." },
  { question: "What happens if I need a service outside my plan?", answer: "Add individual services a la carte anytime, or upgrade to a plan that includes it. One-off services are billed separately." },
  { question: "Are there any hidden fees or contracts?", answer: "No hidden fees, ever. Monthly plans have zero contracts. Quarterly and annual plans are prorated if you cancel early." },
  { question: "How does the Price Lock Guarantee work?", answer: "Once you subscribe, your rate is locked for 12 months regardless of price changes. We notify you 30 days before any adjustments." },
  { question: "What area do you serve?", answer: "The Okanagan Valley including Kelowna, West Kelowna, Lake Country, Peachland, Penticton, and Vernon. Expanding soon." },
  { question: "How are the contractors vetted?", answer: "Every contractor is licensed, insured, and background-checked. We verify references and conduct ongoing quality audits." },
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
    return Math.round(monthlyTotal - monthlyTotal * (1 - discount));
  };

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <SectionHeader
          badge="Simple, Transparent Pricing"
          badgeColor="primary"
          title="Plans That Fit Every Home"
          subtitle="Pre-built packages for every homeowner. Pick the level of care that fits your home and budget."
        />
      </section>

      {/* Cost Comparison */}
      <div className="mt-8">
        <CostComparison compact />
      </div>

      {/* Interval Toggle + Plan Cards */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <FadeIn delay={0.2}>
          <div className="mx-auto mt-6 flex max-w-sm justify-center sm:mt-8">
            <div className="inline-flex rounded-xl border bg-muted/50 p-1">
              {(
                Object.entries(PLAN_DISCOUNTS) as [PlanInterval, (typeof PLAN_DISCOUNTS)[PlanInterval]][]
              ).map(([key, val]) => (
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
              ))}
            </div>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3" staggerDelay={0.12}>
          {PLAN_TIERS.map((plan) => (
            <StaggerItem key={plan.id}>
              <ScaleOnHover scale={1.02}>
                <Card className={`relative flex h-full flex-col overflow-hidden transition-shadow ${
                  plan.highlighted
                    ? "border-primary shadow-xl shadow-primary/15 ring-1 ring-primary/20"
                    : "border-border/50 hover:shadow-lg"
                }`}>
                  {plan.highlighted && (
                    <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
                      <Badge className="gap-1 bg-primary text-primary-foreground shadow-md shadow-primary/20">
                        <Sparkles className="h-3 w-3" /> Most Popular
                      </Badge>
                    </div>
                  )}
                  {plan.id === "premium" && (
                    <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
                      <Badge variant="secondary" className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-600">
                        <Clock className="h-3 w-3" /> Priority Scheduling
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
                    <p className="text-xs font-medium text-muted-foreground sm:text-sm">{plan.tagline}</p>
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
                    {interval !== "monthly" && (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`savings-${plan.id}-${interval}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-1"
                        >
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 sm:text-sm">
                            Save ${getSavings(plan.startingPrice)}/year
                          </span>
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <ul className="flex-1 space-y-2 sm:space-y-2.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="text-xs sm:text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 rounded-lg bg-muted/50 px-3 py-2">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">Best for:</span> {plan.bestFor}
                      </p>
                    </div>
                    <Button className="mt-5 w-full sm:mt-6" variant={plan.highlighted ? "default" : "outline"} size="lg" asChild>
                      <Link href="/onboarding">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Not sure CTA */}
        <FadeIn delay={0.3}>
          <div className="mx-auto mt-8 max-w-2xl sm:mt-12">
            <Card className="border-dashed border-primary/30 bg-primary/[0.04]">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:gap-4 sm:p-8">
                <HelpCircle className="h-8 w-8 text-primary/60" />
                <h3 className="text-lg font-bold sm:text-xl">Not sure which plan?</h3>
                <p className="text-sm text-muted-foreground">
                  Answer a few questions and we&apos;ll recommend the perfect package.
                </p>
                <Link href="/onboarding">
                  <ShimmerButton className="px-6 py-2.5 text-sm">
                    Build Your Custom Plan <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
              </CardContent>
            </Card>
          </div>
        </FadeIn>
      </section>

      {/* Social Proof */}
      <SocialProofBar />

      {/* Guarantees */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Every Plan Includes"
            badgeColor="emerald"
            title="Backed by Real Guarantees"
          />
          <StaggerContainer className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
            {[
              { title: "Price Lock", desc: "Rate locked for 12 months. No surprises.", icon: Lock },
              { title: "Satisfaction Guarantee", desc: "Not satisfied? We'll redo it free.", icon: Shield },
              { title: "Cancel Anytime", desc: "Monthly plans have zero contracts.", icon: XCircle },
            ].map((g) => (
              <StaggerItem key={g.title}>
                <GlowCard glowColor="emerald" className="text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <g.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-sm font-semibold">{g.title}</h4>
                  <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">{g.desc}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Trusted"
            badgeColor="amber"
            title="What Our Members Say"
          />
          <div className="mt-10 sm:mt-14">
            <Testimonials3D audience="homeowner" maxItems={3} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Frequently Asked Questions" subtitle="Everything you need to know about our pricing." />
          <div className="mt-6 sm:mt-8">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="rounded-xl border bg-card px-4">
                  <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
