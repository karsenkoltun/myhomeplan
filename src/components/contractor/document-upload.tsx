"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  Check,
  X,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import type { Database } from "@/lib/supabase/types";

type ContractorDocument =
  Database["public"]["Tables"]["contractor_documents"]["Row"];

type DocumentType = ContractorDocument["document_type"];

interface DocumentConfig {
  type: DocumentType;
  label: string;
  required: boolean;
  hasExpiry: boolean;
}

const DOCUMENT_TYPES: DocumentConfig[] = [
  { type: "business_license", label: "Business License", required: true, hasExpiry: false },
  { type: "insurance_certificate", label: "Insurance Certificate", required: true, hasExpiry: true },
  { type: "wcb_letter", label: "WCB Coverage Letter", required: true, hasExpiry: true },
  { type: "background_check", label: "Background Check Consent", required: true, hasExpiry: false },
  { type: "drivers_license", label: "Driver's License", required: false, hasExpiry: false },
];

const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-transparent">
          <Clock className="mr-1 h-3 w-3" />
          Pending Review
        </Badge>
      );
    case "approved":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-transparent">
          <Check className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-transparent">
          <X className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      );
    case "expired":
      return (
        <Badge className="bg-orange-500/15 text-orange-600 dark:text-orange-400 border-transparent">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Expired
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <Upload className="mr-1 h-3 w-3" />
          Not Uploaded
        </Badge>
      );
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DocumentUploadProps {
  contractorProfileId: string;
  onUploadComplete?: () => void;
}

export function DocumentUpload({
  contractorProfileId,
  onUploadComplete,
}: DocumentUploadProps) {
  const [documents, setDocuments] = useState<ContractorDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [expiryDates, setExpiryDates] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchDocuments = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("contractor_documents")
        .select("*")
        .eq("contractor_profile_id", contractorProfileId)
        .order("uploaded_at", { ascending: false });

      if (fetchError) throw fetchError;
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

  function getDocumentForType(type: DocumentType): ContractorDocument | null {
    // Return the most recent document of this type
    return documents.find((d) => d.document_type === type) ?? null;
  }

  function canUpload(doc: ContractorDocument | null): boolean {
    if (!doc) return true;
    return doc.status === "rejected" || doc.status === "expired";
  }

  async function handleUpload(type: DocumentType, file: File) {
    setError(null);

    // Validate file type
    const validMimes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!validMimes.includes(file.type)) {
      setError("Invalid file type. Only PDF, JPG, and PNG files are accepted.");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 10MB.");
      return;
    }

    setUploading(type);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("document_type", type);

      const expiryDate = expiryDates[type];
      if (expiryDate) {
        formData.append("expires_at", expiryDate);
      }

      setUploadProgress(30);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(80);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      setUploadProgress(100);

      // Refresh documents list
      await fetchDocuments();
      onUploadComplete?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(message);
    } finally {
      setUploading(null);
      setUploadProgress(0);
    }
  }

  function handleFileSelect(type: DocumentType) {
    const input = fileInputRefs.current[type];
    if (input) {
      input.value = "";
      input.click();
    }
  }

  function handleFileChange(type: DocumentType, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(type, file);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Required Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        <div className="space-y-3">
          {DOCUMENT_TYPES.map((config) => {
            const doc = getDocumentForType(config.type);
            const showUpload = canUpload(doc);
            const isUploading = uploading === config.type;

            return (
              <div
                key={config.type}
                className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">
                      {config.label}
                    </p>
                    {config.required ? (
                      <span className="text-xs font-medium text-red-500">Required</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Optional</span>
                    )}
                  </div>

                  {doc && (
                    <div className="mt-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(doc.status)}
                        <span className="truncate text-xs text-muted-foreground">
                          {doc.file_name} ({formatFileSize(doc.file_size)})
                        </span>
                      </div>
                      {doc.expires_at && (
                        <p className="text-xs text-muted-foreground">
                          Expires: {new Date(doc.expires_at).toLocaleDateString("en-CA")}
                        </p>
                      )}
                      {doc.status === "rejected" && doc.rejection_reason && (
                        <p className="text-xs text-red-500">
                          Reason: {doc.rejection_reason}
                        </p>
                      )}
                    </div>
                  )}

                  {!doc && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      No document uploaded yet
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {config.hasExpiry && showUpload && (
                    <input
                      type="date"
                      value={expiryDates[config.type] || ""}
                      onChange={(e) =>
                        setExpiryDates((prev) => ({
                          ...prev,
                          [config.type]: e.target.value,
                        }))
                      }
                      className="h-8 rounded-md border bg-background px-2 text-xs text-foreground"
                      placeholder="Expiry date"
                    />
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={(el) => {
                      fileInputRefs.current[config.type] = el;
                    }}
                    type="file"
                    accept={ACCEPTED_TYPES}
                    className="hidden"
                    onChange={(e) => handleFileChange(config.type, e)}
                  />

                  {showUpload && (
                    <Button
                      size="sm"
                      variant={doc ? "outline" : "default"}
                      disabled={!!uploading}
                      onClick={() => handleFileSelect(config.type)}
                      className="gap-1.5"
                    >
                      {isUploading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Upload className="h-3 w-3" />
                      )}
                      {doc ? "Re-upload" : "Upload"}
                    </Button>
                  )}

                  {doc && doc.file_url && doc.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      asChild
                    >
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="h-3 w-3" />
                        View
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          Accepted formats: PDF, JPG, PNG. Maximum file size: 10MB.
          Documents will be reviewed by our team within 1-2 business days.
        </p>
      </CardContent>
    </Card>
  );
}
