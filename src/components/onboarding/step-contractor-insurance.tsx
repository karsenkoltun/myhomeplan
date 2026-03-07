"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { usePropertyStore } from "@/stores/property-store";
import { Shield, ShieldCheck, FileCheck } from "lucide-react";

export function StepContractorInsurance() {
  const { contractor, setContractor } = usePropertyStore();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
          <Shield className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Insurance & Coverage</h2>
        <p className="mt-2 text-center text-muted-foreground">We require proof of insurance for all contractor partners.</p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Liability Insurance */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-4 w-4 text-sky-600" />
              <h3 className="text-sm font-semibold">General Liability Insurance</h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Insurance Provider <span className="text-red-500">*</span></Label>
                <Input
                  value={contractor.insuranceProvider}
                  onChange={(e) => setContractor({ insuranceProvider: e.target.value })}
                  placeholder="e.g. Intact Insurance"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Policy Number <span className="text-red-500">*</span></Label>
                <Input
                  value={contractor.insurancePolicyNumber}
                  onChange={(e) => setContractor({ insurancePolicyNumber: e.target.value })}
                  placeholder="e.g. POL-123456"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Coverage Amount ($) <span className="text-red-500">*</span></Label>
                <Input
                  type="number"
                  value={contractor.insuranceCoverageAmount || ""}
                  onChange={(e) => setContractor({ insuranceCoverageAmount: Number(e.target.value) })}
                  placeholder="e.g. 2000000"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date <span className="text-red-500">*</span></Label>
                <Input
                  type="date"
                  value={contractor.insuranceExpiry}
                  onChange={(e) => setContractor({ insuranceExpiry: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WCB */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="h-4 w-4 text-sky-600" />
              <h3 className="text-sm font-semibold">WorkSafeBC (WCB) Coverage</h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>WCB Account Number</Label>
                <Input
                  value={contractor.wcbAccountNumber}
                  onChange={(e) => setContractor({ wcbAccountNumber: e.target.value })}
                  placeholder="e.g. 123456"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Coverage Start Date</Label>
                <Input
                  type="date"
                  value={contractor.wcbCoverageStart}
                  onChange={(e) => setContractor({ wcbCoverageStart: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Coverage End Date</Label>
                <Input
                  type="date"
                  value={contractor.wcbCoverageEnd}
                  onChange={(e) => setContractor({ wcbCoverageEnd: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bonding */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-sky-600" />
                <div>
                  <h3 className="text-sm font-semibold">Bonded</h3>
                  <p className="text-xs text-muted-foreground">Are you bonded for the services you provide?</p>
                </div>
              </div>
              <Switch
                checked={contractor.isBonded}
                onCheckedChange={(v) => setContractor({ isBonded: v })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
