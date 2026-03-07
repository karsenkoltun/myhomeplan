"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { MapPin, Check } from "lucide-react";
import { usePropertyStore } from "@/stores/property-store";
import { cn } from "@/lib/utils";

const okanaganCities = [
  "Kelowna",
  "West Kelowna",
  "Penticton",
  "Vernon",
  "Lake Country",
  "Summerland",
  "Peachland",
];

const months = [
  { key: "jan", label: "Jan" },
  { key: "feb", label: "Feb" },
  { key: "mar", label: "Mar" },
  { key: "apr", label: "Apr" },
  { key: "may", label: "May" },
  { key: "jun", label: "Jun" },
  { key: "jul", label: "Jul" },
  { key: "aug", label: "Aug" },
  { key: "sep", label: "Sep" },
  { key: "oct", label: "Oct" },
  { key: "nov", label: "Nov" },
  { key: "dec", label: "Dec" },
];

export function StepContractorServiceArea() {
  const { contractor, setContractor } = usePropertyStore();

  const toggleCity = (city: string) => {
    const current = contractor.serviceArea;
    if (current.includes(city)) {
      setContractor({ serviceArea: current.filter((c) => c !== city) });
    } else {
      setContractor({ serviceArea: [...current, city] });
    }
  };

  const toggleMonth = (month: string) => {
    const current = contractor.seasonalAvailability;
    setContractor({
      seasonalAvailability: { ...current, [month]: !current[month] },
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
          <MapPin className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Service Area</h2>
        <p className="mt-2 text-center text-muted-foreground">Where do you operate and when are you available?</p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Cities */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <Label className="mb-3 block">Cities You Service <span className="text-red-500">*</span></Label>
            <p className="mb-3 text-xs text-muted-foreground">Select all cities you service in the Okanagan.</p>
            <div className="flex flex-wrap gap-2">
              {okanaganCities.map((city) => {
                const isSelected = contractor.serviceArea.includes(city);
                return (
                  <motion.button
                    key={city}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleCity(city)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                      isSelected
                        ? "border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-400"
                        : "border-border/50 text-muted-foreground hover:border-sky-500/30 hover:bg-muted/50"
                    )}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                    {city}
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Max Travel Distance */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Maximum Travel Distance</Label>
                <span className="text-sm font-semibold tabular-nums">{contractor.maxTravelDistance} km</span>
              </div>
              <Slider
                value={[contractor.maxTravelDistance]}
                onValueChange={([v]) => setContractor({ maxTravelDistance: v })}
                min={10}
                max={150}
                step={5}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10 km</span>
                <span>50 km</span>
                <span>100 km</span>
                <span>150 km</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Availability */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <Label className="mb-1 block">Seasonal Availability</Label>
            <p className="mb-4 text-xs text-muted-foreground">Which months are you available to work? Deselect months you take off.</p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {months.map((m) => {
                const isAvailable = contractor.seasonalAvailability[m.key] !== false;
                return (
                  <motion.button
                    key={m.key}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleMonth(m.key)}
                    className={cn(
                      "rounded-lg border py-2 text-center text-sm font-medium transition-all",
                      isAvailable
                        ? "border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-400"
                        : "border-border/50 text-muted-foreground/50 hover:border-sky-500/30"
                    )}
                  >
                    {m.label}
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
