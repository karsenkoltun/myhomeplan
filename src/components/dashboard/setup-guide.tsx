"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Home, HardHat, Building2, Briefcase,
  CheckCircle2, ChevronRight, MapPin, Calendar as CalendarIcon,
  Loader2, CreditCard, ClipboardList, ArrowRight, Mail,
} from "lucide-react";
import { GlowCard } from "@/components/ui/motion";
import { useAuth } from "@/components/auth/auth-provider";
import { updateProfile } from "@/lib/supabase/queries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { UserType } from "@/stores/user-store";

export interface SetupProgress {
  profile_completed: boolean;
  user_type_selected: boolean;
  details_completed: boolean;
  plan_configured: boolean;
  plan_activated: boolean;
}

const DEFAULT_PROGRESS: SetupProgress = {
  profile_completed: false,
  user_type_selected: false,
  details_completed: false,
  plan_configured: false,
  plan_activated: false,
};

interface SetupGuideProps {
  profile: Record<string, unknown>;
  setupProgress: SetupProgress;
  onProgressUpdate: (progress: SetupProgress) => void;
}

const userTypeOptions = [
  {
    type: "homeowner" as UserType,
    title: "Homeowner",
    description: "I want a maintenance plan for my home",
    icon: Home,
    accent: "bg-primary/10 text-primary border-primary/20",
  },
  {
    type: "contractor" as UserType,
    title: "Contractor",
    description: "I want to join the contractor network",
    icon: HardHat,
    accent: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  },
  {
    type: "strata" as UserType,
    title: "Strata Corporation",
    description: "I need building maintenance services",
    icon: Building2,
    accent: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    type: "property-manager" as UserType,
    title: "Property Manager",
    description: "I manage properties for clients",
    icon: Briefcase,
    accent: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  },
];

export function SetupGuide({ profile, setupProgress, onProgressUpdate }: SetupGuideProps) {
  const progress = setupProgress || DEFAULT_PROGRESS;
  const userType = profile.user_type as string;
  const isHomeowner = userType === "homeowner";
  const emailVerified = !!(profile as Record<string, unknown>).email_confirmed_at;

  // Calculate completion
  const steps = [
    { key: "profile_completed", done: progress.profile_completed },
    { key: "user_type_selected", done: progress.user_type_selected },
    { key: "details_completed", done: progress.details_completed },
    ...(isHomeowner && progress.user_type_selected
      ? [
          { key: "plan_configured", done: progress.plan_configured },
          { key: "plan_activated", done: progress.plan_activated },
        ]
      : []),
  ];
  const completedCount = steps.filter((s) => s.done).length;
  const totalSteps = steps.length;
  const allDone = completedCount === totalSteps;

  if (allDone) return null;

  // Find current step (first incomplete)
  const currentStepKey = steps.find((s) => !s.done)?.key || "profile_completed";

  return (
    <div className="mb-8">
      {/* Email verification banner */}
      {!emailVerified && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <Mail className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Please verify your email address. Check your inbox for a confirmation link.
          </p>
        </div>
      )}

      {/* Progress header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Set Up Your Account</h2>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {totalSteps} steps completed
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {Math.round((completedCount / totalSteps) * 100)}% complete
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(completedCount / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Step cards */}
      <div className="space-y-3">
        {/* Step 1: Complete profile */}
        <SetupStepProfileComplete
          done={progress.profile_completed}
          active={currentStepKey === "profile_completed"}
          profile={profile}
          onComplete={(updatedProfile) => {
            const newProgress = { ...progress, profile_completed: true };
            onProgressUpdate(newProgress);
          }}
        />

        {/* Step 2: Choose account type */}
        <SetupStepUserType
          done={progress.user_type_selected}
          active={currentStepKey === "user_type_selected"}
          profile={profile}
          onComplete={(type) => {
            const newProgress = { ...progress, user_type_selected: true };
            onProgressUpdate(newProgress);
          }}
        />

        {/* Step 3: Type-specific details */}
        <SetupStepDetails
          done={progress.details_completed}
          active={currentStepKey === "details_completed"}
          userType={userType}
          profile={profile}
        />

        {/* Step 4: Build plan (homeowner only) */}
        {(isHomeowner || (progress.user_type_selected && userType === "homeowner")) && (
          <SetupStepPlan
            done={progress.plan_configured}
            active={currentStepKey === "plan_configured"}
          />
        )}

        {/* Step 5: Activate plan (homeowner only) */}
        {(isHomeowner || (progress.user_type_selected && userType === "homeowner")) && (
          <SetupStepActivate
            done={progress.plan_activated}
            active={currentStepKey === "plan_activated"}
            planConfigured={progress.plan_configured}
          />
        )}
      </div>
    </div>
  );
}

// ---- Step wrapper ----

function StepCard({
  done,
  active,
  stepNumber,
  title,
  description,
  icon: Icon,
  children,
}: {
  done: boolean;
  active: boolean;
  stepNumber: number;
  title: string;
  description: string;
  icon: React.ElementType;
  children?: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "transition-all duration-200",
        done && "border-primary/20 bg-primary/5",
        active && !done && "border-primary/30 shadow-sm",
        !active && !done && "opacity-60"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              done
                ? "bg-primary text-primary-foreground"
                : active
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {done ? <CheckCircle2 className="h-4 w-4" /> : stepNumber}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">{title}</h3>
              {done && (
                <Badge className="bg-primary/10 text-primary text-[10px] px-1.5 py-0">
                  Done
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            {active && !done && children && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.2 }}
                className="mt-3"
              >
                {children}
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Step 1: Profile Completion ----

function SetupStepProfileComplete({
  done,
  active,
  profile,
  onComplete,
}: {
  done: boolean;
  active: boolean;
  profile: Record<string, unknown>;
  onComplete: (updatedProfile: Record<string, unknown>) => void;
}) {
  const { user } = useAuth();
  const [dateOfBirth, setDateOfBirth] = useState((profile.date_of_birth as string) || "");
  const [street, setStreet] = useState((profile.street as string) || "");
  const [city, setCity] = useState((profile.city as string) || "");
  const [province, setProvince] = useState((profile.province as string) || "BC");
  const [postalCode, setPostalCode] = useState((profile.postal_code as string) || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    if (!street.trim() || !city.trim() || !postalCode.trim()) {
      toast.error("Please fill in your address");
      return;
    }
    setSaving(true);
    try {
      await updateProfile(user.id, {
        date_of_birth: dateOfBirth || null,
        street: street.trim(),
        city: city.trim(),
        province,
        postal_code: postalCode.trim(),
        setup_progress: { ...(profile.setup_progress as SetupProgress), profile_completed: true },
      });
      toast.success("Profile updated!");
      onComplete({ ...profile, street, city, province, postal_code: postalCode });
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <StepCard
      done={done}
      active={active}
      stepNumber={1}
      title="Complete Your Profile"
      description="Add your birthday and address"
      icon={User}
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Date of Birth</Label>
          <Input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Street Address <span className="text-red-500">*</span></Label>
          <Input
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="123 Main St"
            className="h-10 text-sm"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs">City <span className="text-red-500">*</span></Label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Kelowna"
              className="h-10 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Province</Label>
            <Input value={province} onChange={(e) => setProvince(e.target.value)} className="h-10 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Postal Code <span className="text-red-500">*</span></Label>
            <Input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="V1Y 1A1"
              className="h-10 text-sm"
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} size="sm" className="w-full">
          {saving ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
          Save Profile
        </Button>
      </div>
    </StepCard>
  );
}

// ---- Step 2: Choose Account Type ----

function SetupStepUserType({
  done,
  active,
  profile,
  onComplete,
}: {
  done: boolean;
  active: boolean;
  profile: Record<string, unknown>;
  onComplete: (type: UserType) => void;
}) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleSelect = async (type: UserType) => {
    if (!user) return;
    setSaving(true);
    try {
      const currentProgress = (profile.setup_progress as SetupProgress) || DEFAULT_PROGRESS;
      await updateProfile(user.id, {
        user_type: type,
        setup_progress: { ...currentProgress, user_type_selected: true },
      });
      toast.success(`Account type set to ${type === "property-manager" ? "Property Manager" : type.charAt(0).toUpperCase() + type.slice(1)}`);
      onComplete(type);
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <StepCard
      done={done}
      active={active}
      stepNumber={2}
      title="Choose Your Account Type"
      description="Tell us how you'll use My Home Plan"
      icon={Home}
    >
      {saving ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {userTypeOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => handleSelect(opt.type)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all hover:shadow-sm",
                opt.accent
              )}
            >
              <opt.icon className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-xs font-semibold">{opt.title}</p>
                <p className="text-[10px] opacity-70">{opt.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </StepCard>
  );
}

// ---- Step 3: Type-specific details ----

function SetupStepDetails({
  done,
  active,
  userType,
  profile,
}: {
  done: boolean;
  active: boolean;
  userType: string;
  profile: Record<string, unknown>;
}) {
  const router = useRouter();

  const detailsConfig: Record<string, { title: string; description: string; href: string; cta: string }> = {
    homeowner: {
      title: "Add Your Property",
      description: "Tell us about your home so we can customize your services",
      href: "/account/property",
      cta: "Add Property",
    },
    contractor: {
      title: "Set Up Your Business",
      description: "Add your business details to join the contractor network",
      href: "/account/contractor",
      cta: "Add Business",
    },
    strata: {
      title: "Add Your Building",
      description: "Tell us about your strata property",
      href: "/account/setup?type=strata",
      cta: "Add Building",
    },
    "property-manager": {
      title: "Set Up Your Company",
      description: "Add your property management company details",
      href: "/account/setup?type=pm",
      cta: "Set Up Company",
    },
  };

  const config = detailsConfig[userType] || detailsConfig.homeowner;

  return (
    <StepCard
      done={done}
      active={active}
      stepNumber={3}
      title={config.title}
      description={config.description}
      icon={MapPin}
    >
      <Button
        onClick={() => router.push(config.href)}
        size="sm"
        className="w-full"
      >
        {config.cta} <ArrowRight className="ml-2 h-3 w-3" />
      </Button>
    </StepCard>
  );
}

// ---- Step 4: Build Plan ----

function SetupStepPlan({
  done,
  active,
}: {
  done: boolean;
  active: boolean;
}) {
  const router = useRouter();

  return (
    <StepCard
      done={done}
      active={active}
      stepNumber={4}
      title="Build Your Plan"
      description="Select the services you want for your home"
      icon={ClipboardList}
    >
      <Button
        onClick={() => router.push("/account/services")}
        size="sm"
        className="w-full"
      >
        Choose Services <ArrowRight className="ml-2 h-3 w-3" />
      </Button>
    </StepCard>
  );
}

// ---- Step 5: Activate Plan ----

function SetupStepActivate({
  done,
  active,
  planConfigured,
}: {
  done: boolean;
  active: boolean;
  planConfigured: boolean;
}) {
  const router = useRouter();

  return (
    <StepCard
      done={done}
      active={active}
      stepNumber={5}
      title="Activate Your Plan"
      description={planConfigured ? "Set up payment to start your services" : "Configure your plan first, then activate"}
      icon={CreditCard}
    >
      <Button
        onClick={() => router.push("/account/billing")}
        size="sm"
        className="w-full"
        disabled={!planConfigured}
      >
        Activate Plan <ArrowRight className="ml-2 h-3 w-3" />
      </Button>
    </StepCard>
  );
}

export function parseSetupProgress(raw: unknown): SetupProgress {
  if (typeof raw === "object" && raw !== null) return raw as SetupProgress;
  return DEFAULT_PROGRESS;
}
