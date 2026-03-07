"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { usePropertyStore } from "@/stores/property-store";
import { FileSignature } from "lucide-react";

export function StepContractorAgreements() {
  const { contractor, setContractor } = usePropertyStore();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
          <FileSignature className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Agreements</h2>
        <p className="mt-2 text-center text-muted-foreground">Please review and accept the following to complete your application.</p>
      </div>

      <div className="mt-8 space-y-6">
        <Card className="border-sky-500/20">
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-5 text-sm font-semibold">Verification & Safety</h3>
            <div className="space-y-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={contractor.agreedToCriminalCheck}
                  onCheckedChange={(v) => setContractor({ agreedToCriminalCheck: v === true })}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium">I consent to a criminal background check</p>
                  <p className="text-xs text-muted-foreground">
                    My Home Plan conducts criminal record checks on all contractor partners for homeowner safety.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={contractor.agreedToDrugTest}
                  onCheckedChange={(v) => setContractor({ agreedToDrugTest: v === true })}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium">I consent to drug testing if required</p>
                  <p className="text-xs text-muted-foreground">
                    Random or for-cause drug testing may be required for certain service types.
                  </p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className="border-sky-500/20">
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-5 text-sm font-semibold">Quality & Standards</h3>
            <div className="space-y-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={contractor.agreeQualityStandards}
                  onCheckedChange={(v) => setContractor({ agreeQualityStandards: v === true })}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium">I agree to My Home Plan quality standards</p>
                  <p className="text-xs text-muted-foreground">
                    You commit to maintaining high-quality work, timely communication, and professional conduct on every job.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={contractor.agreeBackgroundCheck}
                  onCheckedChange={(v) => setContractor({ agreeBackgroundCheck: v === true })}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium">I agree to reference verification</p>
                  <p className="text-xs text-muted-foreground">
                    My Home Plan will contact the references you provided to verify your work history.
                  </p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className="border-sky-500/20">
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-5 text-sm font-semibold">Legal Agreements</h3>
            <div className="space-y-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={contractor.agreeTerms}
                  onCheckedChange={(v) => setContractor({ agreeTerms: v === true })}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium">I agree to the Terms of Service</p>
                  <p className="text-xs text-muted-foreground">
                    By checking this box, you agree to our{" "}
                    <span className="text-sky-600 underline">Terms of Service</span>.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={contractor.agreePrivacy}
                  onCheckedChange={(v) => setContractor({ agreePrivacy: v === true })}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium">I agree to the Privacy Policy</p>
                  <p className="text-xs text-muted-foreground">
                    By checking this box, you agree to our{" "}
                    <span className="text-sky-600 underline">Privacy Policy</span>.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={contractor.agreeIndependentContractor}
                  onCheckedChange={(v) => setContractor({ agreeIndependentContractor: v === true })}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium">I acknowledge I am an independent contractor</p>
                  <p className="text-xs text-muted-foreground">
                    You understand that you are operating as an independent contractor, not an employee of My Home Plan. You are responsible for your own taxes, insurance, and business obligations.
                  </p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
