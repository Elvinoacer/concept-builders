import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
// Ensure you have these environment variables set
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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

    if (!S3_BUCKET_NAME) {
      console.error("S3_BUCKET_NAME environment variable is not set.");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
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

    // Sanitize file name to remove special characters
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "");

    const key = `designs/${uuidv4()}/${sanitizedFileName}`;

    const putCommand = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, putCommand, {
      expiresIn: 60 * 5, // 5 minutes
    });

    const fileUrl = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({
      signedUrl,
      fileUrl,
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
