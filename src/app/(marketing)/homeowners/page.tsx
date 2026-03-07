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
} from "@/components/ui/motion";
import { CostComparison } from "@/components/marketing/cost-comparison";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Shield,
  CalendarCheck,
  Clock,
  Phone,
  AlertTriangle,
  Star,
  ClipboardList,
  UserCheck,
  Receipt,
  Smile,
} from "lucide-react";

const painPoints = [
  { icon: Phone, title: "Calling 10+ contractors for basic stuff", description: "Lawn guy, snow guy, HVAC tech, cleaner, plumber, pest control... you're basically running a project management firm." },
  { icon: DollarSign, title: "Surprise bills every single time", description: "Every contractor prices differently. You never know what you'll pay until the invoice shows up." },
  { icon: AlertTriangle, title: "No idea who to trust", description: "Some are great. Some ghost you after taking a deposit. You won't know which until it's too late." },
  { icon: Clock, title: "Scheduling is a part-time job", description: "Coordinating availability across multiple contractors eats hours of your week." },
];

const benefits = [
  { icon: DollarSign, title: "Save 20-40% vs. Hiring Individually", description: "Our bulk contractor rates mean you pay significantly less than calling each one yourself. Real savings, not marketing fluff.", color: "emerald" as const },
  { icon: ClipboardList, title: "One Subscription, Every Service", description: "Lawn care, snow removal, HVAC, cleaning, pest control, handyman - all under one monthly payment.", color: "primary" as const },
  { icon: UserCheck, title: "Vetted, Background-Checked Pros", description: "Every contractor is insured, licensed, and background-checked. No more quality roulette.", color: "sky" as const },
  { icon: Receipt, title: "No Surprise Bills, Ever", description: "Your monthly price is locked in. No hidden fees, no scope creep, no awkward negotiations.", color: "amber" as const },
  { icon: Shield, title: "Satisfaction Guaranteed", description: "Not happy with a service? We send someone else at no extra cost. Period.", color: "violet" as const },
  { icon: CalendarCheck, title: "Book Anything From Your Dashboard", description: "Schedule any service in seconds. We handle the contractor coordination.", color: "emerald" as const },
];

const howItWorks = [
  { step: "01", title: "Tell us about your home", description: "Square footage, lot size, what services you need. Takes 2 minutes." },
  { step: "02", title: "Get your custom plan & price", description: "We calculate your exact price based on your property details. No guessing." },
  { step: "03", title: "Subscribe & we handle everything", description: "One monthly payment. We match you with vetted, local contractors." },
  { step: "04", title: "Book services anytime", description: "Need something done? Open your dashboard, pick a date, done." },
];

const testimonials = [
  { name: "Sarah M.", location: "Kelowna", quote: "I used to spend every other weekend coordinating contractors. Now I open the app, book what I need, and it just gets done. I got my weekends back.", rating: 5 },
  { name: "Mike & Jennifer R.", location: "West Kelowna", quote: "We calculated it out - we're saving about $2,400 a year compared to what we were paying before. And the quality is actually better.", rating: 5 },
  { name: "David L.", location: "Penticton", quote: "The peace of mind alone is worth it. Knowing every contractor is vetted and insured, and that I never have to chase anyone down.", rating: 5 },
];

const faqs = [
  { q: "What services are included?", a: "We offer 15+ home maintenance services including lawn care, snow removal, HVAC tune-ups, house cleaning, window washing, gutter cleaning, pest control, plumbing inspections, electrical checks, pressure washing, painting, carpet cleaning, and handyman services. You choose what you need." },
  { q: "How does pricing work?", a: "Your price is calculated based on your specific property - home size, lot size, number of services, and service frequency. There are no hidden fees. You see your exact monthly price before you subscribe." },
  { q: "Can I change my plan?", a: "Absolutely. Add or remove services anytime. Your monthly price adjusts automatically. No penalties, no questions asked." },
  { q: "What if I'm not satisfied with a service?", a: "We guarantee quality. If you're not satisfied with any service, we'll send a different contractor to redo it at no additional cost." },
  { q: "What area do you serve?", a: "We currently serve the Okanagan Valley including Kelowna, West Kelowna, Lake Country, Peachland, Penticton, Vernon, and surrounding areas. We're expanding to more BC communities soon." },
  { q: "Is there a contract or commitment?", a: "No long-term contracts required. You can cancel anytime. We offer monthly, quarterly (save 5%), and annual (save 15%) billing options." },
];

export default function HomeownersPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-background to-background" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <Badge variant="secondary" className="mb-4 border-emerald-500/20 bg-emerald-500/10 text-emerald-700">
              Save $1,500-3,000/year
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Stop Overpaying for{" "}
              <span className="animated-gradient-text">Home Maintenance</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
              One subscription covers every service your home needs - lawn care, snow removal, HVAC, cleaning, and more. Vetted pros. Guaranteed quality. 20-40% less than hiring individually.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/onboarding?type=homeowner">
                <ShimmerButton className="h-12 px-8 text-base">
                  Get Your Personalized Plan in 2 Minutes <ArrowRight className="ml-2 inline h-4 w-4" />
                </ShimmerButton>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/plan-builder">See Pricing</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pain Points */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-center text-2xl font-bold sm:text-3xl">Sound familiar?</h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">These are the exact problems we built My Home Plan to solve.</p>
          </FadeIn>
          <StaggerContainer className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {painPoints.map((p) => (
              <StaggerItem key={p.title}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-5">
                    <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                      <p.icon className="h-8 w-8 text-destructive/70" />
                    </motion.div>
                    <h3 className="mt-3 text-sm font-semibold">{p.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Why Homeowners Switch to My Home Plan
            </h2>
            <p className="mt-3 text-muted-foreground">Real benefits that save you time, money, and headaches.</p>
          </div>
        </FadeIn>
        <StaggerContainer className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <StaggerItem key={b.title}>
              <GlowCard glowColor={b.color} className="h-full">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* How It Works */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-center text-2xl font-bold sm:text-3xl">How it works</h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">From sign-up to stress-free in four simple steps.</p>
          </FadeIn>
          <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            {howItWorks.map((s) => (
              <StaggerItem key={s.step}>
                <Card className="h-full border-border/50">
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{s.step}</span>
                    <div>
                      <h3 className="text-sm font-semibold">{s.title}</h3>
                      <p className="mt-1.5 text-xs text-muted-foreground">{s.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Cost Comparison */}
      <CostComparison />

      {/* Testimonials */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn><h2 className="text-center text-2xl font-bold sm:text-3xl">What homeowners are saying</h2></FadeIn>
        <StaggerContainer className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <Card className="h-full border-border/50">
                <CardContent className="flex h-full flex-col p-5 sm:p-6">
                  <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-4 text-sm font-semibold">{t.name} - {t.location}</p>
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
            <h2 className="text-center text-2xl font-bold sm:text-3xl">Frequently Asked Questions</h2>
          </FadeIn>
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
      <section className="bg-gradient-to-br from-primary to-blue-700 py-16 text-primary-foreground sm:py-24">
        <FadeIn>
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Smile className="mx-auto h-10 w-10 opacity-80" />
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl md:text-4xl">Ready to simplify your home maintenance?</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed opacity-90 sm:text-lg">
              Tell us about your home and get a personalized plan in 2 minutes. No commitment required.
            </p>
            <Button size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base text-primary" asChild>
              <Link href="/onboarding?type=homeowner">Get Your Personalized Plan <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
