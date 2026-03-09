"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, ShimmerButton, AnimatedCounter } from "@/components/ui/motion";
import { FAQ } from "@/components/ui/faq-tabs";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { PLAN_TIERS, PLAN_DISCOUNTS, type PlanInterval } from "@/data/services";
import { ArrowRight, Check, Shield, Lock, XCircle, Sparkles, Clock, HelpCircle } from "lucide-react";

import { TestimonialsMarquee } from "@/components/marketing/testimonials-marquee";

/* ─── Plan card accent colors ─── */
const PLAN_COLORS: Record<string, { border: string; badge: string; glow: string }> = {
  minimum: {
    border: "border-t-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-600",
    glow: "group-hover:shadow-emerald-500/10",
  },
  fundamentals: {
    border: "border-t-primary",
    badge: "bg-primary/10 text-primary",
    glow: "group-hover:shadow-primary/10",
  },
  premium: {
    border: "border-t-amber-500",
    badge: "bg-amber-500/10 text-amber-600",
    glow: "group-hover:shadow-amber-500/10",
  },
};

/* ─── FAQ data ─── */
const faqCategories = { general: "General" };
const faqData = {
  general: [
    {
      question: "Can I switch plans later?",
      answer:
        "Yes, upgrade or downgrade anytime. Upgrades are prorated so you only pay for what you use. Downgrades take effect at your next billing cycle.",
    },
    {
      question: "Are there any hidden fees or contracts?",
      answer:
        "No hidden fees, ever. Monthly plans have zero contracts. Quarterly and annual plans are prorated if you cancel early.",
    },
    {
      question: "How does the Price Lock Guarantee work?",
      answer:
        "Once you subscribe, your rate is locked for 12 months regardless of price changes. We notify you 30 days before any adjustments.",
    },
    {
      question: "How are the contractors vetted?",
      answer:
        "Every contractor is licensed, insured, and background-checked. We verify references and conduct ongoing quality audits.",
    },
    {
      question: "What if I'm not satisfied with a service?",
      answer:
        "We stand behind our work. If you're not happy, we'll send the contractor back to redo it at no extra cost. If the issue persists, we'll assign a different contractor.",
    },
    {
      question: "How is pricing calculated?",
      answer:
        "Pricing is based on your property size (home square footage and lot size), the services you select, and how frequently you need them. Use our Plan Builder to see exact pricing for your property.",
    },
    {
      question: "Can I add or remove services during my plan?",
      answer:
        "Absolutely. You can customize your service lineup anytime. Added services are prorated for the current billing period, and removed services take effect at the next cycle.",
    },
    {
      question: "Do you serve my area?",
      answer:
        "We currently serve 7 cities in the Okanagan Valley: Kelowna, West Kelowna, Vernon, Penticton, Lake Country, Summerland, and Peachland. We're expanding soon to more BC cities.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express) and bank transfers. All payments are processed securely through Stripe.",
    },
    {
      question: "Is there a minimum commitment?",
      answer:
        "Monthly plans have zero commitment - cancel anytime. Quarterly plans have a 3-month minimum and annual plans a 12-month minimum, but both come with significant savings.",
    },
  ],
};

/* ─── Guarantees ─── */
const GUARANTEES = [
  {
    icon: Lock,
    title: "Price Lock",
    desc: "Rate locked for 12 months.",
  },
  {
    icon: Shield,
    title: "Satisfaction Guarantee",
    desc: "Not happy? We redo it free.",
  },
  {
    icon: XCircle,
    title: "Cancel Anytime",
    desc: "Monthly plans, zero contracts.",
  },
];

/* ─── Animated card wrapper ─── */
function PlanCard({
  plan,
  interval,
  getPrice,
  getSavings,
  index,
}: {
  plan: (typeof PLAN_TIERS)[number];
  interval: PlanInterval;
  getPrice: (base: number) => number;
  getSavings: (base: number) => number;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const colors = PLAN_COLORS[plan.id] ?? PLAN_COLORS.minimum;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div
        className={`relative flex h-full flex-col rounded-2xl border border-border/50 border-t-2 ${colors.border} bg-background p-8 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 ${colors.glow} ${
          plan.highlighted ? "ring-1 ring-primary/20" : ""
        }`}
      >
        {/* Badge */}
        {plan.highlighted && (
          <div className="absolute -top-3 left-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
              <Sparkles className="h-3 w-3" />
              Most Popular
            </span>
          </div>
        )}
        {plan.id === "premium" && (
          <div className="absolute -top-3 left-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              <Clock className="h-3 w-3" />
              Priority
            </span>
          </div>
        )}

        {/* Plan name + tagline */}
        <div className="mt-2">
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
        </div>

        {/* Pricing */}
        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-sm text-muted-foreground">From</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={`${plan.id}-${interval}`}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="text-4xl font-bold tracking-tight"
            >
              ${getPrice(plan.startingPrice)}
            </motion.span>
          </AnimatePresence>
          <span className="text-sm text-muted-foreground">/mo</span>
        </div>

        {/* Savings badge */}
        <div className="h-7 mt-2">
          {interval !== "monthly" && (
            <AnimatePresence mode="wait">
              <motion.span
                key={`savings-${plan.id}-${interval}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600"
              >
                Save ${getSavings(plan.startingPrice)}/yr
              </motion.span>
            </AnimatePresence>
          )}
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-border/50" />

        {/* Features */}
        <ul className="flex-1 space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Best for */}
        <p className="mt-6 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Best for:</span>{" "}
          {plan.bestFor}
        </p>

        {/* CTA */}
        <div className="mt-6">
          {plan.highlighted ? (
            <Link href="/onboarding">
              <ShimmerButton className="w-full py-3 text-sm font-medium">
                Get Started
                <ArrowRight className="ml-2 inline h-4 w-4" />
              </ShimmerButton>
            </Link>
          ) : (
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              asChild
            >
              <Link href="/onboarding">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Guarantee card ─── */
function GuaranteeCard({
  item,
  index,
}: {
  item: (typeof GUARANTEES)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="rounded-2xl border border-border/50 bg-background p-8 text-center transition-all duration-300 hover:shadow-lg hover:shadow-black/5"
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h4 className="text-sm font-semibold">{item.title}</h4>
      <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
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
      {/* ── Hero ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Simple, Transparent Pricing
              </p>
              <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Plans that fit every home
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Pick the level of care that matches your home and budget.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Interval Toggle ── */}
      <section className="pb-4">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn delay={0.15}>
            <div className="flex justify-center">
              <div className="relative inline-flex rounded-xl border border-border/50 bg-muted/40 p-1">
                {(
                  Object.entries(PLAN_DISCOUNTS) as [
                    PlanInterval,
                    (typeof PLAN_DISCOUNTS)[PlanInterval],
                  ][]
                ).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setInterval(key)}
                    className={`relative rounded-lg px-4 py-2.5 text-sm font-medium transition-all sm:px-6 ${
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
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
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
        </div>
      </section>

      {/* ── Plan Cards ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
            {PLAN_TIERS.map((plan, i) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                interval={interval}
                getPrice={getPrice}
                getSavings={getSavings}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Not Sure? ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <HelpCircle className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
                Not sure which plan?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Answer a few questions and we&apos;ll recommend the perfect
                package for your home.
              </p>
              <div className="mt-8">
                <Link href="/onboarding">
                  <ShimmerButton className="px-8 py-3 text-sm font-medium">
                    Build Your Custom Plan
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Guarantees ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Every Plan Includes
              </p>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Backed by real guarantees
              </h2>
            </div>
          </FadeIn>

          <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3 lg:gap-8">
            {GUARANTEES.map((item, i) => (
              <GuaranteeCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Trusted
              </p>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                What our members say
              </h2>
            </div>
          </FadeIn>
          <div className="mt-16">
            <TestimonialsMarquee audience="homeowner" />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl">
            <FAQ
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about our plans."
              categories={faqCategories}
              faqData={faqData}
              className="w-full py-0"
            />
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to simplify home care?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join hundreds of Okanagan homeowners who never worry about
                maintenance again.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/onboarding">
                  <ShimmerButton className="px-8 py-3 text-sm font-medium">
                    Get Started
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/plan-builder">
                    Build a Custom Plan
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
