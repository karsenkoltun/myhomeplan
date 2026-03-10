import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createConnectAccount,
  createAccountLink,
  getAccountStatus,
} from "@/lib/stripe-connect";

/**
 * POST /api/stripe/connect
 * Creates a Stripe Connect Express account (or reuses existing) and returns an onboarding link.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the contractor profile for this user
    const { data: contractor, error: contractorError } = await supabase
      .from("contractor_profiles")
      .select("id, stripe_connect_id, business_name")
      .eq("profile_id", user.id)
      .single();

    if (contractorError || !contractor) {
      return NextResponse.json(
        { error: "Contractor profile not found" },
        { status: 404 }
      );
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const refreshUrl = `${origin}/account?stripe_connect=refresh`;
    const returnUrl = `${origin}/api/stripe/connect/callback`;

    let accountId = contractor.stripe_connect_id;

    if (accountId) {
      // Account already exists - generate a fresh onboarding link
      // (in case they didn't finish onboarding previously)
      const accountLink = await createAccountLink(
        accountId,
        refreshUrl,
        returnUrl
      );
      return NextResponse.json({ url: accountLink.url });
    }

    // Create a new Connect account
    const account = await createConnectAccount(
      user.email || "",
      contractor.business_name || ""
    );

    // Persist the stripe_connect_id
    const { error: updateError } = await supabase
      .from("contractor_profiles")
      .update({ stripe_connect_id: account.id })
      .eq("id", contractor.id);

    if (updateError) {
      console.error("Failed to save stripe_connect_id:", updateError);
      return NextResponse.json(
        { error: "Failed to save Connect account" },
        { status: 500 }
      );
    }

    // Generate onboarding link
    const accountLink = await createAccountLink(
      account.id,
      refreshUrl,
      returnUrl
    );

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Stripe Connect error:", error);
    return NextResponse.json(
      { error: "Failed to create Connect account" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stripe/connect
 * Returns the Connect account status for the authenticated contractor.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: contractor, error: contractorError } = await supabase
      .from("contractor_profiles")
      .select("stripe_connect_id")
      .eq("profile_id", user.id)
      .single();

    if (contractorError || !contractor) {
      return NextResponse.json(
        { error: "Contractor profile not found" },
        { status: 404 }
      );
    }

    if (!contractor.stripe_connect_id) {
      return NextResponse.json({ connected: false });
    }

    const status = await getAccountStatus(contractor.stripe_connect_id);

    return NextResponse.json({
      connected: true,
      ...status,
    });
  } catch (error) {
    console.error("Stripe Connect status error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve account status" },
      { status: 500 }
    );
  }
}
