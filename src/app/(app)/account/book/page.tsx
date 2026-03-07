"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { useBookingStore } from "@/stores/booking-store";
import { StepService } from "@/components/booking/step-service";
import { StepDatetime } from "@/components/booking/step-datetime";
import { StepConfirm } from "@/components/booking/step-confirm";
import { Progress } from "@/components/ui/progress";

const STEP_LABELS = ["Select Service", "Date & Time", "Confirm"];

export default function BookingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { bookingStep, reset } = useBookingStore();

  useEffect(() => {
    return () => {
      // Don't reset on unmount if we're in the middle of booking
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const progressValue = ((bookingStep + 1) / 3) * 100;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={
                i <= bookingStep ? "font-medium text-primary" : "text-muted-foreground"
              }
            >
              {label}
            </span>
          ))}
        </div>
        <Progress value={progressValue} className="mt-2" />
      </div>

      {/* Step Content */}
      {bookingStep === 0 && <StepService />}
      {bookingStep === 1 && <StepDatetime />}
      {bookingStep === 2 && <StepConfirm />}
    </div>
  );
}
