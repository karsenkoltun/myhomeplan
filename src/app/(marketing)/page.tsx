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
} from "@/components/ui/motion";
import { HeroScene } from "@/components/hero/hero-scene";
import { HeroTextReveal } from "@/components/hero/hero-text-reveal";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Clock,
  DollarSign,
  Star,
  Users,
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
  Building2,
  HardHat,
} from "lucide-react";

const stats = [
  { label: "Average Annual Savings", value: 2400, prefix: "$", suffix: "+", icon: DollarSign },
  { label: "Vetted Contractors", value: 100, suffix: "%", icon: Shield },
  { label: "Service Guarantee", value: 100, suffix: "%", icon: CheckCircle2 },
  { label: "Payment Within", display: "7 Days", icon: Clock },
];

const userPaths = [
  {
    title: "I'm a Homeowner",
    description: "One subscription for every home service. Set it and forget it.",
    icon: Home,
    href: "/homeowners",
    color: "primary" as const,
    accent: "bg-primary/10 text-primary",
  },
  {
    title: "I'm a Contractor",
    description: "Guaranteed booked jobs. Fair pay. Year-round work pipeline.",
    icon: HardHat,
    href: "/contractors",
    color: "sky" as const,
    accent: "bg-sky-500/10 text-sky-600",
  },
  {
    title: "I Manage a Strata",
    description: "Simplify building maintenance with one comprehensive plan.",
    icon: Building2,
    href: "/strata",
    color: "emerald" as const,
    accent: "bg-emerald-500/10 text-emerald-600",
  },
];

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
    title: "Pick Your Services",
    description: "Choose exactly what you need. Watch your monthly price build in real-time.",
    icon: Calendar,
  },
  {
    step: "03",
    title: "Subscribe & Relax",
    description: "One monthly payment. Schedule services anytime. We handle the rest.",
    icon: CreditCard,
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    location: "Kelowna, BC",
    quote: "I used to spend entire weekends coordinating lawn care, gutter cleaning, and furnace servicing. Now I just open the app and book. It's honestly life-changing.",
    rating: 5,
  },
  {
    name: "David R.",
    location: "Vernon, BC",
    quote: "As a contractor, I've never had such consistent work. No more slow winters. My Home Plan keeps my schedule full year-round.",
    rating: 5,
  },
  {
    name: "Michelle K.",
    location: "Penticton, BC",
    quote: "The savings are real. I calculated what I was paying before - this plan saves me over $200 a month AND the quality is better.",
    rating: 5,
  },
];

function ComparisonRow({ feature, us, them, index }: { feature: string; us: boolean | string; them: boolean | string; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.tr
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="border-b last:border-0"
    >
      <td className="p-3 font-medium sm:p-4">{feature}</td>
      <td className="p-3 text-center sm:p-4">
        {us === true ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", delay: index * 0.06 + 0.2 }}
          >
            <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
          </motion.div>
        ) : (
          <span className="text-muted-foreground">{us as string}</span>
        )}
      </td>
      <td className="p-3 text-center sm:p-4">
        {them === true ? (
          <CheckCircle2 className="mx-auto h-5 w-5 text-muted-foreground" />
        ) : them === false ? (
          <span className="text-muted-foreground/50">-</span>
        ) : (
          <span className="text-xs text-muted-foreground">{them as string}</span>
        )}
      </td>
    </motion.tr>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Full-Viewport Hero */}
      <section className="relative min-h-[100vh] overflow-hidden">
        <HeroScene />
        <HeroTextReveal />
      </section>

      {/* Three User Path Cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Who are you?
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              We built My Home Plan for everyone in the home services equation.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3" staggerDelay={0.12}>
          {userPaths.map((path) => (
            <StaggerItem key={path.title}>
              <Link href={path.href}>
                <GlowCard glowColor={path.color} className="h-full cursor-pointer">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${path.accent}`}>
                    <path.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold sm:text-xl">{path.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{path.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </div>
                </GlowCard>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Stats Bar */}
      <section className="border-y bg-gradient-to-r from-primary/[0.04] via-background to-primary/[0.04]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold sm:text-xl">
                      {"display" in stat ? (
                        stat.display
                      ) : (
                        <AnimatedCounter target={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix || ""} />
                      )}
                    </p>
                    <p className="text-[11px] leading-tight text-muted-foreground sm:text-sm">{stat.label}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Service Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Every Service Your Home Needs</h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">From lawn care to electrical - all managed under one subscription. Pick what you need, skip what you don&apos;t.</p>
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
              <Link href="/plan-builder">See All Services & Build Your Plan <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* How It Works */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">How It Works</h2>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">Three simple steps to never worry about home maintenance again.</p>
            </div>
          </FadeIn>

          <StaggerContainer className="mx-auto mt-12 grid max-w-5xl gap-6 sm:mt-16 sm:gap-8 md:grid-cols-3" staggerDelay={0.15}>
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
                      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground sm:h-7 sm:w-7 sm:text-xs">{step.step}</span>
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
                  Get Started Now <ArrowRight className="ml-2 inline h-4 w-4" />
                </ShimmerButton>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Trusted by Homeowners & Contractors</h2>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">See what people in the Okanagan are saying.</p>
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
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4">&ldquo;{t.quote}&rdquo;</p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary sm:h-10 sm:w-10">{t.name[0]}</div>
                        <div>
                          <p className="text-sm font-semibold">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.location}</p>
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

      {/* Comparison */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Why My Home Plan?</h2>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">Compare us to the old way of managing your home.</p>
            </div>
          </FadeIn>

          <div className="mx-auto mt-8 max-w-3xl overflow-x-auto sm:mt-12">
            <div className="min-w-[400px] overflow-hidden rounded-2xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium text-muted-foreground sm:p-4">Feature</th>
                    <th className="p-3 text-center font-semibold text-primary sm:p-4">My Home Plan</th>
                    <th className="p-3 text-center font-medium text-muted-foreground sm:p-4">DIY / Individual</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "One monthly payment", us: true, them: false },
                    { feature: "All services covered", us: true, them: false },
                    { feature: "Predictable pricing", us: true, them: false },
                    { feature: "Vetted & insured contractors", us: true, them: "Sometimes" },
                    { feature: "Online scheduling", us: true, them: "Rarely" },
                    { feature: "Quality guarantee", us: true, them: false },
                    { feature: "Year-round coverage", us: true, them: "You manage" },
                    { feature: "Save time", us: true, them: false },
                  ].map((row, i) => (
                    <ComparisonRow key={row.feature} feature={row.feature} us={row.us} them={row.them} index={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-700 py-16 text-primary-foreground sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <FadeIn>
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <FloatingElement amplitude={6} duration={4}>
              <Users className="mx-auto h-10 w-10 opacity-80 sm:h-12 sm:w-12" />
            </FloatingElement>
            <h2 className="mt-5 text-2xl font-bold tracking-tight sm:mt-6 sm:text-3xl md:text-4xl">Ready to Simplify Your Home Maintenance?</h2>
            <p className="mx-auto mt-3 max-w-xl text-base opacity-90 sm:mt-4 sm:text-lg">Join homeowners across the Okanagan who&apos;ve switched to one simple plan for all their home services.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <Button size="lg" variant="secondary" className="h-12 w-full px-8 text-base text-primary sm:w-auto" asChild>
                <Link href="/onboarding">Get Started Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 w-full border-white/30 px-8 text-base text-white hover:bg-white/10 sm:w-auto" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm opacity-70">Starting at $89/month - No contracts on monthly plans</p>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
