"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover, ShimmerButton, AnimatedCounter } from "@/components/ui/motion";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Building2, Sparkles, Scissors, Snowflake,
  Waves, Droplets, Bug, Thermometer, Sun, Shield, DollarSign, Clock,
  Users, FileText, ArrowUpDown, Car,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const strataServices = [
  { name: "Common Area Cleaning", icon: Sparkles, desc: "Lobbies, hallways, stairwells" },
  { name: "Grounds Maintenance", icon: Scissors, desc: "Landscaping and lawn care" },
  { name: "Snow & Ice Removal", icon: Snowflake, desc: "Parking lots, walkways, entrances" },
  { name: "Building Exterior Wash", icon: Waves, desc: "Pressure washing all surfaces" },
  { name: "Gutter Cleaning", icon: Droplets, desc: "All gutters and downspouts" },
  { name: "Parkade Maintenance", icon: Car, desc: "Sweeping, line painting, drains" },
  { name: "Common Area Windows", icon: Sun, desc: "Lobby and amenity windows" },
  { name: "Pest Control", icon: Bug, desc: "Building-wide prevention" },
  { name: "Common HVAC", icon: Thermometer, desc: "Shared heating/cooling systems" },
  { name: "Elevator Lobby Care", icon: ArrowUpDown, desc: "Daily lobby maintenance" },
];

const strataSteps = [
  { step: "01", title: "Tell us about your building", description: "Units, common areas, parking, amenities. We'll build a custom scope." },
  { step: "02", title: "Select your services", description: "Choose which building maintenance services your strata needs." },
  { step: "03", title: "Get your strata plan", description: "Receive a comprehensive maintenance plan with transparent per-unit pricing." },
  { step: "04", title: "We handle everything", description: "Vetted contractors, scheduling, quality control - all managed for you." },
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
  { name: "Small Building", units: "4-20 units", price: "From $18", per: "/unit/mo", features: ["Common area cleaning", "Grounds maintenance", "Snow removal", "Gutter cleaning"] },
  { name: "Mid-Size Building", units: "21-50 units", price: "From $15", per: "/unit/mo", features: ["Everything in Small", "Exterior wash", "Pest control", "Window cleaning", "Parkade maintenance"], popular: true },
  { name: "Large Complex", units: "50+ units", price: "Custom", per: "pricing", features: ["Full service package", "Dedicated account manager", "Emergency response", "Custom scheduling", "Volume discounts"] },
];

const faqItems = [
  { q: "How does strata pricing work?", a: "Pricing is per-unit per month, based on the services selected and building size. Common areas and special features are factored into the per-unit rate." },
  { q: "Can the strata council approve services?", a: "Yes. We provide detailed proposals that strata councils can review. Our plans are designed to be easy to present at council meetings." },
  { q: "What's included in the contract?", a: "Everything is clearly outlined: service frequency, scope, pricing, and quality guarantees. No hidden fees or surprise charges." },
  { q: "How do you handle emergencies?", a: "Mid-size and large building plans include emergency response. We coordinate emergency contractors and notify the strata manager." },
  { q: "Can we customize the service frequency?", a: "Absolutely. Every strata building is different. We tailor the frequency and scope to your building's specific needs." },
];

export default function StrataPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.06] via-background to-background" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <Badge className="mb-6 bg-emerald-500/10 text-emerald-600">For Strata Corporations</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Simplify <span className="text-emerald-600">Strata Maintenance.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
              One plan. One invoice. Every building service. Stop managing multiple contractors and surprise invoices. We handle all your building maintenance with vetted professionals and transparent pricing.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/onboarding?type=strata">
                <ShimmerButton className="h-12 bg-emerald-600 px-8 text-base hover:bg-emerald-700">
                  Get a Strata Quote <ArrowRight className="ml-2 inline h-4 w-4" />
                </ShimmerButton>
              </Link>
              <Button variant="outline" size="lg" className="w-full border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 sm:w-auto" asChild>
                <Link href="#pricing">See Pricing</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <FadeIn>
          <h2 className="text-center text-2xl font-bold sm:text-3xl">What we cover</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">Comprehensive building maintenance services tailored for strata corporations.</p>
        </FadeIn>
        <StaggerContainer className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {strataServices.map((s) => (
            <StaggerItem key={s.name}>
              <ScaleOnHover>
                <Card className="h-full border-border/50">
                  <CardContent className="flex flex-col items-center p-4 text-center">
                    <s.icon className="h-7 w-7 text-emerald-600" />
                    <span className="mt-2 text-xs font-semibold sm:text-sm">{s.name}</span>
                    <span className="mt-1 text-[10px] text-muted-foreground">{s.desc}</span>
                  </CardContent>
                </Card>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* How It Works */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn><h2 className="text-center text-2xl font-bold sm:text-3xl">How strata plans work</h2></FadeIn>
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            {strataSteps.map((s) => (
              <StaggerItem key={s.step}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-5">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">{s.step}</span>
                    <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground">{s.description}</p>
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
          <h2 className="text-center text-2xl font-bold sm:text-3xl">My Home Plan vs. managing individual contractors</h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="mt-8 overflow-x-auto">
            <div className="min-w-[380px] overflow-hidden rounded-2xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left sm:p-4">Feature</th>
                    <th className="p-3 text-center font-semibold text-emerald-600 sm:p-4">My Home Plan</th>
                    <th className="p-3 text-center text-muted-foreground sm:p-4">Individual Contractors</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row) => (
                    <tr key={row.feature} className="border-b last:border-0">
                      <td className="p-3 font-medium sm:p-4">{row.feature}</td>
                      <td className="p-3 text-center sm:p-4">{row.us === true ? <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-600" /> : row.us}</td>
                      <td className="p-3 text-center text-muted-foreground sm:p-4">{row.them === false ? <span className="opacity-40">-</span> : row.them}</td>
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
            <h2 className="text-center text-2xl font-bold sm:text-3xl">Strata pricing tiers</h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">Transparent per-unit pricing. No hidden fees.</p>
          </FadeIn>
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <StaggerItem key={tier.name}>
                <Card className={`h-full ${tier.popular ? "border-emerald-500 shadow-lg shadow-emerald-500/10" : "border-border/50"}`}>
                  {tier.popular && <div className="bg-emerald-600 px-4 py-1.5 text-center text-xs font-semibold text-white">Most Popular</div>}
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
                    <Button className={`mt-5 w-full ${tier.popular ? "bg-emerald-600 hover:bg-emerald-700" : ""}`} variant={tier.popular ? "default" : "outline"} asChild>
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
        <FadeIn><h2 className="text-center text-2xl font-bold sm:text-3xl">Strata FAQ</h2></FadeIn>
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
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 py-16 text-white sm:py-20">
        <FadeIn>
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Building2 className="mx-auto h-10 w-10 opacity-80" />
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Ready to simplify your building maintenance?</h2>
            <p className="mx-auto mt-3 max-w-xl opacity-90">Tell us about your strata corporation and get a custom maintenance plan with transparent pricing.</p>
            <Button size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base text-emerald-700" asChild>
              <Link href="/onboarding?type=strata">Get Your Strata Quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
