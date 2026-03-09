/** Map our plan intervals to Stripe recurring params + billing amount multiplier */
export function getStripeInterval(planInterval: "monthly" | "quarterly" | "annual") {
  switch (planInterval) {
    case "monthly":
      return { interval: "month" as const, interval_count: 1, months: 1 };
    case "quarterly":
      return { interval: "month" as const, interval_count: 3, months: 3 };
    case "annual":
      return { interval: "year" as const, interval_count: 1, months: 12 };
  }
}

/** Convert a dollar amount to Stripe cents */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/** The single Stripe Product name for all subscriptions */
export const STRIPE_PRODUCT_NAME = "MyHomePlan Subscription";
