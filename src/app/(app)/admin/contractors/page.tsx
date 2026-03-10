"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import {
  Loader2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Star,
  Briefcase,
  Filter,
  Users,
} from "lucide-react";
import type { Database } from "@/lib/supabase/types";

type ContractorProfile =
  Database["public"]["Tables"]["contractor_profiles"]["Row"];
type VettingStatus = "pending" | "approved" | "suspended" | "rejected";

const STATUS_FILTERS: { label: string; value: VettingStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Suspended", value: "suspended" },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-xs font-medium text-yellow-600 dark:text-yellow-400">
          Pending
        </span>
      );
    case "approved":
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Approved
        </span>
      );
    case "suspended":
      return (
        <span className="inline-flex items-center rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
          Suspended
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center rounded-full bg-zinc-500/15 px-2.5 py-0.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-zinc-500/15 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
          {status}
        </span>
      );
  }
}

export default function AdminContractorsPage() {
  const { user, loading: authLoading } = useAuth();
  const [contractors, setContractors] = useState<ContractorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<VettingStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchContractors = useCallback(async () => {
    const supabase = createClient();
    let query = supabase
      .from("contractor_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("vetting_status", filter);
    }

    const { data } = await query;
    setContractors(data ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    if (authLoading || !user) return;
    fetchContractors();
  }, [user, authLoading, fetchContractors]);

  async function updateStatus(
    contractorId: string,
    newStatus: VettingStatus
  ) {
    setUpdating(contractorId);
    const supabase = createClient();
    const { error } = await supabase
      .from("contractor_profiles")
      .update({ vetting_status: newStatus })
      .eq("id", contractorId);

    if (!error) {
      setContractors((prev) =>
        prev.map((c) =>
          c.id === contractorId
            ? { ...c, vetting_status: newStatus }
            : c
        )
      );
    }
    setUpdating(null);
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <FadeIn>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Contractors</h1>
            <p className="text-sm text-muted-foreground">
              {contractors.length} contractor
              {contractors.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={0.1}>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setFilter(f.value);
                  setLoading(true);
                }}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Contractor List */}
      {contractors.length === 0 ? (
        <FadeIn delay={0.2}>
          <Card className="rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="mb-4 h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium text-muted-foreground">
                No contractors found
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                {filter !== "all"
                  ? `No contractors with status "${filter}"`
                  : "No contractors have signed up yet"}
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <StaggerContainer className="space-y-3">
          {/* Table Header - Desktop */}
          <div className="hidden rounded-xl bg-muted/50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:grid lg:grid-cols-[2fr_1.5fr_1fr_0.8fr_0.8fr_1fr_1fr]">
            <span>Business Name</span>
            <span>Owner</span>
            <span>Services</span>
            <span>Rating</span>
            <span>Status</span>
            <span>Jobs Done</span>
            <span>Actions</span>
          </div>

          {contractors.map((contractor) => {
            const isExpanded = expandedId === contractor.id;
            const servicesOffered = Array.isArray(contractor.services_offered)
              ? contractor.services_offered
              : [];

            return (
              <StaggerItem key={contractor.id}>
                <Card className="rounded-2xl overflow-hidden">
                  {/* Row */}
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : contractor.id)
                    }
                    className="w-full text-left"
                  >
                    <CardContent className="p-5">
                      {/* Mobile layout */}
                      <div className="flex items-center justify-between lg:hidden">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground truncate">
                            {contractor.business_name || "Unnamed Business"}
                          </p>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {contractor.owner_name}
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            {getStatusBadge(contractor.vetting_status)}
                            {contractor.rating > 0 && (
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                                {contractor.rating}
                              </span>
                            )}
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>

                      {/* Desktop layout */}
                      <div className="hidden items-center lg:grid lg:grid-cols-[2fr_1.5fr_1fr_0.8fr_0.8fr_1fr_1fr]">
                        <span className="font-semibold text-foreground truncate pr-2">
                          {contractor.business_name || "Unnamed Business"}
                        </span>
                        <span className="text-sm text-muted-foreground truncate pr-2">
                          {contractor.owner_name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {servicesOffered.length}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          {contractor.rating > 0 ? (
                            <>
                              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                              {contractor.rating}
                            </>
                          ) : (
                            "N/A"
                          )}
                        </span>
                        <span>{getStatusBadge(contractor.vetting_status)}</span>
                        <span className="text-sm text-muted-foreground">
                          {contractor.total_jobs}
                        </span>
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {contractor.vetting_status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updating === contractor.id}
                              onClick={() =>
                                updateStatus(contractor.id, "approved")
                              }
                              className="h-8 gap-1.5 text-xs"
                            >
                              {updating === contractor.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-3 w-3" />
                              )}
                              Approve
                            </Button>
                          )}
                          {contractor.vetting_status === "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updating === contractor.id}
                              onClick={() =>
                                updateStatus(contractor.id, "suspended")
                              }
                              className="h-8 gap-1.5 text-xs text-red-600 hover:bg-red-500/10 hover:text-red-600"
                            >
                              {updating === contractor.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              Suspend
                            </Button>
                          )}
                          {contractor.vetting_status === "suspended" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updating === contractor.id}
                              onClick={() =>
                                updateStatus(contractor.id, "approved")
                              }
                              className="h-8 gap-1.5 text-xs"
                            >
                              {updating === contractor.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-3 w-3" />
                              )}
                              Reinstate
                            </Button>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t bg-muted/30 px-5 py-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Business Type
                          </p>
                          <p className="mt-1 text-sm text-foreground">
                            {contractor.business_type || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Years in Business
                          </p>
                          <p className="mt-1 text-sm text-foreground">
                            {contractor.years_in_business || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Employees
                          </p>
                          <p className="mt-1 text-sm text-foreground">
                            {contractor.employee_count || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Jobs Per Week Capacity
                          </p>
                          <p className="mt-1 text-sm text-foreground">
                            {contractor.jobs_per_week || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Has Own Equipment
                          </p>
                          <p className="mt-1 text-sm text-foreground">
                            {contractor.has_own_equipment ? "Yes" : "No"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Vehicle
                          </p>
                          <p className="mt-1 text-sm text-foreground">
                            {contractor.vehicle_type || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Insurance
                          </p>
                          <p className="mt-1 text-sm text-foreground">
                            {contractor.insurance_provider
                              ? `${contractor.insurance_provider} - $${(contractor.insurance_coverage_amount || 0).toLocaleString()}`
                              : "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            WCB
                          </p>
                          <p className="mt-1 text-sm text-foreground">
                            {contractor.wcb_account_number || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Hourly Rate Range
                          </p>
                          <p className="mt-1 text-sm text-foreground">
                            ${contractor.hourly_rate_min || 0} - $
                            {contractor.hourly_rate_max || 0}
                          </p>
                        </div>
                        {contractor.website && (
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Website
                            </p>
                            <a
                              href={contractor.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 block text-sm text-primary hover:underline"
                            >
                              {contractor.website}
                            </a>
                          </div>
                        )}
                        {servicesOffered.length > 0 && (
                          <div className="sm:col-span-2 lg:col-span-3">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Services Offered
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {servicesOffered.map((svc, i) => (
                                <Badge key={i} variant="secondary">
                                  {String(svc)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {contractor.why_join && (
                          <div className="sm:col-span-2 lg:col-span-3">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Why They Want to Join
                            </p>
                            <p className="mt-1 text-sm text-foreground">
                              {contractor.why_join}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Mobile action buttons */}
                      <div
                        className="mt-4 flex gap-2 lg:hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {contractor.vetting_status === "pending" && (
                          <Button
                            size="sm"
                            disabled={updating === contractor.id}
                            onClick={() =>
                              updateStatus(contractor.id, "approved")
                            }
                            className="gap-1.5"
                          >
                            {updating === contractor.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            Approve
                          </Button>
                        )}
                        {contractor.vetting_status === "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updating === contractor.id}
                            onClick={() =>
                              updateStatus(contractor.id, "suspended")
                            }
                            className="gap-1.5 text-red-600 hover:bg-red-500/10"
                          >
                            {updating === contractor.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            Suspend
                          </Button>
                        )}
                        {contractor.vetting_status === "suspended" && (
                          <Button
                            size="sm"
                            disabled={updating === contractor.id}
                            onClick={() =>
                              updateStatus(contractor.id, "approved")
                            }
                            className="gap-1.5"
                          >
                            {updating === contractor.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            Reinstate
                          </Button>
                        )}
                      </div>

                      <p className="mt-3 text-xs text-muted-foreground">
                        Joined{" "}
                        {new Date(contractor.created_at).toLocaleDateString(
                          "en-CA",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}
    </div>
  );
}
