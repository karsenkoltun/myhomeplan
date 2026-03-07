"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { ShieldCheck, HardHat, Building2 } from "lucide-react";
import type { Database } from "@/lib/supabase/types";

type ContractorProfile =
  Database["public"]["Tables"]["contractor_profiles"]["Row"];

function getExpiryStatus(expiryDate: string | null): {
  label: string;
  color: string;
} {
  if (!expiryDate) {
    return { label: "Not provided", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
  }

  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: "Expired", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" };
  }
  if (diffDays <= 30) {
    return { label: "Expiring soon", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" };
  }
  return { label: "Active", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" };
}

function getCoverageStatus(
  startDate: string | null,
  endDate: string | null
): { label: string; color: string } {
  if (!startDate && !endDate) {
    return { label: "Not provided", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
  }

  const now = new Date();
  const end = endDate ? new Date(endDate) : null;

  if (end) {
    const diffMs = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: "Expired", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" };
    }
    if (diffDays <= 30) {
      return { label: "Expiring soon", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" };
    }
  }

  return { label: "Active", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" };
}

function formatDate(date: string | null): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number | null | undefined): string {
  if (!amount) return "-";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ContractorCredentials({
  contractor,
}: {
  contractor: ContractorProfile;
}) {
  const insuranceStatus = getExpiryStatus(contractor.insurance_expiry);
  const wcbStatus = getCoverageStatus(
    contractor.wcb_coverage_start,
    contractor.wcb_coverage_end
  );

  const hasInsurance =
    contractor.insurance_provider || contractor.insurance_policy_number;
  const hasWcb =
    contractor.wcb_account_number ||
    contractor.wcb_coverage_start ||
    contractor.wcb_coverage_end;
  const hasBusiness =
    contractor.business_number || contractor.gst_number;

  return (
    <FadeIn>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Credentials & Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Insurance Card */}
            <StaggerItem>
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-semibold">Insurance</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      hasInsurance
                        ? insuranceStatus.color
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }
                  >
                    {hasInsurance ? insuranceStatus.label : "Not provided"}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Provider</p>
                    <p className="font-medium">
                      {contractor.insurance_provider || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Policy #</p>
                    <p className="font-medium">
                      {contractor.insurance_policy_number || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Coverage Amount
                    </p>
                    <p className="font-medium">
                      {formatCurrency(contractor.insurance_coverage_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">
                      {formatDate(contractor.insurance_expiry)}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* WCB Card */}
            <StaggerItem>
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardHat className="h-4 w-4 text-orange-600" />
                    <p className="text-sm font-semibold">WCB Coverage</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      hasWcb
                        ? wcbStatus.color
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }
                  >
                    {hasWcb ? wcbStatus.label : "Not provided"}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Account #</p>
                    <p className="font-medium">
                      {contractor.wcb_account_number || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Coverage Start
                    </p>
                    <p className="font-medium">
                      {formatDate(contractor.wcb_coverage_start)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Coverage End
                    </p>
                    <p className="font-medium">
                      {formatDate(contractor.wcb_coverage_end)}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* Business Card */}
            <StaggerItem>
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-emerald-600" />
                    <p className="text-sm font-semibold">Business</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      hasBusiness
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }
                  >
                    {hasBusiness ? "On file" : "Not provided"}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Business Number
                    </p>
                    <p className="font-medium">
                      {contractor.business_number || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">GST Number</p>
                    <p className="font-medium">
                      {contractor.gst_number || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
