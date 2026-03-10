"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import {
  Loader2,
  CreditCard,
  DollarSign,
  HardHat,
  ClipboardCheck,
  CalendarCheck,
  Star,
  ArrowRight,
  Users,
  BarChart3,
  ShieldCheck,
  FileText,
} from "lucide-react";

interface AdminMetrics {
  activeSubscriptions: number;
  monthlyRevenue: number;
  totalContractors: number;
  pendingApplications: number;
  activeBookings: number;
  averageRating: number;
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchMetrics() {
      const supabase = createClient();

      const [
        subscriptionsRes,
        contractorsRes,
        pendingRes,
        bookingsRes,
        ratingsRes,
      ] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("monthly_total")
          .eq("status", "active"),
        supabase
          .from("contractor_profiles")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("contractor_profiles")
          .select("id", { count: "exact", head: true })
          .eq("vetting_status", "pending"),
        supabase
          .from("service_bookings")
          .select("id", { count: "exact", head: true })
          .in("status", ["scheduled", "confirmed", "in_progress"]),
        supabase
          .from("contractor_profiles")
          .select("rating")
          .gt("rating", 0),
      ]);

      const activeSubs = subscriptionsRes.data ?? [];
      const monthlyRevenue = activeSubs.reduce(
        (sum, s) => sum + (s.monthly_total || 0),
        0
      );

      const ratings = ratingsRes.data ?? [];
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) /
            ratings.length
          : 0;

      setMetrics({
        activeSubscriptions: activeSubs.length,
        monthlyRevenue,
        totalContractors: contractorsRes.count ?? 0,
        pendingApplications: pendingRes.count ?? 0,
        activeBookings: bookingsRes.count ?? 0,
        averageRating: Math.round(avgRating * 10) / 10,
      });
      setLoading(false);
    }

    fetchMetrics();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!metrics) return null;

  const metricCards = [
    {
      label: "Active Subscriptions",
      value: metrics.activeSubscriptions,
      icon: CreditCard,
      format: "number" as const,
    },
    {
      label: "Monthly Revenue",
      value: metrics.monthlyRevenue,
      icon: DollarSign,
      format: "currency" as const,
    },
    {
      label: "Total Contractors",
      value: metrics.totalContractors,
      icon: HardHat,
      format: "number" as const,
    },
    {
      label: "Pending Applications",
      value: metrics.pendingApplications,
      icon: ClipboardCheck,
      format: "number" as const,
    },
    {
      label: "Active Bookings",
      value: metrics.activeBookings,
      icon: CalendarCheck,
      format: "number" as const,
    },
    {
      label: "Average Rating",
      value: metrics.averageRating,
      icon: Star,
      format: "rating" as const,
    },
  ];

  const quickLinks = [
    {
      title: "Contractors",
      description: "Manage contractor applications, approvals, and profiles",
      href: "/admin/contractors",
      icon: Users,
    },
    {
      title: "Bookings",
      description: "View and manage all service bookings across properties",
      href: "/admin/bookings",
      icon: CalendarCheck,
    },
    {
      title: "Revenue",
      description: "Revenue analytics, subscription breakdowns, and growth",
      href: "/admin/revenue",
      icon: BarChart3,
    },
    {
      title: "Documents",
      description: "Review and approve contractor documents and credentials",
      href: "/admin/documents",
      icon: FileText,
    },
    {
      title: "Analytics",
      description: "Advanced metrics, cohort analysis, and platform insights",
      href: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <FadeIn>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Platform overview and management
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Metrics Grid */}
      <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((metric) => (
          <StaggerItem key={metric.label}>
            <Card className="rounded-2xl">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <metric.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {metric.format === "currency"
                      ? `$${metric.value.toLocaleString("en-CA", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : metric.format === "rating"
                        ? metric.value > 0
                          ? `${metric.value} / 5`
                          : "N/A"
                        : metric.value.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Quick Links */}
      <FadeIn delay={0.2}>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="group cursor-pointer rounded-2xl transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <link.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">
                        {link.title}
                      </p>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
