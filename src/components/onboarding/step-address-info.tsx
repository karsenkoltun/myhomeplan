"use client";

import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { useUserStore } from "@/stores/user-store";
import { usePropertyStore } from "@/stores/property-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import { RequiredLabel, FieldError, type StepValidationRef } from "./shared";

const provinces = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"];

const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

export const StepAddressInfo = forwardRef<StepValidationRef>(function StepAddressInfo(_props, ref) {
  const { account, setAccount } = useUserStore();
  const { setProperty } = usePropertyStore();

  const [street, setStreet] = useState(account?.address?.street || "");
  const [unit, setUnit] = useState(account?.address?.unit || "");
  const [city, setCity] = useState(account?.address?.city || "");
  const [province, setProvince] = useState(account?.address?.province || "BC");
  const [postalCode, setPostalCode] = useState(account?.address?.postalCode || "");
  const [mailingAddressSame, setMailingAddressSame] = useState(account?.mailingAddressSame ?? true);
  const [mailingStreet, setMailingStreet] = useState(account?.mailingAddress?.street || "");
  const [mailingUnit, setMailingUnit] = useState(account?.mailingAddress?.unit || "");
  const [mailingCity, setMailingCity] = useState(account?.mailingAddress?.city || "");
  const [mailingProvince, setMailingProvince] = useState(account?.mailingAddress?.province || "BC");
  const [mailingPostalCode, setMailingPostalCode] = useState(account?.mailingAddress?.postalCode || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState(false);

  const validate = useCallback(() => {
    const result = addressSchema.safeParse({ street, city, province, postalCode });

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
    if (account) {
      setAccount({
        ...account,
        address: { street, unit, city, province, postalCode },
        mailingAddressSame,
        mailingAddress: mailingAddressSame ? undefined : { street: mailingStreet, unit: mailingUnit, city: mailingCity, province: mailingProvince, postalCode: mailingPostalCode },
      });
    }
    // Also set property address for pricing
    const fullAddress = `${street}${unit ? ` ${unit}` : ""}, ${city}, ${province} ${postalCode}`;
    setProperty({ address: fullAddress });
    return true;
  }, [street, unit, city, province, postalCode, mailingAddressSame, mailingStreet, mailingUnit, mailingCity, mailingProvince, mailingPostalCode, account, setAccount, setProperty]);

  useImperativeHandle(ref, () => ({ validate }), [validate]);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MapPin className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Your Address</h2>
        <p className="mt-2 text-center text-muted-foreground">Where is the property we&apos;ll be servicing?</p>
      </div>

      <div className={cn("mt-8 space-y-6", shaking && "animate-shake")}>
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Service Address</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <RequiredLabel>Street Address</RequiredLabel>
                <Input
                  value={street}
                  onChange={(e) => { setStreet(e.target.value); clearError("street"); }}
                  placeholder="123 Main Street"
                  className={cn("h-11", errors.street && "ring-2 ring-red-500 border-red-500")}
                />
                <FieldError message={errors.street} />
              </div>
              <div className="space-y-2">
                <Label>Unit / Suite <span className="text-xs text-muted-foreground">(optional)</span></Label>
                <Input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Apt 4B"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <RequiredLabel>City</RequiredLabel>
                <Input
                  value={city}
                  onChange={(e) => { setCity(e.target.value); clearError("city"); }}
                  placeholder="Kelowna"
                  className={cn("h-11", errors.city && "ring-2 ring-red-500 border-red-500")}
                />
                <FieldError message={errors.city} />
              </div>
              <div className="space-y-2">
                <RequiredLabel>Province</RequiredLabel>
                <Select value={province} onValueChange={(v) => { setProvince(v); clearError("province"); }}>
                  <SelectTrigger className={cn("h-11", errors.province && "ring-2 ring-red-500 border-red-500")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FieldError message={errors.province} />
              </div>
              <div className="space-y-2">
                <RequiredLabel>Postal Code</RequiredLabel>
                <Input
                  value={postalCode}
                  onChange={(e) => { setPostalCode(e.target.value.toUpperCase()); clearError("postalCode"); }}
                  placeholder="V1Y 1A1"
                  maxLength={7}
                  className={cn("h-11", errors.postalCode && "ring-2 ring-red-500 border-red-500")}
                />
                <FieldError message={errors.postalCode} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold">Mailing address same as service address?</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Toggle off if your mailing address is different.</p>
              </div>
              <Switch checked={mailingAddressSame} onCheckedChange={setMailingAddressSame} />
            </div>

            <AnimatePresence>
              {!mailingAddressSame && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Mailing Street</Label>
                      <Input value={mailingStreet} onChange={(e) => setMailingStreet(e.target.value)} placeholder="456 Oak Ave" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Input value={mailingUnit} onChange={(e) => setMailingUnit(e.target.value)} className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input value={mailingCity} onChange={(e) => setMailingCity(e.target.value)} className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>Province</Label>
                      <Select value={mailingProvince} onValueChange={setMailingProvince}>
                        <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>{provinces.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Postal Code</Label>
                      <Input value={mailingPostalCode} onChange={(e) => setMailingPostalCode(e.target.value.toUpperCase())} maxLength={7} className="h-11" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
