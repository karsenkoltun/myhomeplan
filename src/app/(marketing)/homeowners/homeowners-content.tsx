"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
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
  FloatingElement,
} from "@/components/ui/motion";
import { FlowButton } from "@/components/ui/flow-button";
import { SectionHeader } from "@/components/marketing/section-header";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { BentoGrid } from "@/components/marketing/bento-grid";

// Lazy-load heavy below-fold component
const Testimonials3D = dynamic(
  () => import("@/components/marketing/testimonials-3d").then((mod) => ({ default: mod.Testimonials3D })),
  { ssr: false }
);
import {
  ArrowRight,
  DollarSign,
  Shield,
  CalendarCheck,
  Clock,
  Phone,
  AlertTriangle,
  ClipboardList,
  UserCheck,
  Receipt,
  Smile,
  Home,
} from "lucide-react";

const painPoints = [
  { icon: Phone, title: "Calling 10+ contractors for basic stuff", description: "Lawn guy, snow guy, HVAC tech, cleaner... you're basically running a project management firm." },
  { icon: DollarSign, title: "Surprise bills every single time", description: "Every contractor prices differently. You never know what you'll pay until the invoice shows up." },
  { icon: AlertTriangle, title: "No idea who to trust", description: "Some are great. Some ghost you after taking a deposit. You won't know which until it's too late." },
  { icon: Clock, title: "Scheduling is a part-time job", description: "Coordinating availability across multiple contractors eats hours of your week." },
];

const benefits = [
  { title: "Save 20-40% vs. Hiring Individually", description: "Bulk contractor rates mean you pay significantly less. Real savings, not marketing fluff.", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-500/10", span: "large" as const },
  { title: "One Subscription, Every Service", description: "Lawn care, snow removal, HVAC, cleaning, pest control, handyman - all under one payment.", icon: ClipboardList, color: "text-primary", bg: "bg-primary/10" },
  { title: "Vetted, Background-Checked Pros", description: "Every contractor is insured, licensed, and background-checked. No more quality roulette.", icon: UserCheck, color: "text-sky-500", bg: "bg-sky-500/10" },
  { title: "No Surprise Bills, Ever", description: "Your monthly price is locked in. No hidden fees, no scope creep, no awkward negotiations.", icon: Receipt, color: "text-amber-500", bg: "bg-amber-500/10" },
  { title: "Satisfaction Guaranteed", description: "Not happy? We send someone else at no extra cost. Period.", icon: Shield, color: "text-violet-500", bg: "bg-violet-500/10" },
  { title: "Book Anything From Your Dashboard", description: "Schedule any service in seconds. We handle the contractor coordination.", icon: CalendarCheck, color: "text-rose-500", bg: "bg-rose-500/10" },
];

const howItWorks = [
  { step: "01", title: "Tell us about your home", description: "Square footage, lot size, what services you need. Takes 2 minutes.", icon: Home },
  { step: "02", title: "Get your custom plan & price", description: "We calculate your exact price based on your property. No guessing.", icon: ClipboardList },
  { step: "03", title: "Subscribe & we handle everything", description: "One monthly payment. We match you with vetted, local contractors.", icon: CalendarCheck },
  { step: "04", title: "Book services anytime", description: "Need something done? Open your dashboard, pick a date, done.", icon: Smile },
];

const faqs = [
  { q: "What services are included?", a: "15+ home maintenance services including lawn care, snow removal, HVAC tune-ups, house cleaning, window washing, gutter cleaning, pest control, plumbing inspections, electrical checks, pressure washing, painting, and handyman services." },
  { q: "How does pricing work?", a: "Your price is calculated based on your specific property - home size, lot size, number of services, and frequency. No hidden fees. You see your exact monthly price before you subscribe." },
  { q: "What if I'm not satisfied?", a: "We guarantee quality. If you're not satisfied, we'll send a different contractor to redo it at no additional cost." },
  { q: "Is there a contract?", a: "No long-term contracts required. Cancel anytime. We offer monthly, quarterly (save 5%), and annual (save 15%) billing." },
];

export function HomeownersContent() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-background to-background" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-700">
              <DollarSign className="h-4 w-4" /> Save $1,500-3,000/year
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Stop Overpaying for{" "}
              <span className="animated-gradient-text">Home Maintenance</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
              One subscription covers every service your home needs. Vetted pros. Guaranteed quality. 20-40% less than hiring individually.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/onboarding?type=homeowner">
                <ShimmerButton className="h-12 w-full px-8 text-base sm:w-auto">
                  Get Your Plan in 2 Minutes <ArrowRight className="ml-2 inline h-4 w-4" />
                </ShimmerButton>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/plan-builder">See Pricing</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Social Proof */}
      <SocialProofBar />

      {/* Pain Points */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Sound Familiar?"
            subtitle="These are the exact problems we built My Home Plan to solve."
          />
          <StaggerContainer className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {painPoints.map((p) => (
              <StaggerItem key={p.title}>
                <GlowCard glowColor="primary" className="h-full">
                  <p.icon className="h-8 w-8 text-destructive/70" />
                  <h3 className="mt-3 text-sm font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-xs">{p.description}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Benefits - Bento Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeader
          badge="Why Switch"
          badgeColor="emerald"
          title="Why Homeowners Switch to My Home Plan"
          subtitle="Real benefits that save you time, money, and headaches."
        />
        <div className="mt-10 sm:mt-14">
          <BentoGrid items={benefits} />
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Simple Process"
            badgeColor="sky"
            title="How It Works"
            subtitle="From sign-up to stress-free in four simple steps."
          />
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            {howItWorks.map((s) => (
              <StaggerItem key={s.step}>
                <GlowCard glowColor="sky" className="flex h-full items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground sm:text-xs">{s.description}</p>
                  </div>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Real Stories"
            badgeColor="amber"
            title="What Homeowners Are Saying"
            subtitle="Real people, real savings, real relief."
          />
          <div className="mt-10 sm:mt-14">
            <Testimonials3D audience="homeowner" maxItems={4} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Frequently Asked Questions" />
          <FadeIn delay={0.1}>
            <Accordion type="single" collapsible className="mt-8 space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border bg-card px-4">
                  <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-700 py-16 text-primary-foreground sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <FadeIn>
          <div className="relative mx-auto max-w-3xl px-4 text-center">
            <FloatingElement amplitude={6} duration={4}>
              <Smile className="mx-auto h-10 w-10 opacity-80" />
            </FloatingElement>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              Ready to Simplify Your Home Maintenance?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed opacity-90 sm:text-lg">
              Tell us about your home and get a personalized plan in 2 minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <FlowButton text="Get Your Personalized Plan" href="/onboarding?type=homeowner" className="h-12 px-8 text-base border-white/30 text-white" />
              <Button variant="outline" size="lg" className="w-full border-white/30 text-white hover:bg-white/10 sm:w-auto" asChild>
                <Link href="/plan-builder">View Pricing</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm opacity-70">No commitment required</p>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
