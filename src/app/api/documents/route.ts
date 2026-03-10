import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getContractorDocuments,
  updateDocumentStatus,
  getPendingDocuments,
  createNotification,
} from "@/lib/supabase/queries";

/**
 * GET /api/documents
 *
 * List documents for the authenticated contractor, or all pending docs for admins.
 *
 * Query params:
 *   contractorId?: string - (admin only) filter by contractor profile ID
 *   status?: string - filter by document status
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // ---- Auth ----
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type, email")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const isAdmin = profile.email?.endsWith("@myhomeplan.ca") ?? false;
    const contractorIdParam = req.nextUrl.searchParams.get("contractorId");
    const statusFilter = req.nextUrl.searchParams.get("status");

    // ---- Admin: get all or filtered documents ----
    if (isAdmin) {
      if (statusFilter === "pending" && !contractorIdParam) {
        const documents = await getPendingDocuments();
        return NextResponse.json({ documents });
      }

      if (contractorIdParam) {
        const documents = await getContractorDocuments(contractorIdParam);
        const filtered = statusFilter
          ? documents.filter((d) => d.status === statusFilter)
          : documents;
        return NextResponse.json({ documents: filtered });
      }

      // Admin without filter: get all pending
      const documents = await getPendingDocuments();
      return NextResponse.json({ documents });
    }

    // ---- Contractor: get own documents ----
    if (profile.user_type !== "contractor") {
      return NextResponse.json(
        { error: "Only contractors and admins can access documents" },
        { status: 403 }
      );
    }

    const { data: contractorProfile } = await supabase
      .from("contractor_profiles")
      .select("id")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!contractorProfile) {
      return NextResponse.json({ documents: [] });
    }

    const documents = await getContractorDocuments(contractorProfile.id);
    const filtered = statusFilter
      ? documents.filter((d) => d.status === statusFilter)
      : documents;

    return NextResponse.json({ documents: filtered });
  } catch (error) {
    console.error("List documents error:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/documents
 *
 * Update a document's status (admin only).
 *
 * Body: {
 *   documentId: string;
 *   status: "approved" | "rejected" | "expired";
 *   rejectionReason?: string;
 * }
 */
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();

    // ---- Auth ----
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ---- Admin check ----
    const isAdmin = user.email?.endsWith("@myhomeplan.ca") ?? false;
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Only admins can review documents" },
        { status: 403 }
      );
    }

    // ---- Parse body ----
    const body = await req.json();
    const { documentId, status, rejectionReason } = body as {
      documentId: string;
      status: "approved" | "rejected" | "expired";
      rejectionReason?: string;
    };

    if (!documentId || !status) {
      return NextResponse.json(
        { error: "Missing required fields: documentId, status" },
        { status: 400 }
      );
    }

    const validStatuses = ["approved", "rejected", "expired"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    if (status === "rejected" && !rejectionReason) {
      return NextResponse.json(
        { error: "Rejection reason is required when rejecting a document" },
        { status: 400 }
      );
    }

    // ---- Update the document ----
    const document = await updateDocumentStatus(
      documentId,
      status,
      user.id,
      rejectionReason
    );

    // ---- Notify the contractor ----
    try {
      // Get the contractor's user ID from their profile
      const { data: contractorProfile } = await supabase
        .from("contractor_profiles")
        .select("profile_id, business_name")
        .eq("id", document.contractor_profile_id)
        .single();

      if (contractorProfile) {
        const docTypeLabels: Record<string, string> = {
          business_license: "Business License",
          insurance_certificate: "Insurance Certificate",
          wcb_letter: "WCB Coverage Letter",
          background_check: "Background Check",
          drivers_license: "Driver's License",
          other: "Document",
        };

        const docLabel = docTypeLabels[document.document_type] || "Document";

        if (status === "approved") {
          await createNotification({
            user_id: contractorProfile.profile_id,
            title: "Document Approved",
            message: `Your ${docLabel} has been approved.`,
            type: "document_approved",
            metadata: {
              document_id: document.id,
              document_type: document.document_type,
            },
          });
        } else if (status === "rejected") {
          await createNotification({
            user_id: contractorProfile.profile_id,
            title: "Document Rejected",
            message: `Your ${docLabel} was rejected. Reason: ${rejectionReason}. Please upload a new copy.`,
            type: "document_rejected",
            metadata: {
              document_id: document.id,
              document_type: document.document_type,
              rejection_reason: rejectionReason,
            },
          });
        }
      }
    } catch {
      // Notification failure is non-blocking
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Update document status error:", error);
    return NextResponse.json(
      { error: "Failed to update document status" },
      { status: 500 }
    );
  }
}
