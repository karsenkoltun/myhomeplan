import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { getStripeInterval, toCents, STRIPE_PRODUCT_NAME } from "@/lib/stripe/helpers";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      subscriptionId,
      planInterval,
      monthlyTotal,
    } = body as {
      subscriptionId: string;
      planInterval: "monthly" | "quarterly" | "annual";
      monthlyTotal: number;
    };

    if (!subscriptionId || !planInterval || !monthlyTotal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get or create Stripe Customer
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email, first_name, last_name")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        name: [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Calculate billing amount
    const intervalConfig = getStripeInterval(planInterval);
    const billingAmount = toCents(monthlyTotal * intervalConfig.months);

    // Create an ad-hoc price for this customer's subscription
    // First ensure we have a product
    const products = await stripe.products.search({
      query: `name:"${STRIPE_PRODUCT_NAME}"`,
    });

    let productId: string;
    if (products.data.length > 0) {
      productId = products.data[0].id;
    } else {
      const product = await stripe.products.create({
        name: STRIPE_PRODUCT_NAME,
        description: "Custom home maintenance subscription",
      });
      productId = product.id;
    }

    const price = await stripe.prices.create({
      product: productId,
      unit_amount: billingAmount,
      currency: "cad",
      recurring: {
        interval: intervalConfig.interval,
        interval_count: intervalConfig.interval_count,
      },
      metadata: {
        subscription_id: subscriptionId,
        plan_interval: planInterval,
        monthly_total: String(monthlyTotal),
      },
    });

    // Determine app URL for redirects
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      subscription_data: {
        metadata: {
          supabase_subscription_id: subscriptionId,
          supabase_user_id: user.id,
        },
      },
      metadata: {
        supabase_subscription_id: subscriptionId,
        supabase_user_id: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
