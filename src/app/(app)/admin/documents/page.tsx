"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import {
  Loader2,
  ArrowLeft,
  FileText,
  Check,
  X,
  Clock,
  AlertTriangle,
  Filter,
  ExternalLink,
} from "lucide-react";

type DocumentStatus = "pending" | "approved" | "rejected" | "expired";

interface DocumentWithContractor {
  id: string;
  contractor_profile_id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  file_size: number;
  status: DocumentStatus;
  expires_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
  uploaded_at: string;
  contractor_profiles: {
    business_name: string;
    owner_name: string;
    profile_id: string;
  } | null;
}

const STATUS_FILTERS: { label: string; value: DocumentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Expired", value: "expired" },
];

const DOC_TYPE_LABELS: Record<string, string> = {
  business_license: "Business License",
  insurance_certificate: "Insurance Certificate",
  wcb_letter: "WCB Coverage Letter",
  background_check: "Background Check",
  drivers_license: "Driver's License",
  other: "Other",
};

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-xs font-medium text-yellow-600 dark:text-yellow-400">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </span>
      );
    case "approved":
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <Check className="mr-1 h-3 w-3" />
          Approved
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
          <X className="mr-1 h-3 w-3" />
          Rejected
        </span>
      );
    case "expired":
      return (
        <span className="inline-flex items-center rounded-full bg-orange-500/15 px-2.5 py-0.5 text-xs font-medium text-orange-600 dark:text-orange-400">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Expired
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-zinc-500/15 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
          {status}
        </span>
      );
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminDocumentsPage() {
  const { user, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<DocumentWithContractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DocumentStatus | "all">("pending");
  const [updating, setUpdating] = useState<string | null>(null);
  const [rejectionInput, setRejectionInput] = useState<Record<string, string>>({});
  const [showRejectInput, setShowRejectInput] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      let query = supabase
        .from("contractor_documents")
        .select("*, contractor_profiles(business_name, owner_name, profile_id)")
        .order("uploaded_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setDocuments((data as DocumentWithContractor[]) ?? []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (authLoading || !user) return;
    fetchDocuments();
  }, [user, authLoading, fetchDocuments]);

  async function handleApprove(documentId: string) {
    setUpdating(documentId);
    try {
      const response = await fetch("/api/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          status: "approved",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to approve");
      }

      // Update local state
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === documentId
            ? { ...d, status: "approved" as DocumentStatus, reviewed_at: new Date().toISOString() }
            : d
        )
      );
    } catch (err) {
      console.error("Approve error:", err);
    } finally {
      setUpdating(null);
    }
  }

  async function handleReject(documentId: string) {
    const reason = rejectionInput[documentId]?.trim();
    if (!reason) return;

    setUpdating(documentId);
    try {
      const response = await fetch("/api/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          status: "rejected",
          rejectionReason: reason,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reject");
      }

      // Update local state
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === documentId
            ? {
                ...d,
                status: "rejected" as DocumentStatus,
                rejection_reason: reason,
                reviewed_at: new Date().toISOString(),
              }
            : d
        )
      );
      setShowRejectInput(null);
      setRejectionInput((prev) => ({ ...prev, [documentId]: "" }));
    } catch (err) {
      console.error("Reject error:", err);
    } finally {
      setUpdating(null);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <FadeIn>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Document Review
            </h1>
            <p className="text-sm text-muted-foreground">
              {documents.length} document{documents.length !== 1 ? "s" : ""}{" "}
              {filter !== "all" ? `(${filter})` : ""}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={0.1}>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Documents List */}
      {documents.length === 0 ? (
        <FadeIn delay={0.2}>
          <Card className="rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium text-muted-foreground">
                No documents found
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                {filter !== "all"
                  ? `No documents with status "${filter}"`
                  : "No documents have been uploaded yet"}
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <StaggerContainer className="space-y-3">
          {/* Table Header - Desktop */}
          <div className="hidden rounded-xl bg-muted/50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:grid lg:grid-cols-[1.5fr_1.2fr_1fr_0.8fr_0.8fr_1.5fr]">
            <span>Contractor</span>
            <span>Document Type</span>
            <span>Uploaded</span>
            <span>Size</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {documents.map((doc) => {
            const isRejectMode = showRejectInput === doc.id;

            return (
              <StaggerItem key={doc.id}>
                <Card className="rounded-2xl overflow-hidden">
                  <CardContent className="p-5">
                    {/* Mobile layout */}
                    <div className="space-y-3 lg:hidden">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground">
                            {doc.contractor_profiles?.business_name || "Unknown"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {doc.contractor_profiles?.owner_name}
                          </p>
                        </div>
                        {getStatusBadge(doc.status)}
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <Badge variant="secondary">
                          {DOC_TYPE_LABELS[doc.document_type] || doc.document_type}
                        </Badge>
                        <span className="text-muted-foreground">
                          {formatFileSize(doc.file_size)}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Uploaded{" "}
                        {new Date(doc.uploaded_at).toLocaleDateString("en-CA", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>

                      {doc.expires_at && (
                        <p className="text-xs text-muted-foreground">
                          Expires: {new Date(doc.expires_at).toLocaleDateString("en-CA")}
                        </p>
                      )}

                      {doc.rejection_reason && (
                        <p className="text-xs text-red-500">
                          Rejection reason: {doc.rejection_reason}
                        </p>
                      )}

                      {/* Mobile actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-1.5"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View File
                          </a>
                        </Button>

                        {doc.status === "pending" && !isRejectMode && (
                          <>
                            <Button
                              size="sm"
                              disabled={updating === doc.id}
                              onClick={() => handleApprove(doc.id)}
                              className="gap-1.5"
                            >
                              {updating === doc.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowRejectInput(doc.id)}
                              className="gap-1.5 text-red-600 hover:bg-red-500/10 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>

                      {isRejectMode && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Reason for rejection..."
                            value={rejectionInput[doc.id] || ""}
                            onChange={(e) =>
                              setRejectionInput((prev) => ({
                                ...prev,
                                [doc.id]: e.target.value,
                              }))
                            }
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={
                                updating === doc.id ||
                                !rejectionInput[doc.id]?.trim()
                              }
                              onClick={() => handleReject(doc.id)}
                              className="gap-1.5"
                            >
                              {updating === doc.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                              Confirm Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setShowRejectInput(null);
                                setRejectionInput((prev) => ({
                                  ...prev,
                                  [doc.id]: "",
                                }));
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden items-center lg:grid lg:grid-cols-[1.5fr_1.2fr_1fr_0.8fr_0.8fr_1.5fr]">
                      <div className="min-w-0 pr-2">
                        <p className="truncate font-semibold text-foreground">
                          {doc.contractor_profiles?.business_name || "Unknown"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {doc.contractor_profiles?.owner_name}
                        </p>
                      </div>

                      <div>
                        <Badge variant="secondary" className="text-xs">
                          {DOC_TYPE_LABELS[doc.document_type] || doc.document_type}
                        </Badge>
                        {doc.expires_at && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Exp: {new Date(doc.expires_at).toLocaleDateString("en-CA")}
                          </p>
                        )}
                      </div>

                      <span className="text-sm text-muted-foreground">
                        {new Date(doc.uploaded_at).toLocaleDateString("en-CA", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>

                      <span className="text-sm text-muted-foreground">
                        {formatFileSize(doc.file_size)}
                      </span>

                      <span>{getStatusBadge(doc.status)}</span>

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" asChild>
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View
                          </a>
                        </Button>

                        {doc.status === "pending" && !isRejectMode && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updating === doc.id}
                              onClick={() => handleApprove(doc.id)}
                              className="h-8 gap-1.5 text-xs"
                            >
                              {updating === doc.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowRejectInput(doc.id)}
                              className="h-8 gap-1.5 text-xs text-red-600 hover:bg-red-500/10 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Desktop rejection input */}
                    {isRejectMode && (
                      <div className="mt-3 hidden items-center gap-2 border-t pt-3 lg:flex">
                        <input
                          type="text"
                          placeholder="Reason for rejection..."
                          value={rejectionInput[doc.id] || ""}
                          onChange={(e) =>
                            setRejectionInput((prev) => ({
                              ...prev,
                              [doc.id]: e.target.value,
                            }))
                          }
                          className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && rejectionInput[doc.id]?.trim()) {
                              handleReject(doc.id);
                            }
                            if (e.key === "Escape") {
                              setShowRejectInput(null);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={
                            updating === doc.id || !rejectionInput[doc.id]?.trim()
                          }
                          onClick={() => handleReject(doc.id)}
                          className="h-8 gap-1.5 text-xs"
                        >
                          {updating === doc.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setShowRejectInput(null);
                            setRejectionInput((prev) => ({
                              ...prev,
                              [doc.id]: "",
                            }));
                          }}
                          className="h-8 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}

                    {/* Desktop rejection reason display */}
                    {doc.rejection_reason && !isRejectMode && (
                      <div className="mt-2 hidden text-xs text-red-500 lg:block">
                        Rejection reason: {doc.rejection_reason}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}
    </div>
  );
}
