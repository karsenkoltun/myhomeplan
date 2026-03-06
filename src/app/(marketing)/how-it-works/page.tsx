"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FadeIn,
  SlideIn,
  StaggerContainer,
  StaggerItem,
  ScaleOnHover,
  GlowCard,
} from "@/components/ui/motion";
import { ScrollRoadmap } from "@/components/marketing/scroll-roadmap";
import { CostComparison } from "@/components/marketing/cost-comparison";
import {
  Home,
  ListChecks,
  CalendarClock,
  UserCheck,
  FileCheck,
  Palmtree,
  ArrowRight,
  Shield,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  Unlock,
  TrendingDown,
  Route,
  Handshake,
  Star,
  Quote,
} from "lucide-react";


/* ---------------------------------------------------------------
   Data
--------------------------------------------------------------- */

const oldWay = [
  "Research contractors on Google",
  "Call around for quotes (and wait days)",
  "Compare prices and hope they're fair",
  "Schedule each service separately",
  "Chase contractors who don't show up",
  "Deal with surprise charges",
  "Repeat for every single service",
];

const newWay = [
  "Tell us about your home once",
  "We match you with vetted local pros",
  "One plan, one predictable price",
  "We schedule everything for you",
  "Guaranteed service, guaranteed quality",
  "No surprises, no hidden fees",
  "Everything handled, nothing forgotten",
];

const steps = [
  {
    icon: Home,
    title: "Tell Us About Your Home",
    description:
      "Share your property details - size, features, what matters most. Takes about 5 minutes.",
  },
  {
    icon: ListChecks,
    title: "Choose Your Services",
    description:
      "Pick exactly what you need. Lawn care, snow removal, cleaning, maintenance - mix and match.",
  },
  {
    icon: CalendarClock,
    title: "Set Your Schedule",
    description:
      "Choose how often you want each service. Weekly mowing? Monthly cleaning? You decide.",
  },
  {
    icon: UserCheck,
    title: "We Match You With Pros",
    description:
      "We pair your home with licensed, insured contractors who specialize in what you need.",
  },
  {
    icon: FileCheck,
    title: "Review Your Plan",
    description:
      "See your complete plan with transparent pricing. No hidden fees, no surprises.",
  },
  {
    icon: Palmtree,
    title: "Sit Back and Relax",
    description:
      "We handle scheduling, quality control, and communication. You enjoy your home.",
  },
];

const guarantees = [
  {
    icon: Clock,
    title: "Scheduling Guarantee",
    description:
      "Every service happens when planned. If we miss a window, your next service is free.",
  },
  {
    icon: DollarSign,
    title: "Price Guarantee",
    description:
      "Your plan price is locked in. No surprise charges, no rate hikes mid-contract.",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description:
      "Not satisfied with a service? We'll send another pro to make it right at no cost.",
  },
  {
    icon: Unlock,
    title: "Flexibility Guarantee",
    description:
      "Upgrade, downgrade, add services, or cancel anytime. No long-term lock-in.",
  },
];

const savingsReasons = [
  {
    icon: TrendingDown,
    title: "Bulk Rates",
    description:
      "We negotiate volume pricing with our contractor network",
  },
  {
    icon: Route,
    title: "Route Efficiency",
    description:
      "Planned scheduling means contractors save time and pass savings to you",
  },
  {
    icon: Handshake,
    title: "Steady Work",
    description:
      "Contractors get reliable income, you get reliable prices",
  },
];

const testimonials = [
  {
    quote:
      "I used to spend every Saturday dealing with home stuff. Now I spend it with my kids.",
    name: "Sarah M.",
    detail: "Kelowna homeowner, member since 2025",
  },
  {
    quote:
      "I was skeptical about the price, but I actually save money compared to booking everything separately. And I don't have to think about it.",
    name: "James R.",
    detail: "Vernon homeowner, member since 2025",
  },
  {
    quote:
      "The scheduling alone is worth it. No more playing phone tag with five different contractors every season.",
    name: "Lisa T.",
    detail: "West Kelowna homeowner, member since 2026",
  },
];

/* ---------------------------------------------------------------
   Page
--------------------------------------------------------------- */

export default function HowItWorksPage() {
  return (
    <div className="overflow-hidden">
      {/* ============================================================
          1. HERO SECTION
      ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-5 border-primary/20 bg-primary/10 text-primary"
            >
              How It Works
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Managing Your Home Shouldn&apos;t Feel Like a Second Job
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
              We built My Home Plan so you never have to research, negotiate,
              schedule, or chase down a contractor again. Here&apos;s how it
              works.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ============================================================
          2. THE OLD WAY vs. MY HOME PLAN
      ============================================================ */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="mb-10 text-center text-2xl font-bold sm:mb-14 sm:text-3xl">
              There&apos;s a Better Way to Manage Your Home
            </h2>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {/* Old Way column */}
            <div className="rounded-2xl border border-red-200/60 bg-red-50/50 p-6 dark:border-red-900/40 dark:bg-red-950/20 sm:p-8">
              <div className="mb-6 flex items-center gap-2.5">
                <XCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                  The Old Way
                </h3>
              </div>
              <ul className="space-y-3.5">
                {oldWay.map((item, i) => (
                  <SlideIn key={item} from="left" delay={i * 0.08}>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-200/70 text-xs text-red-600 dark:bg-red-900/50 dark:text-red-400">
                        {i + 1}
                      </span>
                      <span className="text-sm text-red-800/80 dark:text-red-300/80 sm:text-base">
                        {item}
                      </span>
                    </li>
                  </SlideIn>
                ))}
              </ul>
            </div>

            {/* New Way column */}
            <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-6 dark:border-emerald-900/40 dark:bg-emerald-950/20 sm:p-8">
              <div className="mb-6 flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                  The My Home Plan Way
                </h3>
              </div>
              <ul className="space-y-3.5">
                {newWay.map((item, i) => (
                  <SlideIn key={item} from="right" delay={i * 0.08}>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200/70 text-xs text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                        ✓
                      </span>
                      <span className="text-sm text-emerald-800/80 dark:text-emerald-300/80 sm:text-base">
                        {item}
                      </span>
                    </li>
                  </SlideIn>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. STEPS SECTION
      ============================================================ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Your Plan in 6 Simple Steps
              </h2>
              <p className="mt-3 text-muted-foreground sm:text-lg">
                From sign-up to sitting back, here is exactly what happens.
              </p>
            </div>
          </FadeIn>

          <ScrollRoadmap />

          <div className="relative mt-12 sm:mt-16">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/30 via-primary/20 to-transparent md:block" />

            <div className="space-y-10 md:space-y-16">
              {steps.map((step, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <SlideIn
                    key={step.title}
                    from={isLeft ? "left" : "right"}
                    delay={i * 0.06}
                  >
                    <div
                      className={`relative flex flex-col items-center gap-4 md:flex-row md:gap-8 ${
                        isLeft ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      {/* Content card */}
                      <div className="flex-1">
                        <Card className="border-border/50 shadow-sm">
                          <CardContent className="p-5 sm:p-6">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                {i + 1}
                              </div>
                              <step.icon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="mt-3 text-base font-semibold sm:text-lg">
                              {step.title}
                            </h3>
                            <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
                              {step.description}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Center dot (desktop) */}
                      <div className="absolute left-1/2 top-1/2 z-10 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background md:block" />

                      {/* Spacer for the opposite side */}
                      <div className="hidden flex-1 md:block" />
                    </div>
                  </SlideIn>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          4. OUR GUARANTEES
      ============================================================ */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <Badge
                variant="secondary"
                className="mb-4 border-primary/20 bg-primary/10 text-primary"
              >
                Our Promise
              </Badge>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Our Promise to You
              </h2>
              <p className="mt-3 text-muted-foreground sm:text-lg">
                Every My Home Plan membership is backed by real guarantees, not
                vague promises.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {guarantees.map((g) => (
              <StaggerItem key={g.title}>
                <ScaleOnHover scale={1.03}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card p-[1px]">
                    {/* Subtle gradient border on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative h-full rounded-[15px] bg-card p-5 sm:p-6">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                        <g.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-sm font-semibold sm:text-base">
                        {g.title}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                        {g.description}
                      </p>
                    </div>
                  </div>
                </ScaleOnHover>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============================================================
          5. WHY WE'RE CHEAPER
      ============================================================ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Why Plan Members Pay Less
              </h2>
              <p className="mt-3 text-muted-foreground sm:text-lg">
                It is not a gimmick. Our model creates real savings for everyone
                involved.
              </p>
            </div>
          </FadeIn>

          <div className="mt-10">
            <CostComparison compact />
          </div>

          <StaggerContainer className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-3">
            {savingsReasons.map((r) => (
              <StaggerItem key={r.title}>
                <GlowCard className="h-full text-center" glowColor="emerald">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                    <r.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-base font-semibold">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {r.description}
                  </p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============================================================
          6. TESTIMONIALS
      ============================================================ */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="mb-10 text-center text-2xl font-bold sm:mb-14 sm:text-3xl">
              What Homeowners Are Saying
            </h2>
          </FadeIn>

          <StaggerContainer className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <ScaleOnHover scale={1.02}>
                  <Card className="h-full border-border/50">
                    <CardContent className="flex h-full flex-col p-5 sm:p-6">
                      <Quote className="mb-3 h-5 w-5 text-primary/40" />
                      <p className="flex-1 text-sm italic text-foreground/80 sm:text-base">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="mt-4 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.detail}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </ScaleOnHover>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============================================================
          7. CTA SECTION
      ============================================================ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              Ready to Simplify Your Home Maintenance?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground sm:text-lg">
              Build your custom plan in under 5 minutes.
            </p>
            <div className="mt-8">
              <Button size="lg" className="px-8 text-base" asChild>
                <Link href="/onboarding">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required. Cancel anytime.
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
