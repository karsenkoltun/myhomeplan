"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { getProfile } from "@/lib/supabase/queries";
import { HomeownerDashboard } from "@/components/dashboard/homeowner-dashboard";
import { ContractorDashboard } from "@/components/dashboard/contractor-dashboard";
import { StrataDashboard } from "@/components/dashboard/strata-dashboard";
import { PMDashboard } from "@/components/dashboard/pm-dashboard";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const data = await getProfile(user.id);
        if (!data.onboarding_complete) {
          router.push("/onboarding");
          return;
        }
        setProfile(data);
      } catch {
        // Fall back - redirect to onboarding
        router.push("/onboarding");
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) loadData();
  }, [user, authLoading, router]);

  if (authLoading || loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const userType = profile.user_type as string;

  switch (userType) {
    case "homeowner":
      return <HomeownerDashboard profile={profile} />;
    case "contractor":
      return <ContractorDashboard profile={profile} />;
    case "strata":
      return <StrataDashboard profile={profile} />;
    case "property-manager":
      return <PMDashboard profile={profile} />;
    default:
      return <HomeownerDashboard profile={profile} />;
  }
}
