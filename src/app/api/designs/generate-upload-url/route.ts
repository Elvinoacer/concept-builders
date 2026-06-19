import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrlForUpload } from "@/lib/r2-client";
import { authOptions } from "../../auth/[...nextauth]/route";

// Configure route to handle large file uploads
export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';

// Ensure you have these environment variables set
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME!;

const allowedFileTypesByCategory = {
  CAD: [
    "application/acad",
    "application/dwg",
    "application/x-dwg",
    "image/vnd.dwg",
    "application/dxf",
    "image/vnd.dxf",
    "application/x-dxf",
    "application/step",
    "application/x-step",
    "application/STEP",
    "application/iges",
    "application/x-iges",
    "application/sla",
    "application/vnd.stl",
    "model/stl",
    "model/obj",
    "application/x-t-object",
    "model/3mf",
    "application/vnd.ms-pki.3mf",
    "application/octet-stream", // Often a fallback for .dwg
  ],
  PDF: ["application/pdf"],
  IMAGE: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"],
  FLOOR_PLAN: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "image/avif",
  ],
  FILE: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    ".doc",
    ".docx",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/zip",
    "application/x-zip-compressed",
    "application/octet-stream",
  ],
  EXCEL: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fileName, fileType, fileTypeCategory } = await req.json();

    if (!fileName || !fileType || !fileTypeCategory) {
      return NextResponse.json(
        { error: "fileName, fileType, and fileTypeCategory are required" },
        { status: 400 }
      );
    }

    // --- File Type Validation ---
    const allowedTypes =
      allowedFileTypesByCategory[
        fileTypeCategory as keyof typeof allowedFileTypesByCategory
      ];

    if (!allowedTypes) {
      return NextResponse.json(
        { error: `Invalid file type category: ${fileTypeCategory}` },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        {
          error: `Unsupported content type (${fileType}) for category ${fileTypeCategory}`,
        },
        { status: 400 }
      );
    }
    // --- End File Type Validation ---

    const { signedUrl, publicUrl, key } = await getSignedUrlForUpload(
      fileName,
      fileType
    );

    return NextResponse.json({
      signedUrl,
      publicUrl,
      key,
      originalFileName: fileName, // Pass back original name
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
