import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";

type InviteBody = {
  email?: string;
  role?: "manager" | "member" | "viewer";
};

// GET /api/account/members
// List all members on the current user's account (owner view).
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("account_members")
    .select(
      "id, invited_email, role, status, invited_at, accepted_at, revoked_at, member_id, invited_by"
    )
    .eq("owner_id", user.id)
    .order("invited_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Hydrate linked profile names/emails when member has accepted
  const memberIds = (data ?? []).map((r) => r.member_id).filter(Boolean) as string[];
  let profileById = new Map<string, { first_name: string; last_name: string; email: string }>();
  if (memberIds.length > 0) {
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email")
      .in("id", memberIds);
    profileById = new Map((profs ?? []).map((p) => [p.id as string, p as never]));
  }

  const members = (data ?? []).map((row) => {
    const profile = row.member_id ? profileById.get(row.member_id) : null;
    return {
      id: row.id,
      email: row.invited_email,
      role: row.role,
      status: row.status,
      invited_at: row.invited_at,
      accepted_at: row.accepted_at,
      revoked_at: row.revoked_at,
      member: profile
        ? {
            id: row.member_id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email,
          }
        : null,
    };
  });

  return NextResponse.json({ members });
}

// POST /api/account/members
// Invite a new member by email.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: InviteBody;
  try {
    body = (await request.json()) as InviteBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const role = body.role ?? "member";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (!["manager", "member", "viewer"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Prevent inviting yourself
  if (user.email && email === user.email.toLowerCase()) {
    return NextResponse.json(
      { error: "You cannot invite yourself" },
      { status: 400 }
    );
  }

  // Check for existing row (reinvite flow)
  const { data: existing } = await supabase
    .from("account_members")
    .select("id, status")
    .eq("owner_id", user.id)
    .eq("invited_email", email)
    .maybeSingle();

  // If a matching profile already exists, link immediately
  const { data: matchedProfile } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  const token = randomBytes(24).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14); // 14 days

  const payload = {
    owner_id: user.id,
    invited_by: user.id,
    invited_email: email,
    role,
    status: matchedProfile ? ("active" as const) : ("pending" as const),
    member_id: matchedProfile?.id ?? null,
    invite_token: matchedProfile ? null : token,
    invite_expires_at: matchedProfile ? null : expires.toISOString(),
    accepted_at: matchedProfile ? new Date().toISOString() : null,
    revoked_at: null,
  };

  if (existing) {
    const { data: updated, error: updErr } = await supabase
      .from("account_members")
      .update(payload)
      .eq("id", existing.id)
      .select()
      .single();

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }
    return NextResponse.json({ member: updated });
  }

  const { data: inserted, error: insErr } = await supabase
    .from("account_members")
    .insert(payload)
    .select()
    .single();

  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ member: inserted });
}
