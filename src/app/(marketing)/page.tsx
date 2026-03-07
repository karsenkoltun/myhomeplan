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
  ChevronRight,
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
} from "lucide-react";

/* ─── DATA ────────────────────────────────────────────────────── */

const painPoints = [
  {
    text: "Searching for contractors on Google and hoping they're legit",
    icon: Search,
  },
  {
    text: "Getting 3 quotes for one simple job and none of them match",
    icon: Receipt,
  },
  {
    text: "Contractors who don't show up, don't call, don't care",
    icon: PhoneOff,
  },
  {
    text: "Juggling 8 different service providers with 8 different schedules",
    icon: CalendarX,
  },
  {
    text: "Surprise bills that are double what you were quoted",
    icon: DollarSign,
  },
  {
    text: "Spending your weekends doing maintenance instead of living",
    icon: Sofa,
  },
];

const benefits = [
  {
    title: "One Monthly Payment",
    description:
      "Every home service bundled into one predictable bill. No surprise costs, no invoicing chaos.",
    icon: CreditCard,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Vetted Local Pros",
    description:
      "Every contractor is licensed, insured, and background-checked. We only work with the best in the Okanagan.",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Guaranteed Scheduling",
    description:
      "We plan everything ahead. Services happen on time, every time. You never have to coordinate a thing.",
    icon: Calendar,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    title: "Real Savings",
    description:
      "Because you buy on a plan, we negotiate bulk rates. Save 20-40% compared to hiring contractors individually.",
    icon: DollarSign,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const costWithout = [
  { service: "Lawn Care (seasonal)", price: 960 },
  { service: "Snow Removal (seasonal)", price: 1200 },
  { service: "Gutter Cleaning (2x/year)", price: 400 },
  { service: "HVAC Maintenance", price: 350 },
  { service: "House Cleaning (bi-weekly)", price: 2400 },
  { service: "Pest Control (quarterly)", price: 480 },
  { service: "Handyman Visits (4x/year)", price: 600 },
  { service: "Plumbing Inspection", price: 250 },
];

const costWith = [
  { service: "Lawn Care (seasonal)", price: 552 },
  { service: "Snow Removal (seasonal)", price: 864 },
  { service: "Gutter Cleaning (2x/year)", price: 260 },
  { service: "HVAC Maintenance", price: 228 },
  { service: "House Cleaning (bi-weekly)", price: 1560 },
  { service: "Pest Control (quarterly)", price: 336 },
  { service: "Handyman Visits (4x/year)", price: 300 },
  { service: "Plumbing Inspection", price: 100 },
];

const totalWithout = costWithout.reduce((s, i) => s + i.price, 0);
const totalWith = costWith.reduce((s, i) => s + i.price, 0);
const totalSavings = totalWithout - totalWith;

const services = [
  { name: "Lawn Care", icon: Scissors, color: "text-green-600", bg: "bg-green-50", price: "From $46/mo" },
  { name: "Snow Removal", icon: Snowflake, color: "text-sky-500", bg: "bg-sky-50", price: "From $108/mo" },
  { name: "HVAC", icon: Thermometer, color: "text-orange-500", bg: "bg-orange-50", price: "From $24/mo" },
  { name: "Cleaning", icon: Sparkles, color: "text-violet-500", bg: "bg-violet-50", price: "From $195/mo" },
  { name: "Pest Control", icon: Bug, color: "text-rose-500", bg: "bg-rose-50", price: "From $45/mo" },
  { name: "Handyman", icon: Hammer, color: "text-amber-600", bg: "bg-amber-50", price: "From $28/mo" },
  { name: "Plumbing", icon: Wrench, color: "text-cyan-600", bg: "bg-cyan-50", price: "From $15/mo" },
  { name: "Electrical", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50", price: "From $14/mo" },
];

const steps = [
  {
    step: "01",
    title: "Tell Us About Your Home",
    description: "Enter your property details - size, lot, heating type. Takes 2 minutes.",
    icon: Home,
  },
  {
    step: "02",
    title: "Choose Your Services",
    description: "Pick exactly what you need. Watch your monthly price build in real-time.",
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
    description: "Spend your weekends living, not maintaining. That's the whole point.",
    icon: Heart,
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    label: "Busy Parent",
    location: "Kelowna, BC",
    quote:
      "Between the kids, work, and just life - I had zero time to deal with home maintenance. My Home Plan handles everything. I haven't called a contractor in 8 months and my house has never looked better.",
    rating: 5,
  },
  {
    name: "Greg & Linda T.",
    label: "Snowbirds",
    location: "Penticton, BC",
    quote:
      "We spend winters in Arizona. Before My Home Plan, we'd come back to a disaster every spring. Now snow removal, furnace checks, and inspections all happen automatically. Total peace of mind while we're away.",
    rating: 5,
  },
  {
    name: "Jordan K.",
    label: "First-Time Homeowner",
    location: "Vernon, BC",
    quote:
      "I had no idea how much maintenance a house needed until I bought one. My Home Plan was a lifesaver. They told me what I needed, scheduled it all, and I save over $200/month compared to doing it myself.",
    rating: 5,
  },
];

const guarantees = [
  {
    title: "Satisfaction Guarantee",
    description: "Not happy with a service? We'll redo it at no cost or credit your account. No questions asked.",
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Price Lock - No Surprise Fees",
    description: "Your monthly price is your monthly price. No hidden charges, no seasonal surcharges, no fine print.",
    icon: Lock,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Cancel Anytime",
    description: "No long-term contracts on monthly plans. Stay because it's working, not because you're locked in.",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Licensed & Insured Pros Only",
    description: "Every contractor on our platform is vetted, licensed, insured, and background-checked. Period.",
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
            animate={{
              opacity: hovered ? 0 : 1,
              scale: hovered ? 0.5 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center rounded-xl bg-red-500/10"
          >
            <X className="h-5 w-5 text-red-400" />
          </motion.div>
          <motion.div
            initial={false}
            animate={{
              opacity: hovered ? 1 : 0,
              scale: hovered ? 1 : 0.5,
            }}
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

/* ─── (AnimatedCounter from motion.tsx is used for savings) ──── */

/* ─── PAGE ────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* ──────────── Full-Viewport Hero ──────────── */}
      <section className="relative min-h-[100vh] overflow-hidden">
        <HeroScene />
        <HeroTextReveal />
      </section>

      {/* ──────────── Pain Points ──────────── */}
      <section className="relative overflow-hidden bg-[#0a0a0f] py-16 sm:py-24">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.06] via-transparent to-transparent" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                Sound Familiar?
              </h2>
              <p className="mt-3 text-base text-white/50 sm:text-lg">
                Homeownership shouldn&apos;t feel like a second job.
              </p>
            </div>
          </FadeIn>

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

      {/* ──────────── Solution / Benefits ──────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              My Home Plan: Everything Handled. Nothing Forgotten.
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              One subscription replaces every contractor, quote, and phone call.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4" staggerDelay={0.1}>
          {benefits.map((b) => (
            <StaggerItem key={b.title}>
              <ScaleOnHover scale={1.03}>
                <Card className="h-full border-border/50 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-5 sm:p-6">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${b.bg}`}>
                      <b.icon className={`h-6 w-6 ${b.color}`} />
                    </div>
                    <h3 className="text-lg font-bold">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
                  </CardContent>
                </Card>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ──────────── Cost Comparison ──────────── */}
      <section className="overflow-hidden border-y bg-muted/20 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                See How Much You Save
              </h2>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                Real numbers. Real services. Real savings for Okanagan homeowners.
              </p>
            </div>
          </FadeIn>

          <div className="mt-10 grid gap-6 sm:mt-14 md:grid-cols-2">
            {/* Without Plan */}
            <SlideIn from="left">
              <div className="overflow-hidden rounded-2xl border border-red-200/50 bg-red-50/30">
                <div className="border-b border-red-200/50 bg-red-50/50 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-2">
                    <X className="h-5 w-5 text-red-500" />
                    <h3 className="font-bold text-red-900">Without My Home Plan</h3>
                  </div>
                  <p className="mt-1 text-xs text-red-700/70">Typical annual cost hiring contractors individually</p>
                </div>
                <div className="divide-y divide-red-100/80 px-5 sm:px-6">
                  {costWithout.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-muted-foreground">{item.service}</span>
                      <span className="font-medium">${item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-red-200/50 bg-red-50/50 px-5 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-900">Total Per Year</span>
                    <span className="text-xl font-bold text-red-600">${totalWithout.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </SlideIn>

            {/* With Plan */}
            <SlideIn from="right">
              <div className="overflow-hidden rounded-2xl border border-emerald-200/50 bg-emerald-50/30">
                <div className="border-b border-emerald-200/50 bg-emerald-50/50 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-bold text-emerald-900">With My Home Plan</h3>
                  </div>
                  <p className="mt-1 text-xs text-emerald-700/70">Same services, plan pricing with bulk rates</p>
                </div>
                <div className="divide-y divide-emerald-100/80 px-5 sm:px-6">
                  {costWith.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-muted-foreground">{item.service}</span>
                      <span className="font-medium text-emerald-700">${item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-emerald-200/50 bg-emerald-50/50 px-5 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900">Total Per Year</span>
                    <span className="text-xl font-bold text-emerald-600">${totalWith.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </SlideIn>
          </div>

          {/* Big Savings Callout */}
          <FadeIn delay={0.3}>
            <div className="mt-10 text-center sm:mt-14">
              <div className="inline-flex flex-col items-center rounded-2xl border border-primary/20 bg-primary/5 px-8 py-6 sm:px-12 sm:py-8">
                <p className="text-sm font-medium uppercase tracking-widest text-primary">Annual Savings</p>
                <p className="mt-2 text-4xl font-bold text-primary sm:text-5xl md:text-6xl">
                  <AnimatedCounter target={totalSavings} prefix="$" suffix="/yr" duration={2} />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  That&apos;s over ${Math.round(totalSavings / 12)}/month back in your pocket
                </p>
              </div>
              <div className="mt-8">
                <Link href="/onboarding">
                  <ShimmerButton className="h-12 w-full px-8 text-base sm:w-auto">
                    Start Saving Today <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ──────────── How It Works ──────────── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">How It Works</h2>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                Four simple steps. That&apos;s it. Then you never think about home maintenance again.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="mx-auto mt-12 grid max-w-6xl gap-6 sm:mt-16 sm:gap-8 md:grid-cols-4" staggerDelay={0.12}>
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
                    <h3 className="mt-5 text-lg font-semibold sm:mt-6 sm:text-xl">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">{step.description}</p>
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

      {/* ──────────── Service Grid ──────────── */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Every Service Your Home Needs</h2>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                From lawn care to electrical - all managed under one subscription. Pick what you need, skip what you don&apos;t.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-4 sm:gap-4 lg:gap-6">
            {services.map((service) => (
              <StaggerItem key={service.name}>
                <ScaleOnHover>
                  <Card className="cursor-pointer border-border/50 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="flex flex-col items-center gap-2.5 p-4 text-center sm:gap-3 sm:p-6">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${service.bg} sm:h-14 sm:w-14`}>
                        <service.icon className={`h-6 w-6 ${service.color} sm:h-7 sm:w-7`} />
                      </div>
                      <span className="text-xs font-semibold sm:text-sm">{service.name}</span>
                      <span className="text-[10px] text-muted-foreground sm:text-xs">{service.price}</span>
                    </CardContent>
                  </Card>
                </ScaleOnHover>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.3}>
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/plan-builder">
                  See All Services & Build Your Plan <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ──────────── Testimonials ──────────── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Homeowners Love My Home Plan
              </h2>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                Real people. Real homes. Real relief.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <ScaleOnHover scale={1.02}>
                  <Card className="h-full border-border/50">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary sm:h-10 sm:w-10">
                          {t.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{t.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.label} - {t.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScaleOnHover>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ──────────── Trust / Guarantees ──────────── */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Our Guarantees
              </h2>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                We put our money where our mouth is. Every plan comes with these promises.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4" staggerDelay={0.1}>
            {guarantees.map((g) => (
              <StaggerItem key={g.title}>
                <GlowCard glowColor="primary" className="h-full">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${g.bg}`}>
                    <g.icon className={`h-6 w-6 ${g.color}`} />
                  </div>
                  <h3 className="text-base font-bold sm:text-lg">{g.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.description}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ──────────── Final CTA ──────────── */}
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
              Join hundreds of Okanagan homeowners who&apos;ve simplified their home maintenance. One plan. One payment. Everything handled.
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
              Starting at $89/month - No contracts on monthly plans
            </p>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
