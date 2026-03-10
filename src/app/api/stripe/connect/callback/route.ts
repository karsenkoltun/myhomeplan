import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAccountStatus } from "@/lib/stripe-connect";

/**
 * GET /api/stripe/connect/callback
 * Stripe redirects the contractor here after onboarding.
 * Verifies the account status and redirects to /account with a result message.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    if (!user) {
      return NextResponse.redirect(
        `${origin}/account?stripe_connect=unauthorized`
      );
    }

    const { data: contractor } = await supabase
      .from("contractor_profiles")
      .select("stripe_connect_id")
      .eq("profile_id", user.id)
      .single();

    if (!contractor?.stripe_connect_id) {
      return NextResponse.redirect(
        `${origin}/account?stripe_connect=not_found`
      );
    }

    // Verify the account completed onboarding
    const status = await getAccountStatus(contractor.stripe_connect_id);

    if (status.detailsSubmitted) {
      return NextResponse.redirect(
        `${origin}/account?stripe_connect=success`
      );
    }

    // Onboarding was started but not completed
    return NextResponse.redirect(
      `${origin}/account?stripe_connect=incomplete`
    );
  } catch (error) {
    console.error("Stripe Connect callback error:", error);

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    return NextResponse.redirect(
      `${origin}/account?stripe_connect=error`
    );
  }
}
