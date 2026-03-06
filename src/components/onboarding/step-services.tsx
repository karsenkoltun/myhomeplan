"use client";

import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Check, CheckCircle2, ChevronDown, Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap, Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair, Info, type LucideIcon } from "lucide-react";
import { SERVICES, SERVICE_CATEGORIES, type ServiceCategory, type Service } from "@/data/services";
import { usePlanStore } from "@/stores/plan-store";
import { usePropertyStore } from "@/stores/property-store";
import { calculateServicePrice } from "@/lib/pricing";
import { SpringNumber } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { StepValidationRef } from "./step-property-info";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
};

function ServiceDetails({ service }: { service: Service }) {
  return (
    <div className="space-y-3">
      {/* What's included */}
      <div>
        <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          What&apos;s included
        </h4>
        <ul className="space-y-1">
          {service.includes.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-foreground/80 sm:text-sm">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* What to expect */}
      <div>
        <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          What to expect
        </h4>
        <p className="text-xs leading-relaxed text-foreground/70 sm:text-sm">
          {service.whatToExpect}
        </p>
      </div>

      {/* Why it matters */}
      <div className="rounded-lg border border-primary/20 bg-primary/[0.04] p-2.5 sm:p-3">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <p className="text-xs font-medium leading-relaxed text-primary sm:text-sm">
            {service.whyItMatters}
          </p>
        </div>
      </div>
    </div>
  );
}

export const StepServices = forwardRef<StepValidationRef>(function StepServices(_props, ref) {
  const { selectedServices, toggleService } = usePlanStore();
  const { property } = usePropertyStore();
  const categories = Object.keys(SERVICE_CATEGORIES) as ServiceCategory[];
  const [showError, setShowError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [sheetService, setSheetService] = useState<Service | null>(null);

  const totalMonthly = SERVICES.filter((s) => selectedServices.includes(s.id)).reduce(
    (sum, s) => sum + calculateServicePrice(s, property.homeSqft, property.lotSqft, undefined, property),
    0
  );

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

  // Clear error when a service is selected
  const handleToggle = (serviceId: string) => {
    toggleService(serviceId);
    if (showError) setShowError(false);
  };

  const handleLearnMore = (e: React.MouseEvent, service: Service) => {
    e.stopPropagation();
    // On mobile (< 640px), show sheet. On desktop, expand inline.
    if (window.innerWidth < 640) {
      setSheetService(service);
    } else {
      setExpandedService(expandedService === service.id ? null : service.id);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Choose your services</h2>
      <p className="mt-2 text-center text-muted-foreground">Select the services your home needs. Pricing is based on your property details.</p>

      {/* Floating total */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-20 z-10 mt-6 flex items-center justify-between rounded-xl border bg-background/95 p-3 shadow-sm backdrop-blur-sm sm:p-4"
      >
        <div>
          <span className="text-sm text-muted-foreground">{selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""} selected</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary">
            $<SpringNumber value={Math.round(totalMonthly)} />
          </span>
          <span className="text-sm text-muted-foreground">/mo</span>
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

      <div className={cn("mt-6 space-y-6", shaking && "animate-shake")}>
        {categories.map((category) => {
          const categoryServices = SERVICES.filter((s) => s.category === category);
          const info = SERVICE_CATEGORIES[category];
          const selectedCount = categoryServices.filter((s) => selectedServices.includes(s.id)).length;

          return (
            <Card key={category}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{info.label}</CardTitle>
                    <p className="mt-0.5 text-xs text-muted-foreground">{info.description}</p>
                  </div>
                  {selectedCount > 0 && (
                    <Badge className="bg-primary/10 text-primary">{selectedCount} selected</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {categoryServices.map((service) => {
                    const Icon = ICON_MAP[service.icon] || CheckCircle2;
                    const isSelected = selectedServices.includes(service.id);
                    const isExpanded = expandedService === service.id;
                    const price = calculateServicePrice(service, property.homeSqft, property.lotSqft, undefined, property);

                    return (
                      <div key={service.id} className="flex flex-col">
                        <motion.div
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleToggle(service.id)}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors sm:p-4",
                            isExpanded && "rounded-b-none border-b-0",
                            isSelected
                              ? "border-primary bg-primary/[0.04] shadow-sm"
                              : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
                          )}
                        >
                          <motion.div
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                              isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                            }`}
                            animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                          >
                            {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                          </motion.div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                              <span className="truncate text-xs font-semibold sm:text-sm">{service.name}</span>
                              {service.popular && (
                                <Badge variant="secondary" className="bg-amber-100 px-1 py-0 text-[9px] text-amber-700">Popular</Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">{service.frequencyLabel}</span>
                              <span className="text-xs font-semibold text-primary">${price.toFixed(0)}/mo</span>
                            </div>
                            {/* Learn more toggle */}
                            <button
                              type="button"
                              onClick={(e) => handleLearnMore(e, service)}
                              className="group mt-0.5 flex items-center gap-1 text-[10px] font-medium text-muted-foreground transition-colors hover:text-primary sm:text-xs"
                            >
                              <span>{isExpanded ? "Show less" : "Learn more"}</span>
                              <ChevronDown
                                className={cn(
                                  "h-3 w-3 transition-transform duration-200",
                                  isExpanded && "rotate-180"
                                )}
                              />
                            </button>
                          </div>
                        </motion.div>

                        {/* Desktop: inline expandable details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="hidden overflow-hidden sm:block"
                            >
                              <div
                                className={cn(
                                  "rounded-b-xl border border-t-0 p-4",
                                  isSelected
                                    ? "border-primary bg-primary/[0.02]"
                                    : "border-border/50"
                                )}
                              >
                                <ServiceDetails service={service} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mobile: bottom sheet for service details */}
      <Sheet open={!!sheetService} onOpenChange={(open) => !open && setSheetService(null)}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
          {sheetService && (
            <>
              <SheetHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = ICON_MAP[sheetService.icon] || CheckCircle2;
                    return <Icon className="h-5 w-5 text-primary" />;
                  })()}
                  <SheetTitle>{sheetService.name}</SheetTitle>
                </div>
                <SheetDescription>{sheetService.description}</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-6">
                <ServiceDetails service={sheetService} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
});
