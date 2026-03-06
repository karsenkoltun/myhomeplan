"use client";

import { useState } from "react";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, type LucideIcon, Scissors, Snowflake, Thermometer, Bug, Hammer, Wrench, Zap, Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair, Building2, MapPin, Clock, FileSearch, ShieldCheck, Phone, Briefcase, ArrowRight } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { usePropertyStore } from "@/stores/property-store";
import { usePlanStore } from "@/stores/plan-store";
import { SERVICES, PLAN_DISCOUNTS } from "@/data/services";
import { calculateServicePrice } from "@/lib/pricing";
import { SpringNumber, ShimmerButton } from "@/components/ui/motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label>
      {children} <span className="text-red-500">*</span>
    </Label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

export function StepReview({ onComplete }: { onComplete: () => void }) {
  const { userType } = useUserStore();

  if (userType === "contractor") {
    return <ContractorReview onComplete={onComplete} />;
  }

  return <HomeownerStrataReview onComplete={onComplete} />;
}

function HomeownerStrataReview({ onComplete }: { onComplete: () => void }) {
  const { setAccount, completeOnboarding } = useUserStore();
  const { property, serviceSpecs } = usePropertyStore();
  const { selectedServices, planInterval, setPlanInterval } = usePlanStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = () => {
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
              <Label className="text-xs text-muted-foreground">Payment Frequency</Label>
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

        <ShimmerButton onClick={handleSubmit} className="h-12 w-full text-base">
          Complete Setup <Sparkles className="ml-2 inline h-4 w-4" />
        </ShimmerButton>
        <p className="text-center text-xs text-muted-foreground">No payment required today. This is a simulated signup.</p>
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
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = () => {
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
    setAccount({
      firstName: contractor.ownerName.split(" ")[0] || "",
      lastName: contractor.ownerName.split(" ").slice(1).join(" ") || "",
      email,
      phone: "",
      dateOfBirth: "",
      address: { street: "", unit: "", city: "", province: "BC", postalCode: "" },
      mailingAddressSame: true,
      preferredContact: "email",
      emergencyContactName: "",
      emergencyContactPhone: "",
      howDidYouHear: "",
      referralCode: "",
      agreedToTerms: contractor.agreeTerms,
      agreedToPrivacy: true,
      marketingOptIn: false,
    });
    completeOnboarding();
    setSubmitted(true);
    toast.success("Application submitted!");
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
            </div>
          </CardContent>
        </Card>

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

        <ShimmerButton onClick={handleSubmit} className="h-12 w-full text-base">
          Submit Application <Sparkles className="ml-2 inline h-4 w-4" />
        </ShimmerButton>
        <p className="text-center text-xs text-muted-foreground">Your application will be reviewed within 48 hours.</p>
      </div>
    </div>
  );
}
