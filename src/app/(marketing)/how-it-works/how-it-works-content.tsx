"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, ShimmerButton } from "@/components/ui/motion";
import { Timeline } from "@/components/ui/timeline";
import { Gallery4 } from "@/components/ui/gallery4";
import type { Gallery4Item } from "@/components/ui/gallery4";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Check,
  X,
  Shield,
  ClipboardList,
  Users,
  Calendar,
  Home,
} from "lucide-react";

import { TestimonialsMarquee } from "@/components/marketing/testimonials-marquee";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const oldWayItems = [
  "Google contractors for hours",
  "Wait days for quotes",
  "Schedule each service yourself",
  "Chase no-show contractors",
  "Get hit with surprise fees",
];

const newWayItems = [
  "Tell us about your home",
  "One plan, one price",
  "We schedule everything",
  "Guaranteed service quality",
  "Nothing gets forgotten",
];

const timelineData = [
  {
    title: "Step 1",
    content: (
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <ClipboardList className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">
          Build Your Plan
        </h3>
        <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-lg">
          Choose from lawn care, snow removal, window cleaning, gutter maintenance, and more. We recommend a plan based on your home type, size, and location.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2">
          <Check className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Takes under 5 minutes</span>
        </div>
      </div>
    ),
  },
  {
    title: "Step 2",
    content: (
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">
          We Match You With Pros
        </h3>
        <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-lg">
          We match your home with licensed, insured professionals in your area. Every contractor is background-checked and rated by real homeowners.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2">
          <Check className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">All pros are pre-vetted</span>
        </div>
      </div>
    ),
  },
  {
    title: "Step 3",
    content: (
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">
          Everything Gets Auto-Scheduled
        </h3>
        <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-lg">
          Your maintenance calendar is built automatically. Services are scheduled at the right time of year, and you get notified before every visit.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2">
          <Check className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Zero effort from you</span>
        </div>
      </div>
    ),
  },
  {
    title: "Step 4",
    content: (
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">
          Your Home Stays Protected
        </h3>
        <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-lg">
          Track completed services, upcoming visits, and your home's maintenance history in your dashboard. We handle everything so you don't have to.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2">
          <Check className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Full visibility always</span>
        </div>
      </div>
    ),
  },
];

const guaranteeItems: Gallery4Item[] = [
  {
    id: "on-time",
    title: "On-Time Guarantee",
    description: "Miss a window and your next service is free. We respect your time because we know it's valuable.",
    image: "https://images.pexels.com/photos/1178684/pexels-photo-1178684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "price-lock",
    title: "Price Lock",
    description: "No surprise charges. No rate hikes. Your price stays locked from day one.",
    image: "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "quality",
    title: "Quality Guarantee",
    description: "Not happy with a service? We send another pro at no cost. Every job is backed by our quality promise.",
    image: "https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "no-lock-in",
    title: "No Lock-In",
    description: "Upgrade, downgrade, or cancel anytime. We earn your loyalty, we don't lock you into it.",
    image: "https://images.pexels.com/photos/5691658/pexels-photo-5691658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

/* ------------------------------------------------------------------ */
/*  Animated item wrapper                                              */
/* ------------------------------------------------------------------ */

function AnimatedItem({
  children,
  index = 0,
  className = "",
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function HowItWorksContent() {
  return (
    <div className="flex flex-col">
      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
            {/* Left column */}
            <FadeIn>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                How It Works
              </p>
              <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Home maintenance
                <br />
                on autopilot
              </h1>
              <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                Build a plan in 5 minutes. We handle scheduling, contractors,
                and quality - so you never think about home maintenance again.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <Link href="/onboarding">
                  <ShimmerButton className="h-12 px-8 text-base">
                    Get Started
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="h-12 px-6 text-base">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </FadeIn>

            {/* Right column - floating product card */}
            <FadeIn delay={0.2}>
              <div className="relative">
                {/* Main card */}
                <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-xl shadow-black/5">
                  {/* Card header */}
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        Upcoming Schedule
                      </p>
                      <p className="mt-1 text-sm font-semibold">March 2026</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  {/* Schedule items */}
                  <div className="mt-4 space-y-3">
                    {[
                      {
                        service: "Lawn Mowing",
                        date: "Mar 12",
                        status: "Scheduled",
                        color: "bg-emerald-500",
                      },
                      {
                        service: "Gutter Cleaning",
                        date: "Mar 18",
                        status: "Confirmed",
                        color: "bg-blue-500",
                      },
                      {
                        service: "Window Washing",
                        date: "Mar 25",
                        status: "Pending",
                        color: "bg-amber-500",
                      },
                    ].map((item) => (
                      <div
                        key={item.service}
                        className="flex items-center justify-between rounded-xl border border-border/30 bg-muted/30 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-2 w-2 rounded-full ${item.color}`}
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {item.service}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.date}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Card footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                    <p className="text-xs text-muted-foreground">
                      3 services this month
                    </p>
                    <p className="text-xs font-medium text-primary">
                      All on track
                    </p>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -right-3 -top-3 rounded-xl border border-border/50 bg-card px-4 py-2 shadow-lg shadow-black/5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <span className="text-xs font-semibold">Auto-scheduled</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Old Way vs New Way                                          */}
      {/* ============================================================ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                The Difference
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                There's a better way
              </h2>
            </div>
          </FadeIn>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {/* Old Way */}
            <AnimatedItem>
              <div className="h-full rounded-2xl border border-red-200/40 bg-red-50/30 p-8 dark:border-red-500/10 dark:bg-red-950/10">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-500/10">
                    <X className="h-4 w-4 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                    The Old Way
                  </h3>
                </div>
                <ul className="space-y-4">
                  {oldWayItems.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <X className="h-4 w-4 shrink-0 text-red-400" />
                      <span className="text-sm text-red-800/70 dark:text-red-300/70">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedItem>

            {/* New Way */}
            <AnimatedItem index={1}>
              <div className="h-full rounded-2xl border border-emerald-200/40 bg-emerald-50/30 p-8 dark:border-emerald-500/10 dark:bg-emerald-950/10">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/10">
                    <Check className="h-4 w-4 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                    The My Home Plan Way
                  </h3>
                </div>
                <ul className="space-y-4">
                  {newWayItems.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-sm text-emerald-800/70 dark:text-emerald-300/70">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedItem>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Timeline                                                    */}
      {/* ============================================================ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="max-w-4xl">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                The Process
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Four steps to autopilot
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                From sign-up to full home coverage in under 5 minutes. Here's how it works.
              </p>
            </div>
          </FadeIn>
        </div>
        <Timeline data={timelineData} />
      </section>

      {/* ============================================================ */}
      {/*  Guarantees                                                  */}
      {/* ============================================================ */}
      <Gallery4
        title="Backed by real guarantees"
        description="Every plan comes with promises we actually keep. No fine print, no exceptions."
        items={guaranteeItems}
      />

      {/* ============================================================ */}
      {/*  Testimonials                                                */}
      {/* ============================================================ */}
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Real Stories
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                What homeowners are saying
              </h2>
            </div>
          </FadeIn>
          <div className="mt-16">
            <TestimonialsMarquee audience="homeowner" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Final CTA                                                   */}
      {/* ============================================================ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <Home className="mx-auto h-10 w-10 text-primary" />
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to put your home on autopilot?
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Build your custom plan in under 5 minutes.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link href="/onboarding">
                  <ShimmerButton className="h-12 px-8 text-base">
                    Get Started
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="h-12 px-6 text-base">
                    View Pricing
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                No credit card required. Cancel anytime.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
