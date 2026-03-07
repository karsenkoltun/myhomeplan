"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  GlowCard,
  ShimmerButton,
  AnimatedCounter,
  FloatingElement,
} from "@/components/ui/motion";
import { SectionHeader } from "@/components/marketing/section-header";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { Testimonials3D } from "@/components/marketing/testimonials-3d";
import { BentoGrid } from "@/components/marketing/bento-grid";
import {
  InfiniteMarquee,
  MarqueeServiceItem,
} from "@/components/marketing/infinite-marquee";
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
  ArrowUpDown,
  Car,
  AlertTriangle,
  Receipt,
  MessageSquareWarning,
  ClipboardCheck,
  Handshake,
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
      "Each vendor has their own contract, invoice, and schedule. Managing them all is a part-time job.",
  },
  {
    icon: AlertTriangle,
    title: "Surprise Maintenance Costs",
    description:
      "Emergency repairs and seasonal price hikes blow up your budget. Owners lose trust when special assessments keep coming.",
  },
  {
    icon: MessageSquareWarning,
    title: "Council Debates About Spending",
    description:
      "Hours wasted comparing contractor quotes and defending maintenance decisions at every meeting.",
  },
  {
    icon: ClipboardCheck,
    title: "Compliance Tracking Nightmare",
    description:
      "Fire inspections, elevator certs, HVAC servicing - tracking what's due and what's overdue is a full-time job.",
  },
];

const benefitsBento = [
  {
    icon: Handshake,
    title: "Single Vendor Simplicity",
    description: "One contract. One invoice. One point of contact for every building service.",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    span: "large" as const,
  },
  {
    icon: DollarSign,
    title: "Predictable Monthly Costs",
    description: "Fixed per-unit pricing means no budget surprises - this month, next month, or next year.",
    color: "text-sky-600",
    bg: "bg-sky-500/10",
  },
  {
    icon: Timer,
    title: "Reduce Council Meeting Time",
    description: "One clear maintenance report instead of debating ten vendor quotes.",
    color: "text-amber-600",
    bg: "bg-amber-500/10",
  },
  {
    icon: BadgePercent,
    title: "Volume Discounts Built In",
    description: "Our network serves hundreds of buildings. You get bulk pricing individual stratas can't negotiate.",
    color: "text-violet-600",
    bg: "bg-violet-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Tracking Included",
    description: "Every inspection, certification, and maintenance schedule tracked. Nothing falls through the cracks.",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  {
    icon: PhoneCall,
    title: "Emergency Response Covered",
    description: "Burst pipe at 2 AM? We coordinate emergency contractors and notify your strata manager.",
    color: "text-rose-600",
    bg: "bg-rose-500/10",
    span: "large" as const,
  },
];

const strataServices = [
  { name: "Common Area Cleaning", icon: Sparkles },
  { name: "Grounds Maintenance", icon: Scissors },
  { name: "Snow & Ice Removal", icon: Snowflake },
  { name: "Building Exterior Wash", icon: Waves },
  { name: "Gutter Cleaning", icon: Droplets },
  { name: "Parkade Maintenance", icon: Car },
  { name: "Common Area Windows", icon: Sun },
  { name: "Pest Control", icon: Bug },
  { name: "Common HVAC", icon: Thermometer },
  { name: "Elevator Lobby Care", icon: ArrowUpDown },
];

const strataSteps = [
  { step: "01", title: "Tell us about your building", description: "Units, common areas, parking, amenities. We'll build a custom scope." },
  { step: "02", title: "Select your services", description: "Choose which building maintenance services your strata needs." },
  { step: "03", title: "Get your strata plan", description: "A comprehensive maintenance plan with transparent per-unit pricing." },
  { step: "04", title: "We handle everything", description: "Vetted contractors, scheduling, quality control - all managed for you." },
];

const pricingTiers = [
  {
    name: "Small Building",
    units: "4-20 units",
    price: "From $18",
    per: "/unit/mo",
    features: ["Common area cleaning", "Grounds maintenance", "Snow removal", "Gutter cleaning"],
  },
  {
    name: "Mid-Size Building",
    units: "21-50 units",
    price: "From $15",
    per: "/unit/mo",
    popular: true,
    features: ["Everything in Small", "Exterior wash", "Pest control", "Window cleaning", "Parkade maintenance"],
  },
  {
    name: "Large Complex",
    units: "50+ units",
    price: "Custom",
    per: "pricing",
    features: ["Full service package", "Dedicated account manager", "Emergency response", "Volume discounts"],
  },
];

const faqItems = [
  { q: "How does strata pricing work?", a: "Pricing is per-unit per month, based on the services selected and building size. Common areas and special features are factored into the per-unit rate." },
  { q: "What's included in the contract?", a: "Everything is clearly outlined: service frequency, scope, pricing, and quality guarantees. No hidden fees or surprise charges." },
  { q: "How do you handle emergencies?", a: "Mid-size and large building plans include emergency response. We coordinate emergency contractors and notify the strata manager." },
];

const guarantees = [
  { icon: Shield, title: "Quality Guarantee", description: "If any service doesn't meet your standards, we'll re-do it at no cost. Period." },
  { icon: DollarSign, title: "Price Lock Guarantee", description: "Your per-unit rate is locked for the full contract term. No surprise increases." },
  { icon: Clock, title: "Response Time Guarantee", description: "Emergency requests acknowledged within 30 minutes. Routine requests within 24 hours." },
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
                <ShimmerButton className="h-12 w-full bg-emerald-600 px-8 text-base hover:bg-emerald-700 sm:w-auto">
                  Get Your Strata Quote <ArrowRight className="ml-2 inline h-4 w-4" />
                </ShimmerButton>
              </Link>
              <Button variant="outline" size="lg" className="w-full border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 sm:w-auto" asChild>
                <Link href="#pricing">See Pricing</Link>
              </Button>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-6 sm:max-w-xl">
              {[
                { target: 200, suffix: "+", label: "Buildings Served" },
                { target: 35, suffix: "%", label: "Avg. Cost Savings" },
                { target: 10, suffix: "+", label: "Services Covered" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 sm:text-3xl">
                    <AnimatedCounter target={stat.target} />{stat.suffix}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <SocialProofBar />

      {/* Pain Points */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Sound Familiar?"
            badgeColor="rose"
            title="Strata maintenance shouldn't be this painful"
            subtitle="If you're on a strata council, you know the drill. These headaches eat up your time, your budget, and your patience."
          />
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            {painPoints.map((point) => (
              <StaggerItem key={point.title}>
                <Card className="h-full border-red-200/30 bg-red-500/[0.02] transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 hover:border-red-300/50">
                  <CardContent className="flex gap-4 p-5 sm:p-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                      <point.icon className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold sm:text-base">{point.title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">{point.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="The My Home Plan Difference"
            badgeColor="emerald"
            title="What changes when you switch to one plan"
            subtitle="Replace the chaos with a single, streamlined maintenance partnership built for strata corporations."
          />
          <div className="mt-10 sm:mt-12">
            <BentoGrid items={benefitsBento} />
          </div>
        </div>
      </section>

      {/* Services Marquee */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Comprehensive Coverage"
            badgeColor="emerald"
            title="10 services, one contract"
            subtitle="Comprehensive building maintenance tailored for strata corporations."
          />
          <div className="mt-10 sm:mt-12">
            <InfiniteMarquee speed={35}>
              {strataServices.map((s) => (
                <MarqueeServiceItem key={s.name} icon={s.icon} label={s.name} color="text-emerald-600" />
              ))}
            </InfiniteMarquee>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Simple Process"
            badgeColor="emerald"
            title="How strata plans work"
            subtitle="From first contact to full coverage in four straightforward steps."
          />
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            {strataSteps.map((s) => (
              <StaggerItem key={s.step}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-5">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                      {s.step}
                    </span>
                    <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground">{s.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Trusted by Strata Councils"
            badgeColor="emerald"
            title="What strata corporations are saying"
            subtitle="Councils across BC are simplifying their building maintenance with My Home Plan."
          />
          <div className="mt-10 sm:mt-12">
            <Testimonials3D audience="strata" maxItems={3} />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Transparent Pricing"
            badgeColor="emerald"
            title="Strata pricing tiers"
            subtitle="Transparent per-unit pricing. No hidden fees."
          />
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <StaggerItem key={tier.name}>
                <Card className={`h-full ${tier.popular ? "border-emerald-500 shadow-lg shadow-emerald-500/10" : "border-border/50"}`}>
                  {tier.popular && (
                    <div className="bg-emerald-600 px-4 py-1.5 text-center text-xs font-semibold text-white">Most Popular</div>
                  )}
                  <CardContent className="p-5 sm:p-6">
                    <p className="text-sm text-muted-foreground">{tier.units}</p>
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">{tier.per}</span>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs sm:text-sm">
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

      {/* Guarantees */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Our Promises" badgeColor="emerald" title="Guarantees built into every strata plan" />
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-6">
            {guarantees.map((g) => (
              <StaggerItem key={g.title}>
                <GlowCard glowColor="emerald" className="h-full text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                    <g.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold sm:text-base">{g.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{g.description}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="Questions?" badgeColor="emerald" title="Strata FAQ" />
          <FadeIn delay={0.1}>
            <Accordion type="single" collapsible className="mt-8 space-y-2">
              {faqItems.map((faq, i) => (
                <AccordionItem key={i} value={`strata-${i}`} className="rounded-xl border bg-card px-4">
                  <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-700 py-16 text-primary-foreground sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <FloatingElement amplitude={8} duration={5}>
            <Building2 className="mx-auto h-12 w-12 opacity-80" />
          </FloatingElement>
          <FadeIn>
            <h2 className="mt-6 text-2xl font-bold sm:text-3xl md:text-4xl">
              Ready to simplify your building maintenance?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base opacity-90 sm:text-lg">
              Get a custom maintenance plan with transparent pricing.
              Most councils approve within one meeting.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/onboarding?type=strata">
                <ShimmerButton className="h-12 w-full bg-white/20 px-8 text-base hover:bg-white/30 sm:w-auto">
                  Get Your Strata Quote <ArrowRight className="ml-2 inline h-4 w-4" />
                </ShimmerButton>
              </Link>
              <Button size="lg" variant="secondary" className="h-12 w-full px-8 text-base text-primary sm:w-auto" asChild>
                <Link href="#pricing">View Pricing Tiers</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
