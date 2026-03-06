"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  { label: "Average Annual Savings", value: "$2,400+", icon: DollarSign },
  { label: "Vetted Contractors", value: "100%", icon: Shield },
  { label: "Service Guarantee", value: "100%", icon: CheckCircle2 },
  { label: "Payment Within", value: "7 Days", icon: Clock },
];

const services = [
  { name: "Lawn Care", icon: Scissors, color: "text-emerald-600" },
  { name: "Snow Removal", icon: Snowflake, color: "text-blue-500" },
  { name: "HVAC", icon: Thermometer, color: "text-orange-500" },
  { name: "Cleaning", icon: Sparkles, color: "text-purple-500" },
  { name: "Pest Control", icon: Bug, color: "text-red-500" },
  { name: "Handyman", icon: Hammer, color: "text-amber-600" },
  { name: "Plumbing", icon: Wrench, color: "text-cyan-600" },
  { name: "Electrical", icon: Zap, color: "text-yellow-500" },
];

const steps = [
  {
    step: "01",
    title: "Tell Us About Your Home",
    description:
      "Enter your property details - size, lot, heating type. Takes 2 minutes.",
    icon: Home,
  },
  {
    step: "02",
    title: "Pick Your Services",
    description:
      "Choose exactly what you need. Watch your monthly price build in real-time.",
    icon: Calendar,
  },
  {
    step: "03",
    title: "Subscribe & Relax",
    description:
      "One monthly payment. Schedule services anytime. We handle the rest.",
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
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
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

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              All Your Home Services.
              <br />
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                One Monthly Plan.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Stop juggling 10 different contractors. Subscribe to one plan
              that covers lawn care, snow removal, HVAC, cleaning, and
              everything in between. Vetted pros. Guaranteed scheduling.
              Predictable pricing.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <Link href="/plan-builder">
                  Build Your Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base"
                asChild
              >
                <Link href="/how-it-works">See How It Works</Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Plans starting at $89/month - Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 text-center md:justify-center"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold sm:text-xl">{stat.value}</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Every Service Your Home Needs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From lawn care to electrical - all managed under one
            subscription. Pick what you need, skip what you don&apos;t.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
          {services.map((service) => (
            <Card
              key={service.name}
              className="group cursor-pointer border-border/50 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-primary/10">
                  <service.icon
                    className={`h-7 w-7 ${service.color} transition-transform group-hover:scale-110`}
                  />
                </div>
                <span className="text-sm font-semibold">{service.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/plan-builder">
              See All Services & Build Your Plan
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps to never worry about home maintenance again.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gradient-to-r from-primary/30 to-primary/10 md:block" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 ring-4 ring-background">
                    <step.icon className="h-10 w-10 text-primary" />
                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/plan-builder">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Two-Sided Platform */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <Card className="overflow-hidden border-primary/20">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
              <Badge className="mb-3 bg-primary/20 text-primary">
                For Homeowners
              </Badge>
              <h3 className="text-2xl font-bold">
                Stop Managing. Start Living.
              </h3>
              <p className="mt-2 text-muted-foreground">
                One subscription replaces 10+ contractor relationships.
              </p>
            </div>
            <CardContent className="p-6">
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
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full" asChild>
                <Link href="/plan-builder">Build Your Plan</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-blue-500/20">
            <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 p-6">
              <Badge className="mb-3 bg-blue-500/20 text-blue-600">
                For Contractors
              </Badge>
              <h3 className="text-2xl font-bold">
                Guaranteed Work. Fair Pay.
              </h3>
              <p className="mt-2 text-muted-foreground">
                Join our network and get a reliable pipeline of year-round
                jobs.
              </p>
            </div>
            <CardContent className="p-6">
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
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="mt-6 w-full border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
                asChild
              >
                <Link href="/contractors">
                  Join Our Network
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by Homeowners & Contractors
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what people in the Okanagan are saying.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card
                key={t.name}
                className="border-border/50 transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why My Home Plan?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Compare us to the old way of managing your home.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-medium text-muted-foreground">
                  Feature
                </th>
                <th className="p-4 text-center font-semibold text-primary">
                  My Home Plan
                </th>
                <th className="p-4 text-center font-medium text-muted-foreground">
                  DIY / Individual
                </th>
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
                  <td className="p-4 font-medium">{feature as string}</td>
                  <td className="p-4 text-center">
                    {us === true ? (
                      <CheckCircle2 className="mx-auto h-5 w-5 text-primary" />
                    ) : (
                      <span className="text-muted-foreground">
                        {us as string}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {them === true ? (
                      <CheckCircle2 className="mx-auto h-5 w-5 text-muted-foreground" />
                    ) : them === false ? (
                      <span className="text-muted-foreground/50">-</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {them as string}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-primary to-emerald-600 py-20 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Users className="h-12 w-12 opacity-80" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Simplify Your Home Maintenance?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg opacity-90">
            Join homeowners across the Okanagan who&apos;ve switched to one
            simple plan for all their home services.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-8 text-base text-primary"
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
              className="h-12 border-white/30 px-8 text-base text-white hover:bg-white/10"
              asChild
            >
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm opacity-70">
            Starting at $89/month - No contracts on monthly plans
          </p>
        </div>
      </section>
    </div>
  );
}
