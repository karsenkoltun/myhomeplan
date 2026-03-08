"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building, Home, DollarSign, ClipboardList, Users, MapPin, Calendar,
  CheckCircle2, XCircle, Bell, FileText, Building2, UserPlus,
} from "lucide-react";
import { parseISO } from "date-fns";
import {
  getPMCompany,
  getPMContacts,
  getPMManagedProperties,
  getBookingsForProperties,
} from "@/lib/supabase/queries";
import { SERVICES } from "@/data/services";
import { DashboardShell } from "./dashboard-shell";
import { StatCard } from "./stat-card";
import { PMBillingView } from "./pm-billing-view";
import { FadeIn } from "@/components/ui/motion";
import type { Database, Json } from "@/lib/supabase/types";
import type { CalendarData } from "@/components/ui/fullscreen-calendar";

const FullScreenCalendar = dynamic(
  () =>
    import("@/components/ui/fullscreen-calendar").then((mod) => ({
      default: mod.FullScreenCalendar,
    })),
  { ssr: false }
);

type Booking = Database["public"]["Tables"]["service_bookings"]["Row"];
type PMCompany = Database["public"]["Tables"]["pm_companies"]["Row"];
type PMContact = Database["public"]["Tables"]["pm_company_contacts"]["Row"];
type PMProperty = Database["public"]["Tables"]["pm_managed_properties"]["Row"];

function getServiceStatusDot(serviceCount: number) {
  if (serviceCount >= 5) return "bg-emerald-500";
  if (serviceCount >= 2) return "bg-amber-500";
  if (serviceCount >= 1) return "bg-blue-500";
  return "bg-gray-300";
}

export function PMDashboard({
  profile,
}: {
  profile: Record<string, unknown>;
}) {
  const [company, setCompany] = useState<PMCompany | null>(null);
  const [contacts, setContacts] = useState<PMContact[]>([]);
  const [properties, setProperties] = useState<PMProperty[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const co = await getPMCompany(profile.id as string);
        if (co) {
          setCompany(co);
          const [contactsData, propsData] = await Promise.all([
            getPMContacts(co.id),
            getPMManagedProperties(co.id),
          ]);
          setContacts(contactsData);
          setProperties(propsData);

          // Load bookings across all managed properties
          if (propsData.length > 0) {
            const propertyIds = propsData.map((p) => p.id);
            const bookingsData = await getBookingsForProperties(propertyIds);
            setBookings(bookingsData);
          }
        }
      } catch {
        // silent
      }
    }
    load();
  }, [profile.id]);

  const displayName = company?.company_name || (profile.first_name as string) || "there";
  const totalUnits = properties.reduce((sum, p) => sum + (p.unit_count || 0), 0);
  const totalActiveServices = properties.reduce((sum, p) => {
    const svcs = (p.selected_services as string[] | null) ?? [];
    return sum + svcs.length;
  }, 0);

  // Map bookings to calendar events
  const calendarData: CalendarData[] = useMemo(() => {
    return bookings
      .filter((b) => b.status !== "cancelled")
      .map((b) => {
        const prop = properties.find((p) => p.id === b.property_id);
        const serviceName = SERVICES.find((s) => s.id === b.service_id)?.name ?? b.service_id;
        const label = prop ? `${serviceName} - ${prop.property_name || prop.address}` : serviceName;
        return {
          day: parseISO(b.scheduled_date),
          events: [{
            id: Math.random(),
            name: label,
            time: b.scheduled_time,
            datetime: b.scheduled_date,
          }],
        };
      });
  }, [bookings, properties]);

  const upcomingBookingCount = bookings.filter(
    (b) => b.status !== "completed" && b.status !== "cancelled"
  ).length;

  return (
    <DashboardShell
      title={`Welcome, ${displayName}!`}
      subtitle="Your property management overview."
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Building} label="Properties" value={properties.length} delay={0.05} />
        <StatCard icon={Home} label="Total Units" value={totalUnits} delay={0.1} />
        <StatCard icon={DollarSign} label="Monthly Spend" value={company?.annual_maintenance_spend ? Math.round(company.annual_maintenance_spend / 12) : 0} prefix="$" delay={0.15} />
        <StatCard icon={Users} label="Team Members" value={contacts.length} delay={0.2} />
      </div>

      {/* Portfolio Grid with service status dots */}
      <FadeIn delay={0.25}>
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Portfolio ({properties.length} properties)</CardTitle>
              <Badge variant="secondary" className="ml-auto text-[10px]">
                {totalActiveServices} active services
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <Building2 className="h-10 w-10 text-muted-foreground/50" />
                <div>
                  <p className="font-medium">No properties added yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your managed properties will appear here once added.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((prop) => {
                  const selectedServices = (prop.selected_services as string[] | null) ?? [];
                  const serviceNames = selectedServices
                    .map((sid) => SERVICES.find((s) => s.id === sid)?.name ?? sid)
                    .slice(0, 4);
                  return (
                    <div key={prop.id} className="rounded-lg border p-3 transition-colors hover:border-primary/20">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{prop.property_name || prop.address}</p>
                          <p className="text-xs text-muted-foreground">
                            {prop.address}, {prop.city}
                          </p>
                        </div>
                        <div className={`h-2.5 w-2.5 rounded-full ${getServiceStatusDot(selectedServices.length)}`} title={`${selectedServices.length} services`} />
                      </div>
                      <Separator className="my-2" />
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div>
                          <span className="text-muted-foreground">Type: </span>
                          <span className="capitalize">{prop.property_type}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Units: </span>
                          <span>{prop.unit_count}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sq ft: </span>
                          <span>{prop.total_sqft?.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Services: </span>
                          <span className="font-medium">{selectedServices.length}</span>
                        </div>
                      </div>
                      {serviceNames.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {serviceNames.map((name) => (
                            <Badge key={name} variant="secondary" className="text-[10px]">
                              {name}
                            </Badge>
                          ))}
                          {selectedServices.length > 4 && (
                            <Badge variant="outline" className="text-[10px]">
                              +{selectedServices.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Billing View */}
      <div className="mt-6">
        <PMBillingView
          properties={properties.map((p) => ({
            id: p.id,
            property_name: p.property_name,
            address: p.address,
            city: p.city,
            unit_count: p.unit_count,
            total_sqft: p.total_sqft,
            selected_services: (p.selected_services as string[]) ?? [],
          }))}
          billingPreference={company?.billing_preference ?? "monthly"}
          annualSpend={company?.annual_maintenance_spend ?? 0}
        />
      </div>

      {/* Maintenance Calendar */}
      <FadeIn delay={0.32}>
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Maintenance Calendar</CardTitle>
              {upcomingBookingCount > 0 && (
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  {upcomingBookingCount} scheduled
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <FullScreenCalendar data={calendarData} />
          </CardContent>
        </Card>
      </FadeIn>

      {/* Team Permissions Table */}
      <FadeIn delay={0.35}>
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Team Permissions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <UserPlus className="h-10 w-10 text-muted-foreground/50" />
                <div>
                  <p className="font-medium">No team members yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add team contacts to manage permissions and notifications.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Name</th>
                      <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Role</th>
                      <th className="pb-2 pr-4 text-center text-xs font-medium text-muted-foreground">Reports</th>
                      <th className="pb-2 pr-4 text-center text-xs font-medium text-muted-foreground">Invoices</th>
                      <th className="pb-2 text-center text-xs font-medium text-muted-foreground">Notifications</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="border-b last:border-0">
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{contact.name}</span>
                            {contact.is_primary && <Badge variant="secondary" className="text-[10px]">Primary</Badge>}
                          </div>
                        </td>
                        <td className="py-2.5 pr-4 text-muted-foreground">{contact.role}</td>
                        <td className="py-2.5 pr-4 text-center">
                          {contact.can_approve_reports ? (
                            <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                          ) : (
                            <XCircle className="mx-auto h-4 w-4 text-muted-foreground/30" />
                          )}
                        </td>
                        <td className="py-2.5 pr-4 text-center">
                          {contact.can_approve_invoices ? (
                            <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                          ) : (
                            <XCircle className="mx-auto h-4 w-4 text-muted-foreground/30" />
                          )}
                        </td>
                        <td className="py-2.5 text-center">
                          {contact.receives_notifications ? (
                            <Bell className="mx-auto h-4 w-4 text-primary" />
                          ) : (
                            <XCircle className="mx-auto h-4 w-4 text-muted-foreground/30" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Company Overview */}
      <FadeIn delay={0.4}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Company Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Company Type</p>
                <p className="font-medium capitalize">{company?.company_type || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Years in Business</p>
                <p className="font-medium">{company?.years_in_business ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Employees</p>
                <p className="font-medium">{company?.employee_count ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Annual Maintenance</p>
                <p className="font-medium">${(company?.annual_maintenance_spend ?? 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Billing Preference</p>
                <p className="font-medium capitalize">{company?.billing_preference || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment Terms</p>
                <p className="font-medium capitalize">{company?.payment_terms || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reporting</p>
                <p className="font-medium capitalize">{company?.reporting_frequency || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Insurance</p>
                <p className="font-medium">{company?.insurance_provider || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </DashboardShell>
  );
}
