"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Home, Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setSent(true);
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
            {sent ? (
              <div className="text-center">
                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
                <h1 className="text-xl font-bold">Check your email</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  We sent a password reset link to{" "}
                  <strong>{email}</strong>. Click the link in the email to
                  reset your password.
                </p>
                <Button variant="outline" className="mt-6" asChild>
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to sign in
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <h1 className="text-center text-xl font-bold">
                  Reset your password
                </h1>
                <p className="mt-1 text-center text-sm text-muted-foreground">
                  Enter your email and we'll send you a reset link
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="h-11 pl-9"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Send reset link
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
