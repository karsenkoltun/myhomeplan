"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/ui/motion";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";

type MemberRole = "manager" | "member" | "viewer";
type MemberStatus = "pending" | "active" | "revoked";

type Member = {
  id: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  invited_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
  member: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
};

const ROLE_LABEL: Record<MemberRole, string> = {
  manager: "Manager",
  member: "Member",
  viewer: "Viewer",
};

const ROLE_DESC: Record<MemberRole, string> = {
  manager: "Full access, can invite others",
  member: "Can book services and view account",
  viewer: "Read-only access",
};

export default function AccountMembersPage() {
  const { loading: authLoading } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("member");
  const [inviting, setInviting] = useState(false);

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/account/members", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { members: Member[] };
      setMembers(data.members);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) loadMembers();
  }, [authLoading, loadMembers]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;

    setInviting(true);
    try {
      const res = await fetch("/api/account/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: inviteRole }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error || "Failed to send invite");
      }
      toast.success(`Invite sent to ${email}`);
      setInviteEmail("");
      setInviteRole("member");
      await loadMembers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send invite");
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (id: string, role: MemberRole) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/account/members/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
      toast.success("Role updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this member? They will lose access to the account.")) return;
    setRevokingId(id);
    try {
      const res = await fetch(`/api/account/members/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      await loadMembers();
      toast.success("Member revoked");
    } catch (err) {
      console.error(err);
      toast.error("Failed to revoke member");
    } finally {
      setRevokingId(null);
    }
  };

  const activeMembers = members.filter((m) => m.status !== "revoked");
  const revokedMembers = members.filter((m) => m.status === "revoked");

  return (
    <FadeIn>
      <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to account
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Account members</h1>
          <p className="mt-2 text-muted-foreground">
            Invite a partner, family member, or assistant to your account. Each member
            signs in with their own email and password.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite someone new
            </CardTitle>
            <CardDescription>
              They&apos;ll get an email with a link to join your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="name@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    disabled={inviting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-role">Role</Label>
                  <Select
                    value={inviteRole}
                    onValueChange={(v) => setInviteRole(v as MemberRole)}
                    disabled={inviting}
                  >
                    <SelectTrigger id="invite-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(ROLE_LABEL) as MemberRole[]).map((r) => (
                        <SelectItem key={r} value={r}>
                          {ROLE_LABEL[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{ROLE_DESC[inviteRole]}</p>
              <Button type="submit" disabled={inviting || !inviteEmail.trim()}>
                {inviting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending invite...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send invite
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              People with access to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading members...
              </div>
            ) : activeMembers.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No members yet. Invite someone above.
              </p>
            ) : (
              <ul className="divide-y">
                {activeMembers.map((m) => {
                  const name = m.member
                    ? `${m.member.first_name} ${m.member.last_name}`.trim()
                    : m.email;
                  const displayEmail = m.member?.email ?? m.email;
                  return (
                    <li
                      key={m.id}
                      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium">
                            {name || displayEmail}
                          </p>
                          {m.status === "pending" && (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </div>
                        <p className="truncate text-sm text-muted-foreground">
                          {displayEmail}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={m.role}
                          onValueChange={(v) => handleRoleChange(m.id, v as MemberRole)}
                          disabled={updatingId === m.id || revokingId === m.id}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(ROLE_LABEL) as MemberRole[]).map((r) => (
                              <SelectItem key={r} value={r}>
                                {ROLE_LABEL[r]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRevoke(m.id)}
                          disabled={revokingId === m.id}
                          aria-label="Revoke member"
                        >
                          {revokingId === m.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {revokedMembers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revoked</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {revokedMembers.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between py-3 text-sm text-muted-foreground"
                  >
                    <span className="truncate">{m.member?.email ?? m.email}</span>
                    <Badge variant="outline">Revoked</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Separator />
        <p className="text-xs text-muted-foreground">
          Members sign in with their own email and password. Revoking access is instant.
        </p>
      </div>
    </FadeIn>
  );
}
