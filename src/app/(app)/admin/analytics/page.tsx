"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import {
  Loader2,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  UserMinus,
  UserCheck,
  BarChart3,
  Star,
  CalendarCheck,
  HardHat,
  MapPin,
  Home,
  Clock,
  MessageSquare,
  Activity,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KPIs {
  mrr: number;
  arr: number;
  customerCount: number;
  churnRate: number;
  arpu: number;
}

interface MonthBucket {
  label: string; // "Jan 2026"
  key: string; // "2026-01"
}

interface RevenueTrend {
  month: MonthBucket;
  revenue: number;
}

interface ServiceRevenue {
  name: string;
  revenue: number;
}

interface PlanIntervalBreakdown {
  interval: string;
  count: number;
  pct: number;
}

interface SignupTrend {
  month: MonthBucket;
  count: number;
}

interface CohortRow {
  cohortLabel: string;
  total: number;
  retainedPcts: number[]; // % retained at month 0, 1, 2, ...
}

interface ChurnTrend {
  month: MonthBucket;
  count: number;
}

interface CityCount {
  city: string;
  count: number;
}

interface HomeTypeCount {
  type: string;
  count: number;
}

interface ContractorRank {
  name: string;
  value: number;
}

interface ServiceDistribution {
  service: string;
  count: number;
}

interface BookingTrend {
  month: MonthBucket;
  count: number;
}

interface BookingStatusCount {
  status: string;
  count: number;
  color: string;
}

interface RatingDistribution {
  stars: number;
  count: number;
}

interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface AnalyticsData {
  kpis: KPIs;
  revenueTrends: RevenueTrend[];
  serviceRevenue: ServiceRevenue[];
  planIntervalBreakdown: PlanIntervalBreakdown[];
  signupTrends: SignupTrend[];
  cohorts: CohortRow[];
  churnTrends: ChurnTrend[];
  cityCounts: CityCount[];
  homeTypeCounts: HomeTypeCount[];
  avgContractorRating: number;
  contractorUtilization: number;
  topByJobs: ContractorRank[];
  topByRating: ContractorRank[];
  serviceDistribution: ServiceDistribution[];
  bookingTrends: BookingTrend[];
  bookingCompletionRate: number;
  avgBookingValue: number;
  popularServices: ServiceRevenue[];
  bookingStatusCounts: BookingStatusCount[];
  avgReviewRating: number;
  ratingDistribution: RatingDistribution[];
  categoryAverages: { label: string; avg: number }[];
  recentReviews: ReviewItem[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getLast12Months(): MonthBucket[] {
  const months: MonthBucket[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-CA", {
      month: "short",
      year: "numeric",
    });
    months.push({ key, label });
  }
  return months;
}

function monthKeyFromDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-500",
  confirmed: "bg-sky-500",
  in_progress: "bg-amber-500",
  completed: "bg-emerald-500",
  cancelled: "bg-red-500",
  no_show: "bg-zinc-400",
};

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};

// ---------------------------------------------------------------------------
// CSS Bar Component
// ---------------------------------------------------------------------------

function Bar({
  value,
  max,
  color = "bg-primary",
  label,
  sublabel,
}: {
  value: number;
  max: number;
  color?: string;
  label: string;
  sublabel?: string;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="truncate text-sm text-foreground max-w-[60%]">
          {label}
        </span>
        <span className="text-sm font-semibold text-foreground">
          {sublabel ?? value}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function TrendTable({
  rows,
  valueFormatter,
}: {
  rows: { label: string; value: number }[];
  valueFormatter?: (v: number) => string;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  const fmt = valueFormatter ?? ((v: number) => String(v));
  return (
    <div className="space-y-2">
      {rows.map((row) => {
        const pct = max > 0 ? (row.value / max) * 100 : 0;
        return (
          <div key={row.label} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-xs text-muted-foreground">
              {row.label}
            </span>
            <div className="flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/80 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <span className="w-20 shrink-0 text-right text-xs font-semibold text-foreground">
              {fmt(row.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PieChart({ items }: { items: { label: string; value: number; color: string }[] }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  if (total === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No data available
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {/* Segmented bar */}
      <div className="flex h-4 overflow-hidden rounded-full bg-muted">
        {items.map((item) => {
          const pct = (item.value / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={item.label}
              className={`${item.color} transition-all duration-500`}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {items.map((item) => {
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
          return (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${item.color}`} />
              <span className="text-xs text-muted-foreground">
                {item.label}:{" "}
                <span className="font-semibold text-foreground">
                  {item.value}
                </span>{" "}
                ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${
            n <= Math.round(rating)
              ? "fill-yellow-500 text-yellow-500"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function AdminAnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchAll() {
      const supabase = createClient();
      const months = getLast12Months();
      const now = new Date();
      const thisMonthKey = monthKeyFromDate(now.toISOString());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Parallel data fetch
      const [
        subsRes,
        cancelledThisMonthRes,
        allSubsRes,
        bookingsRes,
        contractorsRes,
        profilesRes,
        reviewsRes,
        propertiesRes,
        servicesRes,
      ] = await Promise.all([
        // Active subscriptions
        supabase
          .from("subscriptions")
          .select("id, profile_id, monthly_total, plan_interval, created_at, cancelled_at, status"),
        // Cancelled this month
        supabase
          .from("subscriptions")
          .select("id")
          .eq("status", "cancelled")
          .gte("cancelled_at", startOfMonth),
        // All subscriptions (for cohort analysis)
        supabase
          .from("subscriptions")
          .select("id, profile_id, status, created_at, cancelled_at"),
        // All bookings
        supabase
          .from("service_bookings")
          .select("id, service_id, status, scheduled_date, price, contractor_payout, contractor_profile_id, payment_status, created_at"),
        // Contractors
        supabase
          .from("contractor_profiles")
          .select("id, business_name, owner_name, rating, total_jobs, jobs_per_week, services_offered, vetting_status, created_at"),
        // Profiles
        supabase
          .from("profiles")
          .select("id, user_type, created_at"),
        // Reviews
        supabase
          .from("reviews")
          .select("id, rating, comment, punctuality_rating, quality_rating, communication_rating, value_rating, created_at")
          .order("created_at", { ascending: false }),
        // Properties
        supabase
          .from("homeowner_properties")
          .select("id, city, home_type, created_at"),
        // Services (for name lookup)
        supabase
          .from("services")
          .select("id, name"),
      ]);

      const allSubs = subsRes.data ?? [];
      const activeSubs = allSubs.filter((s) => s.status === "active");
      const cancelledThisMonth = cancelledThisMonthRes.data?.length ?? 0;
      const allSubsForCohort = allSubsRes.data ?? [];
      const bookings = bookingsRes.data ?? [];
      const contractors = contractorsRes.data ?? [];
      const profiles = profilesRes.data ?? [];
      const reviews = reviewsRes.data ?? [];
      const properties = propertiesRes.data ?? [];
      const services = servicesRes.data ?? [];

      const serviceNameMap = new Map(
        services.map((s) => [s.id, s.name])
      );

      // ---- KPIs ----
      const mrr = activeSubs.reduce((s, sub) => s + (sub.monthly_total || 0), 0);
      const arr = mrr * 12;
      const customerCount = activeSubs.length;

      // Churn: cancelled this month / (active at start of month + cancelled this month)
      // "Active at start" approximation: current active + cancelled this month
      const totalAtStart = customerCount + cancelledThisMonth;
      const churnRate = totalAtStart > 0 ? (cancelledThisMonth / totalAtStart) * 100 : 0;
      const arpu = customerCount > 0 ? mrr / customerCount : 0;

      const kpis: KPIs = {
        mrr,
        arr,
        customerCount,
        churnRate: Math.round(churnRate * 10) / 10,
        arpu: Math.round(arpu * 100) / 100,
      };

      // ---- Revenue Trends (from completed bookings per month) ----
      const completedBookings = bookings.filter((b) => b.status === "completed");
      const revenueByMonth: Record<string, number> = {};
      months.forEach((m) => { revenueByMonth[m.key] = 0; });
      completedBookings.forEach((b) => {
        const mk = monthKeyFromDate(b.scheduled_date || b.created_at);
        if (revenueByMonth[mk] !== undefined) {
          revenueByMonth[mk] += b.price || 0;
        }
      });
      const revenueTrends: RevenueTrend[] = months.map((m) => ({
        month: m,
        revenue: revenueByMonth[m.key],
      }));

      // ---- Revenue by Service ----
      const svcRevMap: Record<string, number> = {};
      completedBookings.forEach((b) => {
        const name = serviceNameMap.get(b.service_id) || b.service_id;
        svcRevMap[name] = (svcRevMap[name] || 0) + (b.price || 0);
      });
      const serviceRevenue: ServiceRevenue[] = Object.entries(svcRevMap)
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // ---- Plan Interval Breakdown ----
      const intervalCounts: Record<string, number> = {};
      activeSubs.forEach((s) => {
        const interval = s.plan_interval || "monthly";
        intervalCounts[interval] = (intervalCounts[interval] || 0) + 1;
      });
      const totalSubs = activeSubs.length || 1;
      const planIntervalBreakdown: PlanIntervalBreakdown[] = Object.entries(intervalCounts)
        .map(([interval, count]) => ({
          interval: interval.charAt(0).toUpperCase() + interval.slice(1),
          count,
          pct: Math.round((count / totalSubs) * 1000) / 10,
        }))
        .sort((a, b) => b.count - a.count);

      // ---- Customer Analytics ----
      // Signups per month
      const signupsByMonth: Record<string, number> = {};
      months.forEach((m) => { signupsByMonth[m.key] = 0; });
      profiles.forEach((p) => {
        const mk = monthKeyFromDate(p.created_at);
        if (signupsByMonth[mk] !== undefined) {
          signupsByMonth[mk]++;
        }
      });
      const signupTrends: SignupTrend[] = months.map((m) => ({
        month: m,
        count: signupsByMonth[m.key],
      }));

      // Cohort retention (last 6 months only to keep it readable)
      const cohortMonths = months.slice(-6);
      const cohorts: CohortRow[] = cohortMonths.map((cm) => {
        const cohortSubs = allSubsForCohort.filter(
          (s) => monthKeyFromDate(s.created_at) === cm.key
        );
        const total = cohortSubs.length;
        if (total === 0) {
          return { cohortLabel: cm.label, total: 0, retainedPcts: [] };
        }
        // For each subsequent month, how many are still active (not cancelled before that month end)?
        const retainedPcts: number[] = [];
        for (let offset = 0; offset < 6; offset++) {
          const checkDate = new Date(
            parseInt(cm.key.split("-")[0]),
            parseInt(cm.key.split("-")[1]) - 1 + offset + 1,
            0 // last day of that month
          );
          if (checkDate > now) break;
          const stillActive = cohortSubs.filter((s) => {
            if (s.status === "active") return true;
            if (s.cancelled_at) {
              return new Date(s.cancelled_at) > checkDate;
            }
            return true;
          }).length;
          retainedPcts.push(Math.round((stillActive / total) * 100));
        }
        return { cohortLabel: cm.label, total, retainedPcts };
      }).filter((c) => c.total > 0);

      // Churn analysis - cancellations per month
      const churnByMonth: Record<string, number> = {};
      months.forEach((m) => { churnByMonth[m.key] = 0; });
      allSubsForCohort
        .filter((s) => s.cancelled_at)
        .forEach((s) => {
          const mk = monthKeyFromDate(s.cancelled_at!);
          if (churnByMonth[mk] !== undefined) {
            churnByMonth[mk]++;
          }
        });
      const churnTrends: ChurnTrend[] = months.map((m) => ({
        month: m,
        count: churnByMonth[m.key],
      }));

      // Customers by city
      const cityMap: Record<string, number> = {};
      properties.forEach((p) => {
        const city = p.city || "Unknown";
        cityMap[city] = (cityMap[city] || 0) + 1;
      });
      const cityCounts: CityCount[] = Object.entries(cityMap)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Customers by home type
      const homeTypeMap: Record<string, number> = {};
      properties.forEach((p) => {
        const ht = p.home_type || "unknown";
        homeTypeMap[ht] = (homeTypeMap[ht] || 0) + 1;
      });
      const homeTypeCounts: HomeTypeCount[] = Object.entries(homeTypeMap)
        .map(([type, count]) => ({ type: type.charAt(0).toUpperCase() + type.slice(1), count }))
        .sort((a, b) => b.count - a.count);

      // ---- Contractor Analytics ----
      const ratedContractors = contractors.filter((c) => c.rating > 0);
      const avgContractorRating =
        ratedContractors.length > 0
          ? ratedContractors.reduce((s, c) => s + c.rating, 0) / ratedContractors.length
          : 0;

      // Utilization: total_jobs / (jobs_per_week * weeks passed this month)
      const approvedContractors = contractors.filter((c) => c.vetting_status === "approved");
      const totalCapacity = approvedContractors.reduce((s, c) => s + (c.jobs_per_week || 1), 0);
      const totalJobsDone = approvedContractors.reduce((s, c) => s + (c.total_jobs || 0), 0);
      // Rough utilization: if we assume each contractor has been active for the time since they joined
      const contractorUtilization =
        totalCapacity > 0 ? Math.min((totalJobsDone / (totalCapacity * 4)) * 100, 100) : 0;

      // Top 10 by jobs
      const topByJobs: ContractorRank[] = [...contractors]
        .sort((a, b) => (b.total_jobs || 0) - (a.total_jobs || 0))
        .slice(0, 10)
        .map((c) => ({
          name: c.business_name || c.owner_name || "Unknown",
          value: c.total_jobs || 0,
        }));

      // Top 10 by rating
      const topByRating: ContractorRank[] = [...ratedContractors]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10)
        .map((c) => ({
          name: c.business_name || c.owner_name || "Unknown",
          value: Math.round(c.rating * 10) / 10,
        }));

      // Services offered distribution
      const svcDistMap: Record<string, number> = {};
      contractors.forEach((c) => {
        const offered = Array.isArray(c.services_offered) ? c.services_offered : [];
        (offered as string[]).forEach((svc) => {
          svcDistMap[svc] = (svcDistMap[svc] || 0) + 1;
        });
      });
      const serviceDistribution: ServiceDistribution[] = Object.entries(svcDistMap)
        .map(([service, count]) => ({
          service: serviceNameMap.get(service) || service,
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // ---- Booking Analytics ----
      const bookingsByMonth: Record<string, number> = {};
      months.forEach((m) => { bookingsByMonth[m.key] = 0; });
      bookings.forEach((b) => {
        const mk = monthKeyFromDate(b.scheduled_date || b.created_at);
        if (bookingsByMonth[mk] !== undefined) {
          bookingsByMonth[mk]++;
        }
      });
      const bookingTrends: BookingTrend[] = months.map((m) => ({
        month: m,
        count: bookingsByMonth[m.key],
      }));

      // Completion rate
      const completed = bookings.filter((b) => b.status === "completed").length;
      const terminal = bookings.filter((b) =>
        ["completed", "cancelled", "no_show"].includes(b.status)
      ).length;
      const bookingCompletionRate =
        terminal > 0 ? Math.round((completed / terminal) * 1000) / 10 : 0;

      // Average booking value
      const pricedBookings = bookings.filter((b) => b.price > 0);
      const avgBookingValue =
        pricedBookings.length > 0
          ? pricedBookings.reduce((s, b) => s + b.price, 0) / pricedBookings.length
          : 0;

      // Most popular services by booking count
      const svcBookingCount: Record<string, number> = {};
      bookings.forEach((b) => {
        const name = serviceNameMap.get(b.service_id) || b.service_id;
        svcBookingCount[name] = (svcBookingCount[name] || 0) + 1;
      });
      const popularServices: ServiceRevenue[] = Object.entries(svcBookingCount)
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Bookings by status
      const statusCounts: Record<string, number> = {};
      bookings.forEach((b) => {
        statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
      });
      const bookingStatusCounts: BookingStatusCount[] = Object.entries(statusCounts)
        .map(([status, count]) => ({
          status: STATUS_LABELS[status] || status,
          count,
          color: STATUS_COLORS[status] || "bg-zinc-400",
        }))
        .sort((a, b) => b.count - a.count);

      // ---- Customer Satisfaction ----
      const avgReviewRating =
        reviews.length > 0
          ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
          : 0;

      // Rating distribution
      const ratingDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach((r) => {
        const stars = Math.round(r.rating);
        if (stars >= 1 && stars <= 5) ratingDist[stars]++;
      });
      const ratingDistribution: RatingDistribution[] = [5, 4, 3, 2, 1].map(
        (stars) => ({ stars, count: ratingDist[stars] })
      );

      // Category averages
      const catTotals = { punctuality: 0, quality: 0, communication: 0, value: 0 };
      reviews.forEach((r) => {
        catTotals.punctuality += r.punctuality_rating || 0;
        catTotals.quality += r.quality_rating || 0;
        catTotals.communication += r.communication_rating || 0;
        catTotals.value += r.value_rating || 0;
      });
      const reviewCount = reviews.length || 1;
      const categoryAverages = [
        { label: "Punctuality", avg: Math.round((catTotals.punctuality / reviewCount) * 10) / 10 },
        { label: "Quality", avg: Math.round((catTotals.quality / reviewCount) * 10) / 10 },
        { label: "Communication", avg: Math.round((catTotals.communication / reviewCount) * 10) / 10 },
        { label: "Value", avg: Math.round((catTotals.value / reviewCount) * 10) / 10 },
      ];

      // Recent reviews
      const recentReviews: ReviewItem[] = reviews.slice(0, 10).map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
      }));

      setData({
        kpis,
        revenueTrends,
        serviceRevenue,
        planIntervalBreakdown,
        signupTrends,
        cohorts,
        churnTrends,
        cityCounts,
        homeTypeCounts,
        avgContractorRating: Math.round(avgContractorRating * 10) / 10,
        contractorUtilization: Math.round(contractorUtilization * 10) / 10,
        topByJobs,
        topByRating,
        serviceDistribution,
        bookingTrends,
        bookingCompletionRate,
        avgBookingValue: Math.round(avgBookingValue * 100) / 100,
        popularServices,
        bookingStatusCounts,
        avgReviewRating: Math.round(avgReviewRating * 10) / 10,
        ratingDistribution,
        categoryAverages,
        recentReviews,
      });
      setLoading(false);
    }

    fetchAll();
  }, [user, authLoading]);

  // ---- Loading State ----
  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  // ---- Render ----
  return (
    <div className="mx-auto max-w-7xl space-y-10">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Advanced Analytics
            </h1>
            <p className="text-sm text-muted-foreground">
              Comprehensive platform metrics and insights
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ================================================================= */}
      {/* KPI CARDS                                                         */}
      {/* ================================================================= */}
      <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* MRR */}
        <StaggerItem>
          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">MRR</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(data.kpis.mrr)}
                </p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* ARR */}
        <StaggerItem>
          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">ARR</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(data.kpis.arr)}
                </p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Customer Count */}
        <StaggerItem>
          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Customers</p>
                <p className="text-xl font-bold text-foreground">
                  {data.kpis.customerCount.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Churn Rate */}
        <StaggerItem>
          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                <UserMinus className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Churn Rate</p>
                <p className={`text-xl font-bold ${data.kpis.churnRate > 5 ? "text-red-600 dark:text-red-400" : data.kpis.churnRate > 2 ? "text-amber-600 dark:text-amber-400" : "text-foreground"}`}>
                  {data.kpis.churnRate}%
                </p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* ARPU */}
        <StaggerItem>
          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">ARPU</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(data.kpis.arpu)}
                </p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* NPS */}
        <StaggerItem>
          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-500/10">
                <MessageSquare className="h-5 w-5 text-zinc-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">NPS Score</p>
                <p className="text-sm font-medium text-muted-foreground">
                  Coming Soon
                </p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* ================================================================= */}
      {/* REVENUE TRENDS                                                    */}
      {/* ================================================================= */}
      <FadeIn delay={0.1}>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <DollarSign className="h-5 w-5 text-primary" />
          Revenue Trends
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Monthly Revenue */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Monthly Revenue (Last 12 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendTable
                rows={data.revenueTrends.map((r) => ({
                  label: r.month.label,
                  value: r.revenue,
                }))}
                valueFormatter={formatCurrency}
              />
            </CardContent>
          </Card>

          {/* Revenue by Service */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Top Services by Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              {data.serviceRevenue.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No revenue data available
                </p>
              ) : (
                <div className="space-y-3">
                  {data.serviceRevenue.map((s) => (
                    <Bar
                      key={s.name}
                      label={s.name}
                      value={s.revenue}
                      max={data.serviceRevenue[0]?.revenue || 1}
                      color="bg-emerald-500"
                      sublabel={formatCurrency(s.revenue)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Revenue by Plan Interval */}
          <Card className="rounded-2xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Subscriptions by Plan Interval</CardTitle>
            </CardHeader>
            <CardContent>
              {data.planIntervalBreakdown.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No subscription data
                </p>
              ) : (
                <div className="space-y-4">
                  {data.planIntervalBreakdown.map((item) => (
                    <div key={item.interval}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {item.interval}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.count} ({item.pct}%)
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* ================================================================= */}
      {/* CUSTOMER ANALYTICS                                                */}
      {/* ================================================================= */}
      <FadeIn delay={0.15}>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Users className="h-5 w-5 text-primary" />
          Customer Analytics
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* New Signups per Month */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">New Signups per Month</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendTable
                rows={data.signupTrends.map((s) => ({
                  label: s.month.label,
                  value: s.count,
                }))}
              />
            </CardContent>
          </Card>

          {/* Churn Analysis */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingDown className="h-4 w-4 text-red-500" />
                Cancellations per Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TrendTable
                rows={data.churnTrends.map((c) => ({
                  label: c.month.label,
                  value: c.count,
                }))}
              />
            </CardContent>
          </Card>

          {/* Retention Cohorts */}
          {data.cohorts.length > 0 && (
            <Card className="rounded-2xl lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Customer Retention by Cohort</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-2 pr-4 text-left font-medium text-muted-foreground">
                          Cohort
                        </th>
                        <th className="pb-2 pr-4 text-center font-medium text-muted-foreground">
                          Users
                        </th>
                        {[...Array(6)].map((_, i) => (
                          <th
                            key={i}
                            className="pb-2 pr-2 text-center font-medium text-muted-foreground"
                          >
                            M{i}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.cohorts.map((cohort) => (
                        <tr key={cohort.cohortLabel} className="border-b last:border-0">
                          <td className="py-2 pr-4 font-medium text-foreground">
                            {cohort.cohortLabel}
                          </td>
                          <td className="py-2 pr-4 text-center text-muted-foreground">
                            {cohort.total}
                          </td>
                          {[...Array(6)].map((_, i) => {
                            const pct = cohort.retainedPcts[i];
                            if (pct === undefined) {
                              return (
                                <td key={i} className="py-2 pr-2 text-center text-muted-foreground/40">
                                  -
                                </td>
                              );
                            }
                            const bgOpacity =
                              pct >= 80
                                ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                                : pct >= 50
                                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                                  : "bg-red-500/20 text-red-700 dark:text-red-400";
                            return (
                              <td key={i} className="py-2 pr-2 text-center">
                                <span
                                  className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${bgOpacity}`}
                                >
                                  {pct}%
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Customers by City */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-primary" />
                Customers by City
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.cityCounts.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No property data
                </p>
              ) : (
                <div className="space-y-3">
                  {data.cityCounts.map((c) => (
                    <Bar
                      key={c.city}
                      label={c.city}
                      value={c.count}
                      max={data.cityCounts[0]?.count || 1}
                      color="bg-sky-500"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customers by Home Type */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Home className="h-4 w-4 text-primary" />
                Customers by Home Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.homeTypeCounts.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No property data
                </p>
              ) : (
                <div className="space-y-3">
                  {data.homeTypeCounts.map((h) => (
                    <Bar
                      key={h.type}
                      label={h.type}
                      value={h.count}
                      max={data.homeTypeCounts[0]?.count || 1}
                      color="bg-violet-500"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* ================================================================= */}
      {/* CONTRACTOR ANALYTICS                                              */}
      {/* ================================================================= */}
      <FadeIn delay={0.2}>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <HardHat className="h-5 w-5 text-primary" />
          Contractor Analytics
        </h2>

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10">
                <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Avg Rating
                </p>
                <p className="text-xl font-bold text-foreground">
                  {data.avgContractorRating > 0
                    ? `${data.avgContractorRating} / 5`
                    : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Utilization Rate
                </p>
                <p className="text-xl font-bold text-foreground">
                  {data.contractorUtilization}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-500/10">
                <Clock className="h-5 w-5 text-zinc-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Avg Response Time
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  Coming Soon
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top by Jobs */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Top 10 by Completed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {data.topByJobs.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No contractor data
                </p>
              ) : (
                <div className="space-y-3">
                  {data.topByJobs.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-3">
                      <span className="w-6 shrink-0 text-xs font-bold text-muted-foreground">
                        #{i + 1}
                      </span>
                      <div className="flex-1">
                        <Bar
                          label={c.name}
                          value={c.value}
                          max={data.topByJobs[0]?.value || 1}
                          color="bg-primary"
                          sublabel={`${c.value} jobs`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top by Rating */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Top 10 by Rating</CardTitle>
            </CardHeader>
            <CardContent>
              {data.topByRating.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No rated contractors
                </p>
              ) : (
                <div className="space-y-3">
                  {data.topByRating.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-3">
                      <span className="w-6 shrink-0 text-xs font-bold text-muted-foreground">
                        #{i + 1}
                      </span>
                      <div className="flex-1">
                        <Bar
                          label={c.name}
                          value={c.value}
                          max={5}
                          color="bg-yellow-500"
                          sublabel={`${c.value} / 5`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services Distribution */}
          <Card className="rounded-2xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">
                Services Offered Distribution (Contractors per Service)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.serviceDistribution.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No services data
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {data.serviceDistribution.map((s) => (
                    <Bar
                      key={s.service}
                      label={s.service}
                      value={s.count}
                      max={data.serviceDistribution[0]?.count || 1}
                      color="bg-primary/70"
                      sublabel={`${s.count} contractors`}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* ================================================================= */}
      {/* BOOKING ANALYTICS                                                 */}
      {/* ================================================================= */}
      <FadeIn delay={0.25}>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <CalendarCheck className="h-5 w-5 text-primary" />
          Booking Analytics
        </h2>

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <CalendarCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Completion Rate
                </p>
                <p className="text-xl font-bold text-foreground">
                  {data.bookingCompletionRate}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Avg Booking Value
                </p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(data.avgBookingValue)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Total Bookings
                </p>
                <p className="text-xl font-bold text-foreground">
                  {data.bookingTrends.reduce((s, b) => s + b.count, 0).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Bookings per Month */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Bookings per Month</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendTable
                rows={data.bookingTrends.map((b) => ({
                  label: b.month.label,
                  value: b.count,
                }))}
              />
            </CardContent>
          </Card>

          {/* Bookings by Status */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Bookings by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                items={data.bookingStatusCounts.map((s) => ({
                  label: s.status,
                  value: s.count,
                  color: s.color,
                }))}
              />
            </CardContent>
          </Card>

          {/* Most Popular Services */}
          <Card className="rounded-2xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">
                Most Popular Services (by Booking Count)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.popularServices.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No bookings yet
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {data.popularServices.map((s) => (
                    <Bar
                      key={s.name}
                      label={s.name}
                      value={s.revenue}
                      max={data.popularServices[0]?.revenue || 1}
                      color="bg-sky-500"
                      sublabel={`${s.revenue} bookings`}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* ================================================================= */}
      {/* CUSTOMER SATISFACTION                                             */}
      {/* ================================================================= */}
      <FadeIn delay={0.3}>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Star className="h-5 w-5 text-primary" />
          Customer Satisfaction
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Average Rating */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Overall Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-foreground">
                    {data.avgReviewRating > 0 ? data.avgReviewRating : "-"}
                  </p>
                  <p className="text-xs text-muted-foreground">out of 5</p>
                  {data.avgReviewRating > 0 && (
                    <div className="mt-2">
                      <StarDisplay rating={data.avgReviewRating} />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  {data.ratingDistribution.map((rd) => {
                    const maxCount = Math.max(
                      ...data.ratingDistribution.map((r) => r.count),
                      1
                    );
                    const pct = (rd.count / maxCount) * 100;
                    return (
                      <div key={rd.stars} className="flex items-center gap-2">
                        <span className="w-12 shrink-0 text-xs text-muted-foreground">
                          {rd.stars} star{rd.stars !== 1 ? "s" : ""}
                        </span>
                        <div className="flex-1">
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-yellow-500 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <span className="w-8 shrink-0 text-right text-xs font-semibold text-foreground">
                          {rd.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Rating by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {data.categoryAverages.every((c) => c.avg === 0) ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No reviews yet
                </p>
              ) : (
                <div className="space-y-4">
                  {data.categoryAverages.map((cat) => (
                    <div key={cat.label}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {cat.label}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {cat.avg > 0 ? `${cat.avg} / 5` : "N/A"}
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            cat.avg >= 4
                              ? "bg-emerald-500"
                              : cat.avg >= 3
                                ? "bg-amber-500"
                                : cat.avg > 0
                                  ? "bg-red-500"
                                  : "bg-muted"
                          }`}
                          style={{ width: `${cat.avg > 0 ? (cat.avg / 5) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card className="rounded-2xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentReviews.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No reviews yet
                </p>
              ) : (
                <div className="space-y-4">
                  {data.recentReviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex gap-4 rounded-xl bg-muted/30 p-4"
                    >
                      <div className="shrink-0">
                        <StarDisplay rating={review.rating} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-foreground">
                          {review.comment || (
                            <span className="italic text-muted-foreground">
                              No comment provided
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString(
                            "en-CA",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-lg font-bold text-foreground">
                          {review.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    </div>
  );
}
