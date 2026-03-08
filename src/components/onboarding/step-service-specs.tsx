"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap, Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { usePlanStore } from "@/stores/plan-store";
import { usePropertyStore } from "@/stores/property-store";
import { SERVICES, SERVICE_FREQUENCY_OPTIONS } from "@/data/services";
import { SERVICE_SPECS, type SpecField } from "@/data/property-specs";
import { calculateServicePrice } from "@/lib/pricing";
import { SpringNumber } from "@/components/ui/motion";
import { Clock } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
};

export function StepServiceSpecs() {
  const { selectedServices, serviceFrequencies, setServiceFrequency } = usePlanStore();
  const { property, serviceSpecs, setServiceSpec } = usePropertyStore();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(selectedServices.slice(0, 1)));

  const selectedServiceData = SERVICES.filter((s) => selectedServices.includes(s.id));

  const totalMonthly = selectedServiceData.reduce(
    (sum, s) => sum + calculateServicePrice(s, property.homeSqft, property.lotSqft, serviceSpecs[s.id], property, serviceFrequencies[s.id]),
    0
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Customize your services</h2>
      <p className="mt-2 text-center text-muted-foreground">Fine-tune each service for accurate pricing. Skip this step to use defaults.</p>

      {/* Total */}
      <motion.div className="sticky top-20 z-10 mt-6 flex items-center justify-between rounded-xl border bg-background/95 p-3 shadow-sm backdrop-blur-sm sm:p-4">
        <span className="text-sm text-muted-foreground">{selectedServices.length} services</span>
        <div>
          <span className="text-2xl font-bold text-primary">$<SpringNumber value={Math.round(totalMonthly)} /></span>
          <span className="text-sm text-muted-foreground">/mo</span>
        </div>
      </motion.div>

      <div className="mt-6 space-y-3">
        {selectedServiceData.map((service) => {
          const spec = SERVICE_SPECS.find((s) => s.serviceId === service.id);
          const Icon = ICON_MAP[service.icon] || CheckCircle2;
          const isOpen = openSections.has(service.id);
          const price = calculateServicePrice(service, property.homeSqft, property.lotSqft, serviceSpecs[service.id], property, serviceFrequencies[service.id]);
          const frequencyOptions = SERVICE_FREQUENCY_OPTIONS[service.id];
          const currentFrequency = serviceFrequencies[service.id] || service.frequency;

          return (
            <Card key={service.id} className={isOpen ? "border-primary/30" : ""}>
              <button
                onClick={() => toggleSection(service.id)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">{service.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary">${(Number.isFinite(price) ? price : 0).toFixed(0)}/mo</span>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && spec && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="border-t pt-4">
                      {/* Frequency selector */}
                      {frequencyOptions && frequencyOptions.length > 1 && (
                        <div className="mb-4 space-y-1.5">
                          <Label className="flex items-center gap-1.5 text-xs">
                            <Clock className="h-3 w-3" /> How often?
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {frequencyOptions.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setServiceFrequency(service.id, opt.value)}
                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                                  currentFrequency === opt.value
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border text-muted-foreground hover:border-primary/50"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="grid gap-4 sm:grid-cols-2">
                        {spec.fields.map((field) => (
                          <SpecFieldInput
                            key={field.id}
                            field={field}
                            value={serviceSpecs[service.id]?.[field.id] ?? field.defaultValue}
                            onChange={(val) => setServiceSpec(service.id, field.id, val)}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function SpecFieldInput({
  field,
  value,
  onChange,
}: {
  field: SpecField;
  value: string | number | boolean;
  onChange: (val: string | number | boolean) => void;
}) {
  switch (field.type) {
    case "number":
      return (
        <div className="space-y-1.5">
          <Label className="text-xs">{field.label}{field.unit && ` (${field.unit})`}</Label>
          <Input
            type="number"
            value={value as number}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
            min={field.min}
            max={field.max}
            step={field.step}
            className="h-10"
          />
          {field.pricingImpact && <p className="text-xs text-muted-foreground">{field.pricingImpact}</p>}
        </div>
      );
    case "select":
      return (
        <div className="space-y-1.5">
          <Label className="text-xs">{field.label}</Label>
          <Select value={value as string} onValueChange={onChange}>
            <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {field.pricingImpact && <p className="text-xs text-muted-foreground">{field.pricingImpact}</p>}
        </div>
      );
    case "boolean":
      return (
        <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
          <div>
            <Label className="text-xs">{field.label}</Label>
            {field.pricingImpact && <p className="text-xs text-muted-foreground">{field.pricingImpact}</p>}
          </div>
          <Switch checked={value as boolean} onCheckedChange={onChange} />
        </div>
      );
    case "range":
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">{field.label}</Label>
            <motion.span key={value as number} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-sm font-bold text-primary">
              {value as number}
            </motion.span>
          </div>
          <Slider
            value={[value as number]}
            onValueChange={([v]) => onChange(v)}
            min={field.min}
            max={field.max}
            step={field.step}
          />
          {field.pricingImpact && <p className="text-xs text-muted-foreground">{field.pricingImpact}</p>}
        </div>
      );
  }
}
