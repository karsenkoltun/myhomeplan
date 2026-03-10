import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  // Delete in order to respect FK constraints:
  // 1. subscription_services (FK to subscriptions)
  // 2. subscriptions
  // 3. contractor_references (FK to contractor_profiles)
  // 4. contractor_service_rates (FK to contractor_profiles)
  // 5. contractor_profiles
  // 6. pm_company_contacts (FK to pm_companies)
  // 7. pm_managed_properties (FK to pm_companies)
  // 8. pm_companies
  // 9. strata_properties
  // 10. homeowner_properties
  // 11. service_bookings (via property)
  // 12. notifications

  try {
    // Get all subscription IDs for this user
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("profile_id", userId);
    const subIds = (subs ?? []).map((s) => s.id);

    if (subIds.length > 0) {
      await supabase
        .from("subscription_services")
        .delete()
        .in("subscription_id", subIds);
    }

    await supabase.from("subscriptions").delete().eq("profile_id", userId);

    // Get contractor profile IDs
    const { data: contractors } = await supabase
      .from("contractor_profiles")
      .select("id")
      .eq("profile_id", userId);
    const contractorIds = (contractors ?? []).map((c) => c.id);

    if (contractorIds.length > 0) {
      await supabase
        .from("contractor_references")
        .delete()
        .in("contractor_profile_id", contractorIds);
      await supabase
        .from("contractor_service_rates")
        .delete()
        .in("contractor_profile_id", contractorIds);
    }

    await supabase.from("contractor_profiles").delete().eq("profile_id", userId);

    // Get PM company IDs
    const { data: pmCompanies } = await supabase
      .from("pm_companies")
      .select("id")
      .eq("profile_id", userId);
    const pmIds = (pmCompanies ?? []).map((p) => p.id);

    if (pmIds.length > 0) {
      await supabase
        .from("pm_company_contacts")
        .delete()
        .in("pm_company_id", pmIds);
      await supabase
        .from("pm_managed_properties")
        .delete()
        .in("pm_company_id", pmIds);
    }

    await supabase.from("pm_companies").delete().eq("profile_id", userId);

    // Get property IDs for bookings cleanup
    const { data: properties } = await supabase
      .from("homeowner_properties")
      .select("id")
      .eq("profile_id", userId);
    const propertyIds = (properties ?? []).map((p) => p.id);

    if (propertyIds.length > 0) {
      await supabase
        .from("service_bookings")
        .delete()
        .in("property_id", propertyIds);
    }

    await supabase.from("strata_properties").delete().eq("profile_id", userId);
    await supabase.from("homeowner_properties").delete().eq("profile_id", userId);
    await supabase.from("notifications").delete().eq("profile_id", userId);

    // Reset profile: clear user_type and setup_progress
    await supabase
      .from("profiles")
      .update({
        user_type: "homeowner",
        date_of_birth: null,
        setup_progress: {
          profile_completed: false,
          user_type_selected: false,
          details_completed: false,
          plan_configured: false,
          plan_activated: false,
        },
      })
      .eq("id", userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Account reset failed:", err);
    return NextResponse.json(
      { error: "Failed to reset account data" },
      { status: 500 }
    );
  }
}
