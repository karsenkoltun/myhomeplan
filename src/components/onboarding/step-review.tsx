"use client";

import { useState } from "react";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, type LucideIcon, Scissors, Snowflake, Thermometer, Bug, Hammer, Wrench, Zap, Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair, Building2, MapPin, Clock, FileSearch, ShieldCheck, Phone, Briefcase, ArrowRight, Loader2, Shield, DollarSign } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { usePropertyStore } from "@/stores/property-store";
import { usePlanStore } from "@/stores/plan-store";
import { useAuth } from "@/components/auth/auth-provider";
import { SERVICES, PLAN_DISCOUNTS } from "@/data/services";
import { calculateServicePrice } from "@/lib/pricing";
import { updateProfile, upsertProperty, upsertContractorProfile, saveContractorReferences, saveContractorServiceRates, createSubscription } from "@/lib/supabase/queries";
import { calculateContractorPayout } from "@/lib/pricing";
import { SpringNumber, ShimmerButton } from "@/components/ui/motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RequiredLabel, FieldError } from "./shared";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
};

const accountSchema = z.object({
  firstName: z.string().min(1, "This field is required"),
  lastName: z.string().min(1, "This field is required"),
  email: z.string().min(1, "This field is required").email("Please enter a valid email address"),
  phone: z.string().min(1, "This field is required"),
});

export function StepReview({ onComplete }: { onComplete: () => void }) {
  const { userType } = useUserStore();

  if (userType === "contractor") {
    return <ContractorReview onComplete={onComplete} />;
  }

  return <HomeownerReview onComplete={onComplete} />;
}

function HomeownerReview({ onComplete }: { onComplete: () => void }) {
  const { setAccount, completeOnboarding } = useUserStore();
  const { property, serviceSpecs } = usePropertyStore();
  const { selectedServices, planInterval, setPlanInterval } = usePlanStore();
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState(false);

  const selectedServiceData = SERVICES.filter((s) => selectedServices.includes(s.id));

  const subtotal = selectedServiceData.reduce(
    (sum, s) => sum + calculateServicePrice(s, property.homeSqft, property.lotSqft, serviceSpecs[s.id], property),
    0
  );
  const discount = PLAN_DISCOUNTS[planInterval].discount;
  const total = subtotal * (1 - discount);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    const result = accountSchema.safeParse({ firstName, lastName, email, phone });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const mapped: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(fieldErrors)) {
        if (msgs && msgs.length > 0) mapped[key] = msgs[0];
      }
      setErrors(mapped);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      toast.error("Please fill in all required fields");
      return;
    }

    setErrors({});
    setSaving(true);

    try {
      if (user) {
        await updateProfile(user.id, {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          street: property.address,
          province: "BC",
          onboarding_complete: true,
          agreed_to_terms: true,
          agreed_to_privacy: true,
        });

        const savedProperty = await upsertProperty(user.id, {
          address: property.address,
          home_sqft: property.homeSqft,
          lot_sqft: property.lotSqft,
          year_built: property.yearBuilt,
          home_type: property.homeType,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          floors: property.floors,
          heating_type: property.heatingType,
          has_ac: property.hasAC,
          has_garage: property.hasGarage,
          has_driveway: property.hasDriveway,
          has_deck: property.hasDeck,
          has_fence: property.hasFence,
          has_pets: property.hasPets,
          roof_type: property.roofType,
          exterior_material: property.exteriorMaterial,
          foundation: property.foundation,
          window_count: property.windowCount,
          landscaping_complexity: property.landscapingComplexity,
          mature_trees: property.matureTrees,
          garden_beds: property.gardenBeds,
          garden_bed_sqft: property.gardenBedSqft,
          deck_patio_sqft: property.deckPatioSqft,
          has_pool: property.hasPool,
          has_irrigation: property.hasIrrigation,
          driveway_material: property.drivewayMaterial,
          driveway_length: property.drivewayLength,
          fence_type: property.fenceType,
          fence_linear_feet: property.fenceLinearFeet,
          // New fields
          hvac_brand: property.hvacBrand,
          hvac_age: property.hvacAge,
          water_heater_type: property.waterHeaterType,
          water_heater_age: property.waterHeaterAge,
          furnace_filter_size: property.furnaceFilterSize,
          access_instructions: property.accessInstructions,
          gate_code_exists: property.gateCodeExists,
          lockbox_exists: property.lockboxExists,
          alarm_system: property.alarmSystem,
          pet_details: property.petDetails,
          parking_instructions: property.parkingInstructions,
          preferred_service_day: property.preferredServiceDay,
          chemical_sensitivities: property.chemicalSensitivities,
          special_instructions: property.specialInstructions,
          home_insurance_provider: property.homeInsuranceProvider,
        });

        if (selectedServices.length > 0) {
          const serviceItems = selectedServiceData.map((s) => ({
            serviceId: s.id,
            frequency: s.frequency,
            specs: serviceSpecs[s.id] || {},
            monthlyPrice: calculateServicePrice(s, property.homeSqft, property.lotSqft, serviceSpecs[s.id], property),
          }));

          await createSubscription(
            user.id,
            savedProperty.id,
            planInterval,
            total,
            discount,
            serviceItems
          );
        }
      }

      setAccount({
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: "",
        address: { street: property.address, unit: "", city: "", province: "BC", postalCode: "" },
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
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
        >
          <CheckCircle2 className="h-10 w-10 text-primary" />
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
          Redirecting to your account...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Review your plan</h2>
      <p className="mt-2 text-center text-muted-foreground">Almost done! Review your selections and create your account.</p>

      <div className="mt-8 space-y-6">
        {/* Property summary */}
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-muted-foreground">Your Property</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <div><span className="text-muted-foreground">Home:</span> {property.homeSqft.toLocaleString()} sqft</div>
              <div><span className="text-muted-foreground">Lot:</span> {property.lotSqft.toLocaleString()} sqft</div>
              <div><span className="text-muted-foreground">Bed/Bath:</span> {property.bedrooms}/{property.bathrooms}</div>
              <div><span className="text-muted-foreground">Type:</span> {property.homeType}</div>
            </div>
            {/* Access info summary */}
            {(property.accessInstructions || property.preferredServiceDay) && (
              <div className="mt-3 border-t pt-2 text-sm">
                {property.preferredServiceDay && (
                  <div className="text-xs text-muted-foreground">Preferred service day: {property.preferredServiceDay}</div>
                )}
                {property.accessInstructions && (
                  <div className="text-xs text-muted-foreground mt-1">Access: {property.accessInstructions}</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan summary */}
        <Card className="border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">Your Services</h3>
              <Badge className="bg-primary/10 text-primary">{selectedServices.length} services</Badge>
            </div>

            <div className="mt-4 space-y-2">
              {selectedServiceData.map((service) => {
                const Icon = ICON_MAP[service.icon] || CheckCircle2;
                const price = calculateServicePrice(service, property.homeSqft, property.lotSqft, serviceSpecs[service.id], property);
                return (
                  <div key={service.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{service.name}</span>
                    </div>
                    <span className="font-medium">${price.toFixed(0)}/mo</span>
                  </div>
                );
              })}
            </div>

            <Separator className="my-4" />

            {/* Payment frequency */}
            <div className="mb-4">
              <label className="text-xs text-muted-foreground">Payment Frequency</label>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {(Object.entries(PLAN_DISCOUNTS) as [string, { label: string; discount: number; description: string }][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setPlanInterval(key as "monthly" | "quarterly" | "annual")}
                    className={`rounded-lg border px-2 py-2 text-center text-xs font-medium transition-all ${
                      planInterval === key ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/30"
                    }`}
                  >
                    {val.label}
                    {val.discount > 0 && <span className="block text-[10px] text-primary">{val.description}</span>}
                  </button>
                ))}
              </div>
            </div>

            {discount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(0)}/mo</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex items-center justify-between text-sm text-primary">
                <span>{PLAN_DISCOUNTS[planInterval].label} discount</span>
                <span>-${(subtotal * discount).toFixed(0)}/mo</span>
              </div>
            )}

            <div className="mt-2 flex items-center justify-between">
              <span className="text-lg font-bold">Monthly Total</span>
              <span className="text-2xl font-bold text-primary">
                $<SpringNumber value={Math.round(total)} /><span className="text-sm font-normal text-muted-foreground">/mo</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Account creation */}
        <Card className={cn(shaking && "animate-shake")}>
          <CardContent className="p-5">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Create Your Account</h3>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <RequiredLabel>First Name</RequiredLabel>
                  <Input
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      clearError("firstName");
                    }}
                    placeholder="John"
                    className={cn("h-11 transition-colors duration-200", errors.firstName && "ring-2 ring-red-500 border-red-500")}
                  />
                  <FieldError message={errors.firstName} />
                </div>
                <div className="space-y-1.5">
                  <RequiredLabel>Last Name</RequiredLabel>
                  <Input
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      clearError("lastName");
                    }}
                    placeholder="Smith"
                    className={cn("h-11 transition-colors duration-200", errors.lastName && "ring-2 ring-red-500 border-red-500")}
                  />
                  <FieldError message={errors.lastName} />
                </div>
              </div>
              <div className="space-y-1.5">
                <RequiredLabel>Email</RequiredLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  placeholder="john@example.com"
                  className={cn("h-11 transition-colors duration-200", errors.email && "ring-2 ring-red-500 border-red-500")}
                />
                <FieldError message={errors.email} />
              </div>
              <div className="space-y-1.5">
                <RequiredLabel>Phone</RequiredLabel>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearError("phone");
                  }}
                  placeholder="250-555-0123"
                  className={cn("h-11 transition-colors duration-200", errors.phone && "ring-2 ring-red-500 border-red-500")}
                />
                <FieldError message={errors.phone} />
              </div>
            </div>
          </CardContent>
        </Card>

        <ShimmerButton onClick={handleSubmit} className="h-12 w-full text-base" disabled={saving}>
          {saving ? <><Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> Saving...</> : <>Complete Setup <Sparkles className="ml-2 inline h-4 w-4" /></>}
        </ShimmerButton>
        <p className="text-center text-xs text-muted-foreground">No payment required today.</p>
      </div>
    </div>
  );
}

// --- Contractor Review ---

const whatHappensNextSteps = [
  {
    icon: FileSearch,
    title: "Application Review",
    description: "We review all applications within 48 hours",
    color: "bg-sky-500/10 text-sky-600",
  },
  {
    icon: ShieldCheck,
    title: "Verification",
    description: "Background check and reference verification",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: Phone,
    title: "Onboarding Call",
    description: "30-minute call to discuss partnership details",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: Briefcase,
    title: "Start Working",
    description: "Begin receiving job assignments in your area",
    color: "bg-primary/10 text-primary",
  },
];

function ContractorReview({ onComplete }: { onComplete: () => void }) {
  const { setAccount, completeOnboarding } = useUserStore();
  const { contractor } = usePropertyStore();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState(false);

  const contractorEmailSchema = z.object({
    email: z.string().min(1, "This field is required").email("Please enter a valid email address"),
  });

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const servicesOfferedNames = SERVICES
    .filter((s) => contractor.servicesOffered.includes(s.id))
    .map((s) => s.name);

  const handleSubmit = async () => {
    const result = contractorEmailSchema.safeParse({ email });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const mapped: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(fieldErrors)) {
        if (msgs && msgs.length > 0) mapped[key] = msgs[0];
      }
      setErrors(mapped);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      toast.error("Please enter a valid email address");
      return;
    }

    setErrors({});
    setSaving(true);

    try {
      if (user) {
        await updateProfile(user.id, {
          user_type: "contractor",
          first_name: contractor.ownerName.split(" ")[0] || "",
          last_name: contractor.ownerName.split(" ").slice(1).join(" ") || "",
          email,
          onboarding_complete: true,
          agreed_to_terms: contractor.agreeTerms,
          agreed_to_privacy: contractor.agreePrivacy,
        });

        const savedContractor = await upsertContractorProfile(user.id, {
          business_name: contractor.businessName,
          owner_name: contractor.ownerName,
          business_type: contractor.businessType,
          years_in_business: contractor.yearsInBusiness,
          employee_count: contractor.employeeCount,
          service_area: contractor.serviceArea,
          website: contractor.website,
          services_offered: contractor.servicesOffered,
          licenses: contractor.licenses,
          experience_years: contractor.experienceYears,
          available_days: contractor.availableDays,
          available_hours: contractor.availableHours,
          jobs_per_week: contractor.jobsPerWeek,
          has_own_equipment: contractor.hasOwnEquipment,
          vehicle_type: contractor.vehicleType,
          why_join: contractor.whyJoin,
          agree_background_check: contractor.agreeBackgroundCheck,
          agree_quality_standards: contractor.agreeQualityStandards,
          agree_terms: contractor.agreeTerms,
          // New fields
          personal_address: contractor.personalAddress,
          personal_city: contractor.personalCity,
          personal_province: contractor.personalProvince,
          personal_postal_code: contractor.personalPostalCode,
          date_of_birth: contractor.dateOfBirth || null,
          emergency_contact_name: contractor.emergencyContactName,
          emergency_contact_phone: contractor.emergencyContactPhone,
          preferred_contact: contractor.preferredContact,
          insurance_provider: contractor.insuranceProvider,
          insurance_policy_number: contractor.insurancePolicyNumber,
          insurance_coverage_amount: contractor.insuranceCoverageAmount || null,
          insurance_expiry: contractor.insuranceExpiry || null,
          wcb_account_number: contractor.wcbAccountNumber,
          wcb_coverage_start: contractor.wcbCoverageStart || null,
          wcb_coverage_end: contractor.wcbCoverageEnd || null,
          business_number: contractor.businessNumber,
          gst_number: contractor.gstNumber,
          hourly_rate_min: contractor.hourlyRateMin || null,
          hourly_rate_max: contractor.hourlyRateMax || null,
          equipment_inventory: contractor.equipmentInventory,
          seasonal_availability: contractor.seasonalAvailability,
          portfolio_description: contractor.portfolioDescription,
          agreed_to_criminal_check: contractor.agreedToCriminalCheck,
          agreed_to_drug_test: contractor.agreedToDrugTest,
        });

        if (savedContractor) {
          await saveContractorReferences(savedContractor.id, contractor.references);

          // Save individual service rates if any were entered
          const rateEntries = Object.entries(contractor.serviceRates)
            .filter(([, rate]) => rate > 0)
            .map(([serviceId, rate]) => ({ service_id: serviceId, individual_rate: rate }));
          if (rateEntries.length > 0) {
            await saveContractorServiceRates(savedContractor.id, rateEntries);
          }
        }
      }

      setAccount({
        firstName: contractor.ownerName.split(" ")[0] || "",
        lastName: contractor.ownerName.split(" ").slice(1).join(" ") || "",
        email,
        phone: "",
        dateOfBirth: "",
        address: { street: contractor.personalAddress, unit: "", city: contractor.personalCity, province: contractor.personalProvince || "BC", postalCode: contractor.personalPostalCode },
        mailingAddressSame: true,
        preferredContact: (contractor.preferredContact || "email") as "email" | "phone" | "text",
        emergencyContactName: contractor.emergencyContactName,
        emergencyContactPhone: contractor.emergencyContactPhone,
        howDidYouHear: "",
        referralCode: "",
        agreedToTerms: contractor.agreeTerms,
        agreedToPrivacy: contractor.agreePrivacy,
        marketingOptIn: false,
      });
      completeOnboarding();
      setSubmitted(true);
      toast.success("Application submitted!");
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg">
        {/* Success animation */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sky-500/10"
          >
            <CheckCircle2 className="h-10 w-10 text-sky-500" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-2xl font-bold"
          >
            Application Submitted!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-muted-foreground"
          >
            Thank you for applying to join My Home Plan.
          </motion.p>
        </div>

        {/* What Happens Next */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="mt-8 border-sky-500/20">
            <CardContent className="p-5 sm:p-6">
              <h3 className="mb-5 text-center text-lg font-bold">What Happens Next</h3>

              <div className="relative space-y-0">
                {whatHappensNextSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.15 }}
                      className="relative flex gap-4 pb-6 last:pb-0"
                    >
                      {/* Timeline line */}
                      {index < whatHappensNextSteps.length - 1 && (
                        <div className="absolute left-5 top-10 h-[calc(100%-10px)] w-px bg-border" />
                      )}

                      {/* Icon */}
                      <div className={cn("relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full", step.color)}>
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="pt-1">
                        <p className="text-sm font-semibold">{step.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Email confirmation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          We&apos;ll email you at <span className="font-medium text-foreground">{email}</span> within 48 hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-4"
        >
          <ShimmerButton onClick={onComplete} className="h-12 w-full text-base">
            Go to Dashboard <ArrowRight className="ml-2 inline h-4 w-4" />
          </ShimmerButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Review Your Application</h2>
      <p className="mt-2 text-center text-muted-foreground">Almost done! Review your details and submit your application.</p>

      <div className="mt-8 space-y-6">
        {/* Business Summary */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-sky-600" />
              <h3 className="text-sm font-semibold text-muted-foreground">Business Info</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Business:</span> {contractor.businessName || "Not specified"}</div>
              <div><span className="text-muted-foreground">Owner:</span> {contractor.ownerName || "Not specified"}</div>
              <div><span className="text-muted-foreground">Type:</span> {contractor.businessType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</div>
              <div><span className="text-muted-foreground">Experience:</span> {contractor.yearsInBusiness} years</div>
              <div><span className="text-muted-foreground">Employees:</span> {contractor.employeeCount}</div>
              {contractor.website && (
                <div><span className="text-muted-foreground">Website:</span> {contractor.website}</div>
              )}
              {contractor.businessNumber && (
                <div><span className="text-muted-foreground">Business #:</span> {contractor.businessNumber}</div>
              )}
              {contractor.gstNumber && (
                <div><span className="text-muted-foreground">GST #:</span> {contractor.gstNumber}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Insurance Summary */}
        {(contractor.insuranceProvider || contractor.wcbAccountNumber) && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-sky-600" />
                <h3 className="text-sm font-semibold text-muted-foreground">Insurance & WCB</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {contractor.insuranceProvider && (
                  <div><span className="text-muted-foreground">Liability:</span> {contractor.insuranceProvider}</div>
                )}
                {contractor.insuranceCoverageAmount > 0 && (
                  <div><span className="text-muted-foreground">Coverage:</span> ${contractor.insuranceCoverageAmount.toLocaleString()}</div>
                )}
                {contractor.wcbAccountNumber && (
                  <div><span className="text-muted-foreground">WCB #:</span> {contractor.wcbAccountNumber}</div>
                )}
                {contractor.isBonded && (
                  <div><span className="text-muted-foreground">Bonded:</span> Yes</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Area */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-sky-600" />
              <h3 className="text-sm font-semibold text-muted-foreground">Service Area</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {contractor.serviceArea.length > 0 ? (
                contractor.serviceArea.map((city) => (
                  <Badge key={city} variant="secondary" className="bg-sky-500/10 text-sky-700 dark:text-sky-400">
                    {city}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No cities selected</span>
              )}
            </div>
            {contractor.maxTravelDistance > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">Max travel: {contractor.maxTravelDistance}km</p>
            )}
          </CardContent>
        </Card>

        {/* Services Offered */}
        <Card className="border-sky-500/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Services Offered</h3>
              <Badge className="bg-sky-500/10 text-sky-600">{servicesOfferedNames.length} services</Badge>
            </div>
            {servicesOfferedNames.length > 0 ? (
              <div className="grid grid-cols-2 gap-1.5">
                {servicesOfferedNames.map((name) => (
                  <div key={name} className="flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-500" />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No services selected</span>
            )}

            {contractor.licenses.length > 0 && (
              <>
                <Separator className="my-3" />
                <div className="flex flex-wrap gap-1.5">
                  {contractor.licenses.map((lic) => (
                    <Badge key={lic} variant="outline" className="text-xs">
                      {lic.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </>
            )}

            {(contractor.hourlyRateMin > 0 || contractor.hourlyRateMax > 0) && (
              <>
                <Separator className="my-3" />
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Rate range:</span>
                  <span className="font-medium">${contractor.hourlyRateMin} - ${contractor.hourlyRateMax}/hr</span>
                </div>
              </>
            )}

            {/* Network payout summary */}
            {Object.keys(contractor.serviceRates).some((k) => contractor.serviceRates[k] > 0) && (
              <>
                <Separator className="my-3" />
                <p className="text-xs font-medium text-muted-foreground mb-2">Network Payout per Service</p>
                <div className="space-y-1">
                  {SERVICES.filter((s) => contractor.servicesOffered.includes(s.id)).map((s) => {
                    const payout = calculateContractorPayout(s.basePrice);
                    const rate = contractor.serviceRates[s.id];
                    return (
                      <div key={s.id} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{s.name}</span>
                        <div className="flex items-center gap-2">
                          {rate > 0 && (
                            <span className="text-muted-foreground line-through">${rate}</span>
                          )}
                          <span className="font-medium text-sky-600">${payout.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-sky-600" />
              <h3 className="text-sm font-semibold text-muted-foreground">Availability</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Days:</span>{" "}
                {contractor.availableDays.length > 0
                  ? contractor.availableDays.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(", ")
                  : "Not specified"}
              </div>
              <div>
                <span className="text-muted-foreground">Hours:</span>{" "}
                {contractor.availableHours.length > 0
                  ? contractor.availableHours.map((h) => h.charAt(0).toUpperCase() + h.slice(1)).join(", ")
                  : "Not specified"}
              </div>
              <div><span className="text-muted-foreground">Capacity:</span> {contractor.jobsPerWeek} jobs/week</div>
              <div><span className="text-muted-foreground">Equipment:</span> {contractor.hasOwnEquipment ? "Own equipment" : "No equipment"}</div>
              <div>
                <span className="text-muted-foreground">Vehicle:</span>{" "}
                {contractor.vehicleType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email for application */}
        <Card className={cn(shaking && "animate-shake")}>
          <CardContent className="p-5">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Contact Email</h3>
            <div className="space-y-1.5">
              <RequiredLabel>Email Address</RequiredLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                placeholder="you@yourbusiness.com"
                className={cn("h-11 transition-colors duration-200", errors.email && "ring-2 ring-red-500 border-red-500")}
              />
              <FieldError message={errors.email} />
              <p className="text-xs text-muted-foreground">We&apos;ll send application updates to this email.</p>
            </div>
          </CardContent>
        </Card>

        <ShimmerButton onClick={handleSubmit} className="h-12 w-full text-base" disabled={saving}>
          {saving ? <><Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> Submitting...</> : <>Submit Application <Sparkles className="ml-2 inline h-4 w-4" /></>}
        </ShimmerButton>
        <p className="text-center text-xs text-muted-foreground">Your application will be reviewed within 48 hours.</p>
      </div>
    </div>
  );
}
