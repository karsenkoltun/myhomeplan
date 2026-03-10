"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import {
  Loader2,
  ArrowLeft,
  CalendarCheck,
  Filter,
  Calendar,
  MapPin,
  HardHat,
  DollarSign,
  ArrowUpDown,
} from "lucide-react";
import type { Database } from "@/lib/supabase/types";

type Booking = Database["public"]["Tables"]["service_bookings"]["Row"];
type BookingStatus = Booking["status"];

interface EnrichedBooking extends Booking {
  service_name?: string;
  property_address?: string;
  contractor_name?: string;
}

const STATUS_FILTERS: { label: string; value: BookingStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Confirmed", value: "confirmed" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "No Show", value: "no_show" },
];

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    scheduled:
      "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    confirmed:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    in_progress:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    completed:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    cancelled:
      "bg-red-500/15 text-red-600 dark:text-red-400",
    no_show:
      "bg-zinc-500/15 text-zinc-500 dark:text-zinc-400",
  };

  const labels: Record<string, string> = {
    scheduled: "Scheduled",
    confirmed: "Confirmed",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    no_show: "No Show",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-zinc-500/15 text-zinc-500"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

export default function AdminBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [sortAsc, setSortAsc] = useState(true);

  const fetchBookings = useCallback(async () => {
    const supabase = createClient();

    let query = supabase
      .from("service_bookings")
      .select("*")
      .order("scheduled_date", { ascending: sortAsc });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data: bookingData } = await query;
    const rawBookings = bookingData ?? [];

    if (rawBookings.length === 0) {
      setBookings([]);
      setLoading(false);
      return;
    }

    // Gather unique IDs for enrichment
    const serviceIds = [...new Set(rawBookings.map((b) => b.service_id))];
    const propertyIds = [...new Set(rawBookings.map((b) => b.property_id))];
    const contractorIds = [
      ...new Set(
        rawBookings
          .map((b) => b.contractor_profile_id)
          .filter(Boolean) as string[]
      ),
    ];

    // Fetch related data in parallel
    const [servicesRes, propertiesRes, contractorsRes] = await Promise.all([
      supabase.from("services").select("id, name").in("id", serviceIds),
      supabase
        .from("homeowner_properties")
        .select("id, address, city")
        .in("id", propertyIds),
      contractorIds.length > 0
        ? supabase
            .from("contractor_profiles")
            .select("id, business_name, owner_name")
            .in("id", contractorIds)
        : Promise.resolve({ data: [] }),
    ]);

    const serviceMap = new Map(
      (servicesRes.data ?? []).map((s) => [s.id, s.name])
    );
    const propertyMap = new Map(
      (propertiesRes.data ?? []).map((p) => [
        p.id,
        `${p.address || ""}${p.city ? `, ${p.city}` : ""}`,
      ])
    );
    const contractorMap = new Map(
      (contractorsRes.data ?? []).map((c) => [
        c.id,
        c.business_name || c.owner_name,
      ])
    );

    const enriched: EnrichedBooking[] = rawBookings.map((b) => ({
      ...b,
      service_name: serviceMap.get(b.service_id) ?? b.service_id,
      property_address: propertyMap.get(b.property_id) ?? "Unknown",
      contractor_name: b.contractor_profile_id
        ? contractorMap.get(b.contractor_profile_id) ?? "Unassigned"
        : "Unassigned",
    }));

    setBookings(enriched);
    setLoading(false);
  }, [filter, sortAsc]);

  useEffect(() => {
    if (authLoading || !user) return;
    fetchBookings();
  }, [user, authLoading, fetchBookings]);

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
            <CalendarCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
            <p className="text-sm text-muted-foreground">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Filters & Sort */}
      <FadeIn delay={0.1}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
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

          <button
            onClick={() => {
              setSortAsc(!sortAsc);
              setLoading(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortAsc ? "Upcoming First" : "Recent First"}
          </button>
        </div>
      </FadeIn>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <FadeIn delay={0.2}>
          <Card className="rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <CalendarCheck className="mb-4 h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium text-muted-foreground">
                No bookings found
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                {filter !== "all"
                  ? `No bookings with status "${filter.replace("_", " ")}"`
                  : "No bookings have been created yet"}
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <StaggerContainer className="space-y-3">
          {/* Table Header - Desktop */}
          <div className="hidden rounded-xl bg-muted/50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:grid lg:grid-cols-[1fr_1.5fr_1.5fr_1.2fr_0.8fr_0.8fr]">
            <span>Date</span>
            <span>Service</span>
            <span>Property</span>
            <span>Contractor</span>
            <span>Status</span>
            <span>Price</span>
          </div>

          {bookings.map((booking) => (
            <StaggerItem key={booking.id}>
              <Card className="rounded-2xl">
                <CardContent className="p-5">
                  {/* Mobile layout */}
                  <div className="space-y-3 lg:hidden">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">
                          {booking.service_name}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(
                            booking.scheduled_date + "T12:00:00"
                          ).toLocaleDateString("en-CA", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          at {booking.scheduled_time}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {booking.property_address}
                      </span>
                      <span className="flex items-center gap-1">
                        <HardHat className="h-3.5 w-3.5" />
                        {booking.contractor_name}
                      </span>
                      {booking.price > 0 && (
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <DollarSign className="h-3.5 w-3.5" />$
                          {booking.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden items-center lg:grid lg:grid-cols-[1fr_1.5fr_1.5fr_1.2fr_0.8fr_0.8fr]">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(
                          booking.scheduled_date + "T12:00:00"
                        ).toLocaleDateString("en-CA", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.scheduled_time}
                      </p>
                    </div>
                    <p className="text-sm text-foreground truncate pr-2">
                      {booking.service_name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate pr-2">
                      {booking.property_address}
                    </p>
                    <p className="text-sm text-muted-foreground truncate pr-2">
                      {booking.contractor_name}
                    </p>
                    <div>{getStatusBadge(booking.status)}</div>
                    <p className="text-sm font-medium text-foreground">
                      {booking.price > 0 ? `$${booking.price.toFixed(2)}` : "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
