"use client";

import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { FadeIn, ShimmerButton, AnimatedCounter } from "@/components/ui/motion";
import {
  InfiniteMarquee,
  MarqueeServiceItem,
} from "@/components/marketing/infinite-marquee";
import { ContainerScroll, CardSticky } from "@/components/ui/cards-stack";
import { motion, useInView } from "framer-motion";

import { TestimonialsMarquee } from "@/components/marketing/testimonials-marquee";
import { Gallery4 } from "@/components/ui/gallery4";
import type { Gallery4Item } from "@/components/ui/gallery4";

import {
  ArrowRight,
  Scissors,
  Snowflake,
  Sparkles,
  Thermometer,
  Wrench,
  Zap,
  Bug,
  Hammer,
  Sun,
  FileText,
  UserCheck,
  Phone,
  Rocket,
  TrendingUp,
  Star,
  Briefcase,
} from "lucide-react";

/* --- DATA ---------------------------------------------------------- */

const heroCards = [
  {
    label: "This Week's Earnings",
    value: "$2,840",
    change: "+12%",
    color: "text-emerald-500",
  },
  {
    label: "Jobs in Queue",
    value: "6",
    change: "3 new",
    color: "text-blue-500",
  },
  {
    label: "Customer Rating",
    value: "4.9",
    change: "128 reviews",
    color: "text-amber-500",
  },
];

const stats = [
  { value: 0, prefix: "$", suffix: "", label: "Cost to join" },
  { value: 0, prefix: "", suffix: "", label: "Bi-weekly direct deposit", displayText: "Bi-weekly" },
  { value: 10, prefix: "", suffix: "+", label: "Service categories" },
  { value: 100, prefix: "", suffix: "%", label: "Payment guaranteed" },
];

const benefitItems: Gallery4Item[] = [
  {
    id: "leads",
    title: "Free qualified leads",
    description: "Homeowners sent directly to you at zero cost. No bidding, no competition.",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "payment",
    title: "Guaranteed payment",
    description: "Every completed job paid on schedule. Always. No chasing invoices.",
    image: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "marketing",
    title: "No marketing costs",
    description: "We handle all customer acquisition for you. Focus on what you do best.",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "schedule",
    title: "Flexible schedule",
    description: "You choose when, where, and how much you work. Your business, your terms.",
    image: "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "admin",
    title: "Admin handled",
    description: "Scheduling, invoicing, follow-ups - all taken care of so you can focus on the work.",
    image: "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "network",
    title: "Growing network",
    description: "Join a vetted community of top local professionals. Referrals and collaboration built in.",
    image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

const timelineSteps = [
  {
    num: "01",
    icon: FileText,
    title: "Apply online",
    detail: "Simple form. Takes about 2 minutes.",
  },
  {
    num: "02",
    icon: UserCheck,
    title: "Verification",
    detail: "Background check and reference review. 3-5 days.",
  },
  {
    num: "03",
    icon: Phone,
    title: "Onboarding call",
    detail: "Quick call to discuss the partnership.",
  },
  {
    num: "04",
    icon: Rocket,
    title: "Start getting jobs",
    detail: "Qualified leads sent directly to you.",
  },
];

const serviceCategories = [
  { icon: Scissors, label: "Lawn Care", color: "text-green-600" },
  { icon: Snowflake, label: "Snow Removal", color: "text-sky-500" },
  { icon: Sparkles, label: "Cleaning", color: "text-violet-500" },
  { icon: Thermometer, label: "HVAC", color: "text-orange-500" },
  { icon: Wrench, label: "Plumbing", color: "text-cyan-600" },
  { icon: Zap, label: "Electrical", color: "text-yellow-500" },
  { icon: Bug, label: "Pest Control", color: "text-rose-500" },
  { icon: Hammer, label: "Handyman", color: "text-amber-600" },
  { icon: Sun, label: "Window Cleaning", color: "text-teal-500" },
  { icon: TrendingUp, label: "Landscaping", color: "text-emerald-500" },
];

/* --- COMPONENTS ---------------------------------------------------- */

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
        {stat.displayText ? (
          stat.displayText
        ) : isInView ? (
          <AnimatedCounter
            target={stat.value}
            prefix={stat.prefix}
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

/* --- PAGE ---------------------------------------------------------- */

export function ContractorsContent() {
  return (
    <div className="flex flex-col overflow-x-clip">
      {/* ====== HERO ====== */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
            {/* Left - Copy */}
            <FadeIn>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Now accepting contractors
              </p>
              <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Free leads.
                <br />
                Guaranteed pay.
                <br />
                <span className="text-primary">Zero cost.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                Join the network that sends you qualified homeowners, handles
                admin, and pays on time - every time.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <Link href="/onboarding?type=contractor">
                  <ShimmerButton className="h-12 px-8 text-base">
                    Apply Now
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Button
                  variant="outline"
                  className="h-12 px-6 text-base"
                  onClick={() =>
                    document
                      .getElementById("benefits")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Learn More
                </Button>
              </div>
            </FadeIn>

            {/* Right - Dashboard mockup */}
            <FadeIn delay={0.2}>
              <div className="relative">
                <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-xl shadow-black/5">
                  {/* Header bar */}
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <Briefcase className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          Contractor Dashboard
                        </p>
                        <p className="text-xs text-muted-foreground">March 2026</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                  </div>

                  {/* Metric cards */}
                  <div className="mt-4 space-y-3">
                    {heroCards.map((card) => (
                      <div
                        key={card.label}
                        className="flex items-center justify-between rounded-xl border border-border/30 bg-muted/30 px-4 py-3"
                      >
                        <div>
                          <p className="text-xs text-muted-foreground">{card.label}</p>
                          <p className="mt-0.5 text-xl font-bold">{card.value}</p>
                        </div>
                        <span className={`text-xs font-medium ${card.color}`}>
                          {card.change}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -right-3 -top-3 rounded-xl border border-border/50 bg-card px-4 py-2 shadow-lg shadow-black/5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <span className="text-xs font-semibold">Growing fast</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ====== STATS BANNER ====== */}
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

      {/* ====== BENEFITS ====== */}
      <Gallery4
        title="Built for contractors who want more"
        description="No chasing leads. No unpaid invoices. Just steady work."
        items={benefitItems}
      />

      {/* ====== HOW TO JOIN ====== */}
      <section className="border-y border-border/40 bg-muted/20 py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 md:gap-8 xl:gap-12">
            <div className="left-0 top-0 md:sticky md:h-svh md:py-12">
              <FadeIn>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                  How to join
                </p>
                <h2 className="mb-6 mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  Four steps to{" "}
                  <span className="text-primary">your first job</span>
                </h2>
                <p className="max-w-prose text-muted-foreground">
                  From application to earning - as fast as two weeks.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="mt-10">
                  <Link href="/onboarding?type=contractor">
                    <ShimmerButton className="h-12 px-10 text-base">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </ShimmerButton>
                  </Link>
                </div>
              </FadeIn>
            </div>
            <ContainerScroll className="min-h-[300vh] space-y-8 py-12">
              {timelineSteps.map((step, index) => (
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

      {/* ====== SERVICE CATEGORIES MARQUEE ====== */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                Categories
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Services we&apos;re hiring for
              </h2>
            </div>
          </FadeIn>
        </div>
        <div className="mt-12 sm:mt-16">
          <InfiniteMarquee speed={35} direction="left">
            {serviceCategories.map((svc) => (
              <MarqueeServiceItem
                key={svc.label}
                icon={svc.icon}
                label={svc.label}
                color={svc.color}
              />
            ))}
          </InfiniteMarquee>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="border-y border-border/40 bg-muted/20 py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                Contractor stories
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Hear from our network
              </h2>
            </div>
          </FadeIn>
          <div className="mt-14 sm:mt-16">
            <TestimonialsMarquee audience="contractor" />
          </div>
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Ready to grow your business?
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">
                Free to apply. Free to join. Your first jobs could arrive within
                two weeks.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link href="/onboarding?type=contractor">
                  <ShimmerButton className="h-12 px-8 text-base">
                    Apply Now
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base"
                  onClick={() =>
                    document
                      .getElementById("benefits")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Learn More
                </Button>
              </div>
              <p className="mt-5 text-sm text-muted-foreground/70">
                No fees &middot; No commitments &middot; No credit card required
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
