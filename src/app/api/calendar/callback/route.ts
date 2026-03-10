import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangeCodeForTokens } from "@/lib/google-calendar";

/**
 * GET /api/calendar/callback
 *
 * Google OAuth callback handler. Receives the authorization code and state,
 * exchanges the code for tokens, and stores the refresh token on the
 * contractor profile so we can check their calendar later.
 */
export async function GET(req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const code = req.nextUrl.searchParams.get("code");
    const stateParam = req.nextUrl.searchParams.get("state");
    const error = req.nextUrl.searchParams.get("error");

    // ---- Handle user denial ----
    if (error) {
      return NextResponse.redirect(
        new URL(`/account?error=calendar_denied`, siteUrl)
      );
    }

    if (!code || !stateParam) {
      return NextResponse.redirect(
        new URL("/account?error=missing_callback_params", siteUrl)
      );
    }

    // ---- Decode state ----
    let state: { contractorProfileId: string; userId: string };
    try {
      state = JSON.parse(Buffer.from(stateParam, "base64url").toString("utf-8"));
    } catch {
      return NextResponse.redirect(
        new URL("/account?error=invalid_state", siteUrl)
      );
    }

    // ---- Auth - verify the logged-in user matches the state ----
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== state.userId) {
      return NextResponse.redirect(
        new URL("/login?error=session_mismatch", siteUrl)
      );
    }

    // ---- Exchange code for tokens ----
    const tokens = await exchangeCodeForTokens(code);

    // ---- Store refresh token on contractor profile ----
    // We store the calendar tokens as a JSON object in the
    // calendar_tokens column. If the column doesn't exist yet,
    // we fall back to storing in the service_area JSON field
    // under a _calendar_tokens key.
    const calendarTokenData = {
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
      expires_at: Date.now() + tokens.expires_in * 1000,
      connected_at: new Date().toISOString(),
    };

    // Try updating with a dedicated column first
    const { error: updateError } = await supabase
      .from("contractor_profiles")
      .update({
        calendar_refresh_token: tokens.refresh_token,
      } as Record<string, unknown>)
      .eq("id", state.contractorProfileId);

    // If the column doesn't exist, fall back to storing in service_area
    if (updateError) {
      const { data: profile } = await supabase
        .from("contractor_profiles")
        .select("service_area")
        .eq("id", state.contractorProfileId)
        .single();

      const serviceArea = (profile?.service_area as Record<string, unknown>) || {};

      await supabase
        .from("contractor_profiles")
        .update({
          service_area: {
            ...serviceArea,
            _calendar_tokens: calendarTokenData,
          },
        })
        .eq("id", state.contractorProfileId);
    }

    return NextResponse.redirect(
      new URL("/account?calendar=connected", siteUrl)
    );
  } catch (error) {
    console.error("Calendar callback error:", error);
    return NextResponse.redirect(
      new URL("/account?error=calendar_callback_failed", siteUrl)
    );
  }
}
