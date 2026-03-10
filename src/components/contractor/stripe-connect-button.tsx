"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/auth-provider";

interface ConnectStatus {
  connected: boolean;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  detailsSubmitted?: boolean;
}

export function StripeConnectButton() {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current Connect status on mount
  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchStatus() {
      try {
        const res = await fetch("/api/stripe/connect");
        if (!res.ok) {
          // 404 = not a contractor, silently ignore
          if (res.status === 404) {
            setLoading(false);
            return;
          }
          throw new Error("Failed to fetch Connect status");
        }
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        console.error("Error fetching Connect status:", err);
        setError("Unable to load payment account status");
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, [user, authLoading]);

  const handleConnect = useCallback(async () => {
    setConnecting(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to start onboarding");
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No onboarding URL returned");
      }
    } catch (err) {
      console.error("Connect error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to connect account"
      );
      setConnecting(false);
    }
  }, []);

  const handleDashboard = useCallback(async () => {
    setError(null);

    try {
      // The Stripe Express dashboard link is generated server-side.
      // For now, redirect to Stripe's Express login.
      // A dedicated endpoint could be added later.
      window.open("https://connect.stripe.com/express_login", "_blank");
    } catch (err) {
      console.error("Dashboard link error:", err);
    }
  }, []);

  if (authLoading || loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        Loading...
      </Button>
    );
  }

  if (!status) {
    // Not a contractor or status couldn't be loaded
    return null;
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={handleConnect}>
          Retry
        </Button>
      </div>
    );
  }

  // Fully connected and payouts enabled
  if (
    status.connected &&
    status.detailsSubmitted &&
    status.payoutsEnabled
  ) {
    return (
      <div className="flex items-center gap-3">
        <Badge
          variant="default"
          className="bg-green-600 text-white hover:bg-green-600"
        >
          Payouts Connected
        </Badge>
        <Button variant="ghost" size="sm" onClick={handleDashboard}>
          View Stripe Dashboard
        </Button>
      </div>
    );
  }

  // Account created but onboarding incomplete
  if (status.connected && !status.detailsSubmitted) {
    return (
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          Setup Incomplete
        </Badge>
        <Button
          size="sm"
          onClick={handleConnect}
          disabled={connecting}
        >
          {connecting ? "Redirecting..." : "Complete Bank Account Setup"}
        </Button>
      </div>
    );
  }

  // Account created, details submitted, but payouts not yet enabled (pending verification)
  if (status.connected && status.detailsSubmitted && !status.payoutsEnabled) {
    return (
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          Verification Pending
        </Badge>
        <Button variant="ghost" size="sm" onClick={handleDashboard}>
          Check Status
        </Button>
      </div>
    );
  }

  // Not connected yet
  return (
    <Button
      onClick={handleConnect}
      disabled={connecting}
    >
      {connecting ? "Redirecting..." : "Connect Bank Account"}
    </Button>
  );
}
