"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
  ScaleOnHover,
  GlowCard,
  ShimmerButton,
  FloatingElement,
  SlideIn,
} from "@/components/ui/motion";
import { HeroScene } from "@/components/hero/hero-scene";
import { HeroTextReveal } from "@/components/hero/hero-text-reveal";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { SectionHeader } from "@/components/marketing/section-header";
import { Testimonials3D } from "@/components/marketing/testimonials-3d";
import { BentoGrid } from "@/components/marketing/bento-grid";
import { CostComparison } from "@/components/marketing/cost-comparison";
import {
  InfiniteMarquee,
  MarqueeServiceItem,
} from "@/components/marketing/infinite-marquee";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Star,
  Scissors,
  Snowflake,
  Thermometer,
  Sparkles,
  Bug,
  Hammer,
  Wrench,
  Zap,
  Home,
  Calendar,
  CreditCard,
  X,
  Check,
  Search,
  PhoneOff,
  CalendarX,
  Receipt,
  Sofa,
  ShieldCheck,
  Lock,
  BadgeCheck,
  Heart,
  Droplets,
  PaintBucket,
  Wind,
} from "lucide-react";

/* ─── DATA ────────────────────────────────────────────────────── */

const painPoints = [
  { text: "Searching for contractors on Google and hoping they're legit", icon: Search },
  { text: "Getting 3 quotes for one simple job and none of them match", icon: Receipt },
  { text: "Contractors who don't show up, don't call, don't care", icon: PhoneOff },
  { text: "Juggling 8 different service providers with 8 different schedules", icon: CalendarX },
  { text: "Surprise bills that are double what you were quoted", icon: DollarSign },
  { text: "Spending your weekends doing maintenance instead of living", icon: Sofa },
];

const benefitsBento = [
  {
    title: "One Monthly Payment",
    description: "Every home service bundled into one predictable bill. No surprise costs, no invoicing chaos.",
    icon: CreditCard,
    color: "text-primary",
    bg: "bg-primary/10",
    span: "large" as const,
  },
  {
    title: "Vetted Local Pros",
    description: "Licensed, insured, and background-checked. Only the best contractors in the Okanagan.",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Guaranteed Scheduling",
    description: "Services happen on time, every time. You never coordinate a thing.",
    icon: Calendar,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    title: "Save 20-40%",
    description: "Bulk rates from our contractor network passed directly to you. No hidden markups.",
    icon: DollarSign,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Cancel Anytime",
    description: "No long-term contracts on monthly plans. Stay because it works, not because you're stuck.",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Everything Handled",
    description: "Scheduling, quality control, communication. We manage it all so you can enjoy your home.",
    icon: CheckCircle2,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
];

const marqueeServices = [
  { icon: Scissors, label: "Lawn Care", color: "text-green-600" },
  { icon: Snowflake, label: "Snow Removal", color: "text-sky-500" },
  { icon: Thermometer, label: "HVAC Maintenance", color: "text-orange-500" },
  { icon: Sparkles, label: "House Cleaning", color: "text-violet-500" },
  { icon: Bug, label: "Pest Control", color: "text-rose-500" },
  { icon: Hammer, label: "Handyman", color: "text-amber-600" },
  { icon: Wrench, label: "Plumbing", color: "text-cyan-600" },
  { icon: Zap, label: "Electrical", color: "text-yellow-500" },
  { icon: Droplets, label: "Pressure Washing", color: "text-blue-500" },
  { icon: Wind, label: "Gutter Cleaning", color: "text-teal-500" },
  { icon: PaintBucket, label: "Painting", color: "text-pink-500" },
];

const steps = [
  {
    step: "01",
    title: "Tell Us About Your Home",
    description: "Property details, lot size, heating type. Takes 2 minutes.",
    icon: Home,
  },
  {
    step: "02",
    title: "Choose Your Services",
    description: "Pick exactly what you need. Watch your price build in real-time.",
    icon: Calendar,
  },
  {
    step: "03",
    title: "We Handle Everything",
    description: "Scheduling, coordination, quality checks. You do nothing.",
    icon: CheckCircle2,
  },
  {
    step: "04",
    title: "Enjoy Your Home",
    description: "Spend your weekends living, not maintaining.",
    icon: Heart,
  },
];

const guarantees = [
  {
    title: "Satisfaction Guarantee",
    description: "Not happy? We'll redo it free or credit your account.",
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Price Lock",
    description: "Your price is your price. No hidden charges, no fine print.",
    icon: Lock,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Cancel Anytime",
    description: "No contracts on monthly plans. Stay because it works.",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Licensed Pros Only",
    description: "Every contractor is vetted, licensed, insured, and background-checked.",
    icon: BadgeCheck,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
];

/* ─── PAIN POINT CARD ─────────────────────────────────────────── */

function PainPointCard({ text, icon: Icon, index }: { text: string; icon: React.ElementType; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/20 hover:bg-emerald-500/[0.04] sm:p-6"
    >
      <div className="flex items-start gap-4">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 0 : 1, scale: hovered ? 0.5 : 1 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center rounded-xl bg-red-500/10"
          >
            <X className="h-5 w-5 text-red-400" />
          </motion.div>
          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.5 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center rounded-xl bg-emerald-500/10"
          >
            <Check className="h-5 w-5 text-emerald-400" />
          </motion.div>
        </div>
        <p className="text-sm leading-relaxed text-white/70 transition-colors duration-300 group-hover:text-white/90 sm:text-base">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── PAGE ────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-[100vh] overflow-hidden">
        <HeroScene />
        <HeroTextReveal />
      </section>

      {/* ══════════ SOCIAL PROOF BAR ══════════ */}
      <SocialProofBar />

      {/* ══════════ PAIN POINTS ══════════ */}
      <section className="relative overflow-hidden bg-[#0a0a0f] py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.06] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Sound Familiar?"
            subtitle="Homeownership shouldn't feel like a second job."
            dark
          />
          <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4">
            {painPoints.map((point, i) => (
              <PainPointCard key={i} text={point.text} icon={point.icon} index={i} />
            ))}
          </div>
          <FadeIn delay={0.6}>
            <div className="mt-12 text-center sm:mt-16">
              <p className="text-xl font-semibold text-white sm:text-2xl">
                There&apos;s a better way.
              </p>
              <motion.div
                className="mx-auto mt-4 h-12 w-px bg-gradient-to-b from-white/30 to-transparent"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{ transformOrigin: "top" }}
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════ BENEFITS - BENTO GRID ══════════ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeader
          badge="Why My Home Plan"
          badgeColor="primary"
          title="Everything Handled. Nothing Forgotten."
          subtitle="One subscription replaces every contractor, quote, and phone call."
        />
        <div className="mt-10 sm:mt-14">
          <BentoGrid items={benefitsBento} />
        </div>
      </section>

      {/* ══════════ SERVICES MARQUEE ══════════ */}
      <section className="border-y bg-muted/20 py-10 sm:py-14">
        <FadeIn>
          <p className="mb-6 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground sm:mb-8">
            15+ Services Under One Roof
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
        <FadeIn delay={0.2}>
          <div className="mt-6 text-center sm:mt-8">
            <Button variant="outline" size="sm" asChild>
              <Link href="/plan-builder">
                See All Services & Pricing <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* ══════════ COST COMPARISON ══════════ */}
      <CostComparison />

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Simple Process"
            badgeColor="sky"
            title="How It Works"
            subtitle="Four steps. Then you never think about home maintenance again."
          />

          <StaggerContainer
            className="mx-auto mt-12 grid max-w-6xl gap-6 sm:mt-16 sm:gap-8 md:grid-cols-4"
            staggerDelay={0.12}
          >
            {steps.map((step, i) => (
              <StaggerItem key={step.step}>
                <div className="relative">
                  {i < steps.length - 1 && (
                    <div className="absolute left-1/2 top-12 hidden h-0.5 w-full md:block">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary/30 to-primary/10"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.2 }}
                        style={{ transformOrigin: "left" }}
                      />
                    </div>
                  )}
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      className="relative z-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 ring-4 ring-background sm:h-24 sm:w-24"
                      whileHover={{ scale: 1.08, rotate: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <step.icon className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
                      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground sm:h-7 sm:w-7 sm:text-xs">
                        {step.step}
                      </span>
                    </motion.div>
                    <h3 className="mt-5 text-lg font-semibold sm:mt-6 sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                      {step.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.4}>
            <div className="mt-10 text-center sm:mt-12">
              <Link href="/onboarding">
                <ShimmerButton className="h-12 w-full px-8 text-base sm:w-auto">
                  Build Your Plan <ArrowRight className="ml-2 inline h-4 w-4" />
                </ShimmerButton>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS - 3D CARDS ══════════ */}
      <section className="border-y bg-muted/20 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Real People, Real Results"
            badgeColor="amber"
            title="Homeowners Love My Home Plan"
            subtitle="Real homes. Real savings. Real relief."
          />
          <div className="mt-10 sm:mt-14">
            <Testimonials3D audience="homeowner" maxItems={3} />
          </div>
        </div>
      </section>

      {/* ══════════ GUARANTEES ══════════ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Our Promise"
            badgeColor="emerald"
            title="Our Guarantees"
            subtitle="We put our money where our mouth is."
          />
          <StaggerContainer
            className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
            staggerDelay={0.1}
          >
            {guarantees.map((g) => (
              <StaggerItem key={g.title}>
                <GlowCard glowColor="primary" className="h-full">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${g.bg}`}>
                    <g.icon className={`h-6 w-6 ${g.color}`} />
                  </div>
                  <h3 className="text-base font-bold sm:text-lg">{g.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {g.description}
                  </p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-700 py-16 text-primary-foreground sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <FadeIn>
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <FloatingElement amplitude={6} duration={4}>
              <Home className="mx-auto h-10 w-10 opacity-80 sm:h-12 sm:w-12" />
            </FloatingElement>
            <h2 className="mt-5 text-2xl font-bold tracking-tight sm:mt-6 sm:text-3xl md:text-4xl">
              Ready to Stop Managing and Start Living?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base opacity-90 sm:mt-4 sm:text-lg">
              Join hundreds of Okanagan homeowners who&apos;ve simplified their home maintenance.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 w-full px-8 text-base text-primary sm:w-auto"
                asChild
              >
                <Link href="/onboarding">
                  Build Your Plan <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full border-white/30 px-8 text-base text-white hover:bg-white/10 sm:w-auto"
                asChild
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm opacity-70">
              Starting at $89/month &middot; No contracts on monthly plans
            </p>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
