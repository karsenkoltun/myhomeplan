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
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Calendar,
  Minus,
} from "lucide-react";
import type { Database } from "@/lib/supabase/types";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

interface RevenueData {
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  growthPct: number;
  activeSubscriptions: number;
  byInterval: { interval: string; count: number }[];
  byService: { serviceName: string; revenue: number }[];
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function AdminRevenuePage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchRevenue() {
      const supabase = createClient();

      // Get all active subscriptions with their services
      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("*, subscription_services(*, services(name))")
        .eq("status", "active");

      const activeSubs = subscriptions ?? [];

      // Current & last month dates
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Calculate monthly revenue from active subs
      // Active subscriptions represent recurring monthly revenue
      const thisMonthRevenue = activeSubs.reduce(
        (sum, s) => sum + (s.monthly_total || 0),
        0
      );

      // For last month, check subscriptions that were active at the end of last month
      // We approximate by checking subscriptions created before last month end
      // and not cancelled before last month end
      const lastMonthSubs = activeSubs.filter((s) => {
        const created = new Date(s.created_at);
        return created <= lastMonthEnd;
      });
      const lastMonthRevenue = lastMonthSubs.reduce(
        (sum, s) => sum + (s.monthly_total || 0),
        0
      );

      // Growth
      const growthPct =
        lastMonthRevenue > 0
          ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : thisMonthRevenue > 0
            ? 100
            : 0;

      // By plan interval
      const intervalCounts: Record<string, number> = {};
      activeSubs.forEach((s) => {
        const interval = s.plan_interval || "monthly";
        intervalCounts[interval] = (intervalCounts[interval] || 0) + 1;
      });
      const byInterval = Object.entries(intervalCounts).map(
        ([interval, count]) => ({
          interval:
            interval.charAt(0).toUpperCase() + interval.slice(1),
          count,
        })
      );

      // Revenue by service
      const serviceRevenue: Record<string, number> = {};
      activeSubs.forEach((s) => {
        const services = (s as Record<string, unknown>)
          .subscription_services as Array<{
          calculated_monthly_price: number;
          services: { name: string } | null;
          service_id: string;
        }> | null;
        (services ?? []).forEach((svc) => {
          const name =
            svc.services?.name ?? svc.service_id;
          serviceRevenue[name] =
            (serviceRevenue[name] || 0) +
            (svc.calculated_monthly_price || 0);
        });
      });
      const byService = Object.entries(serviceRevenue)
        .map(([serviceName, revenue]) => ({ serviceName, revenue }))
        .sort((a, b) => b.revenue - a.revenue);

      setData({
        thisMonthRevenue,
        lastMonthRevenue,
        growthPct: Math.round(growthPct * 10) / 10,
        activeSubscriptions: activeSubs.length,
        byInterval,
        byService,
      });
      setLoading(false);
    }

    fetchRevenue();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const GrowthIcon =
    data.growthPct > 0
      ? TrendingUp
      : data.growthPct < 0
        ? TrendingDown
        : Minus;
  const growthColor =
    data.growthPct > 0
      ? "text-emerald-600 dark:text-emerald-400"
      : data.growthPct < 0
        ? "text-red-600 dark:text-red-400"
        : "text-muted-foreground";

  // For the bar chart, find max revenue
  const maxServiceRevenue = Math.max(
    ...data.byService.map((s) => s.revenue),
    1
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <FadeIn>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Revenue</h1>
            <p className="text-sm text-muted-foreground">
              Revenue overview and analytics
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Revenue Summary Cards */}
      <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StaggerItem>
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    This Month (MRR)
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(data.thisMonthRevenue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Last Month
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(data.lastMonthRevenue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    data.growthPct > 0
                      ? "bg-emerald-500/10"
                      : data.growthPct < 0
                        ? "bg-red-500/10"
                        : "bg-muted"
                  }`}
                >
                  <GrowthIcon
                    className={`h-6 w-6 ${growthColor}`}
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Growth
                  </p>
                  <p className={`text-2xl font-bold ${growthColor}`}>
                    {data.growthPct > 0 ? "+" : ""}
                    {data.growthPct}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Subscriptions by Plan Interval */}
        <FadeIn delay={0.2}>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-5 w-5 text-primary" />
                Active Subscriptions by Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.byInterval.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No active subscriptions
                </p>
              ) : (
                <div className="space-y-4">
                  {data.byInterval.map((item) => (
                    <div
                      key={item.interval}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span className="text-sm font-medium text-foreground">
                          {item.interval}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{
                              width: `${
                                data.activeSubscriptions > 0
                                  ? (item.count / data.activeSubscriptions) *
                                    100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="min-w-[3rem] text-right text-sm font-bold text-foreground">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Total Active
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {data.activeSubscriptions}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Revenue by Service */}
        <FadeIn delay={0.3}>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5 text-primary" />
                Revenue by Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.byService.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No revenue data available
                </p>
              ) : (
                <div className="space-y-3">
                  {data.byService.slice(0, 10).map((service) => (
                    <div key={service.serviceName}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm text-foreground truncate max-w-[60%]">
                          {service.serviceName}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {formatCurrency(service.revenue)}
                          <span className="font-normal text-muted-foreground">
                            /mo
                          </span>
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary/80 transition-all duration-500"
                          style={{
                            width: `${(service.revenue / maxServiceRevenue) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {data.byService.length > 10 && (
                    <p className="pt-2 text-xs text-muted-foreground">
                      +{data.byService.length - 10} more services
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
