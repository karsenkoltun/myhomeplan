import { createClient } from "./client";

const supabase = () => createClient();

// ---- PROFILES ----

export async function getProfile(userId: string) {
  const { data, error } = await supabase()
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase()
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- SETUP PROGRESS ----

export async function updateSetupProgress(userId: string, step: string, value: boolean) {
  const { data: profile } = await supabase()
    .from("profiles")
    .select("setup_progress")
    .eq("id", userId)
    .single();

  const progress = ((profile?.setup_progress as Record<string, boolean>) || {});
  progress[step] = value;

  return updateProfile(userId, { setup_progress: progress });
}

// ---- HOMEOWNER PROPERTIES ----

/** Get the most recent property for a user (legacy compat) */
export async function getProperty(userId: string) {
  const { data, error } = await supabase()
    .from("homeowner_properties")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Get ALL properties for a user */
export async function getAllProperties(userId: string) {
  const { data, error } = await supabase()
    .from("homeowner_properties")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Get a specific property by ID */
export async function getPropertyById(propertyId: string) {
  const { data, error } = await supabase()
    .from("homeowner_properties")
    .select("*")
    .eq("id", propertyId)
    .single();
  if (error) throw error;
  return data;
}

/** Create a new property */
export async function createProperty(
  userId: string,
  propertyData: Record<string, unknown>
) {
  const { data, error } = await supabase()
    .from("homeowner_properties")
    .insert({ ...propertyData, profile_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Update an existing property by ID */
export async function updatePropertyById(
  propertyId: string,
  propertyData: Record<string, unknown>
) {
  const { data, error } = await supabase()
    .from("homeowner_properties")
    .update(propertyData)
    .eq("id", propertyId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Delete a property by ID */
export async function deleteProperty(propertyId: string) {
  const { error } = await supabase()
    .from("homeowner_properties")
    .delete()
    .eq("id", propertyId);
  if (error) throw error;
}

export async function upsertProperty(
  userId: string,
  propertyData: Record<string, unknown>
) {
  const existing = await getProperty(userId);

  if (existing) {
    const { data, error } = await supabase()
      .from("homeowner_properties")
      .update(propertyData)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase()
      .from("homeowner_properties")
      .insert({ ...propertyData, profile_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// ---- STRATA PROPERTIES ----

export async function getStrataProperty(userId: string) {
  const { data, error } = await supabase()
    .from("strata_properties")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertStrataProperty(userId: string, strataData: Record<string, unknown>) {
  const existing = await getStrataProperty(userId);

  if (existing) {
    const { data, error } = await supabase()
      .from("strata_properties")
      .update(strataData)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase()
      .from("strata_properties")
      .insert({ ...strataData, profile_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// ---- STRATA PROPERTIES (multi) ----

export async function getAllStrataProperties(userId: string) {
  const { data, error } = await supabase()
    .from("strata_properties")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createStrataPropertyRecord(
  userId: string,
  strataData: Record<string, unknown>
) {
  const { data, error } = await supabase()
    .from("strata_properties")
    .insert({ ...strataData, profile_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateStrataPropertyById(
  strataId: string,
  strataData: Record<string, unknown>
) {
  const { data, error } = await supabase()
    .from("strata_properties")
    .update(strataData)
    .eq("id", strataId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStrataPropertyById(strataId: string) {
  const { error } = await supabase()
    .from("strata_properties")
    .delete()
    .eq("id", strataId);
  if (error) throw error;
}

// ---- PM COMPANIES (multi) ----

export async function getAllPMCompanies(userId: string) {
  const { data, error } = await supabase()
    .from("pm_companies")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createPMCompanyRecord(
  userId: string,
  companyData: Record<string, unknown>
) {
  const { data, error } = await supabase()
    .from("pm_companies")
    .insert({ ...companyData, profile_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePMCompanyById(
  companyId: string,
  companyData: Record<string, unknown>
) {
  const { data, error } = await supabase()
    .from("pm_companies")
    .update(companyData)
    .eq("id", companyId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePMCompanyById(companyId: string) {
  const { error } = await supabase()
    .from("pm_companies")
    .delete()
    .eq("id", companyId);
  if (error) throw error;
}

// ---- CONTRACTOR PROFILES ----

export async function getContractorProfile(userId: string) {
  const { data, error } = await supabase()
    .from("contractor_profiles")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertContractorProfile(userId: string, contractorData: Record<string, unknown>) {
  const existing = await getContractorProfile(userId);

  if (existing) {
    const { data, error } = await supabase()
      .from("contractor_profiles")
      .update(contractorData)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase()
      .from("contractor_profiles")
      .insert({ ...contractorData, profile_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

/** Get ALL contractor profiles for a user (multi-business support) */
export async function getAllContractorProfiles(userId: string) {
  const { data, error } = await supabase()
    .from("contractor_profiles")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Create a new contractor profile */
export async function createContractorProfileRecord(
  userId: string,
  contractorData: Record<string, unknown>
) {
  const { data, error } = await supabase()
    .from("contractor_profiles")
    .insert({ ...contractorData, profile_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Update a contractor profile by ID */
export async function updateContractorProfileById(
  contractorProfileId: string,
  contractorData: Record<string, unknown>
) {
  const { data, error } = await supabase()
    .from("contractor_profiles")
    .update(contractorData)
    .eq("id", contractorProfileId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Delete a contractor profile by ID */
export async function deleteContractorProfileById(contractorProfileId: string) {
  const { error } = await supabase()
    .from("contractor_profiles")
    .delete()
    .eq("id", contractorProfileId);
  if (error) throw error;
}

// ---- CONTRACTOR REFERENCES ----

export async function saveContractorReferences(
  contractorProfileId: string,
  references: { name: string; phone: string; relationship: string }[]
) {
  await supabase()
    .from("contractor_references")
    .delete()
    .eq("contractor_profile_id", contractorProfileId);

  const validRefs = references.filter((r) => r.name.trim());
  if (validRefs.length === 0) return;

  const { error } = await supabase()
    .from("contractor_references")
    .insert(
      validRefs.map((r) => ({
        contractor_profile_id: contractorProfileId,
        name: r.name,
        phone: r.phone,
        relationship: r.relationship,
      }))
    );
  if (error) throw error;
}

// ---- PM COMPANIES ----

export async function getPMCompany(userId: string) {
  const { data, error } = await supabase()
    .from("pm_companies")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertPMCompany(userId: string, companyData: Record<string, unknown>) {
  const existing = await getPMCompany(userId);

  if (existing) {
    const { data, error } = await supabase()
      .from("pm_companies")
      .update(companyData)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase()
      .from("pm_companies")
      .insert({ ...companyData, profile_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// ---- PM CONTACTS ----

export async function savePMContacts(
  pmCompanyId: string,
  contacts: { name: string; email: string; phone: string; role: string; is_primary: boolean; can_approve_reports: boolean; can_approve_invoices: boolean; receives_notifications: boolean }[]
) {
  await supabase()
    .from("pm_company_contacts")
    .delete()
    .eq("pm_company_id", pmCompanyId);

  const validContacts = contacts.filter((c) => c.name.trim());
  if (validContacts.length === 0) return;

  const { error } = await supabase()
    .from("pm_company_contacts")
    .insert(
      validContacts.map((c) => ({
        pm_company_id: pmCompanyId,
        ...c,
      }))
    );
  if (error) throw error;
}

// ---- PM MANAGED PROPERTIES ----

export async function savePMManagedProperties(
  pmCompanyId: string,
  properties: Record<string, unknown>[]
) {
  await supabase()
    .from("pm_managed_properties")
    .delete()
    .eq("pm_company_id", pmCompanyId);

  if (properties.length === 0) return;

  const { error } = await supabase()
    .from("pm_managed_properties")
    .insert(
      properties.map((p) => ({
        pm_company_id: pmCompanyId,
        ...p,
      }))
    );
  if (error) throw error;
}

// ---- SUBSCRIPTIONS ----

export async function getSubscription(userId: string) {
  const { data, error } = await supabase()
    .from("subscriptions")
    .select("*, subscription_services(*)")
    .eq("profile_id", userId)
    .in("status", ["active", "trialing", "draft"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Get subscription for a specific property */
export async function getSubscriptionForProperty(propertyId: string) {
  const { data, error } = await supabase()
    .from("subscriptions")
    .select("*, subscription_services(*)")
    .eq("property_id", propertyId)
    .in("status", ["active", "trialing", "draft"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Get subscription with usage data for a specific property */
export async function getSubscriptionWithUsageForProperty(propertyId: string) {
  const sub = await getSubscriptionForProperty(propertyId);
  if (!sub) return null;

  const services = sub.subscription_services ?? [];
  const periodStart = sub.current_period_start ?? sub.created_at;
  const periodEnd = sub.current_period_end ?? new Date().toISOString();

  const { data: bookings } = await supabase()
    .from("service_bookings")
    .select("service_id, status")
    .eq("subscription_id", sub.id)
    .eq("status", "completed")
    .gte("scheduled_date", periodStart.split("T")[0])
    .lte("scheduled_date", periodEnd.split("T")[0]);

  const completedByService: Record<string, number> = {};
  (bookings ?? []).forEach((b) => {
    completedByService[b.service_id] = (completedByService[b.service_id] || 0) + 1;
  });

  const usageMap = services.map((svc: Record<string, unknown>) => ({
    serviceId: svc.service_id as string,
    frequency: svc.frequency as string,
    monthlyPrice: svc.calculated_monthly_price as number,
    used: completedByService[svc.service_id as string] ?? 0,
  }));

  return { subscription: sub, usageMap, periodStart, periodEnd };
}

export async function createSubscription(
  userId: string,
  propertyId: string | null,
  planInterval: "monthly" | "quarterly" | "annual",
  monthlyTotal: number,
  discountPct: number,
  services: { serviceId: string; frequency: string; specs: Record<string, unknown>; monthlyPrice: number }[],
  status: "active" | "trialing" = "trialing"
) {
  const { data: sub, error: subError } = await supabase()
    .from("subscriptions")
    .insert({
      profile_id: userId,
      property_id: propertyId,
      plan_interval: planInterval,
      monthly_total: monthlyTotal,
      discount_pct: discountPct,
      status,
    })
    .select()
    .single();

  if (subError) throw subError;

  if (services.length > 0) {
    const { error: svcError } = await supabase()
      .from("subscription_services")
      .insert(
        services.map((s) => ({
          subscription_id: sub.id,
          service_id: s.serviceId,
          frequency: s.frequency,
          specs: s.specs,
          calculated_monthly_price: s.monthlyPrice,
        }))
      );
    if (svcError) throw svcError;
  }

  return sub;
}

export async function getSubscriptionByStripeId(stripeSubscriptionId: string) {
  const { data, error } = await supabase()
    .from("subscriptions")
    .select("*, subscription_services(*)")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .single();
  if (error) throw error;
  return data;
}

// ---- SERVICES (from DB catalog) ----

export async function getServices() {
  const { data, error } = await supabase()
    .from("services")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function getStrataServices() {
  const { data, error } = await supabase()
    .from("strata_services")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function getPlanTiers() {
  const { data, error } = await supabase()
    .from("plan_tiers")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw error;
  return data;
}

// ---- PRICING CONFIG (admin-editable multipliers) ----

export async function getPricingAdjustments() {
  const { data, error } = await supabase()
    .from("pricing_adjustments")
    .select("*");
  if (error) throw error;
  return data;
}

export async function updatePricingAdjustment(
  category: string,
  serviceId: string,
  key: string,
  value: number
) {
  const { data, error } = await supabase()
    .from("pricing_adjustments")
    .update({ adjustment_value: value })
    .eq("category", category)
    .eq("service_id", serviceId)
    .eq("adjustment_key", key)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePlatformConfig(key: string, value: string | number) {
  const { data, error } = await supabase()
    .from("platform_config")
    .update({ value: JSON.stringify(value) })
    .eq("key", key)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateServiceBasePrice(serviceId: string, basePrice: number) {
  const { data, error } = await supabase()
    .from("services")
    .update({ base_price: basePrice })
    .eq("id", serviceId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateStrataServicePrice(
  serviceId: string,
  basePerUnit: number,
  basePerSqft: number
) {
  const { data, error } = await supabase()
    .from("strata_services")
    .update({ base_per_unit: basePerUnit, base_per_sqft: basePerSqft })
    .eq("id", serviceId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- SERVICE BOOKINGS ----

export async function getBookingsForProperty(propertyId: string) {
  const { data, error } = await supabase()
    .from("service_bookings")
    .select("*")
    .eq("property_id", propertyId)
    .order("scheduled_date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getBookingsForProperties(propertyIds: string[]) {
  if (propertyIds.length === 0) return [];
  const { data, error } = await supabase()
    .from("service_bookings")
    .select("*")
    .in("property_id", propertyIds)
    .order("scheduled_date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getBookingsForContractor(contractorProfileId: string) {
  const { data, error } = await supabase()
    .from("service_bookings")
    .select("*")
    .eq("contractor_profile_id", contractorProfileId)
    .order("scheduled_date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createBooking(booking: {
  property_id: string;
  service_id: string;
  scheduled_date: string;
  scheduled_time: string;
  notes?: string;
  contractor_profile_id?: string;
  price?: number;
  contractor_payout?: number;
  subscription_id?: string;
}) {
  const { data, error } = await supabase()
    .from("service_bookings")
    .insert({
      ...booking,
      status: "scheduled" as const,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBookingStatus(
  bookingId: string,
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show"
) {
  const updates: Record<string, unknown> = { status };
  if (status === "completed") updates.completed_at = new Date().toISOString();

  const { data, error } = await supabase()
    .from("service_bookings")
    .update(updates)
    .eq("id", bookingId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- NOTIFICATIONS ----

export async function getNotifications(userId: string, limit = 30) {
  const { data, error } = await supabase()
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function createNotification(notification: {
  user_id: string;
  title: string;
  message: string;
  type: string;
  metadata?: Record<string, unknown>;
}) {
  const { data, error } = await supabase()
    .from("notifications")
    .insert(notification)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markNotificationRead(notificationId: string) {
  const { data, error } = await supabase()
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markAllNotificationsRead(userId: string) {
  const { error } = await supabase()
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
  if (error) throw error;
}

export async function getUnreadCount(userId: string) {
  const { count, error } = await supabase()
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);
  if (error) throw error;
  return count ?? 0;
}

// ---- CONTRACTOR AVAILABILITY ----

export async function getAvailableContractorsForService(serviceId: string) {
  const { data, error } = await supabase()
    .from("contractor_profiles")
    .select("*")
    .eq("vetting_status", "approved")
    .contains("services_offered", [serviceId]);
  if (error) throw error;
  return data ?? [];
}

// ---- PM CONTACTS (read) ----

export async function getPMContacts(pmCompanyId: string) {
  const { data, error } = await supabase()
    .from("pm_company_contacts")
    .select("*")
    .eq("pm_company_id", pmCompanyId)
    .order("is_primary", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ---- PM MANAGED PROPERTIES (read) ----

export async function getPMManagedProperties(pmCompanyId: string) {
  const { data, error } = await supabase()
    .from("pm_managed_properties")
    .select("*")
    .eq("pm_company_id", pmCompanyId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ---- USAGE TRACKING ----

export async function getSubscriptionWithUsage(userId: string) {
  const sub = await getSubscription(userId);
  if (!sub) return null;

  const services = sub.subscription_services ?? [];
  const periodStart = sub.current_period_start ?? sub.created_at;
  const periodEnd = sub.current_period_end ?? new Date().toISOString();

  // Get completed bookings in current period
  const { data: bookings } = await supabase()
    .from("service_bookings")
    .select("service_id, status")
    .eq("subscription_id", sub.id)
    .eq("status", "completed")
    .gte("scheduled_date", periodStart.split("T")[0])
    .lte("scheduled_date", periodEnd.split("T")[0]);

  const completedByService: Record<string, number> = {};
  (bookings ?? []).forEach((b) => {
    completedByService[b.service_id] = (completedByService[b.service_id] || 0) + 1;
  });

  const usageMap = services.map((svc: Record<string, unknown>) => ({
    serviceId: svc.service_id as string,
    frequency: svc.frequency as string,
    monthlyPrice: svc.calculated_monthly_price as number,
    used: completedByService[svc.service_id as string] ?? 0,
  }));

  return { subscription: sub, usageMap, periodStart, periodEnd };
}

// ---- ACTIVITY FEED ----

export async function getRecentActivity(profileId: string, propertyId?: string) {
  const [notifs, bookings] = await Promise.all([
    getNotifications(profileId),
    propertyId ? getBookingsForProperty(propertyId) : Promise.resolve([]),
  ]);

  const activities = [
    ...notifs.map((n) => ({
      id: n.id,
      type: "notification" as const,
      title: n.title,
      body: n.message,
      timestamp: n.created_at,
      read: n.read,
    })),
    ...bookings.slice(0, 20).map((b) => ({
      id: b.id,
      type: "booking" as const,
      title: `${b.status === "completed" ? "Completed" : b.status === "cancelled" ? "Cancelled" : "Booked"}: ${b.service_id}`,
      body: `${b.scheduled_date} at ${b.scheduled_time}`,
      timestamp: b.completed_at ?? b.created_at,
      read: true,
    })),
  ];

  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return activities.slice(0, 20);
}

// ---- CONTRACTOR CLIENTS ----

export async function getContractorClients(contractorProfileId: string) {
  const { data, error } = await supabase()
    .from("service_bookings")
    .select("property_id")
    .eq("contractor_profile_id", contractorProfileId)
    .eq("status", "completed");
  if (error) throw error;

  const uniquePropertyIds = [...new Set((data ?? []).map((b) => b.property_id))];
  if (uniquePropertyIds.length === 0) return [];

  const { data: properties } = await supabase()
    .from("homeowner_properties")
    .select("*, profiles!homeowner_properties_profile_id_fkey(first_name, last_name, phone, email)")
    .in("id", uniquePropertyIds);

  return properties ?? [];
}

// ---- CONTRACTOR EARNINGS ----

export async function getContractorMonthlyEarnings(contractorProfileId: string) {
  const { data, error } = await supabase()
    .from("service_bookings")
    .select("scheduled_date, price, contractor_payout")
    .eq("contractor_profile_id", contractorProfileId)
    .eq("status", "completed")
    .order("scheduled_date", { ascending: true });
  if (error) throw error;

  const monthlyMap: Record<string, number> = {};
  (data ?? []).forEach((b) => {
    const month = b.scheduled_date.substring(0, 7); // YYYY-MM
    const payout = b.contractor_payout ?? (b.price || 0) * 0.75;
    monthlyMap[month] = (monthlyMap[month] || 0) + payout;
  });

  return Object.entries(monthlyMap).map(([month, total]) => ({ month, total }));
}

// ---- CONTRACTOR SERVICE RATES ----

export async function saveContractorServiceRates(
  contractorProfileId: string,
  rates: { service_id: string; individual_rate: number }[]
) {
  await supabase()
    .from("contractor_service_rates")
    .delete()
    .eq("contractor_profile_id", contractorProfileId);

  const validRates = rates.filter((r) => r.individual_rate > 0);
  if (validRates.length === 0) return;

  const { error } = await supabase()
    .from("contractor_service_rates")
    .insert(
      validRates.map((r) => ({
        contractor_profile_id: contractorProfileId,
        service_id: r.service_id,
        individual_rate: r.individual_rate,
      }))
    );
  if (error) throw error;
}

export async function getContractorServiceRates(contractorProfileId: string) {
  const { data, error } = await supabase()
    .from("contractor_service_rates")
    .select("*")
    .eq("contractor_profile_id", contractorProfileId);
  if (error) throw error;
  return data ?? [];
}

// ---- CONTRACTOR METRICS ----

export async function getContractorMetrics(contractorProfileId: string) {
  const { data, error } = await supabase()
    .from("service_bookings")
    .select("status")
    .eq("contractor_profile_id", contractorProfileId);
  if (error) throw error;

  const all = data ?? [];
  const total = all.length;
  const completed = all.filter((b) => b.status === "completed").length;
  const cancelled = all.filter((b) => b.status === "cancelled").length;

  return {
    totalJobs: total,
    completedJobs: completed,
    cancelledJobs: cancelled,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    cancellationRate: total > 0 ? Math.round((cancelled / total) * 100) : 0,
  };
}

// ---- CONTRACTOR AVAILABILITY (update) ----

export async function updateContractorAvailability(
  contractorProfileId: string,
  availableDays: string[],
  availableHours: string[],
  jobsPerWeek?: number
) {
  const updates: Record<string, unknown> = {
    available_days: availableDays,
    available_hours: availableHours,
  };
  if (jobsPerWeek !== undefined) updates.jobs_per_week = jobsPerWeek;

  const { data, error } = await supabase()
    .from("contractor_profiles")
    .update(updates)
    .eq("id", contractorProfileId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- SERVICE CREDITS ----
// NOTE: service_credits table may not exist yet - handle gracefully

export async function getServiceCredits(subscriptionId: string) {
  try {
    const { data, error } = await supabase()
      .from("service_credits")
      .select("*")
      .eq("subscription_id", subscriptionId);
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

// ---- REVIEWS ----

export async function createReview(data: {
  homeowner_id: string;
  contractor_profile_id: string;
  booking_id: string;
  rating: number;
  comment?: string;
  punctuality_rating: number;
  quality_rating: number;
  communication_rating: number;
  value_rating: number;
}) {
  const { data: review, error } = await supabase()
    .from("reviews")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return review;
}

export async function getReviewsForContractor(contractorProfileId: string) {
  const { data, error } = await supabase()
    .from("reviews")
    .select("*, profiles!reviews_homeowner_id_fkey(first_name, last_name)")
    .eq("contractor_profile_id", contractorProfileId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getReviewForBooking(bookingId: string) {
  const { data, error } = await supabase()
    .from("reviews")
    .select("*")
    .eq("booking_id", bookingId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateContractorRating(contractorProfileId: string) {
  const reviews = await getReviewsForContractor(contractorProfileId);
  if (reviews.length === 0) return;

  const avgRating =
    reviews.reduce((sum, r) => sum + (r.rating as number), 0) / reviews.length;

  const { data, error } = await supabase()
    .from("contractor_profiles")
    .update({ rating: Math.round(avgRating * 10) / 10 })
    .eq("id", contractorProfileId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- SERVICE CREDITS ----

export async function purchaseCredits(
  subscriptionId: string,
  serviceId: string,
  qty: number
) {
  const { data, error } = await supabase()
    .from("service_credits")
    .insert({
      subscription_id: subscriptionId,
      service_id: serviceId,
      total_credits: qty,
      used_credits: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- CONTRACTOR MATCHING & JOB MANAGEMENT ----

/** Count how many bookings a contractor has in a given week (non-cancelled) */
export async function getContractorWeeklyBookingCount(
  contractorId: string,
  weekStart: string
) {
  const weekEnd = new Date(weekStart + "T12:00:00");
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekEndStr = weekEnd.toISOString().split("T")[0];

  const { count, error } = await supabase()
    .from("service_bookings")
    .select("*", { count: "exact", head: true })
    .eq("contractor_profile_id", contractorId)
    .gte("scheduled_date", weekStart)
    .lte("scheduled_date", weekEndStr)
    .not("status", "eq", "cancelled");
  if (error) throw error;
  return count ?? 0;
}

/** Assign a contractor to a booking with a payout amount */
export async function assignContractorToBooking(
  bookingId: string,
  contractorId: string,
  payout: number
) {
  const { data, error } = await supabase()
    .from("service_bookings")
    .update({
      contractor_profile_id: contractorId,
      contractor_payout: payout,
      status: "scheduled" as const,
    })
    .eq("id", bookingId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Decline a booking - clears the contractor assignment and triggers reassignment */
export async function declineBooking(
  bookingId: string,
  contractorId: string,
  reason?: string
) {
  // First verify this contractor is actually assigned to this booking
  const { data: booking, error: fetchErr } = await supabase()
    .from("service_bookings")
    .select("*")
    .eq("id", bookingId)
    .single();
  if (fetchErr) throw fetchErr;
  if (!booking) throw new Error("Booking not found");
  if (booking.contractor_profile_id !== contractorId) {
    throw new Error("Contractor is not assigned to this booking");
  }

  // Clear the contractor assignment
  const updates: Record<string, unknown> = {
    contractor_profile_id: null,
    contractor_payout: null,
    status: "scheduled" as const,
  };
  if (reason) {
    updates.notes = booking.notes
      ? `${booking.notes}\n[Declined by contractor: ${reason}]`
      : `[Declined by contractor: ${reason}]`;
  }

  const { data, error } = await supabase()
    .from("service_bookings")
    .update(updates)
    .eq("id", bookingId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Get contractor's bookings, optionally filtered by status */
export async function getContractorBookings(
  contractorId: string,
  status?: string
) {
  let query = supabase()
    .from("service_bookings")
    .select("*")
    .eq("contractor_profile_id", contractorId)
    .order("scheduled_date", { ascending: true });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

/** Get a single booking by ID */
export async function getBookingById(bookingId: string) {
  const { data, error } = await supabase()
    .from("service_bookings")
    .select("*")
    .eq("id", bookingId)
    .single();
  if (error) throw error;
  return data;
}

/** Get a contractor profile by its ID (not the user profile_id) */
export async function getContractorProfileById(contractorProfileId: string) {
  const { data, error } = await supabase()
    .from("contractor_profiles")
    .select("*")
    .eq("id", contractorProfileId)
    .single();
  if (error) throw error;
  return data;
}

/** Get property owner's profile_id from a property */
export async function getPropertyOwnerId(propertyId: string) {
  const { data, error } = await supabase()
    .from("homeowner_properties")
    .select("profile_id")
    .eq("id", propertyId)
    .single();
  if (error) throw error;
  return data?.profile_id ?? null;
}
