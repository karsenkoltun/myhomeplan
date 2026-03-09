"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check, ArrowRight } from "lucide-react"
import NumberFlow from "@number-flow/react"

export type PlanLevel = string

export interface PricingFeature {
  name: string
  included: PlanLevel | null
}

export interface PricingPlan {
  name: string
  level: PlanLevel
  price: {
    monthly: number
    yearly: number
  }
  popular?: boolean
}

export interface PricingTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  features: PricingFeature[]
  plans: PricingPlan[]
  onPlanSelect?: (plan: PlanLevel) => void
  defaultPlan?: PlanLevel
  defaultInterval?: "monthly" | "yearly"
  containerClassName?: string
  buttonClassName?: string
  ctaLabel?: string
  ctaHref?: string
  note?: string
}

export function PricingTable({
  features,
  plans,
  onPlanSelect,
  defaultPlan,
  defaultInterval = "monthly",
  className,
  containerClassName,
  buttonClassName,
  ctaLabel = "Get started",
  ctaHref,
  note,
  ...props
}: PricingTableProps) {
  const [isYearly, setIsYearly] = React.useState(defaultInterval === "yearly")
  const [selectedPlan, setSelectedPlan] = React.useState<PlanLevel>(
    defaultPlan || plans[0]?.level || ""
  )

  const handlePlanSelect = (plan: PlanLevel) => {
    setSelectedPlan(plan)
    onPlanSelect?.(plan)
  }

  const selectedPlanData = plans.find((p) => p.level === selectedPlan)

  return (
    <div
      className={cn("w-full max-w-3xl mx-auto", containerClassName)}
      {...props}
    >
      <div className="flex justify-end mb-4 sm:mb-8">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setIsYearly(false)}
            className={cn(
              "px-3 py-1 rounded-md transition-colors",
              !isYearly ? "bg-muted text-foreground" : "text-muted-foreground",
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setIsYearly(true)}
            className={cn(
              "px-3 py-1 rounded-md transition-colors",
              isYearly ? "bg-muted text-foreground" : "text-muted-foreground",
            )}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {plans.map((plan) => (
          <button
            key={plan.name}
            type="button"
            onClick={() => handlePlanSelect(plan.level)}
            className={cn(
              "flex-1 p-4 rounded-xl text-left transition-all",
              "border border-border",
              selectedPlan === plan.level &&
                "ring-2 ring-primary",
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{plan.name}</span>
              {plan.popular && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <NumberFlow
                format={{
                  style: "currency",
                  currency: "CAD",
                  trailingZeroDisplay: "stripIfInteger",
                }}
                value={isYearly ? plan.price.yearly : plan.price.monthly}
                className="text-2xl font-bold"
              />
              <span className="text-sm font-normal text-muted-foreground">
                /{isYearly ? "year" : "month"}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[640px] divide-y divide-border">
            <div className="flex items-center p-4 bg-muted/50">
              <div className="flex-1 text-sm font-medium">Services</div>
              <div className="flex items-center gap-8 text-sm">
                {plans.map((plan) => (
                  <div
                    key={plan.level}
                    className="w-16 text-center font-medium"
                  >
                    {plan.name}
                  </div>
                ))}
              </div>
            </div>
            {features.map((feature) => (
              <div
                key={feature.name}
                className={cn(
                  "flex items-center p-4 transition-colors",
                  feature.included === selectedPlan &&
                    "bg-primary/5",
                )}
              >
                <div className="flex-1 text-sm">{feature.name}</div>
                <div className="flex items-center gap-8 text-sm">
                  {plans.map((plan) => (
                    <div
                      key={plan.level}
                      className={cn(
                        "w-16 flex justify-center",
                        plan.level === selectedPlan && "font-medium",
                      )}
                    >
                      {shouldShowCheck(feature.included, plan.level, plans) ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <span className="text-muted-foreground/30">
                          -
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {note && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {note}
        </p>
      )}

      <div className="mt-8 text-center">
        {ctaHref ? (
          <Button
            className={cn(
              "w-full sm:w-auto px-8 py-2 rounded-xl",
              buttonClassName,
            )}
            asChild
          >
            <a href={ctaHref}>
              {ctaLabel} {selectedPlanData?.name}
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        ) : (
          <Button
            className={cn(
              "w-full sm:w-auto px-8 py-2 rounded-xl",
              buttonClassName,
            )}
          >
            {ctaLabel} {selectedPlanData?.name}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}

function shouldShowCheck(
  included: PricingFeature["included"],
  level: string,
  plans: PricingPlan[],
): boolean {
  if (!included) return false
  if (included === "all") return true

  const planIndex = plans.findIndex((p) => p.level === included)
  const checkIndex = plans.findIndex((p) => p.level === level)

  if (planIndex === -1 || checkIndex === -1) return included === level

  return checkIndex >= planIndex
}
