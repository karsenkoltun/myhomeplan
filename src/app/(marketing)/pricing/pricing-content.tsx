"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FAQ } from "@/components/ui/faq-tabs";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  Lock,
  XCircle,
  HelpCircle,
  Clock,
  Home,
  Users,
  DollarSign,
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
import DisplayCards from "@/components/ui/display-cards";
import { SectionHeader } from "@/components/marketing/section-header";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { PLAN_TIERS, PLAN_DISCOUNTS, type PlanInterval } from "@/data/services";

// Lazy-load heavy below-fold components
const Testimonials3D = dynamic(
  () => import("@/components/marketing/testimonials-3d").then((mod) => ({ default: mod.Testimonials3D })),
  { ssr: false }
);
const CostComparison = dynamic(
  () => import("@/components/marketing/cost-comparison").then((mod) => ({ default: mod.CostComparison })),
  { ssr: false }
);

const faqCategories = { general: "General" };
const faqDataItems = {
  general: [
    { question: "Can I switch plans later?", answer: "Yes, upgrade or downgrade anytime. Upgrades are prorated so you only pay for what you use. Downgrades take effect at your next billing cycle." },
    { question: "Are there any hidden fees or contracts?", answer: "No hidden fees, ever. Monthly plans have zero contracts. Quarterly and annual plans are prorated if you cancel early." },
    { question: "How does the Price Lock Guarantee work?", answer: "Once you subscribe, your rate is locked for 12 months regardless of price changes. We notify you 30 days before any adjustments." },
    { question: "How are the contractors vetted?", answer: "Every contractor is licensed, insured, and background-checked. We verify references and conduct ongoing quality audits." },
    { question: "What if I'm not satisfied with a service?", answer: "We stand behind our work. If you're not happy, we'll send the contractor back to redo it at no extra cost. If the issue persists, we'll assign a different contractor." },
    { question: "How is pricing calculated?", answer: "Pricing is based on your property size (home square footage and lot size), the services you select, and how frequently you need them. Use our Plan Builder to see exact pricing for your property." },
    { question: "Can I add or remove services during my plan?", answer: "Absolutely. You can customize your service lineup anytime. Added services are prorated for the current billing period, and removed services take effect at the next cycle." },
    { question: "Do you serve my area?", answer: "We currently serve 7 cities in the Okanagan Valley: Kelowna, West Kelowna, Vernon, Penticton, Lake Country, Summerland, and Peachland. We're expanding soon to more BC cities." },
    { question: "What payment methods do you accept?", answer: "We accept all major credit cards (Visa, Mastercard, American Express) and bank transfers. All payments are processed securely through Stripe." },
    { question: "Is there a minimum commitment?", answer: "Monthly plans have zero commitment - cancel anytime. Quarterly plans have a 3-month minimum and annual plans a 12-month minimum, but both come with significant savings." },
  ],
};

export default function PricingContent() {
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
                  className={`relative rounded-lg px-3 py-2.5 text-xs font-medium transition-all min-h-[44px] sm:px-5 sm:py-2.5 sm:text-sm ${
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
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold sm:text-xs ${
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
                      <p className="text-sm text-muted-foreground sm:text-xs">
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
      <section className="py-16 sm:py-20">
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

      {/* Trust Milestones - DisplayCards */}
      <section className="border-t bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
              <div className="flex-1">
                <DisplayCards
                  cards={[
                    {
                      className:
                        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                      icon: <Home className="size-4 text-emerald-300" />,
                      title: "200+ Homes Served",
                      description: "Across the Okanagan Valley",
                      date: "And growing",
                      iconClassName: "text-emerald-500",
                      titleClassName: "text-emerald-500",
                    },
                    {
                      className:
                        "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                      icon: <Users className="size-4 text-sky-300" />,
                      title: "50+ Contractors",
                      description: "Vetted, licensed, and insured",
                      date: "Okanagan-wide",
                      iconClassName: "text-sky-500",
                      titleClassName: "text-sky-500",
                    },
                    {
                      className:
                        "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
                      icon: <DollarSign className="size-4 text-amber-300" />,
                      title: "$0 Hidden Fees",
                      description: "Transparent pricing, always",
                      date: "Guaranteed",
                      iconClassName: "text-amber-500",
                      titleClassName: "text-amber-500",
                    },
                  ]}
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Trusted by Okanagan Homeowners
                </h2>
                <p className="mt-3 text-muted-foreground sm:text-lg">
                  Real savings, real contractors, and zero surprises. Our members save 20-40% compared to managing services on their own.
                </p>
              </div>
            </div>
          </FadeIn>
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
          <FAQ
            title=""
            subtitle=""
            categories={faqCategories}
            faqData={faqDataItems}
            className="w-full py-0"
          />
        </div>
      </section>
    </div>
  );
}
