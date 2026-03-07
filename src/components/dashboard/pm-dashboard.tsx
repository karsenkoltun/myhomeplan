"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building, Home, DollarSign, ClipboardList, Users, MapPin,
} from "lucide-react";
import {
  getPMCompany,
  getPMContacts,
  getPMManagedProperties,
} from "@/lib/supabase/queries";
import { DashboardShell } from "./dashboard-shell";
import { StatCard } from "./stat-card";
import { FadeIn } from "@/components/ui/motion";
import type { Database, Json } from "@/lib/supabase/types";

type PMCompany = Database["public"]["Tables"]["pm_companies"]["Row"];
type PMContact = Database["public"]["Tables"]["pm_company_contacts"]["Row"];
type PMProperty = Database["public"]["Tables"]["pm_managed_properties"]["Row"];

export function PMDashboard({
  profile,
}: {
  profile: Record<string, unknown>;
}) {
  const [company, setCompany] = useState<PMCompany | null>(null);
  const [contacts, setContacts] = useState<PMContact[]>([]);
  const [properties, setProperties] = useState<PMProperty[]>([]);

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
        }
      } catch {
        // silent
      }
    }
    load();
  }, [profile.id]);

  const displayName = company?.company_name || (profile.first_name as string) || "there";
  const totalUnits = properties.reduce((sum, p) => sum + (p.unit_count || 0), 0);

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

      {/* Portfolio Grid */}
      <FadeIn delay={0.25}>
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Portfolio ({properties.length} properties)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No properties added yet
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((prop) => {
                  const selectedServices = (prop.selected_services as string[] | null) ?? [];
                  return (
                    <div key={prop.id} className="rounded-lg border p-3">
                      <p className="font-medium text-sm">{prop.property_name || prop.address}</p>
                      <p className="text-xs text-muted-foreground">
                        {prop.address}, {prop.city}
                      </p>
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
                          <span className="text-muted-foreground">Built: </span>
                          <span>{prop.year_built}</span>
                        </div>
                      </div>
                      {selectedServices.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {selectedServices.slice(0, 3).map((s) => (
                            <Badge key={s} variant="secondary" className="text-[10px]">
                              {s}
                            </Badge>
                          ))}
                          {selectedServices.length > 3 && (
                            <Badge variant="outline" className="text-[10px]">
                              +{selectedServices.length - 3}
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

      {/* Billing Summary */}
      <FadeIn delay={0.3}>
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

      {/* Team Contacts */}
      {contacts.length > 0 && (
        <FadeIn delay={0.35}>
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Team Contacts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex flex-col gap-2 rounded-lg border p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{contact.name}</p>
                        {contact.is_primary && <Badge variant="secondary" className="text-[10px]">Primary</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{contact.role}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>{contact.email}</p>
                      <p>{contact.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </DashboardShell>
  );
}
