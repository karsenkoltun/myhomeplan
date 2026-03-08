"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  Building2,
  MapPin,
  Users,
  Phone,
  Mail,
  TrendingDown,
  FileText,
  type LucideIcon,
  Scissors,
  Snowflake,
  Thermometer,
  Bug,
  Waves,
  Droplets,
  Sun,
  Car,
  ArrowUpDown,
  Shield,
  DollarSign,
  Wrench,
} from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { usePropertyStore } from "@/stores/property-store";
import { usePlanStore } from "@/stores/plan-store";
import { STRATA_SERVICES, calculateStrataServicePrice, STRATA_PLAN_DISCOUNTS } from "@/data/strata-services";
import { calculateVolumeDiscount, applyVolumeDiscount } from "@/lib/pricing";
import { SpringNumber, ShimmerButton } from "@/components/ui/motion";
import { toast } from "sonner";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Waves, Droplets, Sun, Car, ArrowUpDown,
};

const buildingTypeLabels: Record<string, string> = {
  townhouse: "Townhouse Complex",
  "low-rise": "Low-Rise (1-4 floors)",
  "mid-rise": "Mid-Rise (5-8 floors)",
  "high-rise": "High-Rise (9+ floors)",
  mixed: "Mixed",
};

const contactRoleLabels: Record<string, string> = {
  "property-manager": "Property Manager",
  "council-president": "Council President",
  "council-member": "Council Member",
  owner: "Owner",
  other: "Other",
};

const painPointLabels: Record<string, string> = {
  reliability: "Contractor Reliability",
  cost: "Cost Overruns",
  quality: "Quality Inconsistency",
  scheduling: "Scheduling Issues",
  communication: "Poor Communication",
  emergency: "Emergency Response",
};

export function StepStrataReview({ onComplete }: { onComplete: () => void }) {
  const { setAccount, completeOnboarding } = useUserStore();
  const { strata } = usePropertyStore();
  const { selectedServices, planInterval, setPlanInterval } = usePlanStore();
  const [name, setName] = useState(strata.contactName);
  const [email, setEmail] = useState(strata.contactEmail);
  const [phone, setPhone] = useState(strata.contactPhone);
  const [submitted, setSubmitted] = useState(false);
  const [quoteRequested, setQuoteRequested] = useState(false);

  const unitCount = strata.unitCount;
  const commonArea = strata.commonAreaSqft;
  const volumeDiscount = calculateVolumeDiscount(unitCount);

  const selectedStrataServices = STRATA_SERVICES.filter((s) => selectedServices.includes(s.id));

  const subtotalMonthly = selectedStrataServices.reduce(
    (sum, s) => sum + calculateStrataServicePrice(s, unitCount, commonArea),
    0
  );
  const afterVolumeDiscount = applyVolumeDiscount(subtotalMonthly, unitCount);

  // Payment interval discount
  const intervalKey = planInterval as keyof typeof STRATA_PLAN_DISCOUNTS;
  const intervalDiscount = STRATA_PLAN_DISCOUNTS[intervalKey]?.discount || 0;
  const total = afterVolumeDiscount * (1 - intervalDiscount);
  const perUnit = unitCount > 0 ? total / unitCount : 0;

  // Show custom quote button for large stratas
  const showCustomQuote = unitCount >= 100 || strata.annualMaintenanceBudget >= 200000;

  const handleSubmit = () => {
    if (!name || !email) {
      toast.error("Please fill in your name and email");
      return;
    }
    setAccount({
      firstName: name.split(" ")[0] || name,
      lastName: name.split(" ").slice(1).join(" "),
      email,
      phone,
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
  };

  const handleRequestQuote = () => {
    if (!name || !email) {
      toast.error("Please fill in your name and email to request a quote");
      return;
    }
    setAccount({
      firstName: name.split(" ")[0] || name,
      lastName: name.split(" ").slice(1).join(" "),
      email,
      phone,
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
    setQuoteRequested(true);
    toast.success("Custom quote request submitted! We'll be in touch within 24 hours.");
    setTimeout(onComplete, 2000);
  };

  if (submitted || quoteRequested) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
        >
          {quoteRequested ? (
            <FileText className="h-10 w-10 text-primary" />
          ) : (
            <CheckCircle2 className="h-10 w-10 text-primary" />
          )}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-2xl font-bold"
        >
          {quoteRequested ? "Quote Request Received!" : "You're all set!"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-muted-foreground"
        >
          {quoteRequested
            ? "Our team will prepare a custom quote for your building and reach out within 24 hours."
            : "Redirecting to your account..."}
        </motion.p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Review your strata plan</h2>
      <p className="mt-2 text-center text-muted-foreground">Almost done! Review your selections and create your account.</p>

      <div className="mt-8 space-y-6">
        {/* Strata summary */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-muted-foreground">Your Building</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Corporation</span>
                <span className="font-medium">{strata.corporationName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Plan Number</span>
                <span className="font-medium">{strata.strataPlanNumber}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Building Type</span>
                <span className="font-medium">{buildingTypeLabels[strata.buildingType]}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm sm:grid-cols-4">
                <div className="rounded-lg bg-muted/50 p-2 text-center">
                  <span className="block text-lg font-bold text-primary">{unitCount}</span>
                  <span className="text-[10px] text-muted-foreground">Units</span>
                </div>
                <div className="rounded-lg bg-muted/50 p-2 text-center">
                  <span className="block text-lg font-bold">{strata.buildingCount}</span>
                  <span className="text-[10px] text-muted-foreground">Buildings</span>
                </div>
                <div className="rounded-lg bg-muted/50 p-2 text-center">
                  <span className="block text-lg font-bold">{commonArea.toLocaleString()}</span>
                  <span className="text-[10px] text-muted-foreground">Common sq ft</span>
                </div>
                <div className="rounded-lg bg-muted/50 p-2 text-center">
                  <span className="block text-lg font-bold">{strata.yearBuilt}</span>
                  <span className="text-[10px] text-muted-foreground">Year Built</span>
                </div>
              </div>
              {strata.address && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{strata.address}, {strata.city}, {strata.province} {strata.postalCode}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact summary */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-muted-foreground">
                Contacts ({1 + strata.councilContacts.filter((c) => c.name).length})
              </h3>
            </div>
            <div className="space-y-2">
              {/* Primary contact */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{strata.contactName}</span>
                  <Badge className="ml-2 text-[10px] bg-primary/10 text-primary">Primary</Badge>
                </div>
                <span className="text-muted-foreground">{contactRoleLabels[strata.contactRole]}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {strata.contactEmail}</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {strata.contactPhone}</span>
              </div>

              {/* Council contacts */}
              {strata.councilContacts.filter((c) => c.name).map((c, i) => (
                <div key={i} className="border-t pt-2 mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted-foreground">{contactRoleLabels[c.role]}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-0.5">
                    {c.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {c.email}</span>}
                    {c.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</span>}
                    {c.canApprove && <Badge variant="secondary" className="text-[10px]">Can Approve</Badge>}
                  </div>
                </div>
              ))}

              {strata.managementCompany && (
                <div className="text-xs text-muted-foreground mt-1">
                  Management: {strata.managementCompany}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Operations summary */}
        {(strata.insuranceProvider || strata.reserveFundBalance > 0) && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground">Operations</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {strata.insuranceProvider && (
                  <div><span className="text-muted-foreground">Insurance:</span> {strata.insuranceProvider}</div>
                )}
                {strata.insuranceCoverageAmount > 0 && (
                  <div><span className="text-muted-foreground">Coverage:</span> ${strata.insuranceCoverageAmount.toLocaleString()}</div>
                )}
                {strata.reserveFundBalance > 0 && (
                  <div><span className="text-muted-foreground">Reserve Fund:</span> ${strata.reserveFundBalance.toLocaleString()}</div>
                )}
                {strata.annualReserveContribution > 0 && (
                  <div><span className="text-muted-foreground">Annual Contribution:</span> ${strata.annualReserveContribution.toLocaleString()}</div>
                )}
                {strata.depreciationReportDate && (
                  <div><span className="text-muted-foreground">Depreciation Report:</span> {strata.depreciationReportDate}</div>
                )}
                {strata.agmMonth > 0 && (
                  <div><span className="text-muted-foreground">AGM Month:</span> {new Date(2000, strata.agmMonth - 1).toLocaleString("en", { month: "long" })}</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current providers summary */}
        {strata.currentProviders.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground">Current Providers ({strata.currentProviders.length})</h3>
              </div>
              <div className="space-y-2">
                {strata.currentProviders.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{p.companyName}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{p.category}</span>
                    </div>
                    {p.contractEndDate && (
                      <span className="text-xs text-muted-foreground">Ends {p.contractEndDate}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pain points */}
        {strata.currentPainPoints.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Challenges We&apos;ll Address</h3>
              <div className="flex flex-wrap gap-1.5">
                {strata.currentPainPoints.map((pp) => (
                  <Badge key={pp} variant="secondary" className="text-xs">
                    {painPointLabels[pp]}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service & Pricing summary */}
        <Card className="border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">Your Services</h3>
              <Badge className="bg-primary/10 text-primary">
                {selectedStrataServices.length} services
              </Badge>
            </div>

            <div className="mt-4 space-y-2">
              {selectedStrataServices.map((service) => {
                const Icon = ICON_MAP[service.icon] || CheckCircle2;
                const rawPrice = calculateStrataServicePrice(service, unitCount, commonArea);
                const price = applyVolumeDiscount(rawPrice, unitCount);
                const servicePerUnit = unitCount > 0 ? price / unitCount : 0;
                return (
                  <div key={service.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{service.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">${(Number.isFinite(price) ? price : 0).toFixed(0)}/mo</span>
                      <span className="ml-1 text-[10px] text-muted-foreground">(${(Number.isFinite(servicePerUnit) ? servicePerUnit : 0).toFixed(2)}/unit)</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator className="my-4" />

            {/* Payment frequency */}
            <div className="mb-4">
              <Label className="text-xs text-muted-foreground">Payment Frequency</Label>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {(Object.entries(STRATA_PLAN_DISCOUNTS) as [string, { label: string; discount: number }][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setPlanInterval(key as "monthly" | "quarterly" | "annual")}
                    className={`rounded-lg border px-2 py-2 text-center text-xs font-medium transition-all ${
                      planInterval === key ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/30"
                    }`}
                  >
                    {val.label}
                    {val.discount > 0 && (
                      <span className="block text-[10px] text-primary">Save {(val.discount * 100).toFixed(0)}%</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="space-y-1.5">
              {volumeDiscount && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${(subtotalMonthly || 0).toFixed(0)}/mo</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-emerald-600">
                    <span className="flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      Volume discount ({volumeDiscount.percent}%)
                    </span>
                    <span>-${((subtotalMonthly - afterVolumeDiscount) || 0).toFixed(0)}/mo</span>
                  </div>
                </>
              )}
              {intervalDiscount > 0 && (
                <div className="flex items-center justify-between text-sm text-primary">
                  <span>{STRATA_PLAN_DISCOUNTS[intervalKey].label} discount</span>
                  <span>-${((afterVolumeDiscount * intervalDiscount) || 0).toFixed(0)}/mo</span>
                </div>
              )}
            </div>

            <Separator className="my-3" />

            {/* Totals */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Monthly Total</span>
                <span className="text-2xl font-bold text-primary">
                  $<SpringNumber value={Math.round(total)} />
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Per unit cost</span>
                <span className="font-semibold text-primary">
                  $<SpringNumber value={Math.round(perUnit * 100) / 100} />
                  <span className="text-xs font-normal text-muted-foreground">/unit/mo</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account creation */}
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Create Your Account</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Contact Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@strata.com" className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone (optional)</Label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="250-555-0123" className="h-11" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="space-y-3">
          {showCustomQuote && (
            <Button
              variant="outline"
              onClick={handleRequestQuote}
              className="h-12 w-full text-base border-primary/30 hover:bg-primary/5"
            >
              <FileText className="mr-2 h-4 w-4" />
              Request Custom Quote
            </Button>
          )}
          <ShimmerButton onClick={handleSubmit} className="h-12 w-full text-base">
            Complete Setup <Sparkles className="ml-2 inline h-4 w-4" />
          </ShimmerButton>
          <p className="text-center text-xs text-muted-foreground">
            {showCustomQuote
              ? "Request a custom quote for personalized pricing, or complete setup with standard rates."
              : "No payment required today. This is a simulated signup."}
          </p>
        </div>
      </div>
    </div>
  );
}
