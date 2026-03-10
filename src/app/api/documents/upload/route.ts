import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadContractorDocument } from "@/lib/supabase/queries";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * POST /api/documents/upload
 *
 * Upload a contractor document to Supabase Storage and create a tracking record.
 *
 * Form data fields:
 *   file: File (required) - PDF, JPG, or PNG, max 10MB
 *   document_type: string (required) - one of the allowed document types
 *   expires_at?: string (optional) - ISO date string for expiry
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // ---- Auth ----
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ---- Verify contractor ----
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (!profile || profile.user_type !== "contractor") {
      return NextResponse.json(
        { error: "Only contractors can upload documents" },
        { status: 403 }
      );
    }

    // ---- Get contractor profile ----
    const { data: contractorProfile } = await supabase
      .from("contractor_profiles")
      .select("id")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!contractorProfile) {
      return NextResponse.json(
        { error: "Contractor profile not found. Complete onboarding first." },
        { status: 404 }
      );
    }

    // ---- Parse form data ----
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const documentType = formData.get("document_type") as string | null;
    const expiresAt = formData.get("expires_at") as string | null;

    if (!file || !documentType) {
      return NextResponse.json(
        { error: "Missing required fields: file, document_type" },
        { status: 400 }
      );
    }

    // ---- Validate document type ----
    const validDocTypes = [
      "business_license",
      "insurance_certificate",
      "wcb_letter",
      "background_check",
      "drivers_license",
      "other",
    ];
    if (!validDocTypes.includes(documentType)) {
      return NextResponse.json(
        { error: `Invalid document_type. Must be one of: ${validDocTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // ---- Validate file type ----
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, JPG, and PNG files are accepted." },
        { status: 400 }
      );
    }

    // ---- Validate file size ----
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // ---- Upload to Supabase Storage ----
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${contractorProfile.id}/${documentType}/${timestamp}_${sanitizedFilename}`;

    const fileBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("contractor-documents")
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file to storage. Please try again." },
        { status: 500 }
      );
    }

    // ---- Get public URL ----
    const { data: urlData } = supabase.storage
      .from("contractor-documents")
      .getPublicUrl(storagePath);

    const fileUrl = urlData.publicUrl;

    // ---- Insert document record ----
    const document = await uploadContractorDocument({
      contractor_profile_id: contractorProfile.id,
      document_type: documentType,
      file_name: file.name,
      file_url: fileUrl,
      file_size: file.size,
      expires_at: expiresAt || null,
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}
