"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Loader2, Plus, Briefcase, Trash2, Pencil, Users } from "lucide-react";
import { usePropertyStore, type BusinessType, type VehicleType, type ContractorProfile } from "@/stores/property-store";
import { useAuth } from "@/components/auth/auth-provider";
import {
  getAllContractorProfiles,
  createContractorProfileRecord,
  updateContractorProfileById,
  deleteContractorProfileById,
  updateSetupProgress,
} from "@/lib/supabase/queries";
import { FadeIn } from "@/components/ui/motion";
import { toast } from "sonner";

interface DbContractorProfile {
  id: string;
  business_name: string;
  owner_name: string;
  business_type: string;
  years_in_business: number;
  employee_count: number;
  website: string;
  personal_address: string;
  personal_city: string;
  personal_province: string;
  personal_postal_code: string;
  insurance_provider: string;
  insurance_policy_number: string;
  insurance_coverage_amount: number;
  insurance_expiry: string;
  wcb_account_number: string;
  business_number: string;
  gst_number: string;
  services_offered: string[] | null;
  hourly_rate_min: number;
  hourly_rate_max: number;
  has_own_equipment: boolean;
  vehicle_type: string;
  jobs_per_week: number;
  created_at: string;
}

function contractorToDbFields(contractor: ContractorProfile) {
  return {
    business_name: contractor.businessName,
    owner_name: contractor.ownerName,
    business_type: contractor.businessType,
    years_in_business: contractor.yearsInBusiness,
    employee_count: contractor.employeeCount,
    website: contractor.website,
    personal_address: contractor.personalAddress,
    personal_city: contractor.personalCity,
    personal_province: contractor.personalProvince,
    personal_postal_code: contractor.personalPostalCode,
    insurance_provider: contractor.insuranceProvider,
    insurance_policy_number: contractor.insurancePolicyNumber,
    insurance_coverage_amount: contractor.insuranceCoverageAmount,
    insurance_expiry: contractor.insuranceExpiry || null,
    wcb_account_number: contractor.wcbAccountNumber,
    business_number: contractor.businessNumber,
    gst_number: contractor.gstNumber,
    services_offered: contractor.servicesOffered,
    hourly_rate_min: contractor.hourlyRateMin,
    hourly_rate_max: contractor.hourlyRateMax,
    has_own_equipment: contractor.hasOwnEquipment,
    vehicle_type: contractor.vehicleType,
    jobs_per_week: contractor.jobsPerWeek,
  };
}

export default function ContractorPage() {
  const { user } = useAuth();
  const { contractor, setContractor } = usePropertyStore();

  const [profiles, setProfiles] = useState<DbContractorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadProfiles();
  }, [user]);

  async function loadProfiles() {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getAllContractorProfiles(user.id);
      setProfiles(data as DbContractorProfile[]);
    } catch {
      toast.error("Failed to load businesses");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(profile: DbContractorProfile) {
    setEditingId(profile.id);
    setAddingNew(false);
    setContractor({
      businessName: profile.business_name || "",
      ownerName: profile.owner_name || "",
      businessType: (profile.business_type || "sole-proprietor") as BusinessType,
      yearsInBusiness: profile.years_in_business || 0,
      employeeCount: profile.employee_count || 1,
      website: profile.website || "",
      personalAddress: profile.personal_address || "",
      personalCity: profile.personal_city || "",
      personalProvince: profile.personal_province || "",
      personalPostalCode: profile.personal_postal_code || "",
      insuranceProvider: profile.insurance_provider || "",
      insurancePolicyNumber: profile.insurance_policy_number || "",
      insuranceCoverageAmount: profile.insurance_coverage_amount || 0,
      insuranceExpiry: profile.insurance_expiry || "",
      wcbAccountNumber: profile.wcb_account_number || "",
      businessNumber: profile.business_number || "",
      gstNumber: profile.gst_number || "",
      servicesOffered: profile.services_offered || [],
      hourlyRateMin: profile.hourly_rate_min || 0,
      hourlyRateMax: profile.hourly_rate_max || 0,
      hasOwnEquipment: profile.has_own_equipment ?? true,
      vehicleType: (profile.vehicle_type || "pickup-truck") as VehicleType,
      jobsPerWeek: profile.jobs_per_week || 5,
    });
  }

  function startAddNew() {
    setEditingId(null);
    setAddingNew(true);
    setContractor({
      businessName: "",
      ownerName: "",
      businessType: "sole-proprietor",
      yearsInBusiness: 0,
      employeeCount: 1,
      website: "",
      personalAddress: "",
      personalCity: "",
      personalProvince: "",
      personalPostalCode: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
      insuranceCoverageAmount: 0,
      insuranceExpiry: "",
      wcbAccountNumber: "",
      businessNumber: "",
      gstNumber: "",
      servicesOffered: [],
      hourlyRateMin: 0,
      hourlyRateMax: 0,
      hasOwnEquipment: true,
      vehicleType: "pickup-truck",
      jobsPerWeek: 5,
    });
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      const fields = contractorToDbFields(contractor);
      if (editingId) {
        await updateContractorProfileById(editingId, fields);
        toast.success("Business updated!");
      } else {
        await createContractorProfileRecord(user.id, fields);
        toast.success("Business added!");
        await updateSetupProgress(user.id, "details_completed", true).catch(() => {});
      }
      setEditingId(null);
      setAddingNew(false);
      await loadProfiles();
    } catch (error) {
      console.error("Failed to save business:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(profileId: string) {
    setDeleting(profileId);
    try {
      await deleteContractorProfileById(profileId);
      toast.success("Business removed");
      await loadProfiles();
    } catch {
      toast.error("Failed to delete business");
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
            <h1 className="text-2xl font-bold">My Businesses</h1>
            <p className="mt-1 text-muted-foreground">Manage your contractor businesses and profiles.</p>
          </div>
          {!isEditing && (
            <Button onClick={startAddNew} className="gap-2">
              <Plus className="h-4 w-4" /> Add Business
            </Button>
          )}
        </div>
      </FadeIn>

      <div className="mt-8 space-y-6">
        {/* Business List */}
        {!isEditing && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : profiles.length === 0 ? (
              <FadeIn>
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No businesses yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Add your first business profile to get started.</p>
                    <Button onClick={startAddNew} className="mt-4 gap-2">
                      <Plus className="h-4 w-4" /> Add Your First Business
                    </Button>
                  </CardContent>
                </Card>
              </FadeIn>
            ) : (
              profiles.map((profile, i) => (
                <FadeIn key={profile.id} delay={i * 0.05}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Briefcase className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{profile.business_name || "Unnamed Business"}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <span className="capitalize">{(profile.business_type || "").replace("-", " ")}</span>
                              {profile.years_in_business > 0 && (
                                <>
                                  <span className="text-muted-foreground/30">|</span>
                                  <span>{profile.years_in_business} years</span>
                                </>
                              )}
                              {profile.employee_count > 0 && (
                                <>
                                  <span className="text-muted-foreground/30">|</span>
                                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{profile.employee_count}</span>
                                </>
                              )}
                            </div>
                            {i === 0 && (
                              <Badge className="mt-2 bg-primary/10 text-primary text-xs">Primary</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => startEditing(profile)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {profiles.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(profile.id)}
                              disabled={deleting === profile.id}
                            >
                              {deleting === profile.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
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

        {/* Edit / Add Form */}
        {isEditing && (
          <>
            <FadeIn>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{editingId ? "Edit Business" : "Add New Business"}</h2>
                <Button variant="ghost" onClick={() => { setEditingId(null); setAddingNew(false); }}>
                  Cancel
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card>
                <CardHeader><CardTitle className="text-base">Business Information</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Business Name</Label>
                    <Input value={contractor.businessName} onChange={(e) => setContractor({ businessName: e.target.value })} placeholder="ABC Contracting" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Owner Name</Label>
                    <Input value={contractor.ownerName} onChange={(e) => setContractor({ ownerName: e.target.value })} placeholder="John Smith" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Business Type</Label>
                    <Select value={contractor.businessType} onValueChange={(v: BusinessType) => setContractor({ businessType: v })}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="corporation">Corporation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Years in Business</Label>
                    <Input type="number" value={contractor.yearsInBusiness} onChange={(e) => setContractor({ yearsInBusiness: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Employees</Label>
                    <Input type="number" value={contractor.employeeCount} onChange={(e) => setContractor({ employeeCount: Number(e.target.value) || 1 })} className="h-11" min={1} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Website</Label>
                    <Input value={contractor.website} onChange={(e) => setContractor({ website: e.target.value })} placeholder="https://example.com" className="h-11" />
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
                    <Input value={contractor.businessNumber} onChange={(e) => setContractor({ businessNumber: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>GST Number</Label>
                    <Input value={contractor.gstNumber} onChange={(e) => setContractor({ gstNumber: e.target.value })} className="h-11" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card>
                <CardHeader><CardTitle className="text-base">Address</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Street Address</Label>
                    <Input value={contractor.personalAddress} onChange={(e) => setContractor({ personalAddress: e.target.value })} placeholder="123 Main St" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>City</Label>
                    <Input value={contractor.personalCity} onChange={(e) => setContractor({ personalCity: e.target.value })} placeholder="Kelowna" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Province</Label>
                    <Input value={contractor.personalProvince} onChange={(e) => setContractor({ personalProvince: e.target.value })} placeholder="BC" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Postal Code</Label>
                    <Input value={contractor.personalPostalCode} onChange={(e) => setContractor({ personalPostalCode: e.target.value })} placeholder="V1Y 1A1" className="h-11" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.25}>
              <Card>
                <CardHeader><CardTitle className="text-base">Insurance</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Insurance Provider</Label>
                    <Input value={contractor.insuranceProvider} onChange={(e) => setContractor({ insuranceProvider: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Policy Number</Label>
                    <Input value={contractor.insurancePolicyNumber} onChange={(e) => setContractor({ insurancePolicyNumber: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Coverage Amount ($)</Label>
                    <Input type="number" value={contractor.insuranceCoverageAmount} onChange={(e) => setContractor({ insuranceCoverageAmount: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Expiry Date</Label>
                    <Input type="date" value={contractor.insuranceExpiry} onChange={(e) => setContractor({ insuranceExpiry: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>WCB Account Number</Label>
                    <Input value={contractor.wcbAccountNumber} onChange={(e) => setContractor({ wcbAccountNumber: e.target.value })} className="h-11" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Card>
                <CardHeader><CardTitle className="text-base">Operations</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Hourly Rate (Min)</Label>
                    <Input type="number" value={contractor.hourlyRateMin} onChange={(e) => setContractor({ hourlyRateMin: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Hourly Rate (Max)</Label>
                    <Input type="number" value={contractor.hourlyRateMax} onChange={(e) => setContractor({ hourlyRateMax: Number(e.target.value) || 0 })} className="h-11" min={0} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Jobs Per Week</Label>
                    <Input type="number" value={contractor.jobsPerWeek} onChange={(e) => setContractor({ jobsPerWeek: Number(e.target.value) || 1 })} className="h-11" min={1} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Vehicle Type</Label>
                    <Select value={contractor.vehicleType} onValueChange={(v: VehicleType) => setContractor({ vehicleType: v })}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup-truck">Pickup Truck</SelectItem>
                        <SelectItem value="cargo-van">Cargo Van</SelectItem>
                        <SelectItem value="box-truck">Box Truck</SelectItem>
                        <SelectItem value="trailer">Trailer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-lg border p-3 sm:col-span-2">
                    <Label className="text-sm">Own Equipment</Label>
                    <Switch checked={contractor.hasOwnEquipment} onCheckedChange={(v) => setContractor({ hasOwnEquipment: v })} />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <Button onClick={handleSave} className="w-full gap-2" size="lg" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Business"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
