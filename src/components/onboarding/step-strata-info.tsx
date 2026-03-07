"use client";

import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { usePropertyStore, type StrataContactRole, type StrataCouncilContact } from "@/stores/property-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { RequiredLabel, FieldError, type StepValidationRef } from "./shared";

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

const emptyContact: StrataCouncilContact = {
  name: "",
  role: "council-member",
  email: "",
  phone: "",
  canApprove: false,
};

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

  const addCouncilContact = () => {
    if (strata.councilContacts.length >= 5) return;
    setStrata({ councilContacts: [...strata.councilContacts, { ...emptyContact }] });
  };

  const removeCouncilContact = (index: number) => {
    setStrata({ councilContacts: strata.councilContacts.filter((_, i) => i !== index) });
  };

  const updateCouncilContact = (index: number, field: keyof StrataCouncilContact, value: string | boolean) => {
    const updated = [...strata.councilContacts];
    updated[index] = { ...updated[index], [field]: value };
    setStrata({ councilContacts: updated });
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

        {/* Additional Council Contacts */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Council Contacts</h3>
                <p className="mt-1 text-xs text-muted-foreground">Add additional council members or contacts (up to 5)</p>
              </div>
              {strata.councilContacts.length < 5 && (
                <Button variant="outline" size="sm" onClick={addCouncilContact} className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              )}
            </div>

            <AnimatePresence mode="popLayout">
              {strata.councilContacts.length === 0 ? (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={addCouncilContact}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-sm text-muted-foreground hover:border-primary/30 hover:bg-muted/50 transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  Add a council contact
                </motion.button>
              ) : (
                <div className="space-y-4">
                  {strata.councilContacts.map((contact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-xl border p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Contact {index + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeCouncilContact(index)} className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Name</Label>
                          <Input
                            value={contact.name}
                            onChange={(e) => updateCouncilContact(index, "name", e.target.value)}
                            placeholder="Full name"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Role</Label>
                          <Select
                            value={contact.role}
                            onValueChange={(v) => updateCouncilContact(index, "role", v)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {contactRoles.map((r) => (
                                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Email</Label>
                          <Input
                            type="email"
                            value={contact.email}
                            onChange={(e) => updateCouncilContact(index, "email", e.target.value)}
                            placeholder="email@example.com"
                            className="h-9"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Phone</Label>
                          <Input
                            type="tel"
                            value={contact.phone}
                            onChange={(e) => updateCouncilContact(index, "phone", e.target.value)}
                            placeholder="250-555-0123"
                            className="h-9"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Switch
                          checked={contact.canApprove}
                          onCheckedChange={(v) => updateCouncilContact(index, "canApprove", v)}
                        />
                        <Label className="text-xs text-muted-foreground">Can approve work orders</Label>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
