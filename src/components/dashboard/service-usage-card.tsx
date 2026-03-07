"use client";

import type { LucideIcon } from "lucide-react";
import {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair, CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FadeIn } from "@/components/ui/motion";
import { SERVICE_FREQUENCY_OPTIONS } from "@/data/services";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
};

function getProgressColor(percentage: number): string {
  if (percentage > 80) return "bg-red-500";
  if (percentage >= 50) return "bg-yellow-500";
  return "bg-emerald-500";
}

function getTotalEvents(serviceId: string, frequency: string): number {
  const options = SERVICE_FREQUENCY_OPTIONS[serviceId];
  if (!options) return 0;
  const match = options.find((opt) => opt.value === frequency);
  return match?.multiplier ?? 0;
}

export function ServiceUsageCard({
  serviceId,
  serviceName,
  iconName,
  frequency,
  monthlyPrice,
  used,
  delay = 0,
}: {
  serviceId: string;
  serviceName: string;
  iconName: string;
  frequency: string;
  monthlyPrice: number;
  used: number;
  delay?: number;
}) {
  const Icon = ICON_MAP[iconName] || CheckCircle2;
  const totalEvents = getTotalEvents(serviceId, frequency);
  const percentage = totalEvents > 0 ? (used / totalEvents) * 100 : 0;
  const colorClass = getProgressColor(percentage);

  // Find the label for this frequency
  const options = SERVICE_FREQUENCY_OPTIONS[serviceId];
  const frequencyLabel =
    options?.find((opt) => opt.value === frequency)?.label ?? frequency;

  return (
    <FadeIn delay={delay}>
      <Card className="h-full">
        <CardContent className="space-y-3 p-4">
          {/* Header: Icon + Name + Price */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">{serviceName}</p>
                <Badge variant="secondary" className="mt-1 text-[10px]">
                  {frequencyLabel}
                </Badge>
              </div>
            </div>
            <span className="text-sm font-bold text-primary">
              ${monthlyPrice.toFixed(0)}<span className="text-xs font-normal text-muted-foreground">/mo</span>
            </span>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {used} of {totalEvents} events used
              </span>
              <span className="font-medium">{Math.round(percentage)}%</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/40">
              <div
                className={`h-full rounded-full transition-all ${colorClass}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
