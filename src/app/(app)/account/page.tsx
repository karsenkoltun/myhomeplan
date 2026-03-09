"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { getProfile, getContractorProfile, getStrataProperty, getPMCompany } from "@/lib/supabase/queries";
import { HomeownerDashboard } from "@/components/dashboard/homeowner-dashboard";
import { ContractorDashboard } from "@/components/dashboard/contractor-dashboard";
import { StrataDashboard } from "@/components/dashboard/strata-dashboard";
import { PMDashboard } from "@/components/dashboard/pm-dashboard";
import { useUserStore, type UserType, type RoleProfile } from "@/stores/user-store";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const { activeRole, setActiveRole, setAvailableRoles } = useUserStore();

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

        // Build available roles by checking which role-specific tables have data
        const roles: RoleProfile[] = [];
        const primaryRole = data.user_type as UserType;

        // Always add the primary role
        const roleLabels: Record<UserType, string> = {
          homeowner: "Homeowner",
          contractor: "Contractor",
          strata: "Strata Manager",
          "property-manager": "Property Manager",
        };
        roles.push({ role: primaryRole, label: roleLabels[primaryRole] });

        // Check for additional roles (in parallel)
        const checks = await Promise.allSettled([
          primaryRole !== "contractor" ? getContractorProfile(user.id) : Promise.reject(),
          primaryRole !== "strata" ? getStrataProperty(user.id) : Promise.reject(),
          primaryRole !== "property-manager" ? getPMCompany(user.id) : Promise.reject(),
        ]);

        if (checks[0].status === "fulfilled" && checks[0].value) {
          roles.push({ role: "contractor", label: "Contractor" });
        }
        if (checks[1].status === "fulfilled" && checks[1].value) {
          const strata = checks[1].value as Record<string, unknown>;
          roles.push({
            role: "strata",
            label: "Strata Manager",
            propertyName: (strata.building_name as string) || undefined,
          });
        }
        if (checks[2].status === "fulfilled" && checks[2].value) {
          const pm = checks[2].value as Record<string, unknown>;
          roles.push({
            role: "property-manager",
            label: "Property Manager",
            propertyName: (pm.company_name as string) || undefined,
          });
        }

        setAvailableRoles(roles);

        // If no active role set yet, use primary
        if (!activeRole) {
          setActiveRole(primaryRole);
        }
      } catch {
        router.push("/onboarding");
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) loadData();
  }, [user, authLoading, router, activeRole, setActiveRole, setAvailableRoles]);

  if (authLoading || loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Use activeRole from store, fall back to profile user_type
  const currentRole = activeRole || (profile.user_type as string);

  switch (currentRole) {
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
