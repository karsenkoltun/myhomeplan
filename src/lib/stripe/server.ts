import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _stripe;
}

/** @deprecated Use getStripeServer() instead */
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripeServer() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
