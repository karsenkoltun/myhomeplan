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
  ShimmerButton,
  AnimatedCounter,
} from "@/components/ui/motion";
import { SectionHeader } from "@/components/marketing/section-header";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { Testimonials3D } from "@/components/marketing/testimonials-3d";
import { BentoGrid } from "@/components/marketing/bento-grid";
import {
  InfiniteMarquee,
  MarqueeServiceItem,
} from "@/components/marketing/infinite-marquee";
import { motion } from "framer-motion";
import {
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
  BadgeDollarSign,
  ShieldCheck,
  Target,
  CalendarClock,
} from "lucide-react";

// ---- Data ----

const benefitItems = [
  {
    icon: Target,
    title: "Free Leads, Every Month",
    description:
      "We send you qualified, ready-to-book homeowners at zero cost. No bidding wars, no pay-per-lead fees, no wasted time on tire-kickers.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    span: "large" as const,
  },
  {
    icon: Briefcase,
    title: "Steady Year-Round Pipeline",
    description:
      "No more feast-or-famine cycles. We keep your calendar full through every season so you can plan ahead with confidence.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Guaranteed Payment, Always",
    description:
      "Stop chasing invoices. We guarantee payment for every completed job - deposited directly to your account on schedule.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: ClipboardCheck,
    title: "We Handle All Admin",
    description:
      "Scheduling, customer communication, invoicing, follow-ups - we take care of everything so you can focus on the work.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Star,
    title: "Build Your Reputation",
    description:
      "Every job builds your verified profile with real reviews. The better you perform, the more premium jobs you unlock.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    span: "large" as const,
  },
  {
    icon: CalendarClock,
    title: "Set Your Own Schedule",
    description:
      "You decide when you work, how much you take on, and which areas you serve. Full flexibility, zero pressure.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

const statCards = [
  {
    value: "$0",
    label: "Cost to Join",
    description: "No fees, no subscriptions, no hidden charges. Ever.",
    color: "from-emerald-500/20 to-emerald-600/5",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-500",
    icon: BadgeDollarSign,
  },
  {
    value: "100%",
    label: "Payment Guaranteed",
    description: "Every completed job. On time. No exceptions.",
    color: "from-primary/20 to-blue-600/5",
    borderColor: "border-primary/30",
    textColor: "text-primary",
    icon: ShieldCheck,
  },
  {
    value: "0 hrs",
    label: "Marketing Needed",
    description: "We bring the customers. You bring the skills.",
    color: "from-amber-500/20 to-amber-600/5",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-500",
    icon: Megaphone,
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

const serviceCategories = [
  { name: "Lawn Care & Landscaping", icon: Scissors, hiring: true, color: "text-emerald-500" },
  { name: "Snow Removal", icon: Snowflake, hiring: true, color: "text-sky-500" },
  { name: "House Cleaning", icon: Sparkles, hiring: true, color: "text-violet-500" },
  { name: "HVAC & Mechanical", icon: Thermometer, hiring: false, color: "text-rose-500" },
  { name: "Plumbing", icon: Wrench, hiring: true, color: "text-blue-500" },
  { name: "Electrical", icon: Zap, hiring: false, color: "text-amber-500" },
  { name: "Pest Control", icon: Bug, hiring: false, color: "text-orange-500" },
  { name: "Handyman Services", icon: Hammer, hiring: true, color: "text-cyan-500" },
  { name: "Painting", icon: Paintbrush, hiring: false, color: "text-pink-500" },
  { name: "Window & Gutter Cleaning", icon: Sun, hiring: true, color: "text-yellow-500" },
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

const faqs = [
  {
    q: "Is there really no cost to join?",
    a: "Zero. No sign-up fees, no monthly subscriptions, no hidden costs. We make money from the homeowner side, not from you. You keep more of what you earn.",
  },
  {
    q: "How do I get paid?",
    a: "Direct deposit every two weeks for completed jobs. Payment is guaranteed for every job you complete - no chasing invoices, no awkward conversations with clients.",
  },
  {
    q: "Can I set my own schedule?",
    a: "Absolutely. You set your available days, hours, and weekly capacity. Only want to work weekdays? No problem. Need to block off a week? Just update your availability and we handle the rest.",
  },
  {
    q: "What if I need to take time off?",
    a: "Just update your availability in the app. We'll automatically reassign any upcoming jobs and hold your spot in the network. No penalties, no questions asked.",
  },
  {
    q: "What area do you serve?",
    a: "Currently serving the Okanagan Valley including Kelowna, West Kelowna, Vernon, Penticton, and surrounding areas. We're expanding rapidly, so check back if your area isn't listed yet.",
  },
  {
    q: "Do I need my own equipment?",
    a: "Yes, you'll need your own tools and reliable transportation. This keeps costs down for everyone and means you're working with equipment you know and trust.",
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-700 to-blue-900 py-20 text-white sm:py-28">
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
              Now Accepting Applications
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              FREE Leads. Guaranteed Pay.
              <br />
              <span className="text-sky-300">Zero Marketing Costs.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed opacity-90 sm:mt-6 sm:text-lg md:text-xl">
              Stop paying for leads that go nowhere. Join My Home Plan and get
              steady, qualified jobs sent directly to you - completely free.
              We handle the customers, you handle the craft.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
              <Link href="/onboarding?type=contractor">
                <ShimmerButton className="h-12 w-full px-8 text-base font-semibold sm:h-13 sm:w-auto">
                  Apply Now - Takes 10 Minutes <ArrowRight className="ml-2 h-4 w-4" />
                </ShimmerButton>
              </Link>
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
                See the Benefits <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ==================== 2. SOCIAL PROOF BAR ==================== */}
      <SocialProofBar />

      {/* ==================== 3. BIG STAT CARDS ==================== */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <StaggerContainer className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {statCards.map((stat) => (
            <StaggerItem key={stat.label}>
              <ScaleOnHover scale={1.03}>
                <GlowCard className={`border-2 ${stat.borderColor} bg-gradient-to-br ${stat.color} backdrop-blur-sm shadow-lg`}>
                  <CardContent className="flex flex-col items-center p-6 text-center sm:p-8">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.textColor} bg-background/80 mb-3`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <p className={`text-3xl font-bold tracking-tight sm:text-4xl ${stat.textColor}`}>
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm font-semibold sm:text-base">
                      {stat.label}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                      {stat.description}
                    </p>
                  </CardContent>
                </GlowCard>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ==================== 4. BENEFITS (BentoGrid) ==================== */}
      <section
        id="benefits"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      >
        <SectionHeader
          badge="Why Join Us"
          badgeColor="emerald"
          title="Everything You Need to Succeed. Nothing You Don't."
          subtitle="We built this platform to eliminate the biggest headaches contractors deal with every single day."
        />

        <div className="mt-10 sm:mt-14">
          <BentoGrid items={benefitItems} />
        </div>
      </section>

      {/* ==================== 5. COMPARISON TABLE ==================== */}
      <section className="border-y bg-muted/20 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Side by Side"
            badgeColor="primary"
            title="My Home Plan vs. Traditional Lead Sources"
            subtitle="See how we stack up against the alternatives."
          />

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
      </section>

      {/* ==================== 6. SERVICE CATEGORIES (InfiniteMarquee) ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeader
          badge="Now Recruiting"
          badgeColor="sky"
          title="Services We're Hiring For"
          subtitle="We're actively recruiting skilled contractors across these categories."
        />

        <div className="mt-8 sm:mt-12">
          <InfiniteMarquee speed={35} direction="left">
            {serviceCategories.map((svc) => (
              <MarqueeServiceItem
                key={svc.name}
                icon={svc.icon}
                label={svc.hiring ? `${svc.name} - Now Hiring` : svc.name}
                color={svc.color}
              />
            ))}
          </InfiniteMarquee>
        </div>

        <div className="mt-4">
          <InfiniteMarquee speed={40} direction="right">
            {serviceCategories.map((svc) => (
              <MarqueeServiceItem
                key={`r-${svc.name}`}
                icon={svc.icon}
                label={svc.name}
                color={svc.color}
              />
            ))}
          </InfiniteMarquee>
        </div>
      </section>

      {/* ==================== 7. APPLICATION PROCESS TIMELINE ==================== */}
      <section className="border-y bg-muted/20 py-16 sm:py-24">
        <SectionHeader
          badge="Get Started"
          badgeColor="violet"
          title="How the Application Process Works"
          subtitle="From application to your first job in as little as two weeks."
        />

        {/* Desktop: horizontal timeline */}
        <div className="mx-auto mt-12 hidden max-w-5xl px-4 md:block lg:px-8">
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
        <div className="mx-auto mt-8 max-w-md px-4 md:hidden">
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

      {/* ==================== 8. TESTIMONIALS (Testimonials3D) ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeader
          badge="Contractor Stories"
          badgeColor="amber"
          title="What Our Contractors Say"
          subtitle="Hear from professionals who have already joined the network."
        />

        <div className="mx-auto mt-8 max-w-5xl sm:mt-12">
          <Testimonials3D audience="contractor" maxItems={3} />
        </div>
      </section>

      {/* ==================== 9. FAQ ==================== */}
      <section className="border-t bg-muted/20 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Questions?"
            badgeColor="rose"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about joining as a contractor."
          />

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
        </div>
      </section>

      {/* ==================== 10. FINAL CTA ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-700 py-16 text-primary-foreground sm:py-24">
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-transparent" />

        <FadeIn>
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <motion.div
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Rocket className="h-7 w-7 text-sky-300" />
            </motion.div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Stop Chasing Leads.
              <br />
              Let Them Come to You.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed opacity-90 sm:text-lg">
              Join our growing network of Okanagan contractors. Free to apply,
              free to join, and your first jobs could be lined up within two weeks.
            </p>
            <Link href="/onboarding?type=contractor">
              <ShimmerButton className="mt-8 h-12 w-full px-10 text-base font-semibold sm:mt-10 sm:h-13 sm:w-auto">
                Apply Now - Takes 10 Minutes <ArrowRight className="ml-2 h-4 w-4" />
              </ShimmerButton>
            </Link>
            <p className="mt-4 text-sm opacity-70">
              No fees. No commitments. No credit card required.
            </p>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
