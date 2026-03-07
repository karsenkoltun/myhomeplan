"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Home, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      setSuccess(true);
      toast.success("Password updated successfully!");
      setTimeout(() => router.push("/account"), 2000);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="w-full max-w-sm"
      >
        <Link
          href="/"
          className="mx-auto mb-8 flex items-center justify-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            My Home Plan
          </span>
        </Link>

        <Card>
          <CardContent className="p-6">
            {success ? (
              <div className="text-center">
                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
                <h1 className="text-xl font-bold">Password updated</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Redirecting you to your account...
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-center text-xl font-bold">
                  Set new password
                </h1>
                <p className="mt-1 text-center text-sm text-muted-foreground">
                  Enter your new password below
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="password">New password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="h-11"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="h-11"
                      required
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update password
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
