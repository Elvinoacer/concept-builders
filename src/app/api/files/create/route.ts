import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { FileType } from "@/generated/prisma";

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileTypeCategory } = await req.json();

    if (!fileName || !fileTypeCategory) {
      return new NextResponse("Missing fileName or fileTypeCategory", { status: 400 });
    }
    
    const key = `designs/${Date.now()}-${fileName}`;
    const publicUrl = `https://${process.env.DO_SPACES_BUCKET}.sfo3.digitaloceanspaces.com/${key}`;

    const newFile = await prisma.file.create({
      data: {
        name: fileName,
        url: publicUrl,
        type: fileTypeCategory as FileType,
        status: 'UPLOADING',
        fileIdentifier: key,
      },
    });

    return NextResponse.json({ fileId: newFile.id, publicUrl, key });
  } catch (error) {
    console.error("Error creating file record:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
