"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Building2, Users, Building, CreditCard, Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { usePropertyStore } from "@/stores/property-store";
import { useAuth } from "@/components/auth/auth-provider";
import { updateProfile, upsertPMCompany, savePMContacts, savePMManagedProperties } from "@/lib/supabase/queries";
import { SERVICES } from "@/data/services";
import { ShimmerButton } from "@/components/ui/motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RequiredLabel, FieldError } from "./shared";

export function StepPMReview({ onComplete }: { onComplete: () => void }) {
  const { setAccount, completeOnboarding } = useUserStore();
  const { pm } = usePropertyStore();
  const { user } = useAuth();
  const primaryContact = pm.contacts.find((c) => c.isPrimary) || pm.contacts[0];
  const [email, setEmail] = useState(primaryContact?.email || user?.email || "");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState(false);

  const totalSelectedServices = pm.properties.reduce((sum, p) => sum + p.selectedServices.length, 0);

  const handleSubmit = async () => {
    if (!email) {
      setErrors({ email: "Email is required" });
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      toast.error("Please enter your email");
      return;
    }

    setErrors({});
    setSaving(true);

    try {
      if (user) {
        await updateProfile(user.id, {
          user_type: "property-manager",
          first_name: primaryContact?.name?.split(" ")[0] || "",
          last_name: primaryContact?.name?.split(" ").slice(1).join(" ") || "",
          email,
          onboarding_complete: true,
          agreed_to_terms: true,
          agreed_to_privacy: true,
        });

        const savedCompany = await upsertPMCompany(user.id, {
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
        });

        if (savedCompany) {
          await savePMContacts(
            savedCompany.id,
            pm.contacts.filter((c) => c.name.trim()).map((c) => ({
              name: c.name,
              email: c.email,
              phone: c.phone,
              role: c.role,
              is_primary: c.isPrimary,
              can_approve_reports: c.canApproveReports,
              can_approve_invoices: c.canApproveInvoices,
              receives_notifications: c.receivesNotifications,
            }))
          );

          await savePMManagedProperties(
            savedCompany.id,
            pm.properties.map((p) => ({
              property_name: p.propertyName,
              address: p.address,
              city: p.city,
              province: p.province,
              postal_code: p.postalCode,
              property_type: p.propertyType,
              unit_count: p.unitCount,
              total_sqft: p.totalSqft,
              year_built: p.yearBuilt,
              access_instructions: p.accessInstructions,
              access_type: p.accessType,
              selected_services: p.selectedServices,
              notes: p.notes,
            }))
          );
        }
      }

      setAccount({
        firstName: primaryContact?.name?.split(" ")[0] || "",
        lastName: primaryContact?.name?.split(" ").slice(1).join(" ") || "",
        email,
        phone: primaryContact?.phone || "",
        dateOfBirth: "",
        address: { street: "", unit: "", city: "", province: "BC", postalCode: "" },
        mailingAddressSame: true,
        preferredContact: "email",
        emergencyContactName: "",
        emergencyContactPhone: "",
        howDidYouHear: "",
        referralCode: "",
        agreedToTerms: true,
        agreedToPrivacy: true,
        marketingOptIn: false,
      });
      completeOnboarding();
      setSubmitted(true);
      toast.success("Welcome to My Home Plan!");
      setTimeout(onComplete, 1500);
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Something went wrong saving your data. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/10"
        >
          <CheckCircle2 className="h-10 w-10 text-violet-500" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-2xl font-bold"
        >
          You&apos;re all set!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-muted-foreground"
        >
          Redirecting to your dashboard...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Review & Submit</h2>
      <p className="mt-2 text-center text-muted-foreground">Review your company details before submitting.</p>

      <div className="mt-8 space-y-6">
        {/* Company Summary */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-violet-600" />
              <h3 className="text-sm font-semibold text-muted-foreground">Company</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Name:</span> {pm.companyName}</div>
              <div><span className="text-muted-foreground">Type:</span> {pm.companyType}</div>
              <div><span className="text-muted-foreground">Years:</span> {pm.yearsInBusiness}</div>
              <div><span className="text-muted-foreground">Employees:</span> {pm.employeeCount}</div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Summary */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-violet-600" />
              <h3 className="text-sm font-semibold text-muted-foreground">Team ({pm.contacts.filter((c) => c.name).length})</h3>
            </div>
            <div className="space-y-2">
              {pm.contacts.filter((c) => c.name).map((c, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{c.name}</span>
                    {c.isPrimary && <Badge className="ml-2 text-[10px] bg-violet-500/10 text-violet-600">Primary</Badge>}
                  </div>
                  <span className="text-muted-foreground">{c.role}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Properties Summary */}
        <Card className="border-violet-500/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-violet-600" />
                <h3 className="text-sm font-semibold text-muted-foreground">Properties</h3>
              </div>
              <Badge className="bg-violet-500/10 text-violet-600">{pm.properties.length} properties</Badge>
            </div>
            {pm.properties.map((p, i) => (
              <div key={p.id} className="mb-2 last:mb-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{p.propertyName || p.address || `Property ${i + 1}`}</span>
                  <span className="text-muted-foreground">{p.unitCount} units</span>
                </div>
                {p.selectedServices.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.selectedServices.map((sId) => {
                      const svc = SERVICES.find((s) => s.id === sId);
                      return svc ? (
                        <Badge key={sId} variant="secondary" className="text-[10px]">{svc.name}</Badge>
                      ) : null;
                    })}
                  </div>
                )}
                {i < pm.properties.length - 1 && <Separator className="mt-2" />}
              </div>
            ))}
            <div className="mt-3 text-xs text-muted-foreground">
              {totalSelectedServices} total service selections across {pm.properties.length} properties
            </div>
          </CardContent>
        </Card>

        {/* Billing Summary */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-violet-600" />
              <h3 className="text-sm font-semibold text-muted-foreground">Billing</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Billing:</span> {pm.billingPreference}</div>
              <div><span className="text-muted-foreground">Terms:</span> {pm.paymentTerms}</div>
              <div><span className="text-muted-foreground">Reports:</span> {pm.reportingFrequency}</div>
            </div>
          </CardContent>
        </Card>

        {/* Email */}
        <Card className={cn(shaking && "animate-shake")}>
          <CardContent className="p-5">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Account Email</h3>
            <div className="space-y-1.5">
              <RequiredLabel>Email Address</RequiredLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                placeholder="you@company.com"
                className={cn("h-11", errors.email && "ring-2 ring-red-500 border-red-500")}
              />
              <FieldError message={errors.email} />
            </div>
          </CardContent>
        </Card>

        <ShimmerButton onClick={handleSubmit} className="h-12 w-full text-base" disabled={saving}>
          {saving ? <><Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> Saving...</> : <>Complete Setup <Sparkles className="ml-2 inline h-4 w-4" /></>}
        </ShimmerButton>
        <p className="text-center text-xs text-muted-foreground">No payment required today. Our team will reach out within 24 hours.</p>
      </div>
    </div>
  );
}
