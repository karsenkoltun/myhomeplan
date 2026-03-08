"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

interface AuthFormProps {
  mode?: "login" | "signup";
  /** When true, hides the outer full-screen wrapper (used inside modals) */
  embedded?: boolean;
  /** Callback fired after successful login (used by modal to close itself) */
  onSuccess?: () => void;
}

export function AuthForm({ mode: initialMode = "login", embedded = false, onSuccess }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/onboarding";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createClient();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
          },
        });

        if (error) throw error;
        toast.success("Check your email for a confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Check onboarding status and redirect
        const { data: { user: loggedInUser } } = await supabase.auth.getUser();
        if (loggedInUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_complete")
            .eq("id", loggedInUser.id)
            .maybeSingle();

          if (profile?.onboarding_complete) {
            router.push("/account");
          } else {
            router.push(redirectTo);
          }
          router.refresh();
        }

        onSuccess?.();
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      setGoogleLoading(false);
    }
  };

  const formContent = (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <Link href="/" className="mx-auto mb-6 flex items-center justify-center gap-2.5">
        <Image src="/icon-192.png" alt="My Home Plan" width={40} height={40} className="h-10 w-10" />
        <span className="text-xl font-bold tracking-tight">My Home Plan</span>
      </Link>

      {/* Glassmorphic Card */}
      <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in to manage your home services"
              : "Get started with your home service plan"}
          </p>
        </div>

        {/* Google OAuth */}
        <Button
          variant="outline"
          className="h-12 w-full gap-2.5 rounded-xl border-border/60 bg-background/50 text-sm font-medium transition-all hover:bg-background/80 hover:shadow-sm"
          onClick={handleGoogleAuth}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="h-5 w-5" />
          )}
          Continue with Google
        </Button>

        {/* OR Divider */}
        <div className="relative my-6 flex items-center">
          <div className="flex-1 border-t border-border/40" />
          <span className="mx-4 flex h-7 items-center rounded-full bg-muted/60 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            OR
          </span>
          <div className="flex-1 border-t border-border/40" />
        </div>

        {/* Email + Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="auth-email" className="text-xs font-medium text-muted-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 rounded-xl border-border/40 bg-muted/50 pl-10 text-sm transition-all focus-visible:border-primary/40 focus-visible:ring-[3px] focus-visible:ring-primary/20"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="auth-password" className="text-xs font-medium text-muted-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "Create a password (min 6 chars)" : "Your password"}
                className="h-12 rounded-xl border-border/40 bg-muted/50 pl-10 pr-10 text-sm transition-all focus-visible:border-primary/40 focus-visible:ring-[3px] focus-visible:ring-primary/20"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-muted-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === "login" && (
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <Button
            type="submit"
            className="h-12 w-full rounded-full text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>

        {/* Mode Toggle */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              {embedded ? (
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Sign up
                </button>
              ) : (
                <Link href="/signup" className="font-semibold text-primary transition-colors hover:text-primary/80">
                  Sign up
                </Link>
              )}
            </>
          ) : (
            <>
              Already have an account?{" "}
              {embedded ? (
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Sign in
                </button>
              ) : (
                <Link href="/login" className="font-semibold text-primary transition-colors hover:text-primary/80">
                  Sign in
                </Link>
              )}
            </>
          )}
        </p>
      </div>

      {/* Social Proof */}
      <div className="mt-6 flex flex-col items-center gap-2.5">
        <div className="flex -space-x-2">
          {[
            "bg-emerald-500",
            "bg-sky-500",
            "bg-amber-500",
            "bg-rose-500",
            "bg-violet-500",
          ].map((color, i) => (
            <div
              key={i}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold text-white",
                color
              )}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold text-muted-foreground">
            +
          </div>
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          Join <span className="text-foreground">200+</span> Okanagan homeowners
        </p>
      </div>

      {/* Terms */}
      <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground/70">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline transition-colors hover:text-foreground">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline transition-colors hover:text-foreground">
          Privacy Policy
        </Link>
      </p>
    </div>
  );

  // If embedded (inside a modal), skip the full-screen wrapper + animations
  if (embedded) {
    return formContent;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="w-full max-w-sm"
      >
        {formContent}
      </motion.div>
    </div>
  );
}
