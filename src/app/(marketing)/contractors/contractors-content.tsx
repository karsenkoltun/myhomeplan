"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FadeIn, ShimmerButton } from "@/components/ui/motion";
import { FlowButton } from "@/components/ui/flow-button";
import { SectionHeader } from "@/components/marketing/section-header";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import { BentoGrid } from "@/components/marketing/bento-grid";
import { InfiniteMarquee, MarqueeServiceItem } from "@/components/marketing/infinite-marquee";

// Lazy-load heavy below-fold component
const Testimonials3D = dynamic(
  () => import("@/components/marketing/testimonials-3d").then((mod) => ({ default: mod.Testimonials3D })),
  { ssr: false }
);
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowDown, Star, Briefcase, ClipboardCheck, Phone, Rocket,
  FileText, UserCheck, Scissors, Snowflake, Sparkles, Thermometer, Wrench,
  Zap, Bug, Hammer, Paintbrush, Sun, Check, X, Minus, ShieldCheck, Target,
  CalendarClock,
} from "lucide-react";

// ---- Data ----

const benefitItems = [
  { icon: Target, title: "Free Leads, Every Month", description: "Qualified, ready-to-book homeowners sent to you at zero cost. No bidding wars, no pay-per-lead fees.", color: "text-emerald-500", bg: "bg-emerald-500/10", span: "large" as const },
  { icon: Briefcase, title: "Steady Year-Round Pipeline", description: "No more feast-or-famine cycles. We keep your calendar full through every season.", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: ShieldCheck, title: "Guaranteed Payment, Always", description: "Stop chasing invoices. Payment guaranteed for every completed job, deposited on schedule.", color: "text-violet-500", bg: "bg-violet-500/10" },
  { icon: ClipboardCheck, title: "We Handle All Admin", description: "Scheduling, customer communication, invoicing, follow-ups - we take care of everything.", color: "text-rose-500", bg: "bg-rose-500/10" },
  { icon: Star, title: "Build Your Reputation", description: "Every job builds your verified profile with real reviews. Better performance unlocks premium jobs.", color: "text-amber-500", bg: "bg-amber-500/10", span: "large" as const },
  { icon: CalendarClock, title: "Set Your Own Schedule", description: "You decide when you work, how much you take on, and which areas you serve.", color: "text-cyan-500", bg: "bg-cyan-500/10" },
];

const comparisonRows = [
  { feature: "Cost to join", mhp: "Free", leads: "$30-100/lead", wom: "Free", mhpGood: true, leadsGood: false, womGood: true },
  { feature: "Steady work", mhp: "Yes", leads: "Inconsistent", wom: "Unpredictable", mhpGood: true, leadsGood: false, womGood: false },
  { feature: "Payment guarantee", mhp: "Yes", leads: "No", wom: "No", mhpGood: true, leadsGood: false, womGood: false },
  { feature: "Admin & scheduling", mhp: "Handled for you", leads: "No", wom: "No", mhpGood: true, leadsGood: false, womGood: false },
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
  { icon: FileText, title: "Submit Application", description: "Fill out our simple form. Takes about 10 minutes.", timing: "Day 1" },
  { icon: UserCheck, title: "Review & Verification", description: "We review qualifications, run a background check, and verify references.", timing: "3-5 business days" },
  { icon: Phone, title: "Onboarding Call", description: "30-minute call to discuss partnership and next steps.", timing: "Week 2" },
  { icon: Rocket, title: "Start Working", description: "Begin receiving job assignments in your service area.", timing: "Week 2-3" },
];

const faqs = [
  { q: "Is there really no cost to join?", a: "Zero. No sign-up fees, no monthly subscriptions, no hidden costs. We make money from the homeowner side, not from you." },
  { q: "How do I get paid?", a: "Direct deposit every two weeks for completed jobs. Payment is guaranteed for every job you complete - no chasing invoices." },
  { q: "Can I set my own schedule?", a: "Absolutely. You set your available days, hours, and weekly capacity. Need to block off a week? Just update your availability and we handle the rest." },
  { q: "What area do you serve?", a: "Currently serving the Okanagan Valley including Kelowna, West Kelowna, Vernon, Penticton, and surrounding areas. We're expanding rapidly." },
];

// ---- Helpers ----

function ComparisonIcon({ good }: { good: boolean | null }) {
  if (good === true) return <Check className="mx-auto h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />;
  if (good === false) return <X className="mx-auto h-4 w-4 text-red-400 sm:h-5 sm:w-5" />;
  return <Minus className="mx-auto h-4 w-4 text-amber-400 sm:h-5 sm:w-5" />;
}

function ComparisonCell({ good, label, highlight }: { good: boolean | null; label: string; highlight?: boolean }) {
  return (
    <td className="p-3 text-center sm:p-4">
      <div className="flex flex-col items-center gap-1">
        <ComparisonIcon good={good} />
        <span className={`text-xs ${highlight ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
      </div>
    </td>
  );
}

// ---- Page ----

export function ContractorsContent() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-blue-700 to-blue-900 py-20 text-white sm:py-28">
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
                onClick={() => document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" })}
              >
                See the Benefits <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ==================== SOCIAL PROOF BAR ==================== */}
      <SocialProofBar />

      {/* ==================== BENEFITS ==================== */}
      <section id="benefits" className="mx-auto max-w-7xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
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

      {/* ==================== COMPARISON TABLE ==================== */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Side by Side"
            badgeColor="primary"
            title="My Home Plan vs. The Alternatives"
            subtitle="See how we stack up against traditional lead sources."
          />
          <div className="mx-auto mt-8 max-w-3xl overflow-x-auto sm:mt-10">
            <div className="min-w-[480px] overflow-hidden rounded-2xl border">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium sm:p-4">Feature</th>
                    <th className="p-3 text-center sm:p-4"><span className="font-semibold text-primary">My Home Plan</span></th>
                    <th className="p-3 text-center text-muted-foreground sm:p-4">Lead Sites</th>
                    <th className="p-3 text-center text-muted-foreground sm:p-4">Word of Mouth</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="border-b last:border-0">
                      <td className="p-3 font-medium sm:p-4">{row.feature}</td>
                      <ComparisonCell good={row.mhpGood} label={row.mhp} highlight />
                      <ComparisonCell good={row.leadsGood} label={row.leads} />
                      <ComparisonCell good={row.womGood} label={row.wom} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SERVICE CATEGORIES ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
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
      </section>

      {/* ==================== APPLICATION TIMELINE ==================== */}
      <section className="border-y bg-muted/20 py-16 sm:py-20">
        <SectionHeader
          badge="Get Started"
          badgeColor="violet"
          title="How the Application Process Works"
          subtitle="From application to your first job in as little as two weeks."
        />
        {/* Desktop */}
        <div className="mx-auto mt-12 hidden max-w-4xl px-4 md:block lg:px-8">
          <div className="relative">
            <div className="absolute left-0 right-0 top-8 h-0.5 bg-border" />
            <div className="grid grid-cols-4 gap-6">
              {timelineSteps.map((step, i) => (
                <FadeIn key={step.title} delay={i * 0.12}>
                  <div className="relative flex flex-col items-center text-center">
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="mt-3 text-xs font-normal">{step.timing}</Badge>
                    <h3 className="mt-2 text-sm font-semibold">{step.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
        {/* Mobile */}
        <div className="mx-auto mt-8 max-w-md px-4 md:hidden">
          <div className="relative ml-6 border-l-2 border-border pl-8">
            {timelineSteps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.1}>
                <div className="relative pb-8 last:pb-0">
                  <div className="absolute -left-[calc(2rem+1px)] flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background">
                    <step.icon className="h-4 w-4 text-primary" />
                  </div>
                  <Badge variant="outline" className="mb-1.5 text-xs font-normal">{step.timing}</Badge>
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
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

      {/* ==================== FAQ ==================== */}
      <section className="border-t bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Questions?"
            badgeColor="rose"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about joining as a contractor."
          />
          <FadeIn delay={0.1}>
            <Accordion type="single" collapsible className="mt-8 sm:mt-10">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-semibold sm:text-base">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-700 py-16 text-primary-foreground sm:py-20">
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
              Stop Chasing Leads.<br />Let Them Come to You.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed opacity-90 sm:text-lg">
              Join our growing network of Okanagan contractors. Free to apply,
              free to join, and your first jobs could be lined up within two weeks.
            </p>
            <div className="mt-8 flex justify-center sm:mt-10">
              <FlowButton text="Apply Now - Takes 10 Minutes" href="/onboarding?type=contractor" className="h-12 px-10 text-base font-semibold border-white/30 text-white" />
            </div>
            <p className="mt-4 text-sm opacity-70">No fees. No commitments. No credit card required.</p>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
