"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, ShimmerButton, AnimatedCounter } from "@/components/ui/motion";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { TestimonialsMarquee } from "@/components/marketing/testimonials-marquee";
import { Feature } from "@/components/ui/feature-section-with-grid";
import { Gallery4 } from "@/components/ui/gallery4";
import type { Gallery4Item } from "@/components/ui/gallery4";

import {
  ArrowRight,
  Building2,
  Sparkles,
  Scissors,
  Snowflake,
  Droplets,
  Bug,
  Thermometer,
  Shield,
  DollarSign,
  Clock,
  Car,
  X,
  Check,
  CalendarCheck,
  Wrench,
  ClipboardList,
  Users,
} from "lucide-react";

/* --- DATA ----------------------------------------------------------- */

const stats = [
  { value: 200, suffix: "+", label: "Buildings managed" },
  { value: 35, suffix: "%", label: "Avg. cost savings" },
  { value: 10, suffix: "+", label: "Services covered" },
  { value: 1, suffix: "", label: "Invoice per month" },
];

const painPoints = [
  "8+ vendor contracts to manage",
  "Surprise maintenance costs",
  "Endless council debates over quotes",
  "Compliance tracking chaos",
];

const solutionPoints = [
  "Single vendor relationship",
  "Predictable monthly costs",
  "Council time cut by 60%",
  "Built-in compliance tracking",
];

const featureItems = [
  { title: "Unified contract management", description: "One agreement replaces a dozen vendor contracts." },
  { title: "Predictable budgeting", description: "Fixed per-unit pricing. No surprise assessments." },
  { title: "Compliance autopilot", description: "Fire, elevator, HVAC - every cert tracked for you." },
  { title: "Emergency coordination", description: "Burst pipe at 2 AM? We handle it, you sleep." },
  { title: "Volume-based savings", description: "Bulk pricing across hundreds of buildings." },
  { title: "Council-ready reporting", description: "One clear report instead of ten vendor summaries." },
];

const pricingTiers = [
  {
    name: "Small Building",
    units: "4-20 units",
    price: "$18",
    per: "/unit/mo",
    borderColor: "border-t-blue-500",
    glowColor: "hover:shadow-blue-500/10",
    features: [
      "Common area cleaning",
      "Grounds maintenance",
      "Snow removal",
      "Gutter cleaning",
    ],
  },
  {
    name: "Mid-Size Building",
    units: "21-50 units",
    price: "$15",
    per: "/unit/mo",
    popular: true,
    borderColor: "border-t-emerald-500",
    glowColor: "hover:shadow-emerald-500/10",
    features: [
      "Everything in Small",
      "Exterior wash",
      "Pest control",
      "Window cleaning",
      "Parkade maintenance",
    ],
  },
  {
    name: "Large Complex",
    units: "50+ units",
    price: "Custom",
    per: "pricing",
    borderColor: "border-t-violet-500",
    glowColor: "hover:shadow-violet-500/10",
    features: [
      "Full service package",
      "Dedicated account manager",
      "Emergency response",
      "Volume discounts",
    ],
  },
];

const guaranteeItems: Gallery4Item[] = [
  {
    id: "quality",
    title: "Quality Guarantee",
    description: "Any service below standard gets re-done at no cost. We stand behind every job.",
    image: "https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "price-lock",
    title: "Price Lock Guarantee",
    description: "Your per-unit rate is locked for the full contract term. No surprise assessments.",
    image: "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "emergency",
    title: "Emergency Response",
    description: "Acknowledged in 30 minutes. Routine requests within 24 hours. Your building is always covered.",
    image: "https://images.pexels.com/photos/5691658/pexels-photo-5691658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

/* --- SUB-COMPONENTS -------------------------------------------------- */

function RevealItem({
  children,
  index,
  variant,
}: {
  children: React.ReactNode;
  index: number;
  variant: "problem" | "solution";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="flex items-center gap-3.5 py-2"
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          variant === "problem" ? "bg-red-50" : "bg-emerald-50"
        }`}
      >
        {variant === "problem" ? (
          <X className="h-3.5 w-3.5 text-red-500" />
        ) : (
          <Check className="h-3.5 w-3.5 text-emerald-600" />
        )}
      </div>
      <p
        className={`text-lg font-medium sm:text-xl ${
          variant === "problem" ? "text-muted-foreground" : "text-foreground"
        }`}
      >
        {children}
      </p>
    </motion.div>
  );
}

function StatItem({
  stat,
  index,
}: {
  stat: (typeof stats)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="text-center"
    >
      <p className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
        {isInView ? (
          <AnimatedCounter
            target={stat.value}
            suffix={stat.suffix}
            duration={1.5}
          />
        ) : (
          "0"
        )}
      </p>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        {stat.label}
      </p>
    </motion.div>
  );
}

function PricingCard({
  tier,
  index,
}: {
  tier: (typeof pricingTiers)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={`group relative rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:shadow-xl ${tier.glowColor} border-t-4 ${tier.borderColor} ${
        tier.popular ? "ring-1 ring-emerald-500/20" : ""
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-emerald-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">
            Most Popular
          </span>
        </div>
      )}
      <div className="p-6 sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">
          {tier.units}
        </p>
        <h3 className="mt-1 text-xl font-bold tracking-tight">{tier.name}</h3>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight">
            {tier.price}
          </span>
          <span className="text-base text-muted-foreground">{tier.per}</span>
        </div>
        <ul className="mt-6 space-y-3">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span className="text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          {tier.popular ? (
            <Link href="/onboarding?type=strata">
              <ShimmerButton className="h-11 w-full text-sm">
                Get Started
                <ArrowRight className="ml-2 inline h-4 w-4" />
              </ShimmerButton>
            </Link>
          ) : (
            <Button
              variant="outline"
              className="h-11 w-full text-sm"
              asChild
            >
              <Link href="/onboarding?type=strata">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}


/* --- DASHBOARD MOCKUP ------------------------------------------------ */

function DashboardMockup() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, rotateX: 8 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative"
    >
      {/* Glow behind the card */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-blue-500/10 to-violet-500/10 blur-2xl" />

      {/* Main dashboard card */}
      <div className="relative rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/10">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border/40 px-5 py-3">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs text-muted-foreground">
            Strata Dashboard
          </span>
        </div>

        <div className="p-5 sm:p-6">
          {/* Building overview row */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Building
              </p>
              <p className="mt-0.5 text-sm font-semibold">
                Oakridge Towers - 48 Units
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              All Clear
            </span>
          </div>

          {/* Service cards */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              {
                icon: Sparkles,
                name: "Cleaning",
                status: "Completed",
                color: "text-emerald-600",
              },
              {
                icon: Scissors,
                name: "Grounds",
                status: "Scheduled",
                color: "text-blue-600",
              },
              {
                icon: Thermometer,
                name: "HVAC",
                status: "Next: Apr 12",
                color: "text-amber-600",
              },
              {
                icon: Bug,
                name: "Pest Control",
                status: "Scheduled",
                color: "text-violet-600",
              },
            ].map((svc) => (
              <div
                key={svc.name}
                className="rounded-xl border border-border/40 bg-muted/30 p-3"
              >
                <div className="flex items-center gap-2">
                  <svc.icon className={`h-3.5 w-3.5 ${svc.color}`} />
                  <span className="text-xs font-medium">{svc.name}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {svc.status}
                </p>
              </div>
            ))}
          </div>

          {/* Monthly cost bar */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
            <div>
              <p className="text-xs text-muted-foreground">Monthly cost</p>
              <p className="text-lg font-bold tracking-tight">$720</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Per unit</p>
              <p className="text-lg font-bold tracking-tight text-emerald-600">
                $15
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* --- PAGE ------------------------------------------------------------ */

export function StrataContent() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.06] via-transparent to-transparent" />
        <div className="absolute left-1/4 top-0 -z-10 h-[600px] w-[800px] rounded-full bg-emerald-500/[0.04] blur-3xl" />

        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left - copy */}
            <div>
              <FadeIn>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600/80 sm:text-sm">
                  For strata corporations
                </p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  One contract. One invoice.{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    Every building service.
                  </span>
                </h1>
                <p className="mt-5 max-w-lg text-lg text-muted-foreground">
                  Replace vendor chaos with a single maintenance partnership
                  built for strata councils.
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Link href="/onboarding?type=strata">
                    <ShimmerButton className="h-12 w-full px-8 text-base sm:w-auto">
                      Get Your Strata Quote
                      <ArrowRight className="ml-2 inline h-4 w-4" />
                    </ShimmerButton>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 w-full px-8 text-base sm:w-auto"
                    asChild
                  >
                    <Link href="#pricing">See Pricing</Link>
                  </Button>
                </div>
              </FadeIn>
            </div>

            {/* Right - dashboard mockup */}
            <div className="lg:pl-4">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS BANNER ========== */}
      <section className="border-y border-border/40 py-20 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <p className="mb-12 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-16 sm:text-sm">
              By the numbers
            </p>
          </FadeIn>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            {stats.map((stat, i) => (
              <StatItem key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROBLEM / SOLUTION ========== */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Problems */}
            <div>
              <FadeIn>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-red-500/80 sm:text-sm">
                  The problem
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  Strata maintenance is broken
                </h2>
              </FadeIn>
              <div className="mt-10 space-y-1">
                {painPoints.map((p, i) => (
                  <RevealItem key={i} index={i} variant="problem">
                    {p}
                  </RevealItem>
                ))}
              </div>
            </div>
            {/* Solutions */}
            <div>
              <FadeIn>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600/80 sm:text-sm">
                  The solution
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  We fixed it
                </h2>
              </FadeIn>
              <div className="mt-10 space-y-1">
                {solutionPoints.map((s, i) => (
                  <RevealItem key={i} index={i} variant="solution">
                    {s}
                  </RevealItem>
                ))}
              </div>
              <FadeIn delay={0.4}>
                <div className="mt-10">
                  <Link href="/onboarding?type=strata">
                    <ShimmerButton className="h-12 px-8 text-base">
                      See How It Works
                      <ArrowRight className="ml-2 inline h-4 w-4" />
                    </ShimmerButton>
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="border-y border-border/40 bg-muted/20 py-24 sm:py-32">
        <FadeIn>
          <Feature
            badge="Why strata councils choose us"
            title="Everything managed. Nothing missed."
            items={featureItems}
            columns={3}
          />
        </FadeIn>
      </section>

      {/* ========== PRICING TIERS ========== */}
      <section id="pricing" className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                Transparent pricing
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Simple per-unit pricing
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">
                No hidden fees. No surprise assessments.
              </p>
            </div>
          </FadeIn>
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:mt-16 md:grid-cols-3">
            {pricingTiers.map((tier, i) => (
              <PricingCard key={tier.name} tier={tier} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== GUARANTEES ========== */}
      <Gallery4
        title="Guarantees built into every plan"
        description="Real promises backed by real accountability. No fine print."
        items={guaranteeItems}
      />

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                Real results
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Trusted by strata councils across BC
              </h2>
            </div>
          </FadeIn>
          <div className="mt-14 sm:mt-16">
            <TestimonialsMarquee audience="strata" />
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="border-t border-border/40 py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Ready to simplify building maintenance?
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">
                Get a custom strata plan in one council meeting.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link href="/onboarding?type=strata">
                  <ShimmerButton className="h-12 px-8 text-base">
                    Get Your Strata Quote
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base"
                  asChild
                >
                  <Link href="#pricing">View Pricing Tiers</Link>
                </Button>
              </div>
              <p className="mt-5 text-sm text-muted-foreground/70">
                Per-unit pricing from $15/mo &middot; No hidden fees &middot;
                Cancel anytime
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
