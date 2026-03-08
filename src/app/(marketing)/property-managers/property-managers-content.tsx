"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/components/ui/faq-tabs";
import { SectionHeader } from "@/components/marketing/section-header";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { BentoGrid } from "@/components/marketing/bento-grid";

// Lazy-load heavy below-fold component
const Testimonials3D = dynamic(
  () => import("@/components/marketing/testimonials-3d").then((mod) => ({ default: mod.Testimonials3D })),
  { ssr: false }
);
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  GlowCard,
  ShimmerButton,
  AnimatedCounter,
  FloatingElement,
} from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Building2,
  DollarSign,
  FileText,
  BarChart3,
  Receipt,
  Phone,
  AlertTriangle,
  Clock,
  TrendingUp,
  Layers,
  HeadphonesIcon,
  Sparkles,
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

const benefitsBento = [
  {
    icon: Layers,
    title: "Portfolio-Wide Consolidation",
    description:
      "Every property, every service, one platform. Manage your entire portfolio's maintenance from a single dashboard instead of dozens of vendor relationships.",
    color: "text-violet-600",
    bg: "bg-violet-500/10",
    span: "large" as const,
  },
  {
    icon: FileText,
    title: "One Invoice, Every Property",
    description:
      "Consolidated monthly billing across your entire portfolio. One invoice, one payment, one line item for your accounting. No more vendor invoice chaos.",
    color: "text-violet-600",
    bg: "bg-violet-500/10",
  },
  {
    icon: TrendingUp,
    title: "Reduce Tenant Complaints",
    description:
      "Proactive, scheduled maintenance prevents most issues before tenants even notice. Less reactive firefighting, more happy tenants and better retention.",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Transparent Reporting",
    description:
      "Real-time dashboards showing service status, spend, and completion rates across every property. Pull reports for owners in seconds, not hours.",
    color: "text-sky-600",
    bg: "bg-sky-500/10",
  },
  {
    icon: DollarSign,
    title: "Volume Pricing at Scale",
    description:
      "The more properties you manage with us, the better your per-unit rate. Our network pricing beats what you'd negotiate property-by-property.",
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    span: "large" as const,
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Account Manager",
    description:
      "One point of contact who knows your portfolio inside and out. No call centers, no ticket queues - just a real person who picks up the phone.",
    color: "text-rose-600",
    bg: "bg-rose-500/10",
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

const faqCategories = { general: "General" };
const faqData = {
  general: [
    {
      question: "How does portfolio pricing work?",
      answer: "Pricing is per-unit per month, based on property types, services selected, and total portfolio size. Larger portfolios get better per-unit rates. We provide a custom quote after understanding your specific needs.",
    },
    {
      question: "Can I add properties to my plan over time?",
      answer: "Absolutely. Add new properties anytime. Your per-unit rate may actually decrease as your portfolio grows with us. We handle all onboarding for new properties.",
    },
    {
      question: "How do you handle different property types?",
      answer: "We tailor services to each property type - residential, commercial, mixed-use. Each property gets a customized maintenance scope while you still get one consolidated bill.",
    },
    {
      question: "What reporting do property owners get?",
      answer: "We provide detailed monthly reports showing services completed, costs, and upcoming schedules. You can pull these from your dashboard anytime or set up automatic owner reports.",
    },
  ],
};

export function PropertyManagersContent() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/[0.08] via-violet-500/[0.03] to-background" />
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-500/[0.06] blur-3xl" />
        <div className="absolute right-0 top-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-violet-400/[0.04] blur-3xl" />
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
                <ShimmerButton className="h-12 w-full bg-violet-600 px-8 text-base hover:bg-violet-700 sm:w-auto">
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

      {/* Social Proof Bar */}
      <SocialProofBar />

      {/* Pain Points */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Sound Familiar?"
            badgeColor="rose"
            title="Portfolio maintenance doesn't have to be this hard"
            subtitle="Every property manager hits the same wall. More properties means more vendors, more invoices, and more fires to put out."
          />
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            {painPoints.map((point) => (
              <StaggerItem key={point.title}>
                <GlowCard glowColor="violet" className="h-full">
                  <div className="flex gap-4">
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
                  </div>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Benefits - BentoGrid */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="The My Home Plan Difference"
            badgeColor="violet"
            title="Built for property managers who want to scale"
            subtitle="One platform that grows with your portfolio. Less vendor management, more time for what actually grows your business."
          />
          <div className="mt-10 sm:mt-12">
            <BentoGrid items={benefitsBento} />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Simple Process"
            badgeColor="violet"
            title="How portfolio plans work"
            subtitle="From first call to fully managed in four straightforward steps."
          />
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            {howItWorks.map((s) => (
              <StaggerItem key={s.step}>
                <GlowCard glowColor="violet" className="h-full">
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                      {s.step}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold sm:text-base">
                        {s.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials - 3D Cards */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Real Results"
            badgeColor="amber"
            title="What property managers are saying"
            subtitle="Don't take our word for it. Here's what PMs across the Okanagan are experiencing."
          />
          <div className="mt-10 sm:mt-12">
            <Testimonials3D audience="pm" maxItems={3} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="FAQ"
            badgeColor="sky"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about managing your portfolio with My Home Plan."
          />
          <FAQ
            title=""
            subtitle=""
            categories={faqCategories}
            faqData={faqData}
            className="w-full py-0"
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-700 py-16 text-primary-foreground sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <FadeIn>
          <div className="relative mx-auto max-w-3xl px-4 text-center">
            <FloatingElement amplitude={6} duration={5}>
              <Building2 className="mx-auto h-12 w-12 opacity-80" />
            </FloatingElement>
            <h2 className="mt-6 text-2xl font-bold sm:text-3xl md:text-4xl">
              Ready to simplify your portfolio maintenance?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Tell us about your portfolio and get a custom plan with
              consolidated pricing. Most managers are fully onboarded within two
              weeks.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-8 text-base text-violet-700"
                asChild
              >
                <Link href="/onboarding?type=property-manager">
                  Get a Portfolio Quote{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/30 bg-transparent px-8 text-base text-white hover:bg-white/10"
                asChild
              >
                <Link href="/contact">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Talk to Our Team
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
