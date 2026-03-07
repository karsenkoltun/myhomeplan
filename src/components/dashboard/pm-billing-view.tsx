"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Building, CircleDot } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import { SERVICES } from "@/data/services";

interface PMProperty {
  id: string;
  property_name: string;
  address: string;
  city: string;
  unit_count: number;
  total_sqft: number;
  selected_services: string[];
}

interface PMBillingViewProps {
  properties: PMProperty[];
  billingPreference: string;
  annualSpend: number;
}

function getServiceName(serviceId: string): string {
  const service = SERVICES.find((s) => s.id === serviceId);
  return service?.name ?? serviceId;
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function PMBillingView({
  properties,
  billingPreference,
  annualSpend,
}: PMBillingViewProps) {
  const monthlySpend = Math.round(annualSpend / 12);
  const totalUnits = properties.reduce((sum, p) => sum + (p.unit_count || 0), 0);
  const totalServices = properties.reduce(
    (sum, p) => sum + (p.selected_services?.length || 0),
    0
  );

  return (
    <FadeIn delay={0.25}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Billing Overview</CardTitle>
            </div>
            <Badge variant="secondary" className="capitalize">
              {billingPreference || "Not set"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Portfolio totals */}
          <div className="mb-4 rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground">Portfolio Total</p>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-2xl font-bold">
                ${formatCurrency(annualSpend)}
                <span className="text-sm font-normal text-muted-foreground">/yr</span>
              </span>
              <span className="text-sm text-muted-foreground">
                ${formatCurrency(monthlySpend)}/mo
              </span>
            </div>
            <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
              <span>{properties.length} properties</span>
              <span>{totalUnits} units</span>
              <span>{totalServices} active services</span>
            </div>
          </div>

          {/* Property grid */}
          {properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Building className="mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No properties in portfolio
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((prop) => {
                const services = prop.selected_services ?? [];

                return (
                  <div key={prop.id} className="rounded-lg border p-3">
                    <p className="truncate text-sm font-medium">
                      {prop.property_name || prop.address}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {prop.address}, {prop.city}
                    </p>

                    <Separator className="my-2" />

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {prop.unit_count} unit{prop.unit_count !== 1 ? "s" : ""}
                      </span>
                      <span className="text-muted-foreground">
                        {services.length} service{services.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {services.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {services.map((serviceId) => (
                          <span
                            key={serviceId}
                            className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"
                            title={getServiceName(serviceId)}
                          >
                            <CircleDot className="h-2.5 w-2.5 text-emerald-500" />
                            <span className="max-w-[80px] truncate">
                              {getServiceName(serviceId)}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer totals */}
          {properties.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Consolidated total across {properties.length} propert{properties.length !== 1 ? "ies" : "y"}
                </span>
                <span className="font-semibold">
                  ${formatCurrency(annualSpend)}/yr
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}
