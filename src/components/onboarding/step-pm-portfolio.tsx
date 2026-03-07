"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { usePropertyStore } from "@/stores/property-store";
import { BarChart3 } from "lucide-react";
import { RequiredLabel } from "./shared";

export function StepPMPortfolio() {
  const { pm, setPM } = usePropertyStore();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
          <BarChart3 className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Portfolio Overview</h2>
        <p className="mt-2 text-center text-muted-foreground">Tell us about the properties you manage.</p>
      </div>

      <div className="mt-8 space-y-6">
        <Card>
          <CardContent className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div className="space-y-2">
              <RequiredLabel>Total Properties Managed</RequiredLabel>
              <Input
                type="number"
                value={pm.totalProperties}
                onChange={(e) => setPM({ totalProperties: Math.max(0, Number(e.target.value)) })}
                min={0}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Total Units Across All Properties</RequiredLabel>
              <Input
                type="number"
                value={pm.totalUnits}
                onChange={(e) => setPM({ totalUnits: Math.max(0, Number(e.target.value)) })}
                min={0}
                className="h-11"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Annual Maintenance Spend ($)</Label>
              <Input
                type="number"
                value={pm.annualMaintenanceSpend || ""}
                onChange={(e) => setPM({ annualMaintenanceSpend: Number(e.target.value) })}
                placeholder="e.g. 500000"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">Approximate annual spend across all properties for maintenance services.</p>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Stats */}
        {pm.totalProperties > 0 && (
          <Card className="border-violet-500/20">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Portfolio Summary</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <span className="block text-2xl font-bold text-violet-600">{pm.totalProperties}</span>
                  <span className="text-xs text-muted-foreground">Properties</span>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <span className="block text-2xl font-bold text-violet-600">{pm.totalUnits}</span>
                  <span className="text-xs text-muted-foreground">Total Units</span>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <span className="block text-2xl font-bold text-violet-600">
                    {pm.totalProperties > 0 ? Math.round(pm.totalUnits / pm.totalProperties) : 0}
                  </span>
                  <span className="text-xs text-muted-foreground">Avg Units/Prop</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
