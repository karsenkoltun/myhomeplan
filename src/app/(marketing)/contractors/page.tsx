"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover, AnimatedCounter } from "@/components/ui/motion";
import { motion } from "framer-motion";
import {
  CheckCircle2, ArrowRight, DollarSign, Calendar, Shield,
  TrendingUp, Star, Users, Briefcase,
} from "lucide-react";

const benefits = [
  { icon: Briefcase, title: "Guaranteed Booked Jobs", description: "No more chasing leads. We send you confirmed, paid jobs from homeowners in your area." },
  { icon: DollarSign, title: "Fair Pay, Fast", description: "Keep 70-80% of service value. Get paid within 7 days of job completion, guaranteed." },
  { icon: Calendar, title: "Year-Round Work", description: "Our bundled plans mean homeowners need services every season. No more dead months." },
  { icon: Shield, title: "No Lead Fees", description: "Zero cost to receive jobs. No advertising spend needed. We bring the customers to you." },
  { icon: Star, title: "Build Your Reputation", description: "Your profile, ratings, and reviews help you stand out. Great work gets rewarded with more jobs." },
  { icon: TrendingUp, title: "Grow Your Business", description: "Top-rated contractors get priority placement, premium jobs, and the best customers." },
];

const requirements = [
  "Valid business license in British Columbia",
  "Proof of liability insurance ($2M minimum)",
  "WorkSafe BC coverage (where applicable)",
  "3+ years of experience in your trade",
  "Clean background check",
  "2 professional references",
  "Commitment to our service standards",
];

const serviceTypes = [
  "Lawn Care & Landscaping", "Snow Removal", "HVAC (Heating & Cooling)",
  "Plumbing", "Electrical", "House Cleaning", "Window Washing",
  "Pest Control", "Handyman Services", "Painting", "Pressure Washing", "Gutter Cleaning",
];

export default function ContractorsPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-800 py-14 text-white sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-transparent" />
        <motion.div
          className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <FadeIn>
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <Badge className="mb-3 bg-white/20 text-white sm:mb-4">For Service Professionals</Badge>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
              Stop Chasing Leads.<br />Start Getting Guaranteed Work.
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm opacity-90 sm:mt-4 sm:text-base md:text-lg">
              Join the Okanagan&apos;s first home services subscription platform. Get a reliable pipeline of year-round, pre-paid jobs.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-4">
              <Button size="lg" variant="secondary" className="h-11 w-full px-8 text-base sm:h-12 sm:w-auto">
                Apply to Join <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-11 w-full border-white/30 px-8 text-base text-white hover:bg-white/10 sm:h-12 sm:w-auto" asChild>
                <Link href="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Why Contractors Choose Us</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base md:text-lg">
              We built this platform to solve the biggest pain points contractors face.
            </p>
          </div>
        </FadeIn>
        <StaggerContainer className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <StaggerItem key={b.title}>
              <ScaleOnHover scale={1.02}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 sm:h-12 sm:w-12">
                      <b.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold sm:mt-4 sm:text-base lg:text-lg">{b.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{b.description}</p>
                  </CardContent>
                </Card>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Comparison */}
      <section className="border-y bg-muted/20 py-14 sm:py-20">
        <FadeIn>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-xl font-bold sm:text-2xl">My Home Plan vs. Traditional Lead Gen</h2>
            <div className="mx-auto mt-6 max-w-2xl overflow-x-auto sm:mt-8">
              <div className="min-w-[380px] overflow-hidden rounded-2xl border">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left sm:p-4">Feature</th>
                      <th className="p-3 text-center font-semibold text-primary sm:p-4">My Home Plan</th>
                      <th className="p-3 text-center text-muted-foreground sm:p-4">Lead Sites</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Cost per lead", "Free", "$30-$100+"],
                      ["Job guarantee", "Yes - pre-booked", "No - just leads"],
                      ["Payment speed", "7 days", "You invoice"],
                      ["Year-round work", "Yes", "Seasonal"],
                      ["Customer quality", "Subscribed", "One-time"],
                      ["Reviews carry over", "Yes", "Platform-locked"],
                    ].map(([feature, us, them]) => (
                      <tr key={feature} className="border-b last:border-0">
                        <td className="p-3 font-medium sm:p-4">{feature}</td>
                        <td className="p-3 text-center text-primary sm:p-4">{us}</td>
                        <td className="p-3 text-center text-muted-foreground sm:p-4">{them}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Requirements & Services */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-2">
          <FadeIn direction="left">
            <h2 className="text-xl font-bold sm:text-2xl">What We Look For</h2>
            <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2">We vet every contractor to ensure the best service.</p>
            <ul className="mt-4 space-y-2.5 sm:mt-6 sm:space-y-3">
              {requirements.map((req) => (
                <li key={req} className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm">{req}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn direction="right">
            <h2 className="text-xl font-bold sm:text-2xl">Services We Need</h2>
            <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2">Actively recruiting contractors in these categories.</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6">
              {serviceTypes.map((type) => (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-2 rounded-lg border bg-card p-2.5 sm:p-3"
                >
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary sm:h-2 sm:w-2" />
                  <span className="text-[11px] sm:text-sm">{type}</span>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats CTA */}
      <section className="border-y bg-gradient-to-br from-primary to-blue-800 py-14 text-white sm:py-20">
        <FadeIn>
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <motion.div className="flex justify-center" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>
              <Users className="h-10 w-10 opacity-80 sm:h-12 sm:w-12" />
            </motion.div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Earn More. Stress Less.</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm opacity-90 sm:mt-4 sm:text-base md:text-lg">
              Our contractors average 20+ guaranteed jobs per month. No advertising costs. No lead fees.
            </p>
            <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6">
              {[
                { label: "Avg. Jobs/Month", value: 20, suffix: "+" },
                { label: "Pay Received Within", display: "7 Days" },
                { label: "Contractor Retention", value: 92, suffix: "%" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm sm:p-6">
                  <p className="text-2xl font-bold sm:text-3xl">
                    {"display" in stat ? stat.display : <AnimatedCounter target={stat.value!} suffix={stat.suffix} />}
                  </p>
                  <p className="mt-1 text-xs opacity-80 sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
            <Button size="lg" variant="secondary" className="mt-8 h-11 w-full px-8 text-base sm:mt-10 sm:h-12 sm:w-auto">
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <FadeIn>
          <h2 className="text-center text-xl font-bold sm:text-2xl">Contractor FAQ</h2>
        </FadeIn>
        <StaggerContainer className="mt-6 space-y-3 sm:mt-8 sm:space-y-4" staggerDelay={0.08}>
          {[
            { q: "Is there a cost to join?", a: "No. Zero cost to join. You don't pay for leads, listings, or advertising. We bring the customers to you." },
            { q: "How do I get paid?", a: "We pay you within 7 days of job completion via direct deposit. You keep 70-80% of the service value." },
            { q: "Can I set my own schedule?", a: "Yes. You choose which jobs to accept and set your availability. We only send jobs that match." },
            { q: "What if a customer is unhappy?", a: "We handle all customer communication and disputes. If a redo is needed, you'll be compensated." },
            { q: "How many jobs will I get?", a: "Depends on your area and subscribers. Our goal is to keep your schedule as full as you want it." },
          ].map((faq) => (
            <StaggerItem key={faq.q}>
              <div className="rounded-xl border bg-card p-4 sm:p-5">
                <h3 className="text-sm font-semibold">{faq.q}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{faq.a}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </div>
  );
}
