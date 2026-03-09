"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, ShimmerButton } from "@/components/ui/motion";
import { FAQ } from "@/components/ui/faq-tabs";
import { PricingTable } from "@/components/ui/pricing-table";
import { Gallery4 } from "@/components/ui/gallery4";
import type { Gallery4Item } from "@/components/ui/gallery4";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Home, Building2, Building, Wrench } from "lucide-react";

import { TestimonialsMarquee } from "@/components/marketing/testimonials-marquee";

/* ─── Home type presets ─── */
const homeTypes = [
  {
    id: "suburban",
    icon: Home,
    name: "Suburban Home",
    tagline: "Full indoor + outdoor coverage",
    description:
      "Detached homes with yards, driveways, and all the maintenance that comes with them.",
  },
  {
    id: "townhome",
    icon: Building2,
    name: "Townhome",
    tagline: "Exterior + interior essentials",
    description:
      "Shared walls, private entrance. Less yard work, more focus on cleaning and exterior upkeep.",
  },
  {
    id: "condo",
    icon: Building,
    name: "Condo / Apartment",
    tagline: "Interior-focused care",
    description:
      "No yard, no exterior. Keep your unit spotless and systems running smoothly.",
  },
];

/* ─── Pricing plans per home type ─── */
const suburbanPlans = [
  { name: "Essential", level: "essential", price: { monthly: 89, yearly: 890 } },
  { name: "Complete", level: "complete", price: { monthly: 159, yearly: 1590 }, popular: true },
  { name: "Premium", level: "premium", price: { monthly: 249, yearly: 2490 } },
];

const townhomePlans = [
  { name: "Essential", level: "essential", price: { monthly: 69, yearly: 690 } },
  { name: "Complete", level: "complete", price: { monthly: 119, yearly: 1190 }, popular: true },
  { name: "Premium", level: "premium", price: { monthly: 189, yearly: 1890 } },
];

const condoPlans = [
  { name: "Essential", level: "essential", price: { monthly: 49, yearly: 490 } },
  { name: "Complete", level: "complete", price: { monthly: 89, yearly: 890 }, popular: true },
  { name: "Premium", level: "premium", price: { monthly: 149, yearly: 1490 } },
];

/* ─── Features per home type ─── */
const suburbanFeatures = [
  { name: "Bi-weekly lawn mowing", included: "essential" },
  { name: "Snow removal", included: "essential" },
  { name: "Spring + fall cleanup", included: "essential" },
  { name: "Gutter cleaning (2x/yr)", included: "essential" },
  { name: "Window washing (2x/yr)", included: "complete" },
  { name: "HVAC tune-ups", included: "complete" },
  { name: "Monthly house cleaning", included: "complete" },
  { name: "Quarterly pest control", included: "complete" },
  { name: "Handyman hours (2hrs/mo)", included: "complete" },
  { name: "Lawn fertilization", included: "premium" },
  { name: "Pressure washing", included: "premium" },
  { name: "Appliance maintenance", included: "premium" },
  { name: "Priority scheduling", included: "premium" },
  { name: "Dedicated account manager", included: "premium" },
];

const townhomeFeatures = [
  { name: "Exterior cleaning (2x/yr)", included: "essential" },
  { name: "Snow removal (walkways)", included: "essential" },
  { name: "Gutter cleaning (2x/yr)", included: "essential" },
  { name: "Bi-weekly house cleaning", included: "complete" },
  { name: "Window washing (2x/yr)", included: "complete" },
  { name: "HVAC tune-ups", included: "complete" },
  { name: "Quarterly pest control", included: "complete" },
  { name: "Small yard maintenance", included: "complete" },
  { name: "Pressure washing", included: "premium" },
  { name: "Handyman hours (2hrs/mo)", included: "premium" },
  { name: "Appliance maintenance", included: "premium" },
  { name: "Priority scheduling", included: "premium" },
];

const condoFeatures = [
  { name: "Bi-weekly house cleaning", included: "essential" },
  { name: "HVAC filter replacement", included: "essential" },
  { name: "Monthly deep clean", included: "complete" },
  { name: "Window washing (interior)", included: "complete" },
  { name: "Quarterly pest control", included: "complete" },
  { name: "Appliance maintenance", included: "complete" },
  { name: "Handyman hours (2hrs/mo)", included: "premium" },
  { name: "Laundry & organizing", included: "premium" },
  { name: "Priority scheduling", included: "premium" },
  { name: "Dedicated account manager", included: "premium" },
];

const plansByType: Record<string, typeof suburbanPlans> = {
  suburban: suburbanPlans,
  townhome: townhomePlans,
  condo: condoPlans,
};

const featuresByType: Record<string, typeof suburbanFeatures> = {
  suburban: suburbanFeatures,
  townhome: townhomeFeatures,
  condo: condoFeatures,
};

/* ─── FAQ data ─── */
const faqCategories = { general: "General" };
const faqData = {
  general: [
    {
      question: "Are prices exact or estimates?",
      answer:
        "Starting prices shown are estimates based on typical home sizes. Your actual price is calculated when you enter your property details in the Plan Builder - it factors in square footage, lot size, and your specific service selections.",
    },
    {
      question: "Can I switch plans later?",
      answer:
        "Yes, upgrade or downgrade anytime. Upgrades are prorated so you only pay for what you use. Downgrades take effect at your next billing cycle.",
    },
    {
      question: "Are there any hidden fees or contracts?",
      answer:
        "No hidden fees, ever. Monthly plans have zero contracts. Yearly plans are prorated if you cancel early.",
    },
    {
      question: "How does the Price Lock Guarantee work?",
      answer:
        "Once you subscribe, your rate is locked for 12 months regardless of price changes. We notify you 30 days before any adjustments.",
    },
    {
      question: "How are the contractors vetted?",
      answer:
        "Every contractor is licensed, insured, and background-checked. We verify references and conduct ongoing quality audits.",
    },
    {
      question: "What if I'm not satisfied with a service?",
      answer:
        "We stand behind our work. If you're not happy, we'll send the contractor back to redo it at no extra cost.",
    },
    {
      question: "Can I add or remove services?",
      answer:
        "Absolutely. You can customize your service lineup anytime. Added services are prorated, removed services take effect at the next cycle.",
    },
    {
      question: "Do you serve my area?",
      answer:
        "We currently serve 7 cities in the Okanagan Valley: Kelowna, West Kelowna, Vernon, Penticton, Lake Country, Summerland, and Peachland.",
    },
  ],
};

/* ─── Guarantee gallery items ─── */
const guaranteeItems: Gallery4Item[] = [
  {
    id: "price-lock",
    title: "Price Lock",
    description: "Your rate is locked for 12 months. No surprise charges, no rate hikes.",
    image: "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "satisfaction",
    title: "Satisfaction Guarantee",
    description: "Not happy with a service? We redo it at no cost. Every single time.",
    image: "https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "cancel",
    title: "Cancel Anytime",
    description: "Monthly plans have zero contracts. No lock-in, no penalties.",
    image: "https://images.pexels.com/photos/5691658/pexels-photo-5691658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */
export default function PricingContent() {
  const [selectedType, setSelectedType] = useState("suburban");

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Simple, Transparent Pricing
              </p>
              <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Plans built for your home type
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Select your home type to see recommended services and starting prices.
                Every plan is customized to your exact property in the Plan Builder.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Home Type Selector ── */}
      <section className="pb-8">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-3">
              {homeTypes.map((type) => {
                const isActive = selectedType === type.id;
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex flex-col items-start rounded-2xl border p-6 text-left transition-all duration-300 ${
                      isActive
                        ? "border-primary/30 bg-primary/5 ring-2 ring-primary shadow-lg shadow-primary/5"
                        : "border-border/50 bg-card hover:border-border hover:shadow-lg hover:shadow-black/5"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold">{type.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{type.tagline}</p>
                  </button>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Pricing Table ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PricingTable
                features={featuresByType[selectedType]}
                plans={plansByType[selectedType]}
                defaultPlan="complete"
                defaultInterval="monthly"
                ctaLabel="Build your plan -"
                ctaHref={`/plan-builder?type=${selectedType}`}
                note="Starting prices shown. Your exact price is calculated based on your property details."
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Custom Plan CTA ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl rounded-2xl border border-border/50 bg-card p-8 text-center shadow-lg shadow-black/5 sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Wrench className="h-7 w-7 text-primary" />
              </div>
              <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
                Need something different?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Mix and match any services to build a fully custom plan.
                Choose exactly what your home needs - nothing more, nothing less.
              </p>
              <div className="mt-8">
                <Link href="/plan-builder">
                  <ShimmerButton className="px-8 py-3 text-sm font-medium">
                    Build a Custom Plan
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Takes under 5 minutes. No credit card required.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Guarantees ── */}
      <Gallery4
        title="Backed by real guarantees"
        description="Every plan includes promises we actually keep. No fine print."
        items={guaranteeItems}
      />

      {/* ── Testimonials ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Trusted
              </p>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                What our members say
              </h2>
            </div>
          </FadeIn>
          <div className="mt-16">
            <TestimonialsMarquee audience="homeowner" />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl">
            <FAQ
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about our plans."
              categories={faqCategories}
              faqData={faqData}
              className="w-full py-0"
            />
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to simplify home care?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join hundreds of Okanagan homeowners who never worry about
                maintenance again.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/plan-builder">
                  <ShimmerButton className="px-8 py-3 text-sm font-medium">
                    Build Your Plan
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/about#contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
