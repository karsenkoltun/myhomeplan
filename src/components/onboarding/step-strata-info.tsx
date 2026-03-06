"use client";

import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { usePropertyStore, type StrataContactRole } from "@/stores/property-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { StepValidationRef } from "./step-property-info";

// --- Validation ---

const strataInfoSchema = z.object({
  corporationName: z.string().min(1, "Corporation name is required"),
  strataPlanNumber: z.string().min(1, "Strata plan number is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactRole: z.enum(["property-manager", "council-president", "council-member", "owner", "other"], {
    message: "Please select a role",
  }),
  contactEmail: z.string().email("Please enter a valid email"),
  contactPhone: z.string().min(7, "Please enter a valid phone number"),
});

// --- Data ---

const contactRoles: { value: StrataContactRole; label: string }[] = [
  { value: "property-manager", label: "Property Manager" },
  { value: "council-president", label: "Council President" },
  { value: "council-member", label: "Council Member" },
  { value: "owner", label: "Owner" },
  { value: "other", label: "Other" },
];

// --- Helpers ---

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label>
      {children} <span className="text-red-500">*</span>
    </Label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

// --- Component ---

export const StepStrataInfo = forwardRef<StepValidationRef>(function StepStrataInfo(_props, ref) {
  const { strata, setStrata } = usePropertyStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState(false);

  const validate = useCallback(() => {
    const result = strataInfoSchema.safeParse({
      corporationName: strata.corporationName,
      strataPlanNumber: strata.strataPlanNumber,
      contactName: strata.contactName,
      contactRole: strata.contactRole,
      contactEmail: strata.contactEmail,
      contactPhone: strata.contactPhone,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const mapped: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(fieldErrors)) {
        if (msgs && msgs.length > 0) mapped[key] = msgs[0];
      }
      setErrors(mapped);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      toast.error("Please fill in all required fields");
      return false;
    }

    setErrors({});
    return true;
  }, [strata]);

  useImperativeHandle(ref, () => ({ validate }), [validate]);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Strata Corporation Details</h2>
      <p className="mt-2 text-center text-muted-foreground">Tell us about your strata so we can tailor everything to your building.</p>

      <div className={cn("mt-8 space-y-6", shaking && "animate-shake")}>
        {/* Corporation Info */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Strata Corporation</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <RequiredLabel>Corporation Name</RequiredLabel>
                <Input
                  value={strata.corporationName}
                  onChange={(e) => {
                    setStrata({ corporationName: e.target.value });
                    clearError("corporationName");
                  }}
                  placeholder="e.g. Strata Corporation BCS1234"
                  className={cn("h-11 transition-colors duration-200", errors.corporationName && "ring-2 ring-red-500 border-red-500")}
                />
                <FieldError message={errors.corporationName} />
              </div>
              <div className="space-y-2">
                <RequiredLabel>Strata Plan Number</RequiredLabel>
                <Input
                  value={strata.strataPlanNumber}
                  onChange={(e) => {
                    setStrata({ strataPlanNumber: e.target.value });
                    clearError("strataPlanNumber");
                  }}
                  placeholder="e.g. BCS1234 or VR1234"
                  className={cn("h-11 transition-colors duration-200", errors.strataPlanNumber && "ring-2 ring-red-500 border-red-500")}
                />
                <FieldError message={errors.strataPlanNumber} />
              </div>
              <div className="space-y-2">
                <Label>Property Management Company</Label>
                <Input
                  value={strata.managementCompany}
                  onChange={(e) => setStrata({ managementCompany: e.target.value })}
                  placeholder="Optional"
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Primary Contact */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Primary Contact</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <RequiredLabel>Contact Name</RequiredLabel>
                <Input
                  value={strata.contactName}
                  onChange={(e) => {
                    setStrata({ contactName: e.target.value });
                    clearError("contactName");
                  }}
                  placeholder="Full name"
                  className={cn("h-11 transition-colors duration-200", errors.contactName && "ring-2 ring-red-500 border-red-500")}
                />
                <FieldError message={errors.contactName} />
              </div>
              <div className="space-y-2">
                <RequiredLabel>Role</RequiredLabel>
                <Select
                  value={strata.contactRole}
                  onValueChange={(v: StrataContactRole) => {
                    setStrata({ contactRole: v });
                    clearError("contactRole");
                  }}
                >
                  <SelectTrigger className={cn("h-11 transition-colors duration-200", errors.contactRole && "ring-2 ring-red-500 border-red-500")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contactRoles.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.contactRole} />
              </div>
              <div className="space-y-2">
                <RequiredLabel>Email</RequiredLabel>
                <Input
                  type="email"
                  value={strata.contactEmail}
                  onChange={(e) => {
                    setStrata({ contactEmail: e.target.value });
                    clearError("contactEmail");
                  }}
                  placeholder="contact@strata.com"
                  className={cn("h-11 transition-colors duration-200", errors.contactEmail && "ring-2 ring-red-500 border-red-500")}
                />
                <FieldError message={errors.contactEmail} />
              </div>
              <div className="space-y-2">
                <RequiredLabel>Phone</RequiredLabel>
                <Input
                  type="tel"
                  value={strata.contactPhone}
                  onChange={(e) => {
                    setStrata({ contactPhone: e.target.value });
                    clearError("contactPhone");
                  }}
                  placeholder="250-555-0123"
                  className={cn("h-11 transition-colors duration-200", errors.contactPhone && "ring-2 ring-red-500 border-red-500")}
                />
                <FieldError message={errors.contactPhone} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
