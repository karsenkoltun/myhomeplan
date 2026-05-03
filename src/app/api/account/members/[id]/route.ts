import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type PatchBody = {
  role?: "manager" | "member" | "viewer";
};

// PATCH /api/account/members/:id
// Update a member's role.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.role || !["manager", "member", "viewer"].includes(body.role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("account_members")
    .update({ role: body.role })
    .eq("id", id)
    .eq("owner_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ member: data });
}

// DELETE /api/account/members/:id
// Revoke a member (soft): status -> revoked. If invite was still pending,
// the row is removed entirely.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: existing } = await supabase
    .from("account_members")
    .select("id, status")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.status === "pending") {
    const { error } = await supabase
      .from("account_members")
      .delete()
      .eq("id", id)
      .eq("owner_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ revoked: true, deleted: true });
  }

  const { data, error } = await supabase
    .from("account_members")
    .update({
      status: "revoked",
      revoked_at: new Date().toISOString(),
      invite_token: null,
    })
    .eq("id", id)
    .eq("owner_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ member: data });
}
