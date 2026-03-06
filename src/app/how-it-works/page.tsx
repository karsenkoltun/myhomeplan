"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/ui/motion";
import { motion } from "framer-motion";
import {
  Home, ListChecks, CreditCard, CalendarCheck, Bell, Star, ArrowRight,
  Users, Shield, Clock, DollarSign, CheckCircle2, ClipboardCheck, Briefcase, TrendingUp,
} from "lucide-react";

const homeownerSteps = [
  { icon: Home, title: "Enter Your Property Details", description: "Tell us about your home - square footage, lot size, heating type. This helps us give you an accurate, personalized price." },
  { icon: ListChecks, title: "Select Your Services", description: "Browse our full service menu - lawn care, snow removal, HVAC, cleaning, pest control, handyman, and more. Pick what you need." },
  { icon: CreditCard, title: "Choose Your Plan & Subscribe", description: "See your monthly price build in real-time. Choose monthly, quarterly (save 5%), or annual (save 15%). One simple payment." },
  { icon: CalendarCheck, title: "Schedule Your Services", description: "Through your dashboard, book any service at a time that works for you. We handle matching you with the best available contractor." },
  { icon: Bell, title: "Get Updates & Confirmations", description: "Receive notifications when your service is confirmed, when the contractor is on the way, and when the job is complete." },
  { icon: Star, title: "Rate & Review", description: "After each service, rate your experience. Your feedback keeps our contractor network sharp and helps other homeowners." },
];

const contractorSteps = [
  { icon: ClipboardCheck, title: "Apply to Join", description: "Submit your business info, licenses, insurance, and service areas. Our team reviews every application." },
  { icon: Shield, title: "Get Vetted", description: "We verify your business license, insurance ($2M liability min), WorkSafe BC coverage, and run background checks." },
  { icon: Briefcase, title: "Get Listed & Receive Jobs", description: "Once approved, you start receiving guaranteed booked jobs - not leads. Accept jobs that fit your schedule." },
  { icon: DollarSign, title: "Complete Work & Get Paid", description: "Do great work, get paid within 7 days. Keep 70-80% of service value. No chasing invoices, ever." },
  { icon: TrendingUp, title: "Grow Your Business", description: "Build your reputation with ratings and reviews. Top-rated contractors get priority placement and more jobs." },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <FadeIn>
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary/10 text-primary">Simple & Transparent</Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">How My Home Plan Works</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base md:text-lg">
            Whether you&apos;re a homeowner looking for hassle-free maintenance or a contractor looking for reliable work.
          </p>
        </div>
      </FadeIn>

      {/* Homeowner Section */}
      <div className="mt-14 sm:mt-20">
        <FadeIn>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
              <Home className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            </div>
            <h2 className="text-xl font-bold sm:text-2xl">For Homeowners</h2>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {homeownerSteps.map((step, i) => (
            <StaggerItem key={step.title}>
              <ScaleOnHover scale={1.02}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <motion.span
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground sm:h-8 sm:w-8 sm:text-sm"
                        whileHover={{ scale: 1.15, rotate: 10 }}
                      >
                        {i + 1}
                      </motion.span>
                      <step.icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold sm:mt-4 sm:text-base">{step.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.3}>
          <div className="mt-6 text-center sm:mt-8">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/plan-builder">Build Your Plan Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </FadeIn>
      </div>

      {/* Contractor Section */}
      <div className="mt-16 sm:mt-24">
        <FadeIn>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 sm:h-10 sm:w-10">
              <Users className="h-4 w-4 text-sky-600 sm:h-5 sm:w-5" />
            </div>
            <h2 className="text-xl font-bold sm:text-2xl">For Contractors</h2>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contractorSteps.map((step, i) => (
            <StaggerItem key={step.title}>
              <ScaleOnHover scale={1.02}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <motion.span
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white sm:h-8 sm:w-8 sm:text-sm"
                        whileHover={{ scale: 1.15, rotate: 10 }}
                      >
                        {i + 1}
                      </motion.span>
                      <step.icon className="h-4 w-4 text-sky-600 sm:h-5 sm:w-5" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold sm:mt-4 sm:text-base">{step.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.3}>
          <div className="mt-6 text-center sm:mt-8">
            <Button size="lg" variant="outline" className="w-full border-sky-500/30 text-sky-600 hover:bg-sky-50 sm:w-auto" asChild>
              <Link href="/contractors">Join Our Contractor Network <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </FadeIn>
      </div>

      {/* Guarantees */}
      <FadeIn delay={0.2}>
        <div className="mx-auto mt-16 max-w-4xl sm:mt-24">
          <h2 className="text-center text-xl font-bold sm:text-2xl">Our Guarantees</h2>
          <StaggerContainer className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6">
            {[
              { icon: Clock, title: "Scheduling Guarantee", desc: "Service happens in your scheduled window, or the next one is free." },
              { icon: CheckCircle2, title: "Quality Guarantee", desc: "Not satisfied? We send another contractor at no cost." },
              { icon: DollarSign, title: "Price Lock Guarantee", desc: "Your rate is locked for 12 months. No surprise increases." },
              { icon: Shield, title: "Contractor Pay Guarantee", desc: "Every contractor gets paid within 7 days. No exceptions." },
            ].map((g) => (
              <StaggerItem key={g.title}>
                <Card className="border-border/50">
                  <CardContent className="flex gap-3 p-4 sm:gap-4 sm:p-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
                      <g.icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{g.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{g.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </FadeIn>
    </div>
  );
}
