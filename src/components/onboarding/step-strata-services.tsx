"use client";

import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Check,
  CheckCircle2,
  Scissors,
  Snowflake,
  Thermometer,
  Sparkles,
  Bug,
  Waves,
  Droplets,
  Sun,
  Car,
  ArrowUpDown,
  type LucideIcon,
  TrendingDown,
} from "lucide-react";
import { STRATA_SERVICES, calculateStrataServicePrice, type StrataService } from "@/data/strata-services";
import { usePlanStore } from "@/stores/plan-store";
import { usePropertyStore } from "@/stores/property-store";
import { SpringNumber } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { StepValidationRef } from "./step-property-info";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Waves, Droplets, Sun, Car, ArrowUpDown,
};

// Frequency options for strata services
const frequencyOptions = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "biannual", label: "2x per year" },
  { value: "annual", label: "Annual" },
  { value: "as-needed", label: "As needed" },
];

// Volume discount tiers
function getVolumeDiscount(units: number): { percent: number; label: string } | null {
  if (units >= 200) return { percent: 15, label: "200+ Units: 15% Off" };
  if (units >= 100) return { percent: 10, label: "100+ Units: 10% Off" };
  if (units >= 50) return { percent: 5, label: "50+ Units: 5% Off" };
  return null;
}

function applyDiscount(price: number, units: number): number {
  const discount = getVolumeDiscount(units);
  if (!discount) return price;
  return price * (1 - discount.percent / 100);
}

export const StepStrataServices = forwardRef<StepValidationRef>(function StepStrataServices(_props, ref) {
  const { selectedServices, toggleService } = usePlanStore();
  const { strata, serviceSpecs, setServiceSpec } = usePropertyStore();
  const [showError, setShowError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const unitCount = strata.unitCount;
  const commonArea = strata.commonAreaSqft;
  const volumeDiscount = getVolumeDiscount(unitCount);

  // Calculate totals
  const selectedStrataServices = STRATA_SERVICES.filter((s) => selectedServices.includes(s.id));
  const totalMonthlyBeforeDiscount = selectedStrataServices.reduce(
    (sum, s) => sum + calculateStrataServicePrice(s, unitCount, commonArea),
    0
  );
  const totalMonthly = applyDiscount(totalMonthlyBeforeDiscount, unitCount);
  const perUnitMonthly = unitCount > 0 ? totalMonthly / unitCount : 0;

  const validate = useCallback(() => {
    if (selectedServices.length === 0) {
      setShowError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      toast.error("Please select at least one service");
      return false;
    }
    setShowError(false);
    return true;
  }, [selectedServices.length]);

  useImperativeHandle(ref, () => ({ validate }), [validate]);

  const handleToggle = (serviceId: string) => {
    toggleService(serviceId);
    if (showError) setShowError(false);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Choose your building services</h2>
      <p className="mt-2 text-center text-muted-foreground">
        Select services for your {unitCount}-unit building. Pricing is per unit per month.
      </p>

      {/* Floating total bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-20 z-10 mt-6 rounded-xl border bg-background/95 p-3 shadow-sm backdrop-blur-sm sm:p-4"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-sm text-muted-foreground">
              {selectedServices.filter((id) => STRATA_SERVICES.some((s) => s.id === id)).length} service{selectedServices.filter((id) => STRATA_SERVICES.some((s) => s.id === id)).length !== 1 ? "s" : ""} selected
            </span>
            {volumeDiscount && (
              <div className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-600">{volumeDiscount.label}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div>
              <span className="text-2xl font-bold text-primary">
                $<SpringNumber value={Math.round(totalMonthly)} />
              </span>
              <span className="text-sm text-muted-foreground">/mo total</span>
            </div>
            <div className="text-xs text-muted-foreground">
              $<SpringNumber value={Math.round(perUnitMonthly)} />/unit/mo
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error message */}
      {showError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center dark:border-red-900 dark:bg-red-950/50"
        >
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Please select at least one service to continue
          </p>
        </motion.div>
      )}

      {/* Service cards */}
      <div className={cn("mt-6 space-y-2.5", shaking && "animate-shake")}>
        {STRATA_SERVICES.map((service) => {
          const Icon = ICON_MAP[service.icon] || CheckCircle2;
          const isSelected = selectedServices.includes(service.id);
          const rawPrice = calculateStrataServicePrice(service, unitCount, commonArea);
          const price = applyDiscount(rawPrice, unitCount);
          const perUnit = unitCount > 0 ? price / unitCount : 0;
          const customFrequency = serviceSpecs[service.id]?.frequency as string | undefined;

          return (
            <Card
              key={service.id}
              className={cn(
                "transition-all",
                isSelected ? "border-primary/40 shadow-sm" : ""
              )}
            >
              <div className="flex items-start gap-3 p-3 sm:p-4">
                {/* Checkbox */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleToggle(service.id)}
                  className="mt-1 shrink-0"
                >
                  <motion.div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors",
                      isSelected ? "border-primary bg-primary" : "border-muted-foreground/30 hover:border-primary/50"
                    )}
                    animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                  >
                    {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                  </motion.div>
                </motion.button>

                {/* Content */}
                <div
                  className="min-w-0 flex-1 cursor-pointer"
                  onClick={() => handleToggle(service.id)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-4 w-4 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-semibold">{service.name}</span>
                    {volumeDiscount && isSelected && (
                      <Badge className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0 dark:bg-emerald-900/40 dark:text-emerald-400">
                        {volumeDiscount.percent}% off
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{service.description}</p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      Default: {service.frequency}
                    </span>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-primary">${price.toFixed(0)}/mo</span>
                      <span className="ml-1.5 text-[10px] text-muted-foreground">(${perUnit.toFixed(2)}/unit)</span>
                    </div>
                  </div>
                </div>

                {/* Frequency selector - only show when selected */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    className="shrink-0"
                  >
                    <Label className="text-[10px] text-muted-foreground">Frequency</Label>
                    <Select
                      value={customFrequency || service.frequency.toLowerCase().replace(/\s+/g, "-")}
                      onValueChange={(v) => setServiceSpec(service.id, "frequency", v)}
                    >
                      <SelectTrigger className="h-8 w-[110px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((f) => (
                          <SelectItem key={f.value} value={f.value} className="text-xs">{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
});
