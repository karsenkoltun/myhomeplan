"use client";

import { Suspense, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { StepUserType } from "@/components/onboarding/step-user-type";
import { StepPropertyBasics, StepPropertyDetails } from "@/components/onboarding/step-property-info";
import type { StepValidationRef } from "@/components/onboarding/step-property-info";
import { StepServices } from "@/components/onboarding/step-services";
import { StepServiceSpecs } from "@/components/onboarding/step-service-specs";
import { StepReview } from "@/components/onboarding/step-review";
import { StepContractorBusiness } from "@/components/onboarding/step-contractor-business";
import { StepContractorServices } from "@/components/onboarding/step-contractor-services";
import { StepContractorAvailability } from "@/components/onboarding/step-contractor-availability";
import { StepContractorReferences } from "@/components/onboarding/step-contractor-references";
import { StepStrataInfo } from "@/components/onboarding/step-strata-info";
import { StepStrataProperty } from "@/components/onboarding/step-strata-property";
import { StepStrataCoverage } from "@/components/onboarding/step-strata-coverage";
import { StepStrataServices } from "@/components/onboarding/step-strata-services";
import { StepStrataReview } from "@/components/onboarding/step-strata-review";
import { useUserStore, type UserType } from "@/stores/user-store";
import { usePlanStore } from "@/stores/plan-store";

const homeownerSteps = [
  "user-type",
  "property-basics",
  "property-details",
  "services",
  "service-specs",
  "review",
] as const;

const strataSteps = [
  "user-type",
  "strata-info",
  "strata-property",
  "strata-coverage",
  "strata-services",
  "strata-review",
] as const;

const contractorSteps = [
  "user-type",
  "contractor-business",
  "contractor-services",
  "contractor-availability",
  "contractor-references",
  "review",
] as const;

function getSteps(userType: UserType | null) {
  if (userType === "strata") return strataSteps;
  if (userType === "contractor") return contractorSteps;
  return homeownerSteps;
}

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
  const propertyBasicsRef = useRef<StepValidationRef>(null);
  const propertyDetailsRef = useRef<StepValidationRef>(null);
  const servicesRef = useRef<StepValidationRef>(null);
  const strataInfoRef = useRef<StepValidationRef>(null);
  const strataPropertyRef = useRef<StepValidationRef>(null);
  const strataCoverageRef = useRef<StepValidationRef>(null);
  const strataServicesRef = useRef<StepValidationRef>(null);

  // Set user type from URL param
  useEffect(() => {
    const typeParam = searchParams.get("type") as UserType | null;
    if (typeParam && ["homeowner", "contractor", "strata"].includes(typeParam)) {
      setUserType(typeParam);
      if (onboardingStep === 0) setOnboardingStep(1);
    }
  }, [searchParams, setUserType, setOnboardingStep, onboardingStep]);

  const steps = getSteps(userType);
  const currentStepName = steps[onboardingStep] || "user-type";

  const validateCurrentStep = useCallback((): boolean => {
    switch (currentStepName) {
      case "property-basics":
        return propertyBasicsRef.current?.validate() ?? true;
      case "property-details":
        return propertyDetailsRef.current?.validate() ?? true;
      case "services":
        return servicesRef.current?.validate() ?? true;
      case "strata-info":
        return strataInfoRef.current?.validate() ?? true;
      case "strata-property":
        return strataPropertyRef.current?.validate() ?? true;
      case "strata-coverage":
        return strataCoverageRef.current?.validate() ?? true;
      case "strata-services":
        return strataServicesRef.current?.validate() ?? true;
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && currentStepName !== "user-type" && currentStepName !== "review") {
        goNext();
      }
      if (e.key === "Escape" && onboardingStep > 0) {
        goBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goBack, currentStepName, onboardingStep]);

  const renderStep = () => {
    switch (currentStepName) {
      case "user-type":
        return <StepUserType onSelect={handleUserTypeSelect} />;
      case "property-basics":
        return <StepPropertyBasics ref={propertyBasicsRef} />;
      case "property-details":
        return <StepPropertyDetails ref={propertyDetailsRef} />;
      case "services":
        return <StepServices ref={servicesRef} />;
      case "service-specs":
        return <StepServiceSpecs />;
      case "contractor-business":
        return <StepContractorBusiness />;
      case "contractor-services":
        return <StepContractorServices />;
      case "contractor-availability":
        return <StepContractorAvailability />;
      case "contractor-references":
        return <StepContractorReferences />;
      case "strata-info":
        return <StepStrataInfo ref={strataInfoRef} />;
      case "strata-property":
        return <StepStrataProperty ref={strataPropertyRef} />;
      case "strata-coverage":
        return <StepStrataCoverage ref={strataCoverageRef} />;
      case "strata-services":
        return <StepStrataServices ref={strataServicesRef} />;
      case "strata-review":
        return <StepStrataReview onComplete={handleComplete} />;
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
      {currentStepName !== "user-type" && currentStepName !== "review" && (
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

      {currentStepName !== "user-type" && currentStepName !== "review" && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Press Enter to continue, Escape to go back
        </p>
      )}
    </div>
  );
}
