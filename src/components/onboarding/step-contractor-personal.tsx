"use client";

import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { usePropertyStore } from "@/stores/property-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { UserCircle } from "lucide-react";
import { RequiredLabel, FieldError, type StepValidationRef } from "./shared";

const provinces = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"];

const contractorPersonalSchema = z.object({
  ownerName: z.string().min(1, "Legal name is required"),
  personalAddress: z.string().min(1, "Address is required"),
  personalCity: z.string().min(1, "City is required"),
  personalProvince: z.string().min(1, "Province is required"),
  personalPostalCode: z.string().min(1, "Postal code is required"),
});

export const StepContractorPersonal = forwardRef<StepValidationRef>(function StepContractorPersonal(_props, ref) {
  const { contractor, setContractor } = usePropertyStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState(false);

  const validate = useCallback(() => {
    const result = contractorPersonalSchema.safeParse({
      ownerName: contractor.ownerName,
      personalAddress: contractor.personalAddress,
      personalCity: contractor.personalCity,
      personalProvince: contractor.personalProvince,
      personalPostalCode: contractor.personalPostalCode,
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
  }, [contractor]);

  useImperativeHandle(ref, () => ({ validate }), [validate]);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
          <UserCircle className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Personal Information</h2>
        <p className="mt-2 text-center text-muted-foreground">We need your details for verification and tax purposes.</p>
      </div>

      <div className={cn("mt-8 space-y-6", shaking && "animate-shake")}>
        {/* Legal Name & DOB */}
        <Card>
          <CardContent className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div className="space-y-2 sm:col-span-2">
              <RequiredLabel>Legal Full Name</RequiredLabel>
              <Input
                value={contractor.ownerName}
                onChange={(e) => { setContractor({ ownerName: e.target.value }); clearError("ownerName"); }}
                placeholder="John Michael Smith"
                className={cn("h-11", errors.ownerName && "ring-2 ring-red-500 border-red-500")}
              />
              <FieldError message={errors.ownerName} />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Date of Birth</RequiredLabel>
              <Input
                type="date"
                value={contractor.dateOfBirth}
                onChange={(e) => setContractor({ dateOfBirth: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Phone</RequiredLabel>
              <Input
                type="tel"
                value={contractor.emergencyContactPhone ? "" : ""}
                onChange={() => {}}
                placeholder="250-555-0123"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">We'll collect your phone on the next steps.</p>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Home / Business Address</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <RequiredLabel>Street Address</RequiredLabel>
                <Input
                  value={contractor.personalAddress}
                  onChange={(e) => { setContractor({ personalAddress: e.target.value }); clearError("personalAddress"); }}
                  placeholder="123 Main Street"
                  className={cn("h-11", errors.personalAddress && "ring-2 ring-red-500 border-red-500")}
                />
                <FieldError message={errors.personalAddress} />
              </div>
              <div className="space-y-2">
                <RequiredLabel>City</RequiredLabel>
                <Input
                  value={contractor.personalCity}
                  onChange={(e) => { setContractor({ personalCity: e.target.value }); clearError("personalCity"); }}
                  placeholder="Kelowna"
                  className={cn("h-11", errors.personalCity && "ring-2 ring-red-500 border-red-500")}
                />
                <FieldError message={errors.personalCity} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <RequiredLabel>Province</RequiredLabel>
                  <Select value={contractor.personalProvince || "BC"} onValueChange={(v) => { setContractor({ personalProvince: v }); clearError("personalProvince"); }}>
                    <SelectTrigger className={cn("h-11", errors.personalProvince && "ring-2 ring-red-500 border-red-500")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.personalProvince} />
                </div>
                <div className="space-y-2">
                  <RequiredLabel>Postal Code</RequiredLabel>
                  <Input
                    value={contractor.personalPostalCode}
                    onChange={(e) => { setContractor({ personalPostalCode: e.target.value.toUpperCase() }); clearError("personalPostalCode"); }}
                    placeholder="V1Y 1A1"
                    maxLength={7}
                    className={cn("h-11", errors.personalPostalCode && "ring-2 ring-red-500 border-red-500")}
                  />
                  <FieldError message={errors.personalPostalCode} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact & Preferred Contact */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Emergency Contact</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <RequiredLabel>Emergency Contact Name</RequiredLabel>
                <Input
                  value={contractor.emergencyContactName}
                  onChange={(e) => setContractor({ emergencyContactName: e.target.value })}
                  placeholder="Jane Smith"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <RequiredLabel>Emergency Contact Phone</RequiredLabel>
                <Input
                  type="tel"
                  value={contractor.emergencyContactPhone}
                  onChange={(e) => setContractor({ emergencyContactPhone: e.target.value })}
                  placeholder="250-555-0456"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <RequiredLabel>Preferred Contact Method</RequiredLabel>
                <Select value={contractor.preferredContact} onValueChange={(v) => setContractor({ preferredContact: v })}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="text">Text Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
