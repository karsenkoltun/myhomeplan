"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { getProfile, updateProfile } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import { FadeIn } from "@/components/ui/motion";
import { toast } from "sonner";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();

  // Profile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        const profile = await getProfile(user.id);
        setFirstName(profile.first_name ?? "");
        setLastName(profile.last_name ?? "");
        setPhone(profile.phone ?? "");
        setEmail(user.email ?? "");
        setEmailNotifications(profile.email_notifications ?? true);
        setSmsNotifications(profile.sms_notifications ?? true);
        setMarketingEmails(profile.marketing_emails ?? false);
      } catch (err) {
        console.error("Failed to load profile:", err);
        toast.error("Failed to load your profile.");
      } finally {
        setLoadingProfile(false);
      }
    }
    if (!authLoading) loadProfile();
  }, [user, authLoading]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateProfile(user.id, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
      });
      toast.success("Profile updated.");
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      console.error("Failed to change password:", err);
      const message = err instanceof Error ? err.message : "Failed to update password.";
      toast.error(message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!user) return;
    setSavingNotifications(true);
    try {
      await updateProfile(user.id, {
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
        marketing_emails: marketingEmails,
      });
      toast.success("Notification preferences saved.");
    } catch (err) {
      console.error("Failed to save notifications:", err);
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteText !== "DELETE") return;
    if (!user) return;
    setDeleting(true);
    try {
      const supabase = createClient();
      // Delete profile row (cascades in DB) then sign out
      await supabase.from("profiles").delete().eq("id", user.id);
      toast.success("Account deleted. Goodbye.");
      await signOut();
    } catch (err) {
      console.error("Failed to delete account:", err);
      toast.error("Failed to delete account. Please contact support.");
      setDeleting(false);
    }
  };

  if (authLoading || loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <FadeIn>
        <Button variant="ghost" className="mb-4 gap-2" asChild>
          <Link href="/account">
            <ArrowLeft className="h-4 w-4" /> Back to Account
          </Link>
        </Button>

        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your profile, password, and preferences.
        </p>
      </FadeIn>

      <div className="mt-8 space-y-6">
        {/* ---- Profile ---- */}
        <FadeIn delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>Your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>First Name</Label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Last Name</Label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={email} disabled className="h-11 bg-muted" />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed here.
                </p>
              </div>
              <Button
                onClick={handleSaveProfile}
                className="gap-2"
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {savingProfile ? "Saving..." : "Save Profile"}
              </Button>
            </CardContent>
          </Card>
        </FadeIn>

        {/* ---- Password ---- */}
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Password</CardTitle>
              <CardDescription>Update your password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="h-11"
                />
              </div>
              <Button
                onClick={handleChangePassword}
                className="gap-2"
                disabled={savingPassword || !newPassword}
              >
                {savingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {savingPassword ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </FadeIn>

        {/* ---- Notifications ---- */}
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notifications</CardTitle>
              <CardDescription>
                Choose how you want to be notified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label className="text-sm font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Booking confirmations, reminders, and updates.
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label className="text-sm font-medium">
                    SMS Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Text alerts for upcoming services.
                  </p>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label className="text-sm font-medium">
                    Marketing Emails
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Tips, promotions, and new service announcements.
                  </p>
                </div>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
              <Button
                onClick={handleSaveNotifications}
                className="gap-2"
                disabled={savingNotifications}
              >
                {savingNotifications ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {savingNotifications ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </FadeIn>

        {/* ---- Danger Zone ---- */}
        <FadeIn delay={0.4}>
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-base text-destructive">
                Danger Zone
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showDeleteConfirm ? (
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              ) : (
                <div className="space-y-3">
                  <Separator />
                  <p className="text-sm text-muted-foreground">
                    This action is irreversible. Type{" "}
                    <span className="font-mono font-bold text-destructive">
                      DELETE
                    </span>{" "}
                    to confirm.
                  </p>
                  <Input
                    value={deleteText}
                    onChange={(e) => setDeleteText(e.target.value)}
                    placeholder='Type "DELETE" to confirm'
                    className="h-11"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      className="gap-2"
                      disabled={deleteText !== "DELETE" || deleting}
                      onClick={handleDeleteAccount}
                    >
                      {deleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      {deleting
                        ? "Deleting..."
                        : "Permanently Delete Account"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteText("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
