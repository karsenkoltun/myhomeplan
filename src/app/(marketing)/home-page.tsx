"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, ShimmerButton, AnimatedCounter } from "@/components/ui/motion";
import { HeroScene } from "@/components/hero/hero-scene";
import { HeroTextReveal } from "@/components/hero/hero-text-reveal";
import { FlowButton } from "@/components/ui/flow-button";
import { ContainerScroll, CardSticky } from "@/components/ui/cards-stack";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { TestimonialsMarquee } from "@/components/marketing/testimonials-marquee";
import { Gallery4 } from "@/components/ui/gallery4";
import type { Gallery4Item } from "@/components/ui/gallery4";

import {
  ArrowRight,
  Check,
  X,
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

const whyItems: Gallery4Item[] = [
  {
    id: "bundled",
    title: "One plan for everything",
    description: "Lawn, snow, HVAC, cleaning, and more - bundled into one subscription with one monthly bill.",
    image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "vetted",
    title: "Vetted local pros",
    description: "Every contractor is licensed, insured, and background-checked. No guessing, no risk.",
    image: "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "scheduled",
    title: "Real-time scheduling",
    description: "Every service tracked and managed for you. Get notified before every visit.",
    image: "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "pricing",
    title: "Predictable pricing",
    description: "No surprise bills. Ever. Your rate is locked from day one.",
    image: "https://images.pexels.com/photos/7578901/pexels-photo-7578901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
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
  return (
    <div className="flex flex-col overflow-x-clip">
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
      <Gallery4
        title="Everything handled. Nothing forgotten."
        description="Why homeowners choose My Home Plan for all their maintenance needs."
        items={whyItems}
      />
      <FadeIn>
        <div className="-mt-16 mb-24 text-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/plan-builder">
              See All Services & Pricing
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="border-y border-border/40 bg-muted/20 py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 md:gap-8 xl:gap-12">
            <div className="left-0 top-0 md:sticky md:h-svh md:py-12">
              <FadeIn>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                  How it works
                </p>
                <h2 className="mb-6 mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  Four steps. Then{" "}
                  <span className="text-primary">never think about it again.</span>
                </h2>
                <p className="max-w-prose text-muted-foreground">
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
            <ContainerScroll className="min-h-[300vh] space-y-8 py-12">
              {steps.map((step, index) => (
                <CardSticky
                  key={step.num}
                  index={index + 2}
                  className="rounded-2xl border border-border/50 bg-card p-8 shadow-md backdrop-blur-md"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="my-6 text-2xl font-bold tracking-tighter">
                      {step.title}
                    </h3>
                    <span className="text-2xl font-bold text-primary">
                      {step.num}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{step.detail}</p>
                </CardSticky>
              ))}
            </ContainerScroll>
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
