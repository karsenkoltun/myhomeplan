"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CreditCard, Check } from "lucide-react";
import { usePropertyStore } from "@/stores/property-store";
import { cn } from "@/lib/utils";

const billingPreferences = [
  { value: "centralized", label: "Centralized", description: "One invoice for all properties" },
  { value: "per-property", label: "Per Property", description: "Separate invoice per property" },
];

const paymentTermsOptions = [
  { value: "net-15", label: "Net 15" },
  { value: "net-30", label: "Net 30" },
  { value: "net-45", label: "Net 45" },
  { value: "net-60", label: "Net 60" },
  { value: "on-receipt", label: "Due on Receipt" },
];

const reportingOptions = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

export function StepPMBilling() {
  const { pm, setPM } = usePropertyStore();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
          <CreditCard className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Billing & Reporting</h2>
        <p className="mt-2 text-center text-muted-foreground">Set your billing preferences and reporting frequency.</p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Billing Preference */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <Label className="mb-3 block text-sm font-semibold">Billing Preference</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {billingPreferences.map((bp) => {
                const isSelected = pm.billingPreference === bp.value;
                return (
                  <motion.button
                    key={bp.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPM({ billingPreference: bp.value })}
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
                    <p className="text-sm font-semibold">{bp.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{bp.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms & Reporting */}
        <Card>
          <CardContent className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Select value={pm.paymentTerms} onValueChange={(v) => setPM({ paymentTerms: v })}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {paymentTermsOptions.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reporting Frequency</Label>
              <Select value={pm.reportingFrequency} onValueChange={(v) => setPM({ reportingFrequency: v })}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {reportingOptions.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Escalation Protocol */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="space-y-2">
              <Label>Escalation Protocol <span className="text-xs text-muted-foreground">(optional)</span></Label>
              <textarea
                value={pm.escalationProtocol}
                onChange={(e) => setPM({ escalationProtocol: e.target.value })}
                placeholder="e.g. For emergencies, call the operations manager first. For billing issues, contact accounting..."
                rows={4}
                className={cn(
                  "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground",
                  "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  "dark:bg-input/30"
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
