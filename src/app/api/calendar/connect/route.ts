import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthUrl } from "@/lib/google-calendar";

/**
 * GET /api/calendar/connect
 *
 * Initiates the Google OAuth flow for a contractor to connect their calendar.
 * Authenticates the user, verifies they have a contractor profile, then
 * redirects to Google's OAuth consent page with the contractor profile ID
 * encoded in the state parameter.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // ---- Auth ----
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
    }

    // ---- Verify contractor profile ----
    const { data: contractorProfile } = await supabase
      .from("contractor_profiles")
      .select("id")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!contractorProfile) {
      return NextResponse.redirect(
        new URL("/account?error=no_contractor_profile", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
      );
    }

    // ---- Build state token ----
    // Encode the contractor profile ID as the state parameter so we can
    // associate the tokens on callback. In production, consider signing or
    // encrypting this value to prevent tampering.
    const state = Buffer.from(
      JSON.stringify({ contractorProfileId: contractorProfile.id, userId: user.id })
    ).toString("base64url");

    // ---- Redirect to Google OAuth ----
    const authUrl = getAuthUrl(state);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Calendar connect error:", error);
    return NextResponse.redirect(
      new URL("/account?error=calendar_connect_failed", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
    );
  }
}
