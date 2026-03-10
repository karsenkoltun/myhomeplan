import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type ContractorProfile = Database["public"]["Tables"]["contractor_profiles"]["Row"];

export interface MatchResult {
  contractorId: string;
  score: number;
  reasons: string[];
}

interface MatchParams {
  serviceId: string;
  date: string;
  timeSlot: string;
  propertyId: string;
  preferredContractorId?: string;
}

/**
 * Determine the day-of-week name for a given date string (YYYY-MM-DD).
 */
function getDayOfWeek(dateStr: string): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const d = new Date(dateStr + "T12:00:00");
  return days[d.getDay()];
}

/**
 * Get the Monday-based ISO week start for a given date string.
 */
function getWeekStart(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  return monday.toISOString().split("T")[0];
}

/**
 * Check if a contractor offers a specific service.
 */
function offersService(contractor: ContractorProfile, serviceId: string): boolean {
  const services = contractor.services_offered as string[] | null;
  if (!services || !Array.isArray(services)) return false;
  return services.includes(serviceId);
}

/**
 * Check if a contractor is available on the given day of the week.
 */
function isAvailableOnDay(contractor: ContractorProfile, dayName: string): boolean {
  const days = contractor.available_days as string[] | null;
  if (!days || !Array.isArray(days)) return false;
  return days.some((d) => d.toLowerCase() === dayName.toLowerCase());
}

/**
 * Check if a contractor is available during the given time slot.
 * Time slots are expected as strings like "Morning", "Afternoon", "Evening"
 * or hour ranges like "9:00-12:00".
 */
function isAvailableDuringSlot(contractor: ContractorProfile, timeSlot: string): boolean {
  const hours = contractor.available_hours as string[] | null;
  if (!hours || !Array.isArray(hours)) return false;
  // Check for direct match (case-insensitive)
  return hours.some(
    (h) => h.toLowerCase() === timeSlot.toLowerCase()
  );
}

/**
 * Get experience years for a specific service from the contractor's profile.
 * experience_years is stored as a JSON object: { "service-id": number, ... }
 */
function getExperienceForService(contractor: ContractorProfile, serviceId: string): number {
  const exp = contractor.experience_years as Record<string, number> | null;
  if (!exp || typeof exp !== "object") return 0;
  return typeof exp[serviceId] === "number" ? exp[serviceId] : 0;
}

/**
 * Find the best contractors for a service booking using a weighted scoring algorithm.
 *
 * Scoring factors:
 * - Rating (weight 30%)
 * - Completion rate (weight 20%)
 * - Weekly capacity remaining (weight 20%)
 * - Experience years for this service (weight 15%)
 * - Fewer cancellations (weight 15%)
 * - Preferred contractor bonus: +50 points
 *
 * Returns the top 3 contractors sorted by score, descending.
 */
export async function findBestContractors(params: MatchParams): Promise<MatchResult[]> {
  const { serviceId, date, timeSlot, preferredContractorId } = params;
  const supabase = createClient();
  const dayName = getDayOfWeek(date);
  const weekStart = getWeekStart(date);

  // 1. Fetch all approved contractors who offer this service
  const { data: contractors, error } = await supabase
    .from("contractor_profiles")
    .select("*")
    .eq("vetting_status", "approved")
    .contains("services_offered", [serviceId]);

  if (error || !contractors || contractors.length === 0) {
    return [];
  }

  // 2. Filter by availability (day + time slot)
  const available = contractors.filter((c) => {
    if (!isAvailableOnDay(c, dayName)) return false;
    if (!isAvailableDuringSlot(c, timeSlot)) return false;
    return true;
  });

  if (available.length === 0) return [];

  // 3. Fetch weekly booking counts for each contractor in parallel
  const weekEnd = new Date(weekStart + "T12:00:00");
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekEndStr = weekEnd.toISOString().split("T")[0];

  const bookingCounts = await Promise.all(
    available.map(async (c) => {
      const { count } = await supabase
        .from("service_bookings")
        .select("*", { count: "exact", head: true })
        .eq("contractor_profile_id", c.id)
        .gte("scheduled_date", weekStart)
        .lte("scheduled_date", weekEndStr)
        .not("status", "eq", "cancelled");
      return { contractorId: c.id, count: count ?? 0 };
    })
  );

  const countMap = new Map(bookingCounts.map((b) => [b.contractorId, b.count]));

  // 4. Fetch metrics (completion rate, cancellation count) for each contractor
  const metricsMap = new Map<string, { completionRate: number; cancellations: number }>();
  await Promise.all(
    available.map(async (c) => {
      const { data: bookings } = await supabase
        .from("service_bookings")
        .select("status")
        .eq("contractor_profile_id", c.id);

      const all = bookings ?? [];
      const total = all.length;
      const completed = all.filter((b) => b.status === "completed").length;
      const cancelled = all.filter((b) => b.status === "cancelled").length;

      metricsMap.set(c.id, {
        completionRate: total > 0 ? completed / total : 1, // New contractors get perfect score
        cancellations: cancelled,
      });
    })
  );

  // 5. Filter out contractors at weekly capacity
  const eligible = available.filter((c) => {
    const weeklyCount = countMap.get(c.id) ?? 0;
    const maxPerWeek = c.jobs_per_week || 10; // Default to 10 if not set
    return weeklyCount < maxPerWeek;
  });

  if (eligible.length === 0) return [];

  // 6. Score each eligible contractor
  const scored: MatchResult[] = eligible.map((c) => {
    const reasons: string[] = [];
    let score = 0;

    // Rating score (0-5 mapped to 0-30 points)
    const rating = c.rating ?? 0;
    const ratingScore = (rating / 5) * 30;
    score += ratingScore;
    if (rating >= 4.5) reasons.push(`Excellent rating: ${rating.toFixed(1)}/5`);
    else if (rating >= 4.0) reasons.push(`Good rating: ${rating.toFixed(1)}/5`);

    // Completion rate (0-1 mapped to 0-20 points)
    const metrics = metricsMap.get(c.id) ?? { completionRate: 1, cancellations: 0 };
    const completionScore = metrics.completionRate * 20;
    score += completionScore;
    if (metrics.completionRate >= 0.95) reasons.push("High completion rate");

    // Weekly capacity remaining (more availability = better, 0-20 points)
    const weeklyCount = countMap.get(c.id) ?? 0;
    const maxPerWeek = c.jobs_per_week || 10;
    const capacityRemaining = (maxPerWeek - weeklyCount) / maxPerWeek;
    const capacityScore = capacityRemaining * 20;
    score += capacityScore;
    if (capacityRemaining >= 0.7) reasons.push("Plenty of availability this week");
    else if (capacityRemaining >= 0.4) reasons.push("Some availability this week");

    // Experience years for this service (0-15 points, capped at 10 years)
    const experience = getExperienceForService(c, serviceId);
    const experienceScore = Math.min(experience / 10, 1) * 15;
    score += experienceScore;
    if (experience >= 5) reasons.push(`${experience} years experience`);

    // Low cancellations (0-15 points)
    const cancellationPenalty = Math.min(metrics.cancellations / 10, 1);
    const cancellationScore = (1 - cancellationPenalty) * 15;
    score += cancellationScore;
    if (metrics.cancellations === 0) reasons.push("Zero cancellations");

    // Preferred contractor bonus
    if (preferredContractorId && c.id === preferredContractorId) {
      score += 50;
      reasons.push("Preferred contractor");
    }

    return {
      contractorId: c.id,
      score: Math.round(score * 100) / 100,
      reasons,
    };
  });

  // 7. Sort by score descending and return top 3
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}

/**
 * Server-side version of findBestContractors that accepts a Supabase client.
 * Used in API routes where the server client is already available.
 */
export async function findBestContractorsServer(
  supabase: ReturnType<typeof createClient>,
  params: MatchParams
): Promise<MatchResult[]> {
  const { serviceId, date, timeSlot, preferredContractorId } = params;
  const dayName = getDayOfWeek(date);
  const weekStart = getWeekStart(date);

  // 1. Fetch all approved contractors who offer this service
  const { data: contractors, error } = await supabase
    .from("contractor_profiles")
    .select("*")
    .eq("vetting_status", "approved")
    .contains("services_offered", [serviceId]);

  if (error || !contractors || contractors.length === 0) {
    return [];
  }

  // 2. Filter by availability (day + time slot)
  const available = contractors.filter((c) => {
    if (!isAvailableOnDay(c, dayName)) return false;
    if (!isAvailableDuringSlot(c, timeSlot)) return false;
    return true;
  });

  if (available.length === 0) return [];

  // 3. Fetch weekly booking counts
  const weekEnd = new Date(weekStart + "T12:00:00");
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekEndStr = weekEnd.toISOString().split("T")[0];

  const bookingCounts = await Promise.all(
    available.map(async (c) => {
      const { count } = await supabase
        .from("service_bookings")
        .select("*", { count: "exact", head: true })
        .eq("contractor_profile_id", c.id)
        .gte("scheduled_date", weekStart)
        .lte("scheduled_date", weekEndStr)
        .not("status", "eq", "cancelled");
      return { contractorId: c.id, count: count ?? 0 };
    })
  );

  const countMap = new Map(bookingCounts.map((b) => [b.contractorId, b.count]));

  // 4. Fetch metrics for each contractor
  const metricsMap = new Map<string, { completionRate: number; cancellations: number }>();
  await Promise.all(
    available.map(async (c) => {
      const { data: bookings } = await supabase
        .from("service_bookings")
        .select("status")
        .eq("contractor_profile_id", c.id);

      const all = bookings ?? [];
      const total = all.length;
      const completed = all.filter((b) => b.status === "completed").length;
      const cancelled = all.filter((b) => b.status === "cancelled").length;

      metricsMap.set(c.id, {
        completionRate: total > 0 ? completed / total : 1,
        cancellations: cancelled,
      });
    })
  );

  // 5. Filter by capacity
  const eligible = available.filter((c) => {
    const weeklyCount = countMap.get(c.id) ?? 0;
    const maxPerWeek = c.jobs_per_week || 10;
    return weeklyCount < maxPerWeek;
  });

  if (eligible.length === 0) return [];

  // 6. Score each contractor
  const scored: MatchResult[] = eligible.map((c) => {
    const reasons: string[] = [];
    let score = 0;

    const rating = c.rating ?? 0;
    score += (rating / 5) * 30;
    if (rating >= 4.5) reasons.push(`Excellent rating: ${rating.toFixed(1)}/5`);
    else if (rating >= 4.0) reasons.push(`Good rating: ${rating.toFixed(1)}/5`);

    const metrics = metricsMap.get(c.id) ?? { completionRate: 1, cancellations: 0 };
    score += metrics.completionRate * 20;
    if (metrics.completionRate >= 0.95) reasons.push("High completion rate");

    const weeklyCount = countMap.get(c.id) ?? 0;
    const maxPerWeek = c.jobs_per_week || 10;
    const capacityRemaining = (maxPerWeek - weeklyCount) / maxPerWeek;
    score += capacityRemaining * 20;
    if (capacityRemaining >= 0.7) reasons.push("Plenty of availability this week");
    else if (capacityRemaining >= 0.4) reasons.push("Some availability this week");

    const experience = getExperienceForService(c, serviceId);
    score += Math.min(experience / 10, 1) * 15;
    if (experience >= 5) reasons.push(`${experience} years experience`);

    const cancellationPenalty = Math.min(metrics.cancellations / 10, 1);
    score += (1 - cancellationPenalty) * 15;
    if (metrics.cancellations === 0) reasons.push("Zero cancellations");

    if (preferredContractorId && c.id === preferredContractorId) {
      score += 50;
      reasons.push("Preferred contractor");
    }

    return {
      contractorId: c.id,
      score: Math.round(score * 100) / 100,
      reasons,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}
