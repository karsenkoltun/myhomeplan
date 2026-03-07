"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  ScaleOnHover,
  GlowCard,
  ShimmerButton,
  AnimatedCounter,
} from "@/components/ui/motion";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  Sparkles,
  Scissors,
  Snowflake,
  Waves,
  Droplets,
  Bug,
  Thermometer,
  Sun,
  Shield,
  DollarSign,
  Clock,
  Users,
  FileText,
  ArrowUpDown,
  Car,
  AlertTriangle,
  Receipt,
  MessageSquareWarning,
  ClipboardCheck,
  Handshake,
  TrendingDown,
  Timer,
  BadgePercent,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const painPoints = [
  {
    icon: Receipt,
    title: "Juggling 8+ Vendor Contracts",
    description:
      "Cleaning crew, landscaper, snow removal, pest control, gutter company, window washers, HVAC techs, pressure washers - each with their own contract, invoice, and schedule to track.",
  },
  {
    icon: AlertTriangle,
    title: "Surprise Maintenance Costs",
    description:
      "Emergency repairs, seasonal price hikes, and unexpected invoices blow up your operating budget every quarter. Owners lose trust when special assessments keep coming.",
  },
  {
    icon: MessageSquareWarning,
    title: "Council Meeting Arguments About Spending",
    description:
      "Hours wasted debating vendor quotes, comparing contractors, and defending maintenance decisions. Every meeting turns into a budgeting battleground.",
  },
  {
    icon: ClipboardCheck,
    title: "Compliance Tracking Nightmare",
    description:
      "Fire inspections, elevator certs, HVAC servicing, gutter maintenance - keeping track of what's due, what's overdue, and what's been completed is a full-time job nobody signed up for.",
  },
];

const benefits = [
  {
    icon: Handshake,
    title: "Single Vendor Simplicity",
    description:
      "One contract. One invoice. One point of contact for every building service. No more chasing down eight different companies.",
  },
  {
    icon: DollarSign,
    title: "Predictable Monthly Costs",
    description:
      "Fixed per-unit pricing means no budget surprises. Know exactly what maintenance will cost this month, next month, and next year.",
  },
  {
    icon: Timer,
    title: "Reduce Council Meeting Time",
    description:
      "Present one clear maintenance report instead of debating ten vendor quotes. Councils approve faster when everything is in one transparent plan.",
  },
  {
    icon: BadgePercent,
    title: "Volume Discounts Built In",
    description:
      "Our contractor network serves hundreds of buildings. You get bulk pricing that individual strata corps could never negotiate on their own.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Tracking Included",
    description:
      "We track every inspection, certification, and maintenance schedule for your building. Nothing falls through the cracks.",
  },
  {
    icon: PhoneCall,
    title: "Emergency Response Covered",
    description:
      "Burst pipe at 2 AM? We coordinate emergency contractors and notify your strata manager. No frantic phone calls to find someone available.",
  },
];

const strataServices = [
  {
    name: "Common Area Cleaning",
    icon: Sparkles,
    desc: "Lobbies, hallways, stairwells",
  },
  {
    name: "Grounds Maintenance",
    icon: Scissors,
    desc: "Landscaping and lawn care",
  },
  {
    name: "Snow & Ice Removal",
    icon: Snowflake,
    desc: "Parking lots, walkways, entrances",
  },
  {
    name: "Building Exterior Wash",
    icon: Waves,
    desc: "Pressure washing all surfaces",
  },
  {
    name: "Gutter Cleaning",
    icon: Droplets,
    desc: "All gutters and downspouts",
  },
  {
    name: "Parkade Maintenance",
    icon: Car,
    desc: "Sweeping, line painting, drains",
  },
  {
    name: "Common Area Windows",
    icon: Sun,
    desc: "Lobby and amenity windows",
  },
  { name: "Pest Control", icon: Bug, desc: "Building-wide prevention" },
  {
    name: "Common HVAC",
    icon: Thermometer,
    desc: "Shared heating/cooling systems",
  },
  {
    name: "Elevator Lobby Care",
    icon: ArrowUpDown,
    desc: "Daily lobby maintenance",
  },
];

const strataSteps = [
  {
    step: "01",
    title: "Tell us about your building",
    description:
      "Units, common areas, parking, amenities. We'll build a custom scope.",
  },
  {
    step: "02",
    title: "Select your services",
    description:
      "Choose which building maintenance services your strata needs.",
  },
  {
    step: "03",
    title: "Get your strata plan",
    description:
      "Receive a comprehensive maintenance plan with transparent per-unit pricing.",
  },
  {
    step: "04",
    title: "We handle everything",
    description:
      "Vetted contractors, scheduling, quality control - all managed for you.",
  },
];

const comparisons = [
  { feature: "Single point of contact", us: true, them: false },
  { feature: "Predictable monthly cost", us: true, them: false },
  { feature: "All services under one contract", us: true, them: false },
  { feature: "Quality guarantee", us: true, them: "Varies" },
  { feature: "Transparent pricing", us: true, them: "Rarely" },
  { feature: "Emergency coverage", us: true, them: "Extra cost" },
];

const pricingTiers = [
  {
    name: "Small Building",
    units: "4-20 units",
    price: "From $18",
    per: "/unit/mo",
    features: [
      "Common area cleaning",
      "Grounds maintenance",
      "Snow removal",
      "Gutter cleaning",
    ],
  },
  {
    name: "Mid-Size Building",
    units: "21-50 units",
    price: "From $15",
    per: "/unit/mo",
    features: [
      "Everything in Small",
      "Exterior wash",
      "Pest control",
      "Window cleaning",
      "Parkade maintenance",
    ],
    popular: true,
  },
  {
    name: "Large Complex",
    units: "50+ units",
    price: "Custom",
    per: "pricing",
    features: [
      "Full service package",
      "Dedicated account manager",
      "Emergency response",
      "Custom scheduling",
      "Volume discounts",
    ],
  },
];

const faqItems = [
  {
    q: "How does strata pricing work?",
    a: "Pricing is per-unit per month, based on the services selected and building size. Common areas and special features are factored into the per-unit rate.",
  },
  {
    q: "Can the strata council approve services?",
    a: "Yes. We provide detailed proposals that strata councils can review. Our plans are designed to be easy to present at council meetings.",
  },
  {
    q: "What's included in the contract?",
    a: "Everything is clearly outlined: service frequency, scope, pricing, and quality guarantees. No hidden fees or surprise charges.",
  },
  {
    q: "How do you handle emergencies?",
    a: "Mid-size and large building plans include emergency response. We coordinate emergency contractors and notify the strata manager.",
  },
  {
    q: "Can we customize the service frequency?",
    a: "Absolutely. Every strata building is different. We tailor the frequency and scope to your building's specific needs.",
  },
];

export default function StrataPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.08] via-emerald-500/[0.03] to-background" />
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <Badge className="mb-6 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15">
              For Strata Corporations
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              One Plan for Every{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                Building Service.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
              Stop juggling eight contractors, surprise invoices, and
              never-ending council debates. My Home Plan bundles every building
              maintenance service into one contract with predictable per-unit
              pricing.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/onboarding?type=strata">
                <ShimmerButton className="h-12 bg-emerald-600 px-8 text-base hover:bg-emerald-700">
                  Get Your Strata Quote{" "}
                  <ArrowRight className="ml-2 inline h-4 w-4" />
                </ShimmerButton>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 sm:w-auto"
                asChild
              >
                <Link href="#pricing">See Pricing</Link>
              </Button>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-6 sm:max-w-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 sm:text-3xl">
                  <AnimatedCounter target={200} />+
                </div>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Buildings Served
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 sm:text-3xl">
                  <AnimatedCounter target={35} />%
                </div>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Avg. Cost Savings
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 sm:text-3xl">
                  <AnimatedCounter target={10} />+
                </div>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Services Covered
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pain Points */}
      <section className="border-y bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <Badge variant="outline" className="mb-4 border-red-300/50 text-red-500">
                Sound Familiar?
              </Badge>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Strata maintenance shouldn&apos;t be this painful
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                If you&apos;re on a strata council, you know the drill. These
                headaches eat up your time, your budget, and your patience.
              </p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            {painPoints.map((point) => (
              <StaggerItem key={point.title}>
                <Card className="h-full border-red-200/30 bg-red-500/[0.02]">
                  <CardContent className="flex gap-4 p-5 sm:p-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                      <point.icon className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold sm:text-base">
                        {point.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {point.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-600">
                The My Home Plan Difference
              </Badge>
              <h2 className="text-2xl font-bold sm:text-3xl">
                What changes when you switch to one plan
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Replace the chaos with a single, streamlined maintenance
                partnership built specifically for strata corporations.
              </p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <StaggerItem key={benefit.title}>
                <GlowCard glowColor="emerald" className="h-full">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                    <benefit.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold sm:text-base">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {benefit.description}
                  </p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Services Grid */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              10 services, one contract
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
              Comprehensive building maintenance services tailored for strata
              corporations.
            </p>
          </FadeIn>
          <StaggerContainer className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {strataServices.map((s) => (
              <StaggerItem key={s.name}>
                <ScaleOnHover>
                  <Card className="h-full border-border/50">
                    <CardContent className="flex flex-col items-center p-4 text-center">
                      <s.icon className="h-7 w-7 text-emerald-600" />
                      <span className="mt-2 text-xs font-semibold sm:text-sm">
                        {s.name}
                      </span>
                      <span className="mt-1 text-[10px] text-muted-foreground">
                        {s.desc}
                      </span>
                    </CardContent>
                  </Card>
                </ScaleOnHover>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              How strata plans work
            </h2>
          </FadeIn>
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            {strataSteps.map((s) => (
              <StaggerItem key={s.step}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-5">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                      {s.step}
                    </span>
                    <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {s.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <FadeIn>
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            My Home Plan vs. managing individual contractors
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="mt-8 overflow-x-auto">
            <div className="min-w-[380px] overflow-hidden rounded-2xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left sm:p-4">Feature</th>
                    <th className="p-3 text-center font-semibold text-emerald-600 sm:p-4">
                      My Home Plan
                    </th>
                    <th className="p-3 text-center text-muted-foreground sm:p-4">
                      Individual Contractors
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row) => (
                    <tr key={row.feature} className="border-b last:border-0">
                      <td className="p-3 font-medium sm:p-4">{row.feature}</td>
                      <td className="p-3 text-center sm:p-4">
                        {row.us === true ? (
                          <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-600" />
                        ) : (
                          row.us
                        )}
                      </td>
                      <td className="p-3 text-center text-muted-foreground sm:p-4">
                        {row.them === false ? (
                          <span className="opacity-40">-</span>
                        ) : (
                          row.them
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

      {/* Pricing Tiers */}
      <section id="pricing" className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              Strata pricing tiers
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
              Transparent per-unit pricing. No hidden fees.
            </p>
          </FadeIn>
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <StaggerItem key={tier.name}>
                <Card
                  className={`h-full ${tier.popular ? "border-emerald-500 shadow-lg shadow-emerald-500/10" : "border-border/50"}`}
                >
                  {tier.popular && (
                    <div className="bg-emerald-600 px-4 py-1.5 text-center text-xs font-semibold text-white">
                      Most Popular
                    </div>
                  )}
                  <CardContent className="p-5 sm:p-6">
                    <p className="text-sm text-muted-foreground">
                      {tier.units}
                    </p>
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">{tier.per}</span>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {tier.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-xs sm:text-sm"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`mt-5 w-full ${tier.popular ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                      variant={tier.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/onboarding?type=strata">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <FadeIn>
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Strata FAQ
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <Accordion type="single" collapsible className="mt-8 space-y-2">
            {faqItems.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`strata-${i}`}
                className="rounded-xl border bg-card px-4"
              >
                <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 py-16 text-white sm:py-20">
        <FadeIn>
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Building2 className="mx-auto h-10 w-10 opacity-80" />
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
              Ready to simplify your building maintenance?
            </h2>
            <p className="mx-auto mt-3 max-w-xl opacity-90">
              Tell us about your strata corporation and get a custom maintenance
              plan with transparent pricing. Most councils approve within one
              meeting.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 h-12 px-8 text-base text-emerald-700"
              asChild
            >
              <Link href="/onboarding?type=strata">
                Get Your Strata Quote{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
