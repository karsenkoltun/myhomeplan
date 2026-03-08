"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function OnboardingProgress({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  // Use compact mode for 8+ steps
  const compact = totalSteps >= 8;

  return (
    <div className="w-full">
      {/* Step indicators */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto px-1">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          return (
            <div key={i} className="flex items-center">
              <motion.div
                className={cn(
                  "flex items-center justify-center rounded-full font-bold transition-colors",
                  compact ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs",
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                )}
                animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? (
                  <Check className={cn(compact ? "h-3 w-3" : "h-3.5 w-3.5")} />
                ) : (
                  i + 1
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
}
