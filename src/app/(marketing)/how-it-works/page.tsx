"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FadeIn,
  SlideIn,
  StaggerContainer,
  StaggerItem,
  GlowCard,
  ShimmerButton,
  FloatingElement,
} from "@/components/ui/motion";
import { SectionHeader } from "@/components/marketing/section-header";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { Testimonials3D } from "@/components/marketing/testimonials-3d";
import { ScrollRoadmap } from "@/components/marketing/scroll-roadmap";
import { CostComparison } from "@/components/marketing/cost-comparison";
import {
  ArrowRight,
  Shield,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  Unlock,
  TrendingDown,
  Route,
  Handshake,
  Home,
} from "lucide-react";

const oldWay = [
  "Research contractors on Google",
  "Call around for quotes (and wait days)",
  "Compare prices and hope they're fair",
  "Schedule each service separately",
  "Chase contractors who don't show up",
  "Deal with surprise charges",
  "Repeat for every single service",
];

const newWay = [
  "Tell us about your home once",
  "We match you with vetted local pros",
  "One plan, one predictable price",
  "We schedule everything for you",
  "Guaranteed service, guaranteed quality",
  "No surprises, no hidden fees",
  "Everything handled, nothing forgotten",
];

const guarantees = [
  { icon: Clock, title: "Scheduling Guarantee", description: "Every service happens when planned. If we miss a window, your next service is free." },
  { icon: DollarSign, title: "Price Guarantee", description: "Your plan price is locked in. No surprise charges, no rate hikes." },
  { icon: Shield, title: "Quality Guarantee", description: "Not satisfied? We'll send another pro to make it right at no cost." },
  { icon: Unlock, title: "Flexibility Guarantee", description: "Upgrade, downgrade, add services, or cancel anytime. No lock-in." },
];

const savingsReasons = [
  { icon: TrendingDown, title: "Bulk Rates", description: "Volume pricing from our contractor network" },
  { icon: Route, title: "Route Efficiency", description: "Planned scheduling = less drive time = lower costs" },
  { icon: Handshake, title: "Steady Work", description: "Contractors get reliable income, you get reliable prices" },
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 sm:pb-12 sm:pt-20 lg:px-8">
        <SectionHeader
          badge="How It Works"
          badgeColor="primary"
          title="Managing Your Home Shouldn't Feel Like a Second Job"
          subtitle="We built My Home Plan so you never have to research, negotiate, schedule, or chase down a contractor again."
        />
      </section>

      {/* Social Proof */}
      <SocialProofBar />

      {/* Old Way vs New Way */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="There's a Better Way to Manage Your Home"
          />
          <div className="mt-10 grid gap-6 sm:mt-14 md:grid-cols-2 md:gap-8">
            <div className="rounded-2xl border border-red-200/60 bg-red-50/50 p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-2.5">
                <XCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-red-700">The Old Way</h3>
              </div>
              <ul className="space-y-3.5">
                {oldWay.map((item, i) => (
                  <SlideIn key={item} from="left" delay={i * 0.08}>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-200/70 text-xs text-red-600">
                        {i + 1}
                      </span>
                      <span className="text-sm text-red-800/80 sm:text-base">{item}</span>
                    </li>
                  </SlideIn>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <h3 className="text-lg font-semibold text-emerald-700">The My Home Plan Way</h3>
              </div>
              <ul className="space-y-3.5">
                {newWay.map((item, i) => (
                  <SlideIn key={item} from="right" delay={i * 0.08}>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200/70 text-xs text-emerald-600">
                        &#10003;
                      </span>
                      <span className="text-sm text-emerald-800/80 sm:text-base">{item}</span>
                    </li>
                  </SlideIn>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step Scroll Roadmap */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="The Process"
            badgeColor="sky"
            title="Your Plan in 6 Simple Steps"
            subtitle="From sign-up to sitting back - here's exactly what happens."
          />
          <ScrollRoadmap />
        </div>
      </section>

      {/* Guarantees */}
      <section className="border-y bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Our Promise"
            badgeColor="emerald"
            title="Backed by Real Guarantees"
            subtitle="Every membership is backed by real guarantees, not vague promises."
          />
          <StaggerContainer className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {guarantees.map((g) => (
              <StaggerItem key={g.title}>
                <GlowCard glowColor="emerald" className="h-full">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <g.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold sm:text-base">{g.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground sm:text-sm">{g.description}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Why We're Cheaper */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why Plan Members Pay Less"
            subtitle="Our model creates real savings for everyone involved."
          />
          <div className="mt-10">
            <CostComparison compact />
          </div>
          <StaggerContainer className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-3">
            {savingsReasons.map((r) => (
              <StaggerItem key={r.title}>
                <GlowCard className="h-full text-center" glowColor="emerald">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                    <r.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-semibold">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Real Stories"
            badgeColor="amber"
            title="What Homeowners Are Saying"
          />
          <div className="mt-10 sm:mt-14">
            <Testimonials3D audience="homeowner" maxItems={3} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-700 py-16 text-primary-foreground sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <FadeIn>
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <FloatingElement amplitude={6} duration={4}>
              <Home className="mx-auto h-10 w-10 opacity-80" />
            </FloatingElement>
            <h2 className="mt-5 text-2xl font-bold sm:text-3xl md:text-4xl">
              Ready to Simplify Your Home Maintenance?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground/90 sm:text-lg">
              Build your custom plan in under 5 minutes.
            </p>
            <div className="mt-8">
              <Link href="/onboarding">
                <ShimmerButton className="h-12 px-8 text-base">
                  Get Started <ArrowRight className="ml-2 inline h-4 w-4" />
                </ShimmerButton>
              </Link>
            </div>
            <p className="mt-4 text-xs opacity-70">No credit card required. Cancel anytime.</p>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
