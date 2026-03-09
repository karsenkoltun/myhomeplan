"use client";

import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { FadeIn, ShimmerButton, AnimatedCounter } from "@/components/ui/motion";
import {
  InfiniteMarquee,
  MarqueeServiceItem,
} from "@/components/marketing/infinite-marquee";
import { motion, useInView } from "framer-motion";

import { TestimonialsMarquee } from "@/components/marketing/testimonials-marquee";
import { Timeline } from "@/components/ui/timeline";

import {
  ArrowRight,
  Scissors,
  Snowflake,
  Thermometer,
  Sparkles,
  Bug,
  Hammer,
  Wrench,
  Zap,
  Droplets,
  PaintBucket,
  Wind,
  Check,
  X,
  CreditCard,
  ShieldCheck,
  Calendar,
  Clock,
  DollarSign,
  Star,
  Leaf,
  Layers,
  CalendarClock,
} from "lucide-react";

/* --- DATA --------------------------------------------------------- */

const problems = [
  "Juggling 8+ contractors",
  "Surprise bills every month",
  "Unreliable service providers",
  "Wasted weekends coordinating",
  "No accountability or guarantees",
];

const solutions = [
  "One subscription covers everything",
  "Predictable monthly pricing",
  "Vetted, insured professionals",
  "We schedule and coordinate for you",
  "Satisfaction guaranteed or we fix it",
];

const stats = [
  { value: 20, suffix: "-40%", label: "Savings", sublabel: "vs. hiring individually" },
  { value: 15, suffix: "+", label: "Services", sublabel: "under one roof" },
  { value: 100, suffix: "%", label: "Vetted", sublabel: "licensed & insured pros" },
  { value: 0, suffix: "", label: "Hidden fees", sublabel: "transparent pricing always" },
];

const timelineItems = [
  {
    title: "Bundled",
    content: (
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Layers className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">One plan, every service</h3>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground md:text-base">
          Lawn, snow, HVAC, cleaning - bundled into one subscription with one monthly bill.
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
          Every contractor is licensed, insured, and background-checked before they touch your home.
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
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">Effortless scheduling</h3>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground md:text-base">
          Book any service in seconds from your dashboard. We handle all coordination.
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
          No surprise bills. Cancel anytime. Your rate is locked from day one.
        </p>
      </div>
    ),
  },
];

const marqueeServices = [
  { icon: Scissors, label: "Lawn Care", color: "text-green-600" },
  { icon: Snowflake, label: "Snow Removal", color: "text-sky-500" },
  { icon: Thermometer, label: "HVAC", color: "text-orange-500" },
  { icon: Sparkles, label: "Cleaning", color: "text-violet-500" },
  { icon: Bug, label: "Pest Control", color: "text-rose-500" },
  { icon: Hammer, label: "Handyman", color: "text-amber-600" },
  { icon: Wrench, label: "Plumbing", color: "text-cyan-600" },
  { icon: Zap, label: "Electrical", color: "text-yellow-500" },
  { icon: Droplets, label: "Pressure Washing", color: "text-blue-500" },
  { icon: Wind, label: "Gutter Cleaning", color: "text-teal-500" },
  { icon: PaintBucket, label: "Painting", color: "text-pink-500" },
  { icon: Leaf, label: "Landscaping", color: "text-lime-600" },
];

/* --- COMPONENTS --------------------------------------------------- */

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
        {stat.value === 0 ? (
          "0"
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

/* --- HERO FLOATING CARD ------------------------------------------- */

function HeroPlanCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateY: -8 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px]"
    >
      {/* Main card */}
      <div className="rounded-2xl border border-border/60 bg-background/80 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Your Plan
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-foreground">
              Essential Home
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {[
            { label: "Lawn Care", freq: "Bi-weekly", active: true },
            { label: "Snow Removal", freq: "As needed", active: true },
            { label: "HVAC Tune-up", freq: "2x / year", active: true },
            { label: "Gutter Cleaning", freq: "2x / year", active: false },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/30 px-3.5 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`h-2 w-2 rounded-full ${
                    item.active ? "bg-emerald-500" : "bg-border"
                  }`}
                />
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{item.freq}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-border/30 pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Monthly total</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              $149<span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1">
            <Check className="h-3 w-3 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">Save 35%</span>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="absolute -right-4 -top-4 flex items-center gap-1.5 rounded-full border border-border/50 bg-background px-3 py-1.5 shadow-lg"
      >
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span className="text-xs font-semibold text-foreground">4.9 Rating</span>
      </motion.div>

      {/* Floating notification */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="absolute -bottom-3 -left-4 flex items-center gap-2 rounded-xl border border-border/50 bg-background px-3 py-2 shadow-lg"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
          <Check className="h-3.5 w-3.5 text-emerald-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-foreground">Service completed</p>
          <p className="text-[10px] text-muted-foreground">Lawn mowed - 2h ago</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* --- PAGE --------------------------------------------------------- */

export function HomeownersContent() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-background to-background" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/[0.06] via-violet-500/[0.04] to-emerald-500/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left - copy */}
            <div>
              <FadeIn>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600 sm:text-sm">
                  For homeowners
                </p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
                  Save $1,500+ every year on home maintenance
                </h1>
                <p className="mt-5 max-w-lg text-lg text-muted-foreground">
                  One subscription. Every service your home needs. Vetted pros, guaranteed quality, 20-40% less than hiring individually.
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
                  <Link href="/onboarding?type=homeowner">
                    <ShimmerButton className="h-12 px-8 text-base">
                      Get Your Plan in 2 Minutes
                      <ArrowRight className="ml-2 inline h-4 w-4" />
                    </ShimmerButton>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-base"
                    asChild
                  >
                    <Link href="/plan-builder">See Pricing</Link>
                  </Button>
                </div>
              </FadeIn>
            </div>

            {/* Right - floating card mockup */}
            <div className="flex items-center justify-center lg:justify-end">
              <HeroPlanCard />
            </div>
          </div>
        </div>
      </section>

      {/* ========== SERVICES MARQUEE ========== */}
      <section className="border-y border-border/40 bg-muted/20 py-8 sm:py-10">
        <FadeIn>
          <p className="mb-5 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:mb-7 sm:text-sm">
            15+ services under one roof
          </p>
        </FadeIn>
        <InfiniteMarquee speed={35}>
          {marqueeServices.map((s) => (
            <MarqueeServiceItem
              key={s.label}
              icon={s.icon}
              label={s.label}
              color={s.color}
            />
          ))}
        </InfiniteMarquee>
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
                  <Link href="/onboarding?type=homeowner">
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

      {/* ========== FEATURES ========== */}
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

      {/* ========== TESTIMONIALS ========== */}
      <section className="border-y border-border/40 bg-muted/20 py-24 sm:py-32">
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

      {/* ========== FINAL CTA ========== */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Ready to simplify your home?
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">
                Build your custom plan in under 2 minutes. No commitment required.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link href="/onboarding?type=homeowner">
                  <ShimmerButton className="h-12 px-8 text-base">
                    Get Your Personalized Plan
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base"
                  asChild
                >
                  <Link href="/plan-builder">View Pricing</Link>
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
