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
  ScaleOnHover,
  GlowCard,
} from "@/components/ui/motion";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  DollarSign,
  Calendar,
  Shield,
  TrendingUp,
  Star,
  Briefcase,
  Megaphone,
  Clock,
  ClipboardCheck,
  Phone,
  Rocket,
  FileText,
  Search,
  UserCheck,
  Quote,
  Scissors,
  Snowflake,
  Sparkles,
  Thermometer,
  Wrench,
  Zap,
  Bug,
  Hammer,
  Paintbrush,
  Sun,
  Check,
  X,
  Minus,
} from "lucide-react";

// ---- Data ----

const benefits = [
  {
    icon: Briefcase,
    title: "Steady Work Pipeline",
    description:
      "No more slow seasons or scrambling for leads. Get consistent job assignments year-round.",
  },
  {
    icon: DollarSign,
    title: "Zero Marketing Costs",
    description:
      "We handle all customer acquisition. No more paying for ads, leads, or listings.",
  },
  {
    icon: Shield,
    title: "Guaranteed Payment",
    description:
      "Get paid on time, every time. No chasing invoices or dealing with non-payment.",
  },
  {
    icon: Calendar,
    title: "Flexible Schedule",
    description:
      "Set your availability and capacity. Only take jobs that fit your schedule.",
  },
  {
    icon: Clock,
    title: "Simple Scheduling",
    description:
      "We coordinate with homeowners and handle all scheduling logistics for you.",
  },
  {
    icon: TrendingUp,
    title: "Professional Growth",
    description:
      "Access to more clients, reviews, and a reputation that grows with every job.",
  },
];

const comparisonRows = [
  {
    feature: "Cost to join",
    mhp: "Free",
    leads: "$30-100/lead",
    wom: "Free",
    mhpGood: true,
    leadsGood: false,
    womGood: true,
  },
  {
    feature: "Steady work",
    mhp: "Yes",
    leads: "Inconsistent",
    wom: "Unpredictable",
    mhpGood: true,
    leadsGood: false,
    womGood: false,
  },
  {
    feature: "Payment guarantee",
    mhp: "Yes",
    leads: "No",
    wom: "No",
    mhpGood: true,
    leadsGood: false,
    womGood: false,
  },
  {
    feature: "Scheduling handled",
    mhp: "Yes",
    leads: "No",
    wom: "No",
    mhpGood: true,
    leadsGood: false,
    womGood: false,
  },
  {
    feature: "Customer vetting",
    mhp: "Yes",
    leads: "Varies",
    wom: "No",
    mhpGood: true,
    leadsGood: null,
    womGood: false,
  },
  {
    feature: "Marketing needed",
    mhp: "None",
    leads: "Yes",
    wom: "Always",
    mhpGood: true,
    leadsGood: false,
    womGood: false,
  },
];

const requirements = [
  "Valid business license",
  "Proof of insurance (minimum $2M liability)",
  "WCB coverage (or equivalent)",
  "Minimum 2 years experience in your trade",
  "Own equipment and reliable transportation",
  "Pass a background check",
  "Commitment to quality and professionalism",
];

const serviceCategories = [
  { name: "Lawn Care & Landscaping", icon: Scissors, hiring: true },
  { name: "Snow Removal", icon: Snowflake, hiring: true },
  { name: "House Cleaning", icon: Sparkles, hiring: true },
  { name: "HVAC & Mechanical", icon: Thermometer, hiring: false },
  { name: "Plumbing", icon: Wrench, hiring: true },
  { name: "Electrical", icon: Zap, hiring: false },
  { name: "Pest Control", icon: Bug, hiring: false },
  { name: "Handyman Services", icon: Hammer, hiring: true },
  { name: "Painting", icon: Paintbrush, hiring: false },
  { name: "Window & Gutter Cleaning", icon: Sun, hiring: true },
];

const timelineSteps = [
  {
    icon: FileText,
    title: "Submit Application",
    description: "Fill out our simple form. Takes about 10 minutes.",
    timing: "Day 1",
  },
  {
    icon: Search,
    title: "We Review",
    description:
      "Our team reviews your qualifications and experience.",
    timing: "Within 48 hours",
  },
  {
    icon: UserCheck,
    title: "Verification",
    description: "Background check and reference verification.",
    timing: "3-5 business days",
  },
  {
    icon: Phone,
    title: "Onboarding Call",
    description:
      "30-minute call to discuss partnership, expectations, and next steps.",
    timing: "Week 2",
  },
  {
    icon: Rocket,
    title: "Start Working",
    description: "Begin receiving job assignments in your service area.",
    timing: "Week 2-3",
  },
];

const testimonials = [
  {
    quote:
      "I used to spend $500/month on advertising. Now I get more work than ever and it costs me nothing.",
    name: "Mike T.",
    trade: "Landscaping",
  },
  {
    quote:
      "The steady scheduling is a game changer. I know exactly what my week looks like every Monday.",
    name: "Sarah K.",
    trade: "House Cleaning",
  },
  {
    quote:
      "Getting paid on time, every time. That alone was worth joining.",
    name: "Dave R.",
    trade: "Handyman",
  },
];

const faqs = [
  {
    q: "Is there a cost to join?",
    a: "No, it's completely free to apply and join.",
  },
  {
    q: "How do I get paid?",
    a: "Direct deposit every two weeks for completed jobs.",
  },
  {
    q: "Can I set my own schedule?",
    a: "Yes, you set your available days, hours, and weekly capacity.",
  },
  {
    q: "What if I need to take time off?",
    a: "Just update your availability - we'll reassign jobs.",
  },
  {
    q: "What area do you serve?",
    a: "Currently serving the Okanagan Valley including Kelowna, West Kelowna, Vernon, Penticton, and surrounding areas.",
  },
  {
    q: "Do I need my own equipment?",
    a: "Yes, you'll need your own tools and reliable transportation.",
  },
];

// ---- Helpers ----

function ComparisonIcon({ good }: { good: boolean | null }) {
  if (good === true)
    return <Check className="mx-auto h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />;
  if (good === false)
    return <X className="mx-auto h-4 w-4 text-red-400 sm:h-5 sm:w-5" />;
  return <Minus className="mx-auto h-4 w-4 text-amber-400 sm:h-5 sm:w-5" />;
}

// ---- Page ----

export default function ContractorsPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* ==================== 1. HERO ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-700 to-blue-900 py-16 text-white sm:py-24">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0djJoMTJ2LTJIMjR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <motion.div
          className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl"
          animate={{ x: [0, -10, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <FadeIn>
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/25 sm:mb-5">
              For Service Professionals
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Grow Your Business with
              <br />
              <span className="text-sky-300">My Home Plan</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed opacity-90 sm:mt-6 sm:text-lg md:text-xl">
              Join our network of trusted local contractors. Get steady work,
              reliable scheduling, and guaranteed payment - without spending a
              dime on marketing.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 w-full px-8 text-base font-semibold sm:h-13 sm:w-auto"
                asChild
              >
                <Link href="/onboarding?type=contractor">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full border-white/30 px-8 text-base text-white hover:bg-white/10 sm:h-13 sm:w-auto"
                onClick={() => {
                  document
                    .getElementById("benefits")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Learn More <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ==================== 2. BENEFITS ==================== */}
      <section
        id="benefits"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      >
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Why Contractors Choose My Home Plan
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
              We built this platform to solve the biggest pain points
              contractors face every day.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <StaggerItem key={b.title}>
              <ScaleOnHover scale={1.02}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 sm:h-12 sm:w-12">
                      <b.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold sm:text-lg">
                      {b.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {b.description}
                    </p>
                  </CardContent>
                </Card>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ==================== 3. COMPARISON TABLE ==================== */}
      <section className="border-y bg-muted/20 py-16 sm:py-24">
        <FadeIn>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              My Home Plan vs. Traditional Lead Sources
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground sm:text-base">
              See how we stack up against the alternatives.
            </p>

            <div className="mx-auto mt-8 max-w-3xl overflow-x-auto sm:mt-10">
              <div className="min-w-[480px] overflow-hidden rounded-2xl border">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium sm:p-4">
                        Feature
                      </th>
                      <th className="p-3 text-center sm:p-4">
                        <span className="font-semibold text-primary">
                          My Home Plan
                        </span>
                      </th>
                      <th className="p-3 text-center text-muted-foreground sm:p-4">
                        Lead Sites
                      </th>
                      <th className="p-3 text-center text-muted-foreground sm:p-4">
                        Word of Mouth
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.feature} className="border-b last:border-0">
                        <td className="p-3 font-medium sm:p-4">
                          {row.feature}
                        </td>
                        <td className="p-3 text-center sm:p-4">
                          <div className="flex flex-col items-center gap-1">
                            <ComparisonIcon good={row.mhpGood} />
                            <span className="text-xs text-primary">
                              {row.mhp}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-center sm:p-4">
                          <div className="flex flex-col items-center gap-1">
                            <ComparisonIcon good={row.leadsGood} />
                            <span className="text-xs text-muted-foreground">
                              {row.leads}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-center sm:p-4">
                          <div className="flex flex-col items-center gap-1">
                            <ComparisonIcon good={row.womGood} />
                            <span className="text-xs text-muted-foreground">
                              {row.wom}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ==================== 4. REQUIREMENTS ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              What You Need to Apply
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              We vet every contractor to ensure the best experience for
              homeowners and professionals alike.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mx-auto mt-8 max-w-xl sm:mt-10">
            <Card className="border-border/50">
              <CardContent className="p-6 sm:p-8">
                <ul className="space-y-4">
                  {requirements.map((req, i) => (
                    <motion.li
                      key={req}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm sm:text-base">{req}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </FadeIn>
      </section>

      {/* ==================== 5. SERVICE CATEGORIES ==================== */}
      <section className="border-y bg-muted/20 py-16 sm:py-24">
        <FadeIn>
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Services We're Hiring For
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              We're actively recruiting skilled contractors across these
              categories.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 px-4 sm:mt-12 sm:grid-cols-3 sm:gap-4 md:grid-cols-5 lg:px-8">
          {serviceCategories.map((svc) => (
            <StaggerItem key={svc.name}>
              <ScaleOnHover scale={1.04}>
                <div className="relative flex flex-col items-center gap-2.5 rounded-xl border bg-card p-4 text-center sm:p-5">
                  {svc.hiring && (
                    <Badge className="absolute -right-1.5 -top-2 bg-emerald-600 px-1.5 py-0.5 text-[10px] text-white hover:bg-emerald-600">
                      Now Hiring
                    </Badge>
                  )}
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 sm:h-12 sm:w-12">
                    <svc.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                  </div>
                  <span className="text-xs font-medium leading-tight sm:text-sm">
                    {svc.name}
                  </span>
                </div>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ==================== 6. APPLICATION PROCESS TIMELINE ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              How the Application Process Works
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              From application to your first job in as little as two weeks.
            </p>
          </div>
        </FadeIn>

        {/* Desktop: horizontal timeline */}
        <div className="mx-auto mt-12 hidden max-w-5xl md:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-8 h-0.5 bg-border" />
            <div className="grid grid-cols-5 gap-4">
              {timelineSteps.map((step, i) => (
                <FadeIn key={step.title} delay={i * 0.12}>
                  <div className="relative flex flex-col items-center text-center">
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge
                      variant="outline"
                      className="mt-3 text-xs font-normal"
                    >
                      {step.timing}
                    </Badge>
                    <h3 className="mt-2 text-sm font-semibold">{step.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="mx-auto mt-8 max-w-md md:hidden">
          <div className="relative ml-6 border-l-2 border-border pl-8">
            {timelineSteps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.1}>
                <div className="relative pb-8 last:pb-0">
                  {/* Circle on the line */}
                  <div className="absolute -left-[calc(2rem+1px)] flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background">
                    <step.icon className="h-4 w-4 text-primary" />
                  </div>
                  <Badge
                    variant="outline"
                    className="mb-1.5 text-xs font-normal"
                  >
                    {step.timing}
                  </Badge>
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 7. TESTIMONIALS ==================== */}
      <section className="border-y bg-muted/20 py-16 sm:py-24">
        <FadeIn>
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              What Our Contractors Say
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Hear from professionals who have already joined the network.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="mx-auto mt-8 grid max-w-5xl gap-5 px-4 sm:mt-12 sm:gap-6 md:grid-cols-3 lg:px-8">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <Card className="h-full border-border/50">
                <CardContent className="flex h-full flex-col p-5 sm:p-6">
                  <Quote className="mb-3 h-6 w-6 text-primary/30" />
                  <p className="flex-1 text-sm leading-relaxed italic text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-3 border-t pt-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.trade}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ==================== 8. FAQ ==================== */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Everything you need to know about joining as a contractor.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Accordion
            type="single"
            collapsible
            className="mt-8 sm:mt-10"
          >
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-semibold sm:text-base">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </section>

      {/* ==================== 9. FINAL CTA ==================== */}
      <section className="border-t bg-gradient-to-br from-primary via-blue-700 to-blue-900 py-16 text-white sm:py-24">
        <FadeIn>
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <motion.div
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Rocket className="h-7 w-7 text-sky-300" />
            </motion.div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Ready to Grow Your Business?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed opacity-90 sm:text-lg">
              Join our growing network of Okanagan contractors. Apply in under
              10 minutes.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 h-12 w-full px-10 text-base font-semibold sm:mt-10 sm:h-13 sm:w-auto"
              asChild
            >
              <Link href="/onboarding?type=contractor">
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
