"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wrench, CalendarClock, ShieldCheck } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

interface StrataServiceProvidersProps {
  currentProviders: Record<string, string> | null;
  contractEndDates: Record<string, string> | null;
}

function getContractStatus(endDate: string): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  className: string;
} {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: "Expired",
      variant: "destructive",
      className: "",
    };
  }
  if (diffDays < 30) {
    return {
      label: `${diffDays}d left`,
      variant: "destructive",
      className: "",
    };
  }
  if (diffDays <= 90) {
    return {
      label: `${diffDays}d left`,
      variant: "outline",
      className: "border-amber-500/50 text-amber-600 dark:text-amber-400",
    };
  }
  return {
    label: "Active",
    variant: "outline",
    className: "border-emerald-500/50 text-emerald-600 dark:text-emerald-400",
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function StrataServiceProviders({
  currentProviders,
  contractEndDates,
}: StrataServiceProvidersProps) {
  const providers = currentProviders ?? {};
  const endDates = contractEndDates ?? {};
  const categories = Object.keys(providers);

  return (
    <FadeIn delay={0.25}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Current Service Providers</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Wrench className="mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No service providers on file
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Provider information will appear here once added
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {categories.map((category, i) => {
                const providerName = providers[category];
                const endDate = endDates[category];
                const status = endDate ? getContractStatus(endDate) : null;

                return (
                  <div key={category}>
                    {i > 0 && <Separator />}
                    <div className="flex items-center justify-between gap-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">{category}</p>
                        <p className="truncate text-sm font-medium">{providerName}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        {endDate && (
                          <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                            <CalendarClock className="h-3 w-3" />
                            <span>{formatDate(endDate)}</span>
                          </div>
                        )}
                        {status ? (
                          <Badge
                            variant={status.variant}
                            className={status.className}
                          >
                            {status.label}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">No date</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  );
}
