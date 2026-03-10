import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error.message);
      const url = new URL("/login", origin);
      url.searchParams.set("error", error.message);
      return NextResponse.redirect(url);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Check if user has completed onboarding
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_complete, first_name, last_name, email")
        .eq("id", user.id)
        .maybeSingle();

      // Enrich profile with OAuth metadata (name, email) if missing
      const meta = user.user_metadata;
      if (profile) {
        const updates: Record<string, string> = {};
        if (!profile.first_name && meta?.full_name) {
          const parts = (meta.full_name as string).split(" ");
          updates.first_name = parts[0] || "";
          updates.last_name = parts.slice(1).join(" ") || "";
        }
        if (!profile.email && user.email) {
          updates.email = user.email;
        }
        if (Object.keys(updates).length > 0) {
          await supabase
            .from("profiles")
            .update(updates)
            .eq("id", user.id);
        }
      }

      // Always go to dashboard - setup guide handles the rest
    }

    return NextResponse.redirect(`${origin}/account`);
  }

  // No code parameter - redirect with error
  console.error("Auth callback: no code parameter received");
  const url = new URL("/login", origin);
  url.searchParams.set("error", "no_code");
  return NextResponse.redirect(url);
}
