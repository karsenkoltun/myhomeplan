"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { usePropertyStore } from "@/stores/property-store";
import { Shield, ShieldCheck } from "lucide-react";

export function StepPMInsurance() {
  const { pm, setPM } = usePropertyStore();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
          <Shield className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Insurance Coverage</h2>
        <p className="mt-2 text-center text-muted-foreground">We need your insurance details for liability coordination.</p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Professional Liability */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-4 w-4 text-violet-600" />
              <h3 className="text-sm font-semibold">Professional Liability Insurance</h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Insurance Provider</Label>
                <Input
                  value={pm.insuranceProvider}
                  onChange={(e) => setPM({ insuranceProvider: e.target.value })}
                  placeholder="e.g. Intact Insurance"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Policy Number</Label>
                <Input
                  value={pm.insurancePolicyNumber}
                  onChange={(e) => setPM({ insurancePolicyNumber: e.target.value })}
                  placeholder="e.g. POL-123456"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Coverage Amount ($)</Label>
                <Input
                  type="number"
                  value={pm.insuranceCoverageAmount || ""}
                  onChange={(e) => setPM({ insuranceCoverageAmount: Number(e.target.value) })}
                  placeholder="e.g. 2000000"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={pm.insuranceExpiry}
                  onChange={(e) => setPM({ insuranceExpiry: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* E&O Insurance */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-violet-600" />
              <h3 className="text-sm font-semibold">Errors & Omissions (E&O) Insurance</h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>E&O Provider</Label>
                <Input
                  value={pm.eoInsuranceProvider}
                  onChange={(e) => setPM({ eoInsuranceProvider: e.target.value })}
                  placeholder="e.g. Aviva Canada"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Policy Number</Label>
                <Input
                  value={pm.eoInsurancePolicyNumber}
                  onChange={(e) => setPM({ eoInsurancePolicyNumber: e.target.value })}
                  placeholder="e.g. EO-789012"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Coverage Amount ($)</Label>
                <Input
                  type="number"
                  value={pm.eoInsuranceCoverageAmount || ""}
                  onChange={(e) => setPM({ eoInsuranceCoverageAmount: Number(e.target.value) })}
                  placeholder="e.g. 1000000"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={pm.eoInsuranceExpiry}
                  onChange={(e) => setPM({ eoInsuranceExpiry: e.target.value })}
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
