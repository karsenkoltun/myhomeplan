"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/motion";
import { ProgressRing } from "@/components/ui/motion";
import { SERVICES, SERVICE_FREQUENCY_OPTIONS } from "@/data/services";
import { ServiceUsageCard } from "./service-usage-card";
import { format } from "date-fns";

interface UsageEntry {
  serviceId: string;
  frequency: string;
  monthlyPrice: number;
  used: number;
}

function getTotalEvents(serviceId: string, frequency: string): number {
  const options = SERVICE_FREQUENCY_OPTIONS[serviceId];
  if (!options) return 0;
  const match = options.find((opt) => opt.value === frequency);
  return match?.multiplier ?? 0;
}

export function UsageOverview({
  usageData,
  periodStart,
  periodEnd,
  delay = 0,
}: {
  usageData: UsageEntry[];
  periodStart: string;
  periodEnd: string;
  delay?: number;
}) {
  // Calculate overall usage percentage across all services
  const totals = usageData.reduce(
    (acc, entry) => {
      const total = getTotalEvents(entry.serviceId, entry.frequency);
      acc.totalEvents += total;
      acc.usedEvents += entry.used;
      return acc;
    },
    { totalEvents: 0, usedEvents: 0 }
  );

  const overallPercentage =
    totals.totalEvents > 0
      ? Math.round((totals.usedEvents / totals.totalEvents) * 100)
      : 0;

  const startLabel = format(new Date(periodStart), "MMM d");
  const endLabel = format(new Date(periodEnd), "MMM d, yyyy");

  return (
    <FadeIn delay={delay}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Service Usage</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                {startLabel} - {endLabel}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ProgressRing progress={overallPercentage} size={44} strokeWidth={3.5} />
              <div className="text-right">
                <p className="text-lg font-bold">{overallPercentage}%</p>
                <p className="text-[10px] text-muted-foreground">overall</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {usageData.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No active services to display
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {usageData.map((entry, i) => {
                const service = SERVICES.find((s) => s.id === entry.serviceId);
                return (
                  <ServiceUsageCard
                    key={entry.serviceId}
                    serviceId={entry.serviceId}
                    serviceName={service?.name ?? entry.serviceId}
                    iconName={service?.icon ?? "CheckCircle2"}
                    frequency={entry.frequency}
                    monthlyPrice={entry.monthlyPrice}
                    used={entry.used}
                    delay={delay + 0.05 * (i + 1)}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}
