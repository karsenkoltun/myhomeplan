"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, ShimmerButton, AnimatedCounter } from "@/components/ui/motion";
import { HeroScene } from "@/components/hero/hero-scene";
import { HeroTextReveal } from "@/components/hero/hero-text-reveal";
import { FlowButton } from "@/components/ui/flow-button";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

import { TestimonialsMarquee } from "@/components/marketing/testimonials-marquee";
import { Timeline } from "@/components/ui/timeline";

import {
  ArrowRight,
  Check,
  X,
  Layers,
  ShieldCheck,
  CalendarClock,
  DollarSign,
} from "lucide-react";

/* ─── DATA ────────────────────────────────────────────────────── */

const problems = [
  "Unreliable contractors",
  "Endless Googling for quotes",
  "Juggling 8+ providers",
  "Surprise bills every month",
  "Wasted weekends coordinating",
];

const solutions = [
  "Vetted, licensed, and insured pros",
  "One subscription, one monthly bill",
  "Every service scheduled for you",
  "Save 20-40% with bulk rates",
  "Cancel anytime, no contracts",
];

const stats = [
  { value: 15, suffix: "+", label: "Services", sublabel: "under one roof" },
  { value: 847, suffix: "", label: "$847", sublabel: "avg. annual savings", prefix: "" },
  { value: 100, suffix: "%", label: "Vetted", sublabel: "contractors insured" },
  { value: 2, suffix: " min", label: "Setup", sublabel: "to build your plan" },
];

const timelineItems = [
  {
    title: "Bundled",
    content: (
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Layers className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">One plan for everything</h3>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground md:text-base">
          Lawn, snow, HVAC, cleaning, and more - bundled into one subscription with one monthly bill.
        </p>
      </div>
    ),
  },
  {
    title: "Vetted",
    content: (
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">Vetted local pros</h3>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground md:text-base">
          Every contractor is licensed, insured, and background-checked. No guessing, no risk.
        </p>
      </div>
    ),
  },
  {
    title: "Scheduled",
    content: (
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <CalendarClock className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">Real-time scheduling</h3>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground md:text-base">
          Every service tracked and managed for you. Get notified before every visit.
        </p>
      </div>
    ),
  },
  {
    title: "Predictable",
    content: (
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <DollarSign className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">Predictable pricing</h3>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground md:text-base">
          No surprise bills. Ever. Your rate is locked from day one.
        </p>
      </div>
    ),
  },
];

const steps = [
  {
    num: "01",
    title: "Tell us about your home",
    detail: "Property size, lot, heating. 2 minutes.",
  },
  {
    num: "02",
    title: "Pick your services",
    detail: "Choose what you need. Price builds live.",
  },
  {
    num: "03",
    title: "We handle everything",
    detail: "Scheduling, coordination, quality checks.",
  },
  {
    num: "04",
    title: "Enjoy your home",
    detail: "Weekends are yours again.",
  },
];


/* ─── COMPONENTS ──────────────────────────────────────────────── */

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
              ? "oklch(0.55 0.18 250)"
              : "oklch(0.955 0.005 250)",
          }}
          transition={{ duration: 0.3 }}
          className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold shadow-sm sm:h-14 sm:w-14 sm:text-base"
        >
          <span className={isActive ? "text-white" : "text-muted-foreground"}>
            {step.num}
          </span>
        </motion.div>
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-border to-transparent" style={{ minHeight: "2rem" }} />
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
          animate={{ opacity: isActive ? 1 : 0.5, height: isActive ? "auto" : "auto" }}
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
        {stat.label === "$847" ? (
          isInView ? (
            <>
              $<AnimatedCounter target={847} duration={1.5} />
            </>
          ) : (
            "$0"
          )
        ) : isInView ? (
          <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={1.5} />
        ) : (
          "0"
        )}
      </p>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        {stat.sublabel}
      </p>
    </motion.div>
  );
}

/* ─── PAGE ────────────────────────────────────────────────────── */

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-[100vh] overflow-hidden">
        <HeroScene />
        <HeroTextReveal />
      </section>


      {/* ══════════ PROBLEM → SOLUTION ══════════ */}
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
                  Homeownership shouldn&apos;t be a second job
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
                  There&apos;s a better way
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
                  <Link href="/onboarding">
                    <ShimmerButton className="h-12 px-8 text-base">
                      Build Your Plan
                      <ArrowRight className="ml-2 inline h-4 w-4" />
                    </ShimmerButton>
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STATS BANNER ══════════ */}
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

      {/* ══════════ WHY MY HOME PLAN ══════════ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="max-w-4xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                Why My Home Plan
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Everything handled. Nothing forgotten.
              </h2>
            </div>
          </FadeIn>
        </div>
        <Timeline data={timelineItems} />
        <FadeIn delay={0.3}>
          <div className="mt-12 text-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/plan-builder">
                See All Services & Pricing
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="border-y border-border/40 bg-muted/20 py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Left - text */}
            <div>
              <FadeIn>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                  How it works
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  Four steps. Then never think about it again.
                </h2>
                <p className="mt-5 text-lg text-muted-foreground">
                  From signup to service - it takes less time than ordering dinner.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="mt-10">
                  <FlowButton
                    text="Build Your Plan"
                    href="/onboarding"
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

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                Real results
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Homeowners love My Home Plan
              </h2>
            </div>
          </FadeIn>
          <div className="mt-14 sm:mt-16">
            <TestimonialsMarquee audience="homeowner" />
          </div>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="border-t border-border/40 py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Ready to get started?
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">
                Build your custom home plan in under 2 minutes.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link href="/onboarding">
                  <ShimmerButton className="h-12 px-8 text-base">
                    Build Your Plan
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base"
                  asChild
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
              <p className="mt-5 text-sm text-muted-foreground/70">
                Starting at $89/month &middot; Cancel anytime &middot; No contracts
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
