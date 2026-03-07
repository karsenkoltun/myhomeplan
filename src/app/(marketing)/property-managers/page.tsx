"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  GlowCard,
  ShimmerButton,
  AnimatedCounter,
} from "@/components/ui/motion";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  DollarSign,
  FileText,
  Users,
  BarChart3,
  Phone,
  AlertTriangle,
  Receipt,
  Clock,
  Shield,
  Star,
  TrendingUp,
  Layers,
  ClipboardList,
  HeadphonesIcon,
} from "lucide-react";

const painPoints = [
  {
    icon: Receipt,
    title: "One Invoice Per Property, Per Vendor",
    description:
      "10 properties with 5 vendors each means 50 invoices to track every month. Good luck keeping that organized across your portfolio.",
  },
  {
    icon: Phone,
    title: "Tenant Complaint Whack-a-Mole",
    description:
      "Leaky faucet at building A, broken heater at building C, pest issue at building F - and every one needs a different contractor call.",
  },
  {
    icon: AlertTriangle,
    title: "Inconsistent Service Quality",
    description:
      "Different contractors at different properties means wildly different quality. One building gets great service, the next gets ghosted.",
  },
  {
    icon: Clock,
    title: "Scaling Is a Nightmare",
    description:
      "Every new property means re-sourcing vendors, negotiating rates, and setting up new accounts. Growing your portfolio shouldn't mean growing your headaches.",
  },
];

const benefits = [
  {
    icon: Layers,
    title: "Portfolio-Wide Consolidation",
    description:
      "Every property, every service, one platform. Manage your entire portfolio's maintenance from a single dashboard instead of dozens of vendor relationships.",
    color: "violet" as const,
  },
  {
    icon: FileText,
    title: "One Invoice, Every Property",
    description:
      "Consolidated monthly billing across your entire portfolio. One invoice, one payment, one line item for your accounting. No more vendor invoice chaos.",
    color: "violet" as const,
  },
  {
    icon: TrendingUp,
    title: "Reduce Tenant Complaints",
    description:
      "Proactive, scheduled maintenance prevents most issues before tenants even notice. Less reactive firefighting, more happy tenants and better retention.",
    color: "violet" as const,
  },
  {
    icon: BarChart3,
    title: "Transparent Reporting",
    description:
      "Real-time dashboards showing service status, spend, and completion rates across every property. Pull reports for owners in seconds, not hours.",
    color: "violet" as const,
  },
  {
    icon: DollarSign,
    title: "Volume Pricing at Scale",
    description:
      "The more properties you manage with us, the better your per-unit rate. Our network pricing beats what you'd negotiate property-by-property.",
    color: "violet" as const,
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Account Manager",
    description:
      "One point of contact who knows your portfolio inside and out. No call centers, no ticket queues - just a real person who picks up the phone.",
    color: "violet" as const,
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Tell us about your portfolio",
    description:
      "Number of properties, unit counts, property types, current maintenance setup. Takes about 15 minutes.",
  },
  {
    step: "02",
    title: "Get a custom portfolio plan",
    description:
      "We build a comprehensive maintenance plan across your entire portfolio with consolidated pricing.",
  },
  {
    step: "03",
    title: "Onboard your properties",
    description:
      "We handle contractor matching, scheduling setup, and access coordination for every property.",
  },
  {
    step: "04",
    title: "Manage from one dashboard",
    description:
      "Track services, view reports, manage billing, and handle requests across your entire portfolio.",
  },
];

const testimonials = [
  {
    name: "Rachel S.",
    role: "Property Manager, 28 units",
    quote:
      "I went from managing 6 different vendor relationships per property to one. My admin time dropped by about 60% in the first month.",
    rating: 5,
  },
  {
    name: "James & Partners",
    role: "PM Company, 120+ units",
    quote:
      "The consolidated billing alone saved us 15 hours a month in accounting. The quality improvement across our portfolio was the bonus we didn't expect.",
    rating: 5,
  },
  {
    name: "Lisa M.",
    role: "Property Manager, 45 units",
    quote:
      "Tenant maintenance complaints dropped 40% after switching. Proactive scheduling catches things before they become problems.",
    rating: 5,
  },
];

const faqs = [
  {
    q: "How does portfolio pricing work?",
    a: "Pricing is per-unit per month, based on property types, services selected, and total portfolio size. Larger portfolios get better per-unit rates. We provide a custom quote after understanding your specific needs.",
  },
  {
    q: "Can I add properties to my plan over time?",
    a: "Absolutely. Add new properties anytime. Your per-unit rate may actually decrease as your portfolio grows with us. We handle all onboarding for new properties.",
  },
  {
    q: "How do you handle different property types?",
    a: "We tailor services to each property type - residential, commercial, mixed-use. Each property gets a customized maintenance scope while you still get one consolidated bill.",
  },
  {
    q: "What reporting do property owners get?",
    a: "We provide detailed monthly reports showing services completed, costs, and upcoming schedules. You can pull these from your dashboard anytime or set up automatic owner reports.",
  },
  {
    q: "Is there a minimum portfolio size?",
    a: "We work with property managers of all sizes, from 5 units to 500+. However, our platform provides the most value at 10+ units where consolidation savings really add up.",
  },
  {
    q: "What area do you currently serve?",
    a: "We currently serve the Okanagan Valley including Kelowna, West Kelowna, Lake Country, Peachland, Penticton, Vernon, and surrounding areas. Expanding to more BC communities soon.",
  },
];

export default function PropertyManagersPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/[0.08] via-violet-500/[0.03] to-background" />
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-500/[0.06] blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <Badge className="mb-6 bg-violet-500/10 text-violet-600 hover:bg-violet-500/15">
              For Property Managers
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Simplify Maintenance Across{" "}
              <span className="bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
                Your Entire Portfolio.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
              Stop juggling dozens of vendors across multiple properties. My Home
              Plan consolidates every maintenance service into one platform with
              one invoice and one point of contact.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/onboarding?type=property-manager">
                <ShimmerButton className="h-12 bg-violet-600 px-8 text-base hover:bg-violet-700">
                  Get a Portfolio Quote{" "}
                  <ArrowRight className="ml-2 inline h-4 w-4" />
                </ShimmerButton>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full border-violet-500/30 text-violet-600 hover:bg-violet-50 sm:w-auto"
                onClick={() => {
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                How It Works
              </Button>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-6 sm:max-w-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-600 sm:text-3xl">
                  <AnimatedCounter target={60} />%
                </div>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Less Admin Time
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-600 sm:text-3xl">
                  1
                </div>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Invoice Per Month
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-600 sm:text-3xl">
                  <AnimatedCounter target={40} />%
                </div>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Fewer Complaints
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
              <Badge
                variant="outline"
                className="mb-4 border-red-300/50 text-red-500"
              >
                Sound Familiar?
              </Badge>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Portfolio maintenance doesn&apos;t have to be this hard
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Every property manager hits the same wall. More properties means
                more vendors, more invoices, and more fires to put out.
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
              <Badge className="mb-4 bg-violet-500/10 text-violet-600">
                The My Home Plan Difference
              </Badge>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Built for property managers who want to scale
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                One platform that grows with your portfolio. Less vendor
                management, more time for what actually grows your business.
              </p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <StaggerItem key={benefit.title}>
                <GlowCard glowColor={benefit.color} className="h-full">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                    <benefit.icon className="h-5 w-5 text-violet-600" />
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

      {/* How It Works */}
      <section
        id="how-it-works"
        className="border-y bg-muted/20 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              How portfolio plans work
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
              From first call to fully managed in four straightforward steps.
            </p>
          </FadeIn>
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            {howItWorks.map((s) => (
              <StaggerItem key={s.step}>
                <Card className="h-full border-border/50">
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                      {s.step}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">{s.title}</h3>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {s.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn>
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            What property managers are saying
          </h2>
        </FadeIn>
        <StaggerContainer className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <Card className="h-full border-border/50">
                <CardContent className="flex h-full flex-col p-5 sm:p-6">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4 border-t pt-3">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* FAQ */}
      <section className="border-y bg-muted/20 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Accordion type="single" collapsible className="mt-8 space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-xl border bg-card px-4"
                >
                  <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-violet-600 to-violet-800 py-16 text-white sm:py-24">
        <FadeIn>
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Building2 className="mx-auto h-10 w-10 opacity-80" />
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              Ready to simplify your portfolio maintenance?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed opacity-90 sm:text-lg">
              Tell us about your portfolio and get a custom plan with
              consolidated pricing. Most managers are fully onboarded within two
              weeks.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 h-12 px-8 text-base text-violet-700"
              asChild
            >
              <Link href="/onboarding?type=property-manager">
                Get a Portfolio Quote{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
