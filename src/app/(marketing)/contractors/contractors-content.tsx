"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FadeIn, ShimmerButton, AnimatedCounter } from "@/components/ui/motion";
import {
  InfiniteMarquee,
  MarqueeServiceItem,
} from "@/components/marketing/infinite-marquee";
import { motion, useInView } from "framer-motion";

import { TestimonialsMarquee } from "@/components/marketing/testimonials-marquee";
import { Feature } from "@/components/ui/feature-section-with-grid";

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
  DollarSign,
  ShieldCheck,
  Target,
  CalendarClock,
  ClipboardCheck,
  Users,
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

const benefitItems = [
  { title: "Free qualified leads", description: "Homeowners sent directly to you at zero cost." },
  { title: "Guaranteed payment", description: "Every completed job paid on schedule. Always." },
  { title: "No marketing costs", description: "We handle all customer acquisition for you." },
  { title: "Flexible schedule", description: "You choose when, where, and how much you work." },
  { title: "Admin handled", description: "Scheduling, invoicing, follow-ups - all taken care of." },
  { title: "Growing network", description: "Join a vetted community of top local professionals." },
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

function HeroDashboardCard({
  card,
  index,
}: {
  card: (typeof heroCards)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.6 + index * 0.15,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md"
    >
      <p className="text-xs font-medium text-white/50">{card.label}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-2xl font-bold text-white">{card.value}</p>
        <span className={`text-xs font-medium ${card.color}`}>
          {card.change}
        </span>
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

function TimelineStep({
  step,
  index,
  isLast,
  isActive,
  onClick,
}: {
  step: (typeof timelineSteps)[0];
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

/* --- PAGE ---------------------------------------------------------- */

export function ContractorsContent() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden bg-[#0a0a0a] py-24 sm:py-32">
        {/* Subtle gradient orbs */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
        <motion.div
          className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-500/5 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left - Copy */}
            <div>
              <FadeIn>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400/80 sm:text-sm">
                  Now accepting contractors
                </p>
                <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
                  Free leads.
                  <br />
                  Guaranteed pay.
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                    Zero cost.
                  </span>
                </h1>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
                  Join the network that sends you qualified homeowners, handles
                  admin, and pays on time - every time.
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Link href="/onboarding?type=contractor">
                    <ShimmerButton className="h-12 w-full px-8 text-base font-semibold sm:w-auto">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </ShimmerButton>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 border-white/15 px-8 text-base text-white hover:bg-white/5"
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
            </div>

            {/* Right - Dashboard mockup */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Glow behind cards */}
                <div className="absolute inset-0 -m-8 rounded-3xl bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10 blur-2xl" />
                <div className="relative space-y-4">
                  {/* Header bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500">
                        <Briefcase className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Contractor Dashboard
                        </p>
                        <p className="text-xs text-white/40">March 2026</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-white/80">
                        4.9
                      </span>
                    </div>
                  </motion.div>

                  {/* Metric cards */}
                  <div className="grid grid-cols-1 gap-3">
                    {heroCards.map((card, i) => (
                      <HeroDashboardCard key={card.label} card={card} index={i} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
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

      {/* ====== BENEFITS GRID ====== */}
      <section id="benefits" className="py-24 sm:py-32">
        <FadeIn>
          <Feature
            badge="Why join us"
            title="Built for contractors who want more"
            subtitle="No chasing leads. No unpaid invoices. Just steady work."
            items={benefitItems}
            columns={3}
          />
        </FadeIn>
      </section>

      {/* ====== HOW TO JOIN ====== */}
      <section className="border-y border-border/40 bg-muted/20 py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Left - text */}
            <div>
              <FadeIn>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
                  How to join
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  Four steps to your first job
                </h2>
                <p className="mt-5 text-lg text-muted-foreground">
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
            {/* Right - timeline */}
            <div className="mt-2">
              {timelineSteps.map((step, i) => (
                <TimelineStep
                  key={step.num}
                  step={step}
                  index={i}
                  isLast={i === timelineSteps.length - 1}
                  isActive={activeStep === i}
                  onClick={() => setActiveStep(i)}
                />
              ))}
            </div>
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
                Services we're hiring for
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
