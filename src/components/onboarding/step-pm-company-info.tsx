"use client";

import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Building2, Check } from "lucide-react";
import { usePropertyStore } from "@/stores/property-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { RequiredLabel, FieldError, type StepValidationRef } from "./shared";

const companyTypes = [
  { value: "residential", label: "Residential", description: "Houses, condos, townhomes" },
  { value: "commercial", label: "Commercial", description: "Office, retail, industrial" },
  { value: "mixed", label: "Mixed", description: "Both residential & commercial" },
  { value: "strata", label: "Strata Focused", description: "Primarily strata buildings" },
];

const pmCompanySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
});

export const StepPMCompanyInfo = forwardRef<StepValidationRef>(function StepPMCompanyInfo(_props, ref) {
  const { pm, setPM } = usePropertyStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState(false);

  const validate = useCallback(() => {
    const result = pmCompanySchema.safeParse({ companyName: pm.companyName });
    if (!result.success) {
      setErrors({ companyName: "Company name is required" });
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      toast.error("Please fill in the company name");
      return false;
    }
    setErrors({});
    return true;
  }, [pm.companyName]);

  useImperativeHandle(ref, () => ({ validate }), [validate]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
          <Building2 className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Company Information</h2>
        <p className="mt-2 text-center text-muted-foreground">Tell us about your property management company.</p>
      </div>

      <div className={cn("mt-8 space-y-6", shaking && "animate-shake")}>
        <Card>
          <CardContent className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div className="space-y-2 sm:col-span-2">
              <RequiredLabel>Company Name</RequiredLabel>
              <Input
                value={pm.companyName}
                onChange={(e) => { setPM({ companyName: e.target.value }); setErrors({}); }}
                placeholder="ABC Property Management"
                className={cn("h-11", errors.companyName && "ring-2 ring-red-500 border-red-500")}
              />
              <FieldError message={errors.companyName} />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Years in Business</RequiredLabel>
              <Input
                type="number"
                value={pm.yearsInBusiness}
                onChange={(e) => setPM({ yearsInBusiness: Math.max(0, Number(e.target.value)) })}
                min={0}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Number of Employees</RequiredLabel>
              <Input
                type="number"
                value={pm.employeeCount}
                onChange={(e) => setPM({ employeeCount: Math.max(1, Number(e.target.value)) })}
                min={1}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Website</RequiredLabel>
              <Input
                type="url"
                value={pm.website}
                onChange={(e) => setPM({ website: e.target.value })}
                placeholder="https://www.yourcompany.com"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Business Registration #</RequiredLabel>
              <Input
                value={pm.businessNumber}
                onChange={(e) => setPM({ businessNumber: e.target.value })}
                placeholder="e.g. BN123456789"
                className="h-11"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <RequiredLabel>GST/HST Number</RequiredLabel>
              <Input
                value={pm.gstNumber}
                onChange={(e) => setPM({ gstNumber: e.target.value })}
                placeholder="e.g. 123456789RT0001"
                className="h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Company Type */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <RequiredLabel>Company Type</RequiredLabel>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {companyTypes.map((ct) => {
                const isSelected = pm.companyType === ct.value;
                return (
                  <motion.button
                    key={ct.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPM({ companyType: ct.value })}
                    className={cn(
                      "relative rounded-xl border p-4 text-left transition-all",
                      isSelected
                        ? "border-violet-500 bg-violet-500/[0.06] shadow-sm"
                        : "border-border/50 hover:border-violet-500/30 hover:bg-muted/50"
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500"
                      >
                        <Check className="h-3 w-3 text-white" />
                      </motion.div>
                    )}
                    <p className="text-sm font-semibold">{ct.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{ct.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
