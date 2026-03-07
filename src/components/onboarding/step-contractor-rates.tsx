"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Shield,
  Users,
  Scissors,
  Snowflake,
  Thermometer,
  Sparkles,
  Bug,
  Hammer,
  Wrench,
  Zap,
  Sprout,
  Leaf,
  Droplets,
  Waves,
  Sun,
  Paintbrush,
  Armchair,
  type LucideIcon,
} from "lucide-react";
import { SERVICES } from "@/data/services";
import { usePropertyStore } from "@/stores/property-store";
import { calculateContractorPayout } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
};

const benefits = [
  {
    icon: Users,
    title: "Guaranteed Volume",
    description: "Steady stream of jobs in your area, no marketing needed",
  },
  {
    icon: Shield,
    title: "Guaranteed Payment",
    description: "We handle billing and collections - you always get paid on time",
  },
  {
    icon: TrendingUp,
    title: "Zero Overhead",
    description: "No advertising, no quotes, no client acquisition costs",
  },
];

export const StepContractorRates = forwardRef<{ validate: () => boolean }>(
  function StepContractorRates(_props, _ref) {
    const { contractor, setContractor } = usePropertyStore();

    const selectedServiceData = SERVICES.filter((s) =>
      contractor.servicesOffered.includes(s.id)
    );

    const updateRate = (serviceId: string, value: string) => {
      const numericValue = parseFloat(value) || 0;
      setContractor({
        serviceRates: {
          ...contractor.serviceRates,
          [serviceId]: numericValue,
        },
      });
    };

    return (
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">
          Your service rates
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Tell us what you currently charge individually. This helps us show you
          how the network compares.
        </p>

        {/* Value proposition */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 rounded-xl border border-sky-500/20 bg-sky-50/50 p-4 dark:bg-sky-950/20"
        >
          <h3 className="text-sm font-semibold text-sky-700 dark:text-sky-400">
            Why contractors love the network
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-start gap-2">
                <b.icon className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                <div>
                  <p className="text-xs font-semibold">{b.title}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rate cards */}
        <div className="mt-6 space-y-3">
          {selectedServiceData.map((service, index) => {
            const Icon = ICON_MAP[service.icon] || CheckCircle2;
            const individualRate = contractor.serviceRates[service.id] || 0;
            const networkPayout = calculateContractorPayout(service.basePrice);
            const savingsVsRate =
              individualRate > 0
                ? Math.round((networkPayout / individualRate) * 100)
                : null;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10">
                        <Icon className="h-4 w-4 text-sky-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {service.name}
                          </span>
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-3">
                          {/* Their rate */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                              Your individual rate
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                type="number"
                                min={0}
                                step={5}
                                value={individualRate || ""}
                                onChange={(e) =>
                                  updateRate(service.id, e.target.value)
                                }
                                placeholder="0"
                                className="h-9 pl-7 text-sm"
                              />
                            </div>
                          </div>

                          {/* Network payout */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                              Network payout
                            </label>
                            <div className="flex h-9 items-center rounded-md border bg-muted/50 px-3">
                              <span className="text-sm font-semibold text-sky-600">
                                ${networkPayout.toFixed(2)}
                              </span>
                              <span className="ml-1 text-[10px] text-muted-foreground">
                                /service
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Comparison callout */}
                        {savingsVsRate !== null && individualRate > 0 && (
                          <div
                            className={cn(
                              "mt-2 rounded-md px-2.5 py-1.5 text-[11px]",
                              savingsVsRate >= 70
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                            )}
                          >
                            Network payout is {savingsVsRate}% of your rate, but
                            with zero marketing, billing, or acquisition costs
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Rates are optional and for comparison only. Your network payout is
          always based on the service plan price.
        </p>
      </div>
    );
  }
);
