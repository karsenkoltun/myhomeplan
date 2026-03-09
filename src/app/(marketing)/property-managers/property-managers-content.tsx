"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, ShimmerButton, AnimatedCounter } from "@/components/ui/motion";
import { FlowButton } from "@/components/ui/flow-button";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

import { TestimonialsMarquee } from "@/components/marketing/testimonials-marquee";
import { Timeline } from "@/components/ui/timeline";

import {
  ArrowRight,
  Building2,
  FileText,
  BarChart3,
  HeadphonesIcon,
  ShieldCheck,
  Check,
  X,
  Users,
  Layers,
  Receipt,
  MessageSquare,
} from "lucide-react";

/* -- DATA --------------------------------------------------------- */

const stats = [
  { value: 60, suffix: "%", label: "Less admin time" },
  { value: 1, suffix: "", label: "Invoice per month" },
  { value: 40, suffix: "%", label: "Fewer tenant complaints" },
  { value: 40, suffix: "%", label: "Cost savings", prefix: "20-", showRange: true },
];

const problems = [
  "50+ vendor invoices every month",
  "Different contractors per property",
  "Inconsistent service quality",
  "Hours lost to scheduling calls",
  "Scaling adds more chaos, not revenue",
];

const solutions = [
  "One invoice for your entire portfolio",
  "Vetted pros assigned across properties",
  "Consistent quality with real-time tracking",
  "We handle all scheduling and coordination",
  "Adding properties takes minutes, not weeks",
];

const timelineItems = [
  {
    title: "Consolidate",
    content: (
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Layers className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">Portfolio consolidation</h3>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground md:text-base">
          Every property, every service, one dashboard. Replace dozens of vendor relationships with a single platform.
        </p>
      </div>
    ),
  },
  {
    title: "Billing",
    content: (
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Receipt className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">One monthly invoice</h3>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground md:text-base">
          Consolidated billing across your entire portfolio. One payment, one line item for accounting.
        </p>
      </div>
    ),
  },
  {
    title: "Retention",
    content: (
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <MessageSquare className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">Reduce tenant complaints</h3>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground md:text-base">
          Proactive, scheduled maintenance prevents issues before tenants notice. Better retention, fewer calls.
        </p>
      </div>
    ),
  },
  {
    title: "Support",
    content: (
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <HeadphonesIcon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">Dedicated account manager</h3>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground md:text-base">
          One point of contact who knows your portfolio. No call centers, no ticket queues.
        </p>
      </div>
    ),
  },
];

const steps = [
  {
    num: "01",
    title: "Tell us about your portfolio",
    detail: "Properties, unit counts, current setup. 15 minutes.",
  },
  {
    num: "02",
    title: "Get a custom portfolio plan",
    detail: "Comprehensive maintenance plan with consolidated pricing.",
  },
  {
    num: "03",
    title: "We onboard everything",
    detail: "Contractor matching, scheduling, access coordination handled.",
  },
];

/* -- COMPONENTS --------------------------------------------------- */

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

function TimelineStep({
  step,
  index,
  isLast,
  isActive,
  onClick,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
  isActive: boolean;
  onClick: () => void;
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
        delay: index * 0.12,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      onClick={onClick}
      className="group relative flex cursor-pointer gap-5 sm:gap-7"
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <motion.div
          animate={{
            scale: isActive ? 1 : 0.85,
            backgroundColor: isActive
              ? "oklch(0.55 0.18 285)"
              : "oklch(0.955 0.005 285)",
          }}
          transition={{ duration: 0.3 }}
          className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold shadow-sm sm:h-14 sm:w-14 sm:text-base"
        >
          <span className={isActive ? "text-white" : "text-muted-foreground"}>
            {step.num}
          </span>
        </motion.div>
        {!isLast && (
          <div
            className="w-px flex-1 bg-gradient-to-b from-border to-transparent"
            style={{ minHeight: "2rem" }}
          />
        )}
      </div>
      {/* Content */}
      <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
        <h3
          className={`text-lg font-semibold tracking-tight transition-colors duration-200 sm:text-xl ${
            isActive ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {step.title}
        </h3>
        <motion.p
          animate={{ opacity: isActive ? 1 : 0.5 }}
          className="mt-1 text-sm text-muted-foreground sm:text-base"
        >
          {step.detail}
        </motion.p>
      </div>
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
        {stat.showRange ? (
          isInView ? (
            <>
              20-<AnimatedCounter target={stat.value} suffix="%" duration={1.5} />
            </>
          ) : (
            "0%"
          )
        ) : stat.value === 1 ? (
          "1"
        ) : isInView ? (
          <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={1.5} />
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

/* -- FLOATING DASHBOARD ------------------------------------------- */

function FloatingDashboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotateY: -8 }}
      animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative"
    >
      {/* Glow effect behind card */}
      <div className="absolute -inset-4 rounded-3xl bg-violet-500/10 blur-2xl" />

      {/* Main dashboard card */}
      <div className="relative rounded-2xl border border-border/50 bg-card p-5 shadow-2xl shadow-black/10 sm:p-6">
        {/* Header bar */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Portfolio Overview</p>
              <p className="text-xs text-muted-foreground">12 properties</p>
            </div>
          </div>
          <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
            All active
          </div>
        </div>

        {/* Mini stat row */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          {[
            { label: "Units", value: "186" },
            { label: "This month", value: "$12.4k" },
            { label: "Open tasks", value: "3" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Property list */}
        <div className="space-y-2">
          {[
            { name: "Lakeshore Towers", units: 48, status: "On schedule" },
            { name: "Pine Valley Complex", units: 32, status: "On schedule" },
            { name: "Downtown Suites", units: 24, status: "1 pending" },
          ].map((prop) => (
            <div
              key={prop.name}
              className="flex items-center justify-between rounded-xl border border-border/30 px-4 py-2.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50">
                  <Building2 className="h-3.5 w-3.5 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{prop.name}</p>
                  <p className="text-[10px] text-muted-foreground">{prop.units} units</p>
                </div>
              </div>
              <span
                className={`text-xs font-medium ${
                  prop.status === "On schedule"
                    ? "text-emerald-600"
                    : "text-amber-600"
                }`}
              >
                {prop.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* -- PAGE --------------------------------------------------------- */

export function PropertyManagersContent() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/[0.06] via-transparent to-background" />
        <div className="absolute left-1/4 top-0 -z-10 h-[500px] w-[600px] rounded-full bg-violet-500/[0.05] blur-3xl" />
        <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left - copy */}
            <div>
              <FadeIn>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                  For property managers
                </p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Simplify portfolio{" "}
                  <span className="bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
                    maintenance.
                  </span>
                </h1>
                <p className="mt-5 text-lg text-muted-foreground">
                  One platform for every property. One invoice. One point of contact.
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Link href="/onboarding?type=property-manager">
                    <ShimmerButton className="h-12 w-full bg-violet-600 px-8 text-base hover:bg-violet-700 sm:w-auto">
                      Get a Portfolio Quote
                      <ArrowRight className="ml-2 inline h-4 w-4" />
                    </ShimmerButton>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-base"
                    onClick={() => {
                      document
                        .getElementById("how-it-works")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    How It Works
                  </Button>
                </div>
              </FadeIn>
            </div>
            {/* Right - floating dashboard */}
            <div className="lg:pl-8">
              <FloatingDashboard />
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
              <StatItem key={i} stat={stat} index={i} />
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
                  More properties, more chaos
                </h2>
              </FadeIn>
              <div className="mt-10 space-y-1">
                {problems.map((p, i) => (
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
                  One platform, total control
                </h2>
              </FadeIn>
              <div className="mt-10 space-y-1">
                {solutions.map((s, i) => (
                  <RevealItem key={i} index={i} variant="solution">
                    {s}
                  </RevealItem>
                ))}
              </div>
              <FadeIn delay={0.4}>
                <div className="mt-10">
                  <Link href="/onboarding?type=property-manager">
                    <ShimmerButton className="h-12 bg-violet-600 px-8 text-base hover:bg-violet-700">
                      Get Started
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
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="max-w-4xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                Why My Home Plan
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Built for portfolio scale
              </h2>
            </div>
          </FadeIn>
        </div>
        <Timeline data={timelineItems} />
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Left - text */}
            <div>
              <FadeIn>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                  How it works
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  Three steps to a simpler portfolio
                </h2>
                <p className="mt-5 text-lg text-muted-foreground">
                  From first call to fully managed in under two weeks.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="mt-10">
                  <FlowButton
                    text="Get a Portfolio Quote"
                    href="/onboarding?type=property-manager"
                    className="h-12 px-10 text-base"
                  />
                </div>
              </FadeIn>
            </div>
            {/* Right - timeline */}
            <div className="mt-2">
              {steps.map((step, i) => (
                <TimelineStep
                  key={step.num}
                  step={step}
                  index={i}
                  isLast={i === steps.length - 1}
                  isActive={activeStep === i}
                  onClick={() => setActiveStep(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="border-y border-border/40 bg-muted/20 py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                Real results
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                What property managers are saying
              </h2>
            </div>
          </FadeIn>
          <div className="mt-14 sm:mt-16">
            <TestimonialsMarquee audience="pm" />
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="border-t border-border/40 py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Ready to streamline your portfolio?
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">
                Get a custom portfolio plan with consolidated pricing. Most managers are fully onboarded within two weeks.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link href="/onboarding?type=property-manager">
                  <ShimmerButton className="h-12 bg-violet-600 px-8 text-base hover:bg-violet-700">
                    Get a Portfolio Quote
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base"
                  asChild
                >
                  <Link href="/contact">Talk to Our Team</Link>
                </Button>
              </div>
              <p className="mt-5 text-sm text-muted-foreground/70">
                Volume pricing available &middot; Cancel anytime &middot; No contracts
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
