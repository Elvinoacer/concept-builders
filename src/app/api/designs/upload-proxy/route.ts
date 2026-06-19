import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/r2-client";

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
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const fileTypeCategory = formData.get("fileTypeCategory") as string | null;

    if (!file) {
      return new NextResponse(JSON.stringify({ error: "No file provided" }), {
        status: 400,
      });
    }

    if (!fileTypeCategory) {
      return new NextResponse(
        JSON.stringify({ error: "No fileTypeCategory provided" }),
        {
          status: 400,
        }
      );
    }

    const allowedTypes =
      allowedFileTypesByCategory[
        fileTypeCategory as keyof typeof allowedFileTypesByCategory
      ];

    if (!allowedTypes) {
      return new NextResponse(
        JSON.stringify({
          error: `Invalid file type category: ${fileTypeCategory}`,
        }),
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(file.type)) {
      return new NextResponse(
        JSON.stringify({
          error: `Unsupported content type (${file.type}) for category ${fileTypeCategory}`,
        }),
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { publicUrl } = await uploadFile(buffer, file.name, file.type);

    return NextResponse.json({
      url: publicUrl,
      originalFileName: file.name,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(JSON.stringify({ error: message }), {
      status: 500,
    });
  }
}

