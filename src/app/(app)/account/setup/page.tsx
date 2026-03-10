"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Loader2, Plus, Building2, Trash2, Pencil, Users } from "lucide-react";
import { usePropertyStore, type StrataProfile, type PMProfile } from "@/stores/property-store";
import { useAuth } from "@/components/auth/auth-provider";
import {
  getAllStrataProperties,
  createStrataPropertyRecord,
  updateStrataPropertyById,
  deleteStrataPropertyById,
  getAllPMCompanies,
  createPMCompanyRecord,
  updatePMCompanyById,
  deletePMCompanyById,
  updateSetupProgress,
} from "@/lib/supabase/queries";
import { FadeIn } from "@/components/ui/motion";
import { toast } from "sonner";

// ---- Strata DB fields mapping ----

function strataToDbFields(strata: StrataProfile) {
  return {
    corporation_name: strata.corporationName,
    strata_plan_number: strata.strataPlanNumber,
    management_company: strata.managementCompany,
    contact_name: strata.contactName,
    contact_role: strata.contactRole,
    contact_email: strata.contactEmail,
    contact_phone: strata.contactPhone,
    unit_count: strata.unitCount,
    building_type: strata.buildingType,
    building_count: strata.buildingCount,
    common_area_sqft: strata.commonAreaSqft,
    year_built: strata.yearBuilt,
    address: strata.address,
    city: strata.city,
    province: strata.province,
    postal_code: strata.postalCode,
    annual_maintenance_budget: strata.annualMaintenanceBudget,
    insurance_provider: strata.insuranceProvider,
    insurance_policy_number: strata.insurancePolicyNumber,
    insurance_coverage_amount: strata.insuranceCoverageAmount,
    insurance_expiry: strata.insuranceExpiry || null,
    reserve_fund_balance: strata.reserveFundBalance,
    annual_reserve_contribution: strata.annualReserveContribution,
  };
}

// ---- PM DB fields mapping ----

function pmToDbFields(pm: PMProfile) {
  return {
    company_name: pm.companyName,
    company_type: pm.companyType,
    years_in_business: pm.yearsInBusiness,
    employee_count: pm.employeeCount,
    website: pm.website,
    business_number: pm.businessNumber,
    gst_number: pm.gstNumber,
    insurance_provider: pm.insuranceProvider,
    insurance_policy_number: pm.insurancePolicyNumber,
    insurance_coverage_amount: pm.insuranceCoverageAmount,
    insurance_expiry: pm.insuranceExpiry || null,
    eo_insurance_provider: pm.eoInsuranceProvider,
    eo_insurance_policy_number: pm.eoInsurancePolicyNumber,
    eo_insurance_coverage_amount: pm.eoInsuranceCoverageAmount,
    eo_insurance_expiry: pm.eoInsuranceExpiry || null,
    total_properties: pm.totalProperties,
    total_units: pm.totalUnits,
    annual_maintenance_spend: pm.annualMaintenanceSpend,
    billing_preference: pm.billingPreference,
    payment_terms: pm.paymentTerms,
    reporting_frequency: pm.reportingFrequency,
    escalation_protocol: pm.escalationProtocol,
  };
}

// ---- Main component ----

function SetupPageContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "strata" | "pm" | null;

  if (type === "strata") return <StrataSetup />;
  if (type === "pm") return <PMSetup />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <FadeIn>
        <Button variant="ghost" className="mb-4 gap-2" asChild>
          <Link href="/account"><ArrowLeft className="h-4 w-4" /> Back to Account</Link>
        </Button>
        <h1 className="text-2xl font-bold">Setup</h1>
        <p className="mt-2 text-muted-foreground">Invalid setup type. Please go back to your dashboard.</p>
      </FadeIn>
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    }>
      <SetupPageContent />
    </Suspense>
  );
}

// ---- Strata Setup ----

interface DbStrataProperty {
  id: string;
  corporation_name: string;
  strata_plan_number: string;
  management_company: string;
  contact_name: string;
  unit_count: number;
  building_type: string;
  building_count: number;
  address: string;
  city: string;
  year_built: number;
  annual_maintenance_budget: number;
  created_at: string;
}

function StrataSetup() {
  const { user } = useAuth();
  const { strata, setStrata } = usePropertyStore();

  const [records, setRecords] = useState<DbStrataProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadRecords();
  }, [user]);

  async function loadRecords() {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getAllStrataProperties(user.id);
      setRecords(data as DbStrataProperty[]);
    } catch {
      toast.error("Failed to load strata properties");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(record: DbStrataProperty) {
    setEditingId(record.id);
    setAddingNew(false);
    setStrata({
      corporationName: record.corporation_name || "",
      strataPlanNumber: record.strata_plan_number || "",
      managementCompany: record.management_company || "",
      contactName: record.contact_name || "",
      unitCount: record.unit_count || 20,
      buildingType: (record.building_type || "low-rise") as StrataProfile["buildingType"],
      buildingCount: record.building_count || 1,
      address: record.address || "",
      city: record.city || "",
      yearBuilt: record.year_built || 2000,
      annualMaintenanceBudget: record.annual_maintenance_budget || 0,
    });
  }

  function startAddNew() {
    setEditingId(null);
    setAddingNew(true);
    setStrata({
      corporationName: "",
      strataPlanNumber: "",
      managementCompany: "",
      contactName: "",
      unitCount: 20,
      buildingType: "low-rise",
      buildingCount: 1,
      address: "",
      city: "",
      province: "",
      postalCode: "",
      yearBuilt: 2000,
      annualMaintenanceBudget: 0,
    });
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      const fields = strataToDbFields(strata);
      if (editingId) {
        await updateStrataPropertyById(editingId, fields);
        toast.success("Strata property updated!");
      } else {
        await createStrataPropertyRecord(user.id, fields);
        toast.success("Strata property added!");
        await updateSetupProgress(user.id, "details_completed", true).catch(() => {});
      }
      setEditingId(null);
      setAddingNew(false);
      await loadRecords();
    } catch (error) {
      console.error("Failed to save strata property:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(recordId: string) {
    setDeleting(recordId);
    try {
      await deleteStrataPropertyById(recordId);
      toast.success("Strata property removed");
      await loadRecords();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  }

  const isEditing = editingId !== null || addingNew;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <FadeIn>
        <Button variant="ghost" className="mb-4 gap-2" asChild>
          <Link href="/account"><ArrowLeft className="h-4 w-4" /> Back to Account</Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Strata Properties</h1>
            <p className="mt-1 text-muted-foreground">Manage your strata corporation properties.</p>
          </div>
          {!isEditing && (
            <Button onClick={startAddNew} className="gap-2">
              <Plus className="h-4 w-4" /> Add Property
            </Button>
          )}
        </div>
      </FadeIn>

      <div className="mt-8 space-y-6">
        {!isEditing && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : records.length === 0 ? (
              <FadeIn>
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Building2 className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No strata properties yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Add your first strata property to get started.</p>
                    <Button onClick={startAddNew} className="mt-4 gap-2">
                      <Plus className="h-4 w-4" /> Add Strata Property
                    </Button>
                  </CardContent>
                </Card>
              </FadeIn>
            ) : (
              records.map((record, i) => (
                <FadeIn key={record.id} delay={i * 0.05}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{record.corporation_name || "Unnamed Corporation"}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <span>{record.unit_count || 0} units</span>
                              <span className="text-muted-foreground/30">|</span>
                              <span className="capitalize">{(record.building_type || "").replace("-", " ")}</span>
                              {record.address && (
                                <>
                                  <span className="text-muted-foreground/30">|</span>
                                  <span>{record.address}</span>
                                </>
                              )}
                            </div>
                            {i === 0 && (
                              <Badge className="mt-2 bg-primary/10 text-primary text-xs">Primary</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => startEditing(record)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {records.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(record.id)}
                              disabled={deleting === record.id}
                            >
                              {deleting === record.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))
            )}
          </>
        )}

        {isEditing && (
          <>
            <FadeIn>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{editingId ? "Edit Strata Property" : "Add Strata Property"}</h2>
                <Button variant="ghost" onClick={() => { setEditingId(null); setAddingNew(false); }}>Cancel</Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card>
                <CardHeader><CardTitle className="text-base">Corporation Info</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Corporation Name</Label>
                    <Input value={strata.corporationName} onChange={(e) => setStrata({ corporationName: e.target.value })} placeholder="Sunrise Strata Corp" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Strata Plan Number</Label>
                    <Input value={strata.strataPlanNumber} onChange={(e) => setStrata({ strataPlanNumber: e.target.value })} placeholder="BCS1234" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Management Company</Label>
                    <Input value={strata.managementCompany} onChange={(e) => setStrata({ managementCompany: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Primary Contact Name</Label>
                    <Input value={strata.contactName} onChange={(e) => setStrata({ contactName: e.target.value })} className="h-11" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.15}>
              <Card>
                <CardHeader><CardTitle className="text-base">Property Details</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Address</Label>
                    <Input value={strata.address} onChange={(e) => setStrata({ address: e.target.value })} placeholder="123 Strata Ave" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>City</Label>
                    <Input value={strata.city} onChange={(e) => setStrata({ city: e.target.value })} placeholder="Kelowna" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Province</Label>
                    <Input value={strata.province} onChange={(e) => setStrata({ province: e.target.value })} placeholder="BC" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Postal Code</Label>
                    <Input value={strata.postalCode} onChange={(e) => setStrata({ postalCode: e.target.value })} placeholder="V1Y 1A1" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Building Type</Label>
                    <Select value={strata.buildingType} onValueChange={(v) => setStrata({ buildingType: v as StrataProfile["buildingType"] })}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="low-rise">Low Rise</SelectItem>
                        <SelectItem value="mid-rise">Mid Rise</SelectItem>
                        <SelectItem value="high-rise">High Rise</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Unit Count</Label>
                    <Input type="number" value={strata.unitCount} onChange={(e) => setStrata({ unitCount: Number(e.target.value) || 1 })} className="h-11" min={1} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Building Count</Label>
                    <Input type="number" value={strata.buildingCount} onChange={(e) => setStrata({ buildingCount: Number(e.target.value) || 1 })} className="h-11" min={1} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Common Area (sq ft)</Label>
                    <Input type="number" value={strata.commonAreaSqft} onChange={(e) => setStrata({ commonAreaSqft: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Year Built</Label>
                    <Input type="number" value={strata.yearBuilt} onChange={(e) => setStrata({ yearBuilt: Number(e.target.value) || 2000 })} className="h-11" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card>
                <CardHeader><CardTitle className="text-base">Insurance & Financials</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Insurance Provider</Label>
                    <Input value={strata.insuranceProvider} onChange={(e) => setStrata({ insuranceProvider: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Policy Number</Label>
                    <Input value={strata.insurancePolicyNumber} onChange={(e) => setStrata({ insurancePolicyNumber: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Coverage Amount ($)</Label>
                    <Input type="number" value={strata.insuranceCoverageAmount} onChange={(e) => setStrata({ insuranceCoverageAmount: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Insurance Expiry</Label>
                    <Input type="date" value={strata.insuranceExpiry} onChange={(e) => setStrata({ insuranceExpiry: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Reserve Fund Balance ($)</Label>
                    <Input type="number" value={strata.reserveFundBalance} onChange={(e) => setStrata({ reserveFundBalance: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Annual Reserve Contribution ($)</Label>
                    <Input type="number" value={strata.annualReserveContribution} onChange={(e) => setStrata({ annualReserveContribution: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Annual Maintenance Budget ($)</Label>
                    <Input type="number" value={strata.annualMaintenanceBudget} onChange={(e) => setStrata({ annualMaintenanceBudget: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <Button onClick={handleSave} className="w-full gap-2" size="lg" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Strata Property"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ---- PM Setup ----

interface DbPMCompany {
  id: string;
  company_name: string;
  company_type: string;
  years_in_business: number;
  employee_count: number;
  website: string;
  total_properties: number;
  total_units: number;
  annual_maintenance_spend: number;
  created_at: string;
}

function PMSetup() {
  const { user } = useAuth();
  const { pm, setPM } = usePropertyStore();

  const [records, setRecords] = useState<DbPMCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadRecords();
  }, [user]);

  async function loadRecords() {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getAllPMCompanies(user.id);
      setRecords(data as DbPMCompany[]);
    } catch {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(record: DbPMCompany) {
    setEditingId(record.id);
    setAddingNew(false);
    setPM({
      companyName: record.company_name || "",
      companyType: record.company_type || "residential",
      yearsInBusiness: record.years_in_business || 0,
      employeeCount: record.employee_count || 1,
      website: record.website || "",
      totalProperties: record.total_properties || 0,
      totalUnits: record.total_units || 0,
      annualMaintenanceSpend: record.annual_maintenance_spend || 0,
    });
  }

  function startAddNew() {
    setEditingId(null);
    setAddingNew(true);
    setPM({
      companyName: "",
      companyType: "residential",
      yearsInBusiness: 0,
      employeeCount: 1,
      website: "",
      businessNumber: "",
      gstNumber: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
      insuranceCoverageAmount: 0,
      insuranceExpiry: "",
      eoInsuranceProvider: "",
      eoInsurancePolicyNumber: "",
      eoInsuranceCoverageAmount: 0,
      eoInsuranceExpiry: "",
      totalProperties: 0,
      totalUnits: 0,
      annualMaintenanceSpend: 0,
      billingPreference: "centralized",
      paymentTerms: "net-30",
      reportingFrequency: "monthly",
      escalationProtocol: "",
    });
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      const fields = pmToDbFields(pm);
      if (editingId) {
        await updatePMCompanyById(editingId, fields);
        toast.success("Company updated!");
      } else {
        await createPMCompanyRecord(user.id, fields);
        toast.success("Company added!");
        await updateSetupProgress(user.id, "details_completed", true).catch(() => {});
      }
      setEditingId(null);
      setAddingNew(false);
      await loadRecords();
    } catch (error) {
      console.error("Failed to save company:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(recordId: string) {
    setDeleting(recordId);
    try {
      await deletePMCompanyById(recordId);
      toast.success("Company removed");
      await loadRecords();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  }

  const isEditing = editingId !== null || addingNew;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <FadeIn>
        <Button variant="ghost" className="mb-4 gap-2" asChild>
          <Link href="/account"><ArrowLeft className="h-4 w-4" /> Back to Account</Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Property Management Companies</h1>
            <p className="mt-1 text-muted-foreground">Manage your PM companies and portfolios.</p>
          </div>
          {!isEditing && (
            <Button onClick={startAddNew} className="gap-2">
              <Plus className="h-4 w-4" /> Add Company
            </Button>
          )}
        </div>
      </FadeIn>

      <div className="mt-8 space-y-6">
        {!isEditing && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : records.length === 0 ? (
              <FadeIn>
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Building2 className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No companies yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Add your first PM company to get started.</p>
                    <Button onClick={startAddNew} className="mt-4 gap-2">
                      <Plus className="h-4 w-4" /> Add Your First Company
                    </Button>
                  </CardContent>
                </Card>
              </FadeIn>
            ) : (
              records.map((record, i) => (
                <FadeIn key={record.id} delay={i * 0.05}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{record.company_name || "Unnamed Company"}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <span className="capitalize">{record.company_type || "residential"}</span>
                              {record.total_properties > 0 && (
                                <>
                                  <span className="text-muted-foreground/30">|</span>
                                  <span>{record.total_properties} properties</span>
                                </>
                              )}
                              {record.employee_count > 0 && (
                                <>
                                  <span className="text-muted-foreground/30">|</span>
                                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{record.employee_count}</span>
                                </>
                              )}
                            </div>
                            {i === 0 && (
                              <Badge className="mt-2 bg-primary/10 text-primary text-xs">Primary</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => startEditing(record)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {records.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(record.id)}
                              disabled={deleting === record.id}
                            >
                              {deleting === record.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))
            )}
          </>
        )}

        {isEditing && (
          <>
            <FadeIn>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{editingId ? "Edit Company" : "Add New Company"}</h2>
                <Button variant="ghost" onClick={() => { setEditingId(null); setAddingNew(false); }}>Cancel</Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card>
                <CardHeader><CardTitle className="text-base">Company Information</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Company Name</Label>
                    <Input value={pm.companyName} onChange={(e) => setPM({ companyName: e.target.value })} placeholder="ABC Property Management" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Company Type</Label>
                    <Select value={pm.companyType} onValueChange={(v) => setPM({ companyType: v })}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                        <SelectItem value="strata">Strata-Focused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Years in Business</Label>
                    <Input type="number" value={pm.yearsInBusiness} onChange={(e) => setPM({ yearsInBusiness: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Employees</Label>
                    <Input type="number" value={pm.employeeCount} onChange={(e) => setPM({ employeeCount: Number(e.target.value) || 1 })} className="h-11" min={1} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Website</Label>
                    <Input value={pm.website} onChange={(e) => setPM({ website: e.target.value })} placeholder="https://example.com" className="h-11" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.15}>
              <Card>
                <CardHeader><CardTitle className="text-base">Registration</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Business Number</Label>
                    <Input value={pm.businessNumber} onChange={(e) => setPM({ businessNumber: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>GST Number</Label>
                    <Input value={pm.gstNumber} onChange={(e) => setPM({ gstNumber: e.target.value })} className="h-11" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card>
                <CardHeader><CardTitle className="text-base">General Liability Insurance</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Provider</Label>
                    <Input value={pm.insuranceProvider} onChange={(e) => setPM({ insuranceProvider: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Policy Number</Label>
                    <Input value={pm.insurancePolicyNumber} onChange={(e) => setPM({ insurancePolicyNumber: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Coverage Amount ($)</Label>
                    <Input type="number" value={pm.insuranceCoverageAmount} onChange={(e) => setPM({ insuranceCoverageAmount: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Expiry Date</Label>
                    <Input type="date" value={pm.insuranceExpiry} onChange={(e) => setPM({ insuranceExpiry: e.target.value })} className="h-11" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.25}>
              <Card>
                <CardHeader><CardTitle className="text-base">Errors & Omissions Insurance</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>E&O Provider</Label>
                    <Input value={pm.eoInsuranceProvider} onChange={(e) => setPM({ eoInsuranceProvider: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>E&O Policy Number</Label>
                    <Input value={pm.eoInsurancePolicyNumber} onChange={(e) => setPM({ eoInsurancePolicyNumber: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>E&O Coverage ($)</Label>
                    <Input type="number" value={pm.eoInsuranceCoverageAmount} onChange={(e) => setPM({ eoInsuranceCoverageAmount: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>E&O Expiry</Label>
                    <Input type="date" value={pm.eoInsuranceExpiry} onChange={(e) => setPM({ eoInsuranceExpiry: e.target.value })} className="h-11" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Card>
                <CardHeader><CardTitle className="text-base">Portfolio</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label>Total Properties</Label>
                    <Input type="number" value={pm.totalProperties} onChange={(e) => setPM({ totalProperties: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Total Units</Label>
                    <Input type="number" value={pm.totalUnits} onChange={(e) => setPM({ totalUnits: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Annual Maintenance ($)</Label>
                    <Input type="number" value={pm.annualMaintenanceSpend} onChange={(e) => setPM({ annualMaintenanceSpend: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.35}>
              <Card>
                <CardHeader><CardTitle className="text-base">Billing & Operations</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Billing Preference</Label>
                    <Select value={pm.billingPreference} onValueChange={(v) => setPM({ billingPreference: v })}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="centralized">Centralized</SelectItem>
                        <SelectItem value="per-property">Per Property</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Payment Terms</Label>
                    <Select value={pm.paymentTerms} onValueChange={(v) => setPM({ paymentTerms: v })}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="net-15">Net 15</SelectItem>
                        <SelectItem value="net-30">Net 30</SelectItem>
                        <SelectItem value="net-45">Net 45</SelectItem>
                        <SelectItem value="net-60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Reporting Frequency</Label>
                    <Select value={pm.reportingFrequency} onValueChange={(v) => setPM({ reportingFrequency: v })}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <Button onClick={handleSave} className="w-full gap-2" size="lg" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Company"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
