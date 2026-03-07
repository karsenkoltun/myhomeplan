"use client";

import { Suspense, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import type { StepValidationRef } from "@/components/onboarding/shared";

// Step imports - Shared
import { StepUserType } from "@/components/onboarding/step-user-type";

// Steps - Homeowner
import { StepPersonalInfo } from "@/components/onboarding/step-personal-info";
import { StepAddressInfo } from "@/components/onboarding/step-address-info";
import { StepPropertyBasics, StepPropertyDetails } from "@/components/onboarding/step-property-info";
import { StepPropertyAccess } from "@/components/onboarding/step-property-access";
import { StepServices } from "@/components/onboarding/step-services";
import { StepServiceSpecs } from "@/components/onboarding/step-service-specs";
import { StepReview } from "@/components/onboarding/step-review";

// Steps - Contractor
import { StepContractorPersonal } from "@/components/onboarding/step-contractor-personal";
import { StepContractorBusiness } from "@/components/onboarding/step-contractor-business";
import { StepContractorInsurance } from "@/components/onboarding/step-contractor-insurance";
import { StepContractorServices } from "@/components/onboarding/step-contractor-services";
import { StepContractorServiceArea } from "@/components/onboarding/step-contractor-service-area";
import { StepContractorAvailability } from "@/components/onboarding/step-contractor-availability";
import { StepContractorReferences } from "@/components/onboarding/step-contractor-references";
import { StepContractorAgreements } from "@/components/onboarding/step-contractor-agreements";
import { StepContractorRates } from "@/components/onboarding/step-contractor-rates";

// Steps - Strata
import { StepStrataInfo } from "@/components/onboarding/step-strata-info";
import { StepStrataProperty } from "@/components/onboarding/step-strata-property";
import { StepStrataOperations } from "@/components/onboarding/step-strata-operations";
import { StepStrataCurrentProviders } from "@/components/onboarding/step-strata-current-providers";
import { StepStrataCoverage } from "@/components/onboarding/step-strata-coverage";
import { StepStrataServices } from "@/components/onboarding/step-strata-services";
import { StepStrataReview } from "@/components/onboarding/step-strata-review";

// Steps - Property Manager
import { StepPMCompanyInfo } from "@/components/onboarding/step-pm-company-info";
import { StepPMInsurance } from "@/components/onboarding/step-pm-insurance";
import { StepPMContacts } from "@/components/onboarding/step-pm-contacts";
import { StepPMPortfolio } from "@/components/onboarding/step-pm-portfolio";
import { StepPMProperties } from "@/components/onboarding/step-pm-properties";
import { StepPMServices } from "@/components/onboarding/step-pm-services";
import { StepPMBilling } from "@/components/onboarding/step-pm-billing";
import { StepPMReview } from "@/components/onboarding/step-pm-review";

import { useUserStore, type UserType } from "@/stores/user-store";
import { usePlanStore } from "@/stores/plan-store";

// --- Step Arrays ---

const homeownerSteps = [
  "user-type",
  "personal-info",
  "address-info",
  "property-basics",
  "property-details",
  "property-access",
  "services",
  "service-specs",
  "review",
] as const;

const contractorSteps = [
  "user-type",
  "contractor-personal",
  "contractor-business",
  "contractor-insurance",
  "contractor-services",
  "contractor-rates",
  "contractor-service-area",
  "contractor-availability",
  "contractor-references",
  "contractor-agreements",
  "review",
] as const;

const strataSteps = [
  "user-type",
  "strata-info",
  "strata-property",
  "strata-operations",
  "strata-current-providers",
  "strata-coverage",
  "strata-services",
  "strata-review",
] as const;

const pmSteps = [
  "user-type",
  "pm-company-info",
  "pm-insurance",
  "pm-contacts",
  "pm-portfolio",
  "pm-properties",
  "pm-services",
  "pm-billing",
  "pm-review",
] as const;

function getSteps(userType: UserType | null) {
  if (userType === "strata") return strataSteps;
  if (userType === "contractor") return contractorSteps;
  if (userType === "property-manager") return pmSteps;
  return homeownerSteps;
}

// Steps that have their own submit button (no nav buttons shown)
const TERMINAL_STEPS = new Set(["user-type", "review", "strata-review", "pm-review"]);

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
};

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userType, setUserType, onboardingStep, setOnboardingStep } = useUserStore();
  const { selectedServices } = usePlanStore();

  // Refs for step validation
  const personalInfoRef = useRef<StepValidationRef>(null);
  const addressInfoRef = useRef<StepValidationRef>(null);
  const propertyBasicsRef = useRef<StepValidationRef>(null);
  const propertyDetailsRef = useRef<StepValidationRef>(null);
  const servicesRef = useRef<StepValidationRef>(null);
  const contractorPersonalRef = useRef<StepValidationRef>(null);
  const strataInfoRef = useRef<StepValidationRef>(null);
  const strataPropertyRef = useRef<StepValidationRef>(null);
  const strataCoverageRef = useRef<StepValidationRef>(null);
  const strataServicesRef = useRef<StepValidationRef>(null);
  const pmCompanyInfoRef = useRef<StepValidationRef>(null);

  // Set user type from URL param
  useEffect(() => {
    const typeParam = searchParams.get("type") as UserType | null;
    if (typeParam && ["homeowner", "contractor", "strata", "property-manager"].includes(typeParam)) {
      setUserType(typeParam);
      if (onboardingStep === 0) setOnboardingStep(1);
    }
  }, [searchParams, setUserType, setOnboardingStep, onboardingStep]);

  const steps = getSteps(userType);
  const currentStepName = steps[onboardingStep] || "user-type";

  const validateCurrentStep = useCallback((): boolean => {
    switch (currentStepName) {
      case "personal-info":
        return personalInfoRef.current?.validate() ?? true;
      case "address-info":
        return addressInfoRef.current?.validate() ?? true;
      case "property-basics":
        return propertyBasicsRef.current?.validate() ?? true;
      case "property-details":
        return propertyDetailsRef.current?.validate() ?? true;
      case "services":
        return servicesRef.current?.validate() ?? true;
      case "contractor-personal":
        return contractorPersonalRef.current?.validate() ?? true;
      case "strata-info":
        return strataInfoRef.current?.validate() ?? true;
      case "strata-property":
        return strataPropertyRef.current?.validate() ?? true;
      case "strata-coverage":
        return strataCoverageRef.current?.validate() ?? true;
      case "strata-services":
        return strataServicesRef.current?.validate() ?? true;
      case "pm-company-info":
        return pmCompanyInfoRef.current?.validate() ?? true;
      default:
        return true;
    }
  }, [currentStepName]);

  const goNext = useCallback(() => {
    if (!validateCurrentStep()) return;
    if (onboardingStep < steps.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    }
  }, [onboardingStep, steps.length, setOnboardingStep, validateCurrentStep]);

  const goBack = useCallback(() => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1);
    }
  }, [onboardingStep, setOnboardingStep]);

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setOnboardingStep(1);
  };

  const handleComplete = () => {
    router.push("/account");
  };

  const isTerminal = TERMINAL_STEPS.has(currentStepName);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isTerminal) {
        goNext();
      }
      if (e.key === "Escape" && onboardingStep > 0) {
        goBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goBack, isTerminal, onboardingStep]);

  const renderStep = () => {
    switch (currentStepName) {
      // Shared
      case "user-type":
        return <StepUserType onSelect={handleUserTypeSelect} />;

      // Homeowner
      case "personal-info":
        return <StepPersonalInfo ref={personalInfoRef} />;
      case "address-info":
        return <StepAddressInfo ref={addressInfoRef} />;
      case "property-basics":
        return <StepPropertyBasics ref={propertyBasicsRef} />;
      case "property-details":
        return <StepPropertyDetails ref={propertyDetailsRef} />;
      case "property-access":
        return <StepPropertyAccess />;
      case "services":
        return <StepServices ref={servicesRef} />;
      case "service-specs":
        return <StepServiceSpecs />;

      // Contractor
      case "contractor-personal":
        return <StepContractorPersonal ref={contractorPersonalRef} />;
      case "contractor-business":
        return <StepContractorBusiness />;
      case "contractor-insurance":
        return <StepContractorInsurance />;
      case "contractor-services":
        return <StepContractorServices />;
      case "contractor-rates":
        return <StepContractorRates />;
      case "contractor-service-area":
        return <StepContractorServiceArea />;
      case "contractor-availability":
        return <StepContractorAvailability />;
      case "contractor-references":
        return <StepContractorReferences />;
      case "contractor-agreements":
        return <StepContractorAgreements />;

      // Strata
      case "strata-info":
        return <StepStrataInfo ref={strataInfoRef} />;
      case "strata-property":
        return <StepStrataProperty ref={strataPropertyRef} />;
      case "strata-operations":
        return <StepStrataOperations />;
      case "strata-current-providers":
        return <StepStrataCurrentProviders />;
      case "strata-coverage":
        return <StepStrataCoverage ref={strataCoverageRef} />;
      case "strata-services":
        return <StepStrataServices ref={strataServicesRef} />;
      case "strata-review":
        return <StepStrataReview onComplete={handleComplete} />;

      // Property Manager
      case "pm-company-info":
        return <StepPMCompanyInfo ref={pmCompanyInfoRef} />;
      case "pm-insurance":
        return <StepPMInsurance />;
      case "pm-contacts":
        return <StepPMContacts />;
      case "pm-portfolio":
        return <StepPMPortfolio />;
      case "pm-properties":
        return <StepPMProperties />;
      case "pm-services":
        return <StepPMServices />;
      case "pm-billing":
        return <StepPMBilling />;
      case "pm-review":
        return <StepPMReview onComplete={handleComplete} />;

      // Shared review (homeowner + contractor)
      case "review":
        return <StepReview onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Progress */}
      {onboardingStep > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <OnboardingProgress currentStep={onboardingStep} totalSteps={steps.length} />
        </motion.div>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait" custom={1}>
        <motion.div
          key={currentStepName}
          custom={1}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      {!isTerminal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10 flex items-center justify-between"
        >
          <Button variant="ghost" onClick={goBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button onClick={goNext} className="gap-2">
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {!isTerminal && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Press Enter to continue, Escape to go back
        </p>
      )}
    </div>
  );
}
