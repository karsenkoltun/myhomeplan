"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
  ShimmerButton,
} from "@/components/ui/motion";
import {
  ArrowRight,
  Shield,
  Handshake,
  MapPin,
  Calendar,
  Receipt,
  TrendingDown,
  Check,
} from "lucide-react";
import { SERVICES, FREQUENCY_MULTIPLIERS, type ServiceFrequency } from "@/data/services";
import { calculateIndividualComparison } from "@/lib/pricing";

// -------------------------------------------------------------------
// Usage:
//   Import on the homepage (page.tsx) after the benefits/solution section:
//     import { CostComparison } from "@/components/marketing/cost-comparison";
//     <CostComparison />
//
//   Import on the pricing page (pricing/page.tsx) above the plan tier cards:
//     import { CostComparison } from "@/components/marketing/cost-comparison";
//     <CostComparison compact />
// -------------------------------------------------------------------

interface ComparisonService {
  name: string;
  individualCost: number;
  planCost: number;
}

// Services to show in comparison (curated subset with friendly labels)
const COMPARISON_SERVICE_IDS = [
  "lawn-mowing",
  "snow-removal",
  "spring-fall-cleanup",
  "house-cleaning",
  "gutter-cleaning",
  "hvac-tuneup",
  "window-washing",
  "pest-control",
];

const FRIENDLY_LABELS: Record<string, string> = {
  "lawn-mowing": "Lawn Mowing (bi-weekly, 7 months)",
  "snow-removal": "Snow Removal (seasonal)",
  "spring-fall-cleanup": "Spring & Fall Cleanup",
  "house-cleaning": "House Cleaning (monthly)",
  "gutter-cleaning": "Gutter Cleaning (bi-annual)",
  "hvac-tuneup": "HVAC Tune-Up (bi-annual)",
  "window-washing": "Window Washing (bi-annual)",
  "pest-control": "Pest Control (quarterly)",
};

const comparisonData: ComparisonService[] = COMPARISON_SERVICE_IDS
  .map((id) => {
    const service = SERVICES.find((s) => s.id === id);
    if (!service) return null;
    const annualEvents = FREQUENCY_MULTIPLIERS[service.frequency as ServiceFrequency] ?? 1;
    const planCost = Math.round(service.basePrice * annualEvents);
    const individualCost = Math.round(calculateIndividualComparison(planCost));
    return {
      name: FRIENDLY_LABELS[id] || service.name,
      individualCost,
      planCost,
    };
  })
  .filter((d): d is ComparisonService => d !== null);

const individualTotal = comparisonData.reduce((sum, s) => sum + s.individualCost, 0);
const planTotal = comparisonData.reduce((sum, s) => sum + s.planCost, 0);
const totalSavings = individualTotal - planTotal;
const monthlySavings = Math.round(totalSavings / 12);
const savingsPercent = Math.round((totalSavings / individualTotal) * 100);

const explanations = [
  {
    title: "Bulk Negotiation",
    icon: Handshake,
    description:
      "We partner with contractors for volume rates that individual homeowners can't access.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Route Efficiency",
    icon: MapPin,
    description:
      "Planned scheduling means contractors optimize routes. Less drive time = lower costs for you.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Year-Round Work",
    icon: Calendar,
    description:
      "Contractors get steady, reliable income. In return, they offer preferred rates to plan members.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Zero Markup",
    icon: Receipt,
    description:
      "We pass negotiated savings directly to you. Our fee is built into the plan - no hidden markups.",
    color: "bg-violet-50 text-violet-600",
  },
];

function CostComparisonRow({
  service,
  index,
}: {
  service: ComparisonService;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  const savings = service.individualCost - service.planCost;

  return (
    <motion.tr
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="border-b border-border/50 last:border-0"
    >
      <td className="p-3 text-sm font-medium sm:p-4">{service.name}</td>
      <td className="p-3 text-center text-sm text-muted-foreground line-through decoration-red-400/60 sm:p-4">
        ${service.individualCost.toLocaleString()}/yr
      </td>
      <td className="p-3 text-center sm:p-4">
        <span className="text-sm font-semibold text-primary">
          ${service.planCost.toLocaleString()}/yr
        </span>
      </td>
      <td className="hidden p-3 text-center sm:table-cell sm:p-4">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.3, delay: index * 0.07 + 0.2 }}
          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700"
        >
          <TrendingDown className="h-3 w-3" />
          -${savings}
        </motion.span>
      </td>
    </motion.tr>
  );
}

// Mobile card variant for each service comparison
function CostComparisonCard({
  service,
  index,
}: {
  service: ComparisonService;
  index: number;
}) {
  const savings = service.individualCost - service.planCost;

  return (
    <StaggerItem>
      <div className="rounded-xl border border-border/50 bg-card p-4">
        <p className="text-sm font-medium">{service.name}</p>
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground line-through decoration-red-400/60">
              ${service.individualCost.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-primary">
              ${service.planCost.toLocaleString()}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            <TrendingDown className="h-3 w-3" />
            -${savings}
          </span>
        </div>
      </div>
    </StaggerItem>
  );
}

export function CostComparison({ compact = false }: { compact?: boolean }) {
  const savingsRef = useRef(null);
  const savingsInView = useInView(savingsRef, { once: true, margin: "-40px" });

  return (
    <section
      className={compact ? "py-10 sm:py-14" : "border-y bg-muted/20 py-16 sm:py-20"}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            {!compact && (
              <Badge
                variant="secondary"
                className="mb-4 border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
              >
                Real Savings
              </Badge>
            )}
            <h2
              className={
                compact
                  ? "text-xl font-bold tracking-tight sm:text-2xl"
                  : "text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
              }
            >
              See How Much You Save
            </h2>
            <p
              className={
                compact
                  ? "mt-2 text-sm text-muted-foreground"
                  : "mt-3 text-base text-muted-foreground sm:text-lg"
              }
            >
              Because you buy on a plan, we negotiate bulk rates with our contractor
              network. Here&apos;s what that means for your wallet.
            </p>
          </div>
        </FadeIn>

        {/* Desktop Table */}
        <div className="mx-auto mt-8 hidden max-w-4xl sm:mt-12 md:block">
          <div className="overflow-hidden rounded-2xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left font-medium text-muted-foreground">
                    Service
                  </th>
                  <th className="p-4 text-center font-medium text-red-400/80">
                    Individual Cost
                  </th>
                  <th className="p-4 text-center font-semibold text-primary">
                    My Home Plan
                  </th>
                  <th className="hidden p-4 text-center font-medium text-emerald-600 sm:table-cell">
                    You Save
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((service, i) => (
                  <CostComparisonRow key={service.name} service={service} index={i} />
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 bg-muted/30">
                  <td className="p-4 font-bold">Total Per Year</td>
                  <td className="p-4 text-center font-semibold text-muted-foreground">
                    ~${individualTotal.toLocaleString()}/yr
                  </td>
                  <td className="p-4 text-center font-bold text-primary">
                    ~${planTotal.toLocaleString()}/yr
                  </td>
                  <td className="hidden p-4 text-center sm:table-cell">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                      <TrendingDown className="h-4 w-4" />
                      -${totalSavings.toLocaleString()}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <StaggerContainer
          className="mt-6 grid gap-2.5 sm:mt-8 md:hidden"
          staggerDelay={0.06}
        >
          {comparisonData.map((service, i) => (
            <CostComparisonCard key={service.name} service={service} index={i} />
          ))}
          {/* Mobile Total */}
          <StaggerItem>
            <div className="mt-1 rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Total Per Year</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground line-through">
                    ${individualTotal.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    ${planTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Savings Callout */}
        <div ref={savingsRef} className={compact ? "mt-6 sm:mt-8" : "mt-10 sm:mt-14"}>
          <FadeIn>
            <div className="mx-auto max-w-2xl">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-blue-700 p-6 text-primary-foreground sm:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
                <div className="relative text-center">
                  <p className="text-sm font-medium uppercase tracking-wider opacity-80">
                    Your Annual Savings
                  </p>
                  <p
                    className={
                      compact
                        ? "mt-2 text-3xl font-bold sm:text-4xl"
                        : "mt-2 text-4xl font-bold sm:text-5xl"
                    }
                  >
                    Save up to{" "}
                    {savingsInView ? (
                      <AnimatedCounter
                        target={totalSavings}
                        prefix="$"
                        duration={1.8}
                      />
                    ) : (
                      "$0"
                    )}{" "}
                    per year
                  </p>
                  <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-6">
                    <span className="flex items-center gap-1.5 text-sm opacity-90 sm:text-base">
                      <Check className="h-4 w-4" />
                      That&apos;s ${monthlySavings}/month back in your pocket
                    </span>
                    <span className="flex items-center gap-1.5 text-sm opacity-90 sm:text-base">
                      <Check className="h-4 w-4" />
                      Save {savingsPercent}% on average
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Why We Can Offer Lower Prices */}
        {!compact && (
          <>
            <FadeIn delay={0.1}>
              <div className="mx-auto mt-14 max-w-2xl text-center sm:mt-20">
                <h3 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                  Why We Can Offer Lower Prices
                </h3>
              </div>
            </FadeIn>

            <StaggerContainer
              className="mx-auto mt-8 grid max-w-4xl gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6"
              staggerDelay={0.1}
            >
              {explanations.map((item) => (
                <StaggerItem key={item.title}>
                  <Card className="h-full border-border/50 transition-shadow hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold sm:text-base">
                            {item.title}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </>
        )}

        {/* Trust Callout */}
        <FadeIn delay={compact ? 0.15 : 0.3}>
          <div className={compact ? "mt-6 sm:mt-8" : "mt-10 sm:mt-14"}>
            <div className="mx-auto flex max-w-2xl items-center justify-center gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/50 px-5 py-4 text-center sm:gap-4 sm:px-8 sm:py-5">
              <Shield className="h-6 w-6 shrink-0 text-emerald-600 sm:h-7 sm:w-7" />
              <p className="text-xs font-medium text-emerald-800 sm:text-sm">
                We guarantee our plan pricing. No surprise charges. No rate hikes. Ever.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={compact ? 0.2 : 0.4}>
          <div className={compact ? "mt-6 text-center" : "mt-8 text-center sm:mt-10"}>
            <Link href="/onboarding">
              <ShimmerButton
                className={
                  compact
                    ? "h-10 w-full px-6 text-sm sm:w-auto"
                    : "h-12 w-full px-8 text-base sm:w-auto"
                }
              >
                Start Saving Today <ArrowRight className="ml-2 inline h-4 w-4" />
              </ShimmerButton>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
