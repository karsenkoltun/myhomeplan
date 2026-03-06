"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Building2, Check } from "lucide-react";
import { usePropertyStore, type BusinessType } from "@/stores/property-store";
import { cn } from "@/lib/utils";

const businessTypes: { value: BusinessType; label: string; description: string }[] = [
  { value: "sole-proprietor", label: "Sole Proprietor", description: "Individual owner" },
  { value: "partnership", label: "Partnership", description: "Two or more owners" },
  { value: "corporation", label: "Corporation", description: "Incorporated business" },
];

const okanaganCities = [
  "Kelowna",
  "West Kelowna",
  "Penticton",
  "Vernon",
  "Lake Country",
  "Summerland",
  "Peachland",
];

export function StepContractorBusiness() {
  const { contractor, setContractor } = usePropertyStore();

  const toggleCity = (city: string) => {
    const current = contractor.serviceArea;
    if (current.includes(city)) {
      setContractor({ serviceArea: current.filter((c) => c !== city) });
    } else {
      setContractor({ serviceArea: [...current, city] });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
          <Building2 className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Your Business</h2>
        <p className="mt-2 text-center text-muted-foreground">Tell us about your contracting business.</p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Business & Owner Name */}
        <Card>
          <CardContent className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div className="space-y-2">
              <Label>Business Name <span className="text-red-500">*</span></Label>
              <Input
                value={contractor.businessName}
                onChange={(e) => setContractor({ businessName: e.target.value })}
                placeholder="ABC Home Services"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Owner Name <span className="text-red-500">*</span></Label>
              <Input
                value={contractor.ownerName}
                onChange={(e) => setContractor({ ownerName: e.target.value })}
                placeholder="John Smith"
                className="h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Type */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <Label className="mb-3 block">Business Type</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {businessTypes.map((bt) => {
                const isSelected = contractor.businessType === bt.value;
                return (
                  <motion.button
                    key={bt.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setContractor({ businessType: bt.value })}
                    className={cn(
                      "relative rounded-xl border p-4 text-left transition-all",
                      isSelected
                        ? "border-sky-500 bg-sky-500/[0.06] shadow-sm"
                        : "border-border/50 hover:border-sky-500/30 hover:bg-muted/50"
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500"
                      >
                        <Check className="h-3 w-3 text-white" />
                      </motion.div>
                    )}
                    <p className="text-sm font-semibold">{bt.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{bt.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Years & Employees */}
        <Card>
          <CardContent className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div className="space-y-2">
              <Label>Years in Business</Label>
              <Input
                type="number"
                value={contractor.yearsInBusiness}
                onChange={(e) => setContractor({ yearsInBusiness: Math.max(0, Number(e.target.value)) })}
                min={0}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Number of Employees</Label>
              <Input
                type="number"
                value={contractor.employeeCount}
                onChange={(e) => setContractor({ employeeCount: Math.max(1, Number(e.target.value)) })}
                min={1}
                className="h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Area */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <Label className="mb-3 block">Service Area <span className="text-red-500">*</span></Label>
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

        {/* Website */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="space-y-2">
              <Label>Website <span className="text-xs text-muted-foreground">(optional)</span></Label>
              <Input
                type="url"
                value={contractor.website}
                onChange={(e) => setContractor({ website: e.target.value })}
                placeholder="https://www.yourbusiness.com"
                className="h-11"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
