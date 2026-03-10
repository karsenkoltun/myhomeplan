"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Check,
  AlertTriangle,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { Database } from "@/lib/supabase/types";

type ContractorDocument =
  Database["public"]["Tables"]["contractor_documents"]["Row"];

interface RequiredDocument {
  type: string;
  label: string;
}

const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  { type: "business_license", label: "Business License" },
  { type: "insurance_certificate", label: "Insurance Certificate" },
  { type: "wcb_letter", label: "WCB Coverage Letter" },
  { type: "background_check", label: "Background Check Consent" },
];

interface DocumentStatusCardProps {
  contractorProfileId: string;
}

export function DocumentStatusCard({ contractorProfileId }: DocumentStatusCardProps) {
  const [documents, setDocuments] = useState<ContractorDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contractor_documents")
        .select("*")
        .eq("contractor_profile_id", contractorProfileId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setDocuments(data ?? []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  }, [contractorProfileId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Analyze document statuses
  const docsByType: Record<string, ContractorDocument> = {};
  documents.forEach((doc) => {
    // Keep the most recent per type
    if (!docsByType[doc.document_type]) {
      docsByType[doc.document_type] = doc;
    }
  });

  let uploadedCount = 0;
  let approvedCount = 0;
  const missingDocs: string[] = [];
  const expiredDocs: string[] = [];
  const pendingDocs: string[] = [];
  const rejectedDocs: string[] = [];

  REQUIRED_DOCUMENTS.forEach((req) => {
    const doc = docsByType[req.type];
    if (!doc) {
      missingDocs.push(req.label);
      return;
    }

    uploadedCount++;
    switch (doc.status) {
      case "approved":
        approvedCount++;
        break;
      case "pending":
        pendingDocs.push(req.label);
        break;
      case "rejected":
        rejectedDocs.push(req.label);
        break;
      case "expired":
        expiredDocs.push(req.label);
        break;
    }
  });

  const totalRequired = REQUIRED_DOCUMENTS.length;
  const progressValue = (approvedCount / totalRequired) * 100;

  // Determine overall status color
  let statusColor = "text-red-500";
  let progressBarClass = "bg-red-500";
  if (approvedCount === totalRequired) {
    statusColor = "text-emerald-500";
    progressBarClass = "bg-emerald-500";
  } else if (uploadedCount === totalRequired && rejectedDocs.length === 0 && expiredDocs.length === 0) {
    statusColor = "text-yellow-500";
    progressBarClass = "bg-yellow-500";
  } else if (uploadedCount > 0) {
    statusColor = "text-yellow-500";
    progressBarClass = "bg-yellow-500";
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-5 w-5 text-primary" />
          Document Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className={statusColor}>
              {approvedCount} of {totalRequired} required documents approved
            </span>
            <span className="text-muted-foreground">{Math.round(progressValue)}%</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressBarClass}`}
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>

        {/* Status items */}
        {approvedCount === totalRequired ? (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
            <Check className="h-4 w-4" />
            All required documents approved
          </div>
        ) : (
          <div className="space-y-2">
            {missingDocs.length > 0 && (
              <div className="flex items-start gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-medium">Missing:</p>
                  <ul className="mt-1 list-inside list-disc">
                    {missingDocs.map((doc) => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {pendingDocs.length > 0 && (
              <div className="flex items-start gap-2 rounded-lg bg-yellow-500/10 p-3 text-sm text-yellow-600 dark:text-yellow-400">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-medium">Pending review:</p>
                  <ul className="mt-1 list-inside list-disc">
                    {pendingDocs.map((doc) => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {rejectedDocs.length > 0 && (
              <div className="flex items-start gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-medium">Rejected - re-upload needed:</p>
                  <ul className="mt-1 list-inside list-disc">
                    {rejectedDocs.map((doc) => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {expiredDocs.length > 0 && (
              <div className="flex items-start gap-2 rounded-lg bg-orange-500/10 p-3 text-sm text-orange-600 dark:text-orange-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-medium">Expired - re-upload needed:</p>
                  <ul className="mt-1 list-inside list-disc">
                    {expiredDocs.map((doc) => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Link to full upload page */}
        <Button variant="outline" size="sm" className="w-full gap-1.5" asChild>
          <Link href="/account/contractor/documents">
            <FileText className="h-3 w-3" />
            {approvedCount === totalRequired ? "Manage Documents" : "Upload Documents"}
            <ChevronRight className="ml-auto h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
