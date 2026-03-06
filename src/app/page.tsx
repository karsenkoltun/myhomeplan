"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
  ScaleOnHover,
} from "@/components/ui/motion";
import { motion } from "framer-motion";
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
} from "lucide-react";

const stats = [
  { label: "Average Annual Savings", value: 2400, prefix: "$", suffix: "+", icon: DollarSign },
  { label: "Vetted Contractors", value: 100, suffix: "%", icon: Shield },
  { label: "Service Guarantee", value: 100, suffix: "%", icon: CheckCircle2 },
  { label: "Payment Within", display: "7 Days", icon: Clock },
];

const services = [
  { name: "Lawn Care", icon: Scissors, color: "text-green-600", bg: "bg-green-50" },
  { name: "Snow Removal", icon: Snowflake, color: "text-sky-500", bg: "bg-sky-50" },
  { name: "HVAC", icon: Thermometer, color: "text-orange-500", bg: "bg-orange-50" },
  { name: "Cleaning", icon: Sparkles, color: "text-violet-500", bg: "bg-violet-50" },
  { name: "Pest Control", icon: Bug, color: "text-rose-500", bg: "bg-rose-50" },
  { name: "Handyman", icon: Hammer, color: "text-amber-600", bg: "bg-amber-50" },
  { name: "Plumbing", icon: Wrench, color: "text-cyan-600", bg: "bg-cyan-50" },
  { name: "Electrical", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50" },
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
    quote:
      "I used to spend entire weekends coordinating lawn care, gutter cleaning, and furnace servicing. Now I just open the app and book. It's honestly life-changing.",
    rating: 5,
  },
  {
    name: "David R.",
    location: "Vernon, BC",
    quote:
      "As a contractor, I've never had such consistent work. No more slow winters. My Home Plan keeps my schedule full year-round.",
    rating: 5,
  },
  {
    name: "Michelle K.",
    location: "Penticton, BC",
    quote:
      "The savings are real. I calculated what I was paying before - this plan saves me over $200 a month AND the quality is better.",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.12] via-transparent to-transparent" />
        {/* Animated blobs */}
        <motion.div
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/[0.06] blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-32 top-64 h-72 w-72 rounded-full bg-sky-400/[0.06] blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <FadeIn delay={0.1}>
              <Badge
                variant="secondary"
                className="mb-6 gap-1.5 border-primary/20 bg-primary/10 px-4 py-1.5 text-primary"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Now Serving the Okanagan Valley
              </Badge>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                All Your Home Services.
                <br />
                <span className="bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">
                  One Monthly Plan.
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.35}>
              <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
                Stop juggling 10 different contractors. Subscribe to one plan
                that covers lawn care, snow removal, HVAC, cleaning, and
                everything in between. Vetted pros. Guaranteed scheduling.
                Predictable pricing.
              </p>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
                <Button size="lg" className="h-12 w-full px-8 text-base sm:w-auto" asChild>
                  <Link href="/plan-builder">
                    Build Your Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-full px-8 text-base sm:w-auto"
                  asChild
                >
                  <Link href="/how-it-works">See How It Works</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Plans starting at $89/month - Cancel anytime
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y bg-muted/30">
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
                        <AnimatedCounter
                          target={stat.value}
                          prefix={stat.prefix || ""}
                          suffix={stat.suffix || ""}
                        />
                      )}
                    </p>
                    <p className="text-[11px] leading-tight text-muted-foreground sm:text-sm">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Every Service Your Home Needs
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              From lawn care to electrical - all managed under one
              subscription. Pick what you need, skip what you don&apos;t.
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
                See All Services & Build Your Plan
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* How It Works */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                How It Works
              </h2>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                Three simple steps to never worry about home maintenance again.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="mx-auto mt-12 grid max-w-5xl gap-6 sm:mt-16 sm:gap-8 md:grid-cols-3" staggerDelay={0.15}>
            {steps.map((step, i) => (
              <StaggerItem key={step.step}>
                <div className="relative">
                  {i < steps.length - 1 && (
                    <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gradient-to-r from-primary/30 to-primary/10 md:block" />
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
              <Button size="lg" className="h-12 w-full px-8 text-base sm:w-auto" asChild>
                <Link href="/plan-builder">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Two-Sided Platform */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          <FadeIn direction="left">
            <ScaleOnHover scale={1.01}>
              <Card className="h-full overflow-hidden border-primary/20">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-5 sm:p-6">
                  <Badge className="mb-3 bg-primary/20 text-primary">For Homeowners</Badge>
                  <h3 className="text-xl font-bold sm:text-2xl">Stop Managing. Start Living.</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    One subscription replaces 10+ contractor relationships.
                  </p>
                </div>
                <CardContent className="p-5 sm:p-6">
                  <ul className="space-y-3">
                    {[
                      "One monthly bill for all home services",
                      "Predictable pricing - no surprise charges",
                      "Every contractor is vetted and insured",
                      "Schedule everything from your phone",
                      "Quality guarantee on every service",
                      "Save 10-20% vs. hiring individually",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6 w-full" asChild>
                    <Link href="/plan-builder">Build Your Plan</Link>
                  </Button>
                </CardContent>
              </Card>
            </ScaleOnHover>
          </FadeIn>

          <FadeIn direction="right">
            <ScaleOnHover scale={1.01}>
              <Card className="h-full overflow-hidden border-sky-500/20">
                <div className="bg-gradient-to-r from-sky-500/10 to-sky-500/5 p-5 sm:p-6">
                  <Badge className="mb-3 bg-sky-500/20 text-sky-600">For Contractors</Badge>
                  <h3 className="text-xl font-bold sm:text-2xl">Guaranteed Work. Fair Pay.</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Join our network and get a reliable pipeline of year-round jobs.
                  </p>
                </div>
                <CardContent className="p-5 sm:p-6">
                  <ul className="space-y-3">
                    {[
                      "Guaranteed booked jobs - not just leads",
                      "Keep 70-80% of service value",
                      "Get paid within 7 days, always",
                      "Year-round work, even in slow seasons",
                      "No lead fees or advertising costs",
                      "Build your reputation with reviews",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-500 sm:h-5 sm:w-5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    className="mt-6 w-full border-sky-500/30 text-sky-600 hover:bg-sky-500/10"
                    asChild
                  >
                    <Link href="/contractors">
                      Join Our Network
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </ScaleOnHover>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Trusted by Homeowners & Contractors
              </h2>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                See what people in the Okanagan are saying.
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
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Why My Home Plan?
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Compare us to the old way of managing your home.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
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
                    ["One monthly payment", true, false],
                    ["All services covered", true, false],
                    ["Predictable pricing", true, false],
                    ["Vetted & insured contractors", true, "Sometimes"],
                    ["Online scheduling", true, "Rarely"],
                    ["Quality guarantee", true, false],
                    ["Year-round coverage", true, "You manage"],
                    ["Save time", true, false],
                  ].map(([feature, us, them]) => (
                    <tr key={feature as string} className="border-b last:border-0">
                      <td className="p-3 font-medium sm:p-4">{feature as string}</td>
                      <td className="p-3 text-center sm:p-4">
                        {us === true ? (
                          <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-primary to-blue-700 py-16 text-primary-foreground sm:py-20">
        <FadeIn>
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <motion.div
              className="flex justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Users className="h-10 w-10 opacity-80 sm:h-12 sm:w-12" />
            </motion.div>
            <h2 className="mt-5 text-2xl font-bold tracking-tight sm:mt-6 sm:text-3xl md:text-4xl">
              Ready to Simplify Your Home Maintenance?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base opacity-90 sm:mt-4 sm:text-lg">
              Join homeowners across the Okanagan who&apos;ve switched to one
              simple plan for all their home services.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 w-full px-8 text-base text-primary sm:w-auto"
                asChild
              >
                <Link href="/plan-builder">
                  Build Your Plan Now
                  <ArrowRight className="ml-2 h-4 w-4" />
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
