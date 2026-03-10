"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ExternalLink, Loader2, Calendar, DollarSign, AlertCircle, ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { getSubscription, getSubscriptionForProperty } from "@/lib/supabase/queries";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";
import { motion } from "framer-motion";

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: typeof CheckCircle2 }> = {
  active: { label: "Active", color: "text-emerald-600", bgColor: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  draft: { label: "Draft", color: "text-gray-600", bgColor: "bg-gray-500/10 border-gray-500/20", icon: Clock },
  trialing: { label: "Awaiting Payment", color: "text-sky-600", bgColor: "bg-sky-500/10 border-sky-500/20", icon: Clock },
  past_due: { label: "Past Due", color: "text-orange-600", bgColor: "bg-orange-500/10 border-orange-500/20", icon: AlertCircle },
  cancelled: { label: "Cancelled", color: "text-red-600", bgColor: "bg-red-500/10 border-red-500/20", icon: AlertCircle },
  paused: { label: "Paused", color: "text-gray-600", bgColor: "bg-gray-500/10 border-gray-500/20", icon: Clock },
};

export default function BillingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { activePropertyId } = useUserStore();
  const [subscription, setSubscription] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        let sub = null;
        if (activePropertyId) {
          sub = await getSubscriptionForProperty(activePropertyId);
        }
        if (!sub) {
          sub = await getSubscription(user.id);
        }
        setSubscription(sub);
      } catch {
        // No subscription
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) load();
  }, [user, authLoading, activePropertyId]);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Could not open billing portal");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPortalLoading(false);
    }
  };

  const retryCheckout = async () => {
    if (!subscription) return;
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          planInterval: subscription.plan_interval,
          monthlyTotal: subscription.monthly_total,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Could not create checkout session");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPortalLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const status = (subscription?.status as string) || "none";
  const planInterval = subscription?.plan_interval as string;
  const monthlyTotal = subscription?.monthly_total as number;
  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end as string).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const hasStripeSubscription = !!subscription?.stripe_subscription_id;
  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.paused;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => router.push("/account")}
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="mt-1.5 text-muted-foreground">Manage your subscription and payment details.</p>
        </motion.div>

        <div className="mt-10 space-y-6">
          {/* Subscription Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-2xl border bg-card shadow-sm"
          >
            <div className="border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Subscription</h2>
                <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                  <StatusIcon className="h-3 w-3" />
                  {statusInfo.label}
                </div>
              </div>
            </div>

            {subscription ? (
              <div className="p-6">
                <div className="grid gap-6 sm:grid-cols-3">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">Monthly Total</span>
                    </div>
                    <p className="mt-2 text-3xl font-bold tabular-nums">
                      ${monthlyTotal?.toFixed(0)}
                      <span className="text-base font-normal text-muted-foreground">/mo</span>
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">Billing Cycle</span>
                    </div>
                    <p className="mt-2 text-lg font-semibold capitalize">{planInterval}</p>
                  </div>
                  {periodEnd && (
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Next Billing</span>
                      </div>
                      <p className="mt-2 text-lg font-semibold">{periodEnd}</p>
                    </div>
                  )}
                </div>

                {/* Status alerts */}
                {status === "past_due" && (
                  <div className="mt-6 flex items-start gap-3 rounded-xl bg-orange-500/5 border border-orange-500/10 p-4">
                    <AlertCircle className="h-5 w-5 shrink-0 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-600">Payment failed</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">Please update your payment method to continue receiving services.</p>
                    </div>
                  </div>
                )}

                {status === "draft" && (
                  <div className="mt-6 flex items-start gap-3 rounded-xl bg-gray-500/5 border border-gray-500/10 p-4">
                    <Clock className="h-5 w-5 shrink-0 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Plan saved as draft</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">Your plan is configured but not yet active. Activate it when you&apos;re ready to start.</p>
                    </div>
                  </div>
                )}

                {status === "trialing" && (
                  <div className="mt-6 flex items-start gap-3 rounded-xl bg-sky-500/5 border border-sky-500/10 p-4">
                    <Clock className="h-5 w-5 shrink-0 text-sky-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-sky-600">Payment required</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">Complete payment to activate your subscription and start receiving services.</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground">No active subscription found.</p>
              </div>
            )}
          </motion.div>

          {/* Payment Management */}
          {hasStripeSubscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="overflow-hidden rounded-2xl border bg-card shadow-sm"
            >
              <div className="border-b px-6 py-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Payment</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-muted-foreground">
                  Update your payment method, view invoices, or manage your subscription.
                </p>
                <button
                  onClick={openPortal}
                  disabled={portalLoading}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {portalLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  Manage Billing
                </button>
              </div>
            </motion.div>
          )}

          {/* Activate / Complete payment CTA for draft or trialing */}
          {(status === "draft" || status === "trialing") && subscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="overflow-hidden rounded-2xl border-2 border-primary/20 bg-card shadow-sm"
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold">
                  {status === "draft" ? "Activate your plan" : "Complete your payment"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your plan is saved and ready to go. Click below to set up payment and activate your subscription.
                </p>
                <button
                  onClick={retryCheckout}
                  disabled={portalLoading}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {portalLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  {status === "draft" ? "Activate Plan" : "Complete Payment"}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
