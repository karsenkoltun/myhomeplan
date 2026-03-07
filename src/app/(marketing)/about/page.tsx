"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  GlowCard,
  AnimatedCounter,
  ShimmerButton,
  FloatingElement,
} from "@/components/ui/motion";
import { SectionHeader } from "@/components/marketing/section-header";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { BentoGrid } from "@/components/marketing/bento-grid";
import {
  ArrowRight,
  Heart,
  Target,
  Lightbulb,
  Shield,
  MapPin,
  Mail,
  Home,
} from "lucide-react";

const values = [
  { icon: Heart, title: "Fair for Everyone", description: "Contractors deserve fair pay. Homeowners deserve fair prices. Our model ensures both sides win.", color: "text-rose-500", bg: "bg-rose-500/10" },
  { icon: Shield, title: "Trust & Transparency", description: "Every contractor is vetted. Every price is upfront. No hidden fees, no surprises.", color: "text-primary", bg: "bg-primary/10" },
  { icon: Target, title: "Quality Obsession", description: "We guarantee every service. If it's not right, we make it right.", color: "text-emerald-600", bg: "bg-emerald-500/10" },
  { icon: Lightbulb, title: "Simplicity First", description: "One plan, one payment, one place to manage everything.", color: "text-amber-500", bg: "bg-amber-500/10" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
        <SectionHeader
          badge="Our Story"
          badgeColor="primary"
          title="Making Home Maintenance Simple, Fair, and Reliable"
          subtitle="We started My Home Plan because we were tired of the same problem every homeowner faces: managing a dozen contractors, never knowing the real price, and hoping for the best."
        />
      </section>

      {/* Problem / Solution */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:gap-12 md:grid-cols-2">
            <FadeIn direction="left">
              <GlowCard glowColor="primary">
                <h2 className="text-xl font-bold sm:text-2xl">The Problem</h2>
                <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                  The average homeowner deals with 8-12 different service providers every year. Finding them is stressful. Pricing is unpredictable. Quality is inconsistent.
                </p>
                <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                  In Canada, there is no single platform that bundles home services into a simple subscription.
                </p>
              </GlowCard>
            </FadeIn>
            <FadeIn direction="right">
              <GlowCard glowColor="emerald">
                <h2 className="text-xl font-bold sm:text-2xl">Our Solution</h2>
                <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                  My Home Plan is the first Canadian platform to offer a complete home services subscription. One monthly payment covers everything through vetted, local contractors.
                </p>
                <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                  We&apos;re building a platform where homeowners get peace of mind and contractors get stability.
                </p>
              </GlowCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeader title="What We Stand For" />
        <div className="mt-8 sm:mt-10">
          <BentoGrid items={values} />
        </div>
      </section>

      {/* Numbers */}
      <SocialProofBar />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="The Okanagan Home Services Market" />
          <StaggerContainer className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:gap-6 md:grid-cols-4">
            {[
              { value: 200, suffix: "K+", label: "Households" },
              { prefix: "$", value: 580, suffix: "M", label: "Annual Spending" },
              { value: 0, display: "0", label: "Subscription Competitors" },
              { value: 0, display: "1st", label: "Of Its Kind in Canada" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <GlowCard glowColor="primary" className="text-center">
                  <p className="text-2xl font-bold text-primary sm:text-3xl">
                    {"display" in stat && stat.display
                      ? stat.display
                      : <AnimatedCounter target={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix || ""} />}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Get In Touch"
            subtitle="Questions? We'd love to hear from you."
          />
          <FadeIn delay={0.2}>
            <div className="mx-auto mt-6 grid max-w-lg gap-3 sm:mt-8 sm:gap-4">
              {[
                { icon: Mail, label: "Email", value: "hello@myhomeplan.ca", href: "mailto:hello@myhomeplan.ca" },
                { icon: MapPin, label: "Location", value: "Kelowna, BC, Canada", href: "#" },
              ].map((contact) => (
                <a key={contact.label} href={contact.href} className="flex items-center gap-3 rounded-xl border bg-card p-3.5 transition-all hover:shadow-md hover:border-primary/20 sm:gap-4 sm:p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
                    <contact.icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground sm:text-xs">{contact.label}</p>
                    <p className="text-sm font-medium">{contact.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </FadeIn>

          {/* CTA */}
          <FadeIn delay={0.3}>
            <div className="mt-8 text-center sm:mt-10">
              <Link href="/plan-builder">
                <ShimmerButton className="h-12 w-full px-8 text-base sm:w-auto">
                  Build Your Plan <ArrowRight className="ml-2 inline h-4 w-4" />
                </ShimmerButton>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
