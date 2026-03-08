"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
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
import { FlowButton } from "@/components/ui/flow-button";
import DisplayCards from "@/components/ui/display-cards";
import { SectionHeader } from "@/components/marketing/section-header";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";

// Lazy-load heavy below-fold components (3D transforms, GSAP scroll, charts)
const Testimonials3D = dynamic(
  () => import("@/components/marketing/testimonials-3d").then((mod) => ({ default: mod.Testimonials3D })),
  { ssr: false }
);
const ScrollRoadmap = dynamic(
  () => import("@/components/marketing/scroll-roadmap").then((mod) => ({ default: mod.ScrollRoadmap })),
  { ssr: false }
);
const CostComparison = dynamic(
  () => import("@/components/marketing/cost-comparison").then((mod) => ({ default: mod.CostComparison })),
  { ssr: false }
);
import {
  ArrowRight,
  Shield,
  Clock,
  ClipboardList,
  DollarSign,
  CheckCircle2,
  XCircle,
  Unlock,
  Users,
  Home,
} from "lucide-react";

const oldWay = [
  "Research contractors on Google",
  "Call around for quotes (and wait days)",
  "Schedule each service separately",
  "Chase contractors who don't show up",
  "Deal with surprise charges",
];

const newWay = [
  "Tell us about your home once",
  "One plan, one predictable price",
  "We schedule everything for you",
  "Guaranteed service, guaranteed quality",
  "Everything handled, nothing forgotten",
];

const guarantees = [
  { icon: Clock, title: "Scheduling Guarantee", description: "Every service happens when planned. If we miss a window, your next service is free." },
  { icon: DollarSign, title: "Price Guarantee", description: "Your plan price is locked in. No surprise charges, no rate hikes." },
  { icon: Shield, title: "Quality Guarantee", description: "Not satisfied? We'll send another pro to make it right at no cost." },
  { icon: Unlock, title: "Flexibility Guarantee", description: "Upgrade, downgrade, add services, or cancel anytime. No lock-in." },
];


export function HowItWorksContent() {
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

      {/* Process Preview - DisplayCards */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Three Steps to a Stress-Free Home
                </h2>
                <p className="mt-3 text-muted-foreground sm:text-lg">
                  Pick your services, we match you with vetted contractors, and your home stays maintained year-round.
                </p>
              </div>
              <div className="flex-1">
                <DisplayCards
                  cards={[
                    {
                      className:
                        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                      icon: <ClipboardList className="size-4 text-sky-300" />,
                      title: "Choose Services",
                      description: "Pick exactly what your home needs",
                      date: "Step 1",
                      iconClassName: "text-sky-500",
                      titleClassName: "text-sky-500",
                    },
                    {
                      className:
                        "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                      icon: <Users className="size-4 text-emerald-300" />,
                      title: "We Match Contractors",
                      description: "Vetted pros assigned to your home",
                      date: "Step 2",
                      iconClassName: "text-emerald-500",
                      titleClassName: "text-emerald-500",
                    },
                    {
                      className:
                        "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
                      icon: <CheckCircle2 className="size-4 text-violet-300" />,
                      title: "Home Maintained",
                      description: "Everything handled automatically",
                      date: "Ongoing",
                      iconClassName: "text-violet-500",
                      titleClassName: "text-violet-500",
                    },
                  ]}
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Social Proof */}
      <SocialProofBar />

      {/* Old Way vs New Way */}
      <section className="bg-muted/30 py-16 sm:py-20">
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
      <section className="py-16 sm:py-20">
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
      <section className="border-y bg-muted/30 py-16 sm:py-20">
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

      {/* Cost Comparison */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why Plan Members Pay Less"
            subtitle="Our model creates real savings for everyone involved."
          />
          <div className="mt-10">
            <CostComparison compact />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y bg-muted/30 py-16 sm:py-20">
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-700 py-16 text-primary-foreground sm:py-20">
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
            <div className="mt-8 flex justify-center">
              <FlowButton text="Get Started" href="/onboarding" className="h-12 px-10 text-base border-white/30 text-white" />
            </div>
            <p className="mt-4 text-xs opacity-70">No credit card required. Cancel anytime.</p>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
