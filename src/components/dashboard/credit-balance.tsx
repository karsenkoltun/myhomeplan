"use client";

import { Coins, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GlowCard, FadeIn, SpringNumber } from "@/components/ui/motion";

export function CreditBalance({
  totalCredits,
  usedCredits,
  delay = 0,
}: {
  totalCredits: number;
  usedCredits: number;
  delay?: number;
}) {
  const available = totalCredits - usedCredits;
  const usagePercentage =
    totalCredits > 0 ? (usedCredits / totalCredits) * 100 : 0;

  return (
    <FadeIn delay={delay}>
      <GlowCard glowColor="primary" className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Coins className="h-4 w-4 text-primary" />
          </div>
          <p className="text-sm font-semibold">Service Credits</p>
        </div>

        {/* Big number */}
        <div>
          <p className="text-4xl font-bold tracking-tight">
            <SpringNumber value={available} />
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            credits available
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{usedCredits} used</span>
            <span>{totalCredits} total</span>
          </div>
          <Progress value={usagePercentage} className="h-1.5" />
        </div>

        {/* Buy Credits button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            // placeholder - wire up to credits purchase flow
          }}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Buy Credits
        </Button>
      </GlowCard>
    </FadeIn>
  );
}
