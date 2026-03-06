"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CheckCircle2, Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap, Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair, type LucideIcon } from "lucide-react";
import { SERVICES, SERVICE_CATEGORIES, type ServiceCategory } from "@/data/services";
import { usePlanStore } from "@/stores/plan-store";
import { usePropertyStore } from "@/stores/property-store";
import { calculateServicePrice } from "@/lib/pricing";
import { SpringNumber } from "@/components/ui/motion";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
};

export function StepServices() {
  const { selectedServices, toggleService } = usePlanStore();
  const { property } = usePropertyStore();
  const categories = Object.keys(SERVICE_CATEGORIES) as ServiceCategory[];

  const totalMonthly = SERVICES.filter((s) => selectedServices.includes(s.id)).reduce(
    (sum, s) => sum + calculateServicePrice(s, property.homeSqft, property.lotSqft),
    0
  );

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

      <div className="mt-6 space-y-6">
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
                    const price = calculateServicePrice(service, property.homeSqft, property.lotSqft);

                    return (
                      <motion.div
                        key={service.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleService(service.id)}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors sm:p-4 ${
                          isSelected
                            ? "border-primary bg-primary/[0.04] shadow-sm"
                            : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
                        }`}
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
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
