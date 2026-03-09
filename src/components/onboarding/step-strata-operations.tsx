"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { usePropertyStore } from "@/stores/property-store";
import { cn } from "@/lib/utils";
import { Settings, Shield, Wallet, FileText, KeyRound } from "lucide-react";

const accessTypes = [
  { value: "fob", label: "Key Fob" },
  { value: "key", label: "Physical Key" },
  { value: "code", label: "Access Code" },
  { value: "combo", label: "Combination" },
];

const utilityOptions = [
  { value: "individual", label: "Individual Meters" },
  { value: "shared", label: "Shared / Common" },
  { value: "mixed", label: "Mixed" },
];

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function StepStrataOperations() {
  const { strata, setStrata } = usePropertyStore();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <Settings className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Operations & Financials</h2>
        <p className="mt-2 text-center text-muted-foreground">Help us understand your building&apos;s operations for better service planning.</p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Insurance */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-semibold">Building Insurance</h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Insurance Provider</Label>
                <Input
                  value={strata.insuranceProvider}
                  onChange={(e) => setStrata({ insuranceProvider: e.target.value })}
                  placeholder="e.g. Intact Insurance"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Policy Number</Label>
                <Input
                  value={strata.insurancePolicyNumber}
                  onChange={(e) => setStrata({ insurancePolicyNumber: e.target.value })}
                  placeholder="e.g. POL-123456"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Coverage Amount ($)</Label>
                <Input
                  type="number"
                  value={strata.insuranceCoverageAmount || ""}
                  onChange={(e) => setStrata({ insuranceCoverageAmount: Number(e.target.value) })}
                  placeholder="e.g. 5000000"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={strata.insuranceExpiry}
                  onChange={(e) => setStrata({ insuranceExpiry: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reserve Fund */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-semibold">Reserve Fund</h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Current Balance ($)</Label>
                <Input
                  type="number"
                  value={strata.reserveFundBalance || ""}
                  onChange={(e) => setStrata({ reserveFundBalance: Number(e.target.value) })}
                  placeholder="e.g. 500000"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Annual Contribution ($)</Label>
                <Input
                  type="number"
                  value={strata.annualReserveContribution || ""}
                  onChange={(e) => setStrata({ annualReserveContribution: Number(e.target.value) })}
                  placeholder="e.g. 100000"
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Depreciation Report */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-semibold">Depreciation Report</h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Last Report Date</Label>
                <Input
                  type="date"
                  value={strata.depreciationReportDate}
                  onChange={(e) => setStrata({ depreciationReportDate: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>AGM Month</Label>
                <Select value={String(strata.agmMonth)} onValueChange={(v) => setStrata({ agmMonth: Number(v) })}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {monthNames.map((name, i) => <SelectItem key={i} value={String(i + 1)}>{name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Relevant Bylaws <span className="text-xs text-muted-foreground">(anything affecting service work)</span></Label>
                <textarea
                  value={strata.relevantBylaws}
                  onChange={(e) => setStrata({ relevantBylaws: e.target.value })}
                  placeholder="e.g. Noise restrictions after 10pm, no work on Sundays..."
                  rows={3}
                  className={cn(
                    "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground",
                    "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    "dark:bg-input/30"
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access & Utilities */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <KeyRound className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-semibold">Building Access & Utilities</h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Access Type</Label>
                <Select value={strata.accessType} onValueChange={(v) => setStrata({ accessType: v })}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {accessTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Utility Metering</Label>
                <Select value={strata.utilityMetering} onValueChange={(v) => setStrata({ utilityMetering: v })}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {utilityOptions.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Access Instructions</Label>
                <Input
                  value={strata.accessDetails}
                  onChange={(e) => setStrata({ accessDetails: e.target.value })}
                  placeholder="e.g. Fob required for parkade, code for lobby"
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
