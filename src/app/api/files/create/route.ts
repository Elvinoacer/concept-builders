import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { FileType } from "@/generated/prisma";

// Configure route for large file metadata handling
export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileTypeCategory, key, url } = await req.json();

    if (!fileName || !fileTypeCategory || !key || !url) {
      return new NextResponse("Missing required fields: fileName, fileTypeCategory, key, url", { status: 400 });
    }
    
    const newFile = await prisma.file.create({
      data: {
        name: fileName,
        url: url,
        type: fileTypeCategory as FileType,
        status: 'UPLOADING', // Status is now UPLOADING until upload is confirmed
        fileIdentifier: key,
      },
    });

    return NextResponse.json({ fileId: newFile.id });
  } catch (error) {
    console.error("Error creating file record:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
