"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover, GlowCard, ShimmerButton, AnimatedCounter } from "@/components/ui/motion";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Home, Clock, DollarSign, Shield, CalendarCheck,
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  AlertTriangle, Phone, Star,
} from "lucide-react";

const painPoints = [
  { icon: Phone, title: "Calling 10+ contractors", description: "Lawn guy, snow guy, HVAC tech, cleaner, plumber... you're basically a project manager." },
  { icon: DollarSign, title: "Surprise bills", description: "Every contractor has different pricing. You never know what the final bill will be." },
  { icon: AlertTriangle, title: "Quality roulette", description: "Some contractors are great. Some ghost you. You won't know until after you've paid." },
  { icon: Clock, title: "Scheduling chaos", description: "Coordinating availability across multiple contractors is a part-time job." },
];

const howItWorks = [
  { step: "01", title: "Tell us about your home", description: "Square footage, lot size, what services you need. Takes 2 minutes." },
  { step: "02", title: "We build your plan", description: "Get a personalized monthly price based on your exact property details." },
  { step: "03", title: "Subscribe & relax", description: "One monthly payment. We match you with vetted, local contractors." },
  { step: "04", title: "Schedule anytime", description: "Book any service through your dashboard. We handle the coordination." },
  { step: "05", title: "We guarantee quality", description: "Not satisfied? We send someone else at no cost. Period." },
  { step: "06", title: "Rate & review", description: "Your feedback keeps our network sharp. Top contractors get more work." },
];

const sampleServices = [
  { name: "Lawn Mowing", icon: Scissors, price: "$46/mo", note: "Bi-weekly Apr-Oct" },
  { name: "Snow Removal", icon: Snowflake, price: "$108/mo", note: "As needed Nov-Mar" },
  { name: "HVAC Tune-up", icon: Thermometer, price: "$24/mo", note: "2x per year" },
  { name: "House Cleaning", icon: Sparkles, price: "$195/mo", note: "Monthly deep clean" },
  { name: "Pest Control", icon: Bug, price: "$45/mo", note: "Quarterly treatment" },
  { name: "Handyman", icon: Hammer, price: "$28/mo", note: "4 hours/year bank" },
];

const testimonials = [
  { name: "Sarah M.", location: "Kelowna", quote: "I used to spend weekends coordinating contractors. Now I just open the app and book.", rating: 5 },
  { name: "Michelle K.", location: "Penticton", quote: "This plan saves me over $200 a month AND the quality is better.", rating: 5 },
];

export default function HomeownersPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-background to-background" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <Badge variant="secondary" className="mb-6 border-primary/20 bg-primary/10 text-primary">For Homeowners</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Your Home, <span className="animated-gradient-text">Handled.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
              Stop juggling contractors. One subscription covers lawn care, snow removal, HVAC, cleaning, pest control, and everything your home needs. Vetted pros. Guaranteed quality. Predictable pricing.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/onboarding?type=homeowner">
                <ShimmerButton className="h-12 px-8 text-base">
                  Get Started <ArrowRight className="ml-2 inline h-4 w-4" />
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
                    <p className="mt-1.5 text-xs text-muted-foreground">{p.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <FadeIn>
          <h2 className="text-center text-2xl font-bold sm:text-3xl">How it works for homeowners</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">Six simple steps to never worry about home maintenance again.</p>
        </FadeIn>
        <StaggerContainer className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {howItWorks.map((s, i) => (
            <StaggerItem key={s.step}>
              <Card className="h-full border-border/50">
                <CardContent className="p-5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{s.step}</span>
                  <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground">{s.description}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Service Gallery */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-center text-2xl font-bold sm:text-3xl">Sample pricing for a 1,500 sq ft home</h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">Based on a typical 5,000 sq ft lot in Kelowna. Your price is calculated from your actual property details.</p>
          </FadeIn>
          <StaggerContainer className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4 lg:gap-6">
            {sampleServices.map((s) => (
              <StaggerItem key={s.name}>
                <ScaleOnHover>
                  <Card className="border-border/50">
                    <CardContent className="flex flex-col items-center p-4 text-center sm:p-6">
                      <s.icon className="h-8 w-8 text-primary" />
                      <span className="mt-2 text-sm font-semibold">{s.name}</span>
                      <span className="mt-1 text-lg font-bold text-primary">{s.price}</span>
                      <span className="text-[10px] text-muted-foreground">{s.note}</span>
                    </CardContent>
                  </Card>
                </ScaleOnHover>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <FadeIn><h2 className="text-center text-2xl font-bold sm:text-3xl">What homeowners say</h2></FadeIn>
        <StaggerContainer className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <Card className="h-full border-border/50">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                  <p className="mt-3 text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-3 text-sm font-semibold">{t.name} - {t.location}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary to-blue-700 py-16 text-primary-foreground sm:py-20">
        <FadeIn>
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to simplify your home maintenance?</h2>
            <p className="mx-auto mt-3 max-w-xl opacity-90">Tell us about your home and get a personalized plan in 2 minutes. No commitment required.</p>
            <Button size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base text-primary" asChild>
              <Link href="/onboarding?type=homeowner">Get Your Personalized Plan <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
