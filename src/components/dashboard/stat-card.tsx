"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, SpringNumber } from "@/components/ui/motion";

export function StatCard({
  icon: Icon,
  label,
  value,
  prefix = "",
  suffix = "",
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
}) {
  return (
    <FadeIn delay={delay}>
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold">
              {prefix}
              <SpringNumber value={value} />
              {suffix}
            </p>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
