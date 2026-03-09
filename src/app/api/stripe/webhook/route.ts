import { NextRequest, NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/server";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

// Use service role client for webhook handler (no user session)
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/** Extract period dates from a Stripe subscription (they live on items in v2026+) */
function getPeriodDates(sub: Stripe.Subscription) {
  const item = sub.items.data[0];
  if (!item) return {};
  return {
    current_period_start: new Date(item.current_period_start * 1000).toISOString(),
    current_period_end: new Date(item.current_period_end * 1000).toISOString(),
  };
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripeServer().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getServiceClient();

  // Idempotency check
  const { data: existing } = await supabase
    .from("stripe_webhook_events")
    .select("id")
    .eq("id", event.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Log the event
  await supabase.from("stripe_webhook_events").insert({
    id: event.id,
    type: event.type,
    data: event.data.object as unknown as Record<string, unknown>,
  });

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(supabase, event.data.object as Stripe.Checkout.Session);
        break;
      case "invoice.paid":
        await handleInvoicePaid(supabase, event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(supabase, event.data.object as Stripe.Invoice);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(supabase, event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(supabase, event.data.object as Stripe.Subscription);
        break;
    }
  } catch (err) {
    console.error(`Error handling ${event.type}:`, err);
    // Still return 200 - we logged the event for retry
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  supabase: ReturnType<typeof getServiceClient>,
  session: Stripe.Checkout.Session
) {
  const subId = session.metadata?.supabase_subscription_id;
  if (!subId) return;

  const stripeSubscriptionId = session.subscription as string;
  const stripeSub = await getStripeServer().subscriptions.retrieve(stripeSubscriptionId);

  await supabase
    .from("subscriptions")
    .update({
      status: "active",
      stripe_subscription_id: stripeSubscriptionId,
      stripe_price_id: stripeSub.items.data[0]?.price?.id || null,
      ...getPeriodDates(stripeSub),
    })
    .eq("id", subId);

  // Complete onboarding for the user
  const userId = session.metadata?.supabase_user_id;
  if (userId) {
    await supabase
      .from("profiles")
      .update({ onboarding_complete: true })
      .eq("id", userId);
  }
}

/** Extract subscription ID from invoice (v2026+ uses parent.subscription_details) */
function getSubIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const subDetails = invoice.parent?.subscription_details;
  if (!subDetails) return null;
  return typeof subDetails.subscription === "string"
    ? subDetails.subscription
    : subDetails.subscription?.id ?? null;
}

async function handleInvoicePaid(
  supabase: ReturnType<typeof getServiceClient>,
  invoice: Stripe.Invoice
) {
  const stripeSubId = getSubIdFromInvoice(invoice);
  if (!stripeSubId) return;

  const stripeSub = await getStripeServer().subscriptions.retrieve(stripeSubId);

  await supabase
    .from("subscriptions")
    .update({
      status: "active",
      ...getPeriodDates(stripeSub),
    })
    .eq("stripe_subscription_id", stripeSubId);
}

async function handleInvoicePaymentFailed(
  supabase: ReturnType<typeof getServiceClient>,
  invoice: Stripe.Invoice
) {
  const stripeSubId = getSubIdFromInvoice(invoice);
  if (!stripeSubId) return;

  await supabase
    .from("subscriptions")
    .update({ status: "past_due" })
    .eq("stripe_subscription_id", stripeSubId);
}

async function handleSubscriptionUpdated(
  supabase: ReturnType<typeof getServiceClient>,
  subscription: Stripe.Subscription
) {
  const statusMap: Record<string, string> = {
    active: "active",
    past_due: "past_due",
    canceled: "cancelled",
    unpaid: "past_due",
    trialing: "trialing",
    paused: "paused",
  };

  const updates: Record<string, unknown> = {
    status: statusMap[subscription.status] || subscription.status,
    ...getPeriodDates(subscription),
  };

  if (subscription.canceled_at) {
    updates.cancelled_at = new Date(subscription.canceled_at * 1000).toISOString();
  }

  await supabase
    .from("subscriptions")
    .update(updates)
    .eq("stripe_subscription_id", subscription.id);
}

async function handleSubscriptionDeleted(
  supabase: ReturnType<typeof getServiceClient>,
  subscription: Stripe.Subscription
) {
  await supabase
    .from("subscriptions")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);
}
