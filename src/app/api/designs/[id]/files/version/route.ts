import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  endpoint: "https://fra1.digitaloceanspaces.com", // TODO: Use environment variables
  region: "fra1", // TODO: Use environment variables
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY!,
  },
});

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  try {
    const { id: designId } = params;
    const { fileIdentifier, fileName, fileType, fileTypeCategory, originalFileName } = await request.json();

    if (!fileIdentifier || !fileName || !fileType || !fileTypeCategory || !originalFileName) {
      return new NextResponse("Missing required fields for version upload", { status: 400 });
    }

    // 1. Find the current latest version and mark it as not latest
    const currentLatestFile = await prisma.file.findFirst({
      where: {
        designId: designId,
        fileIdentifier: fileIdentifier,
        isLatest: true,
      },
      orderBy: { version: "desc" },
    });

    let newVersion = 1;
    if (currentLatestFile) {
      await prisma.file.update({
        where: { id: currentLatestFile.id },
        data: { isLatest: false },
      });
      newVersion = currentLatestFile.version + 1;
    }

    // 2. Get signed URL for the new file upload
    const key = `${designId}/${fileIdentifier}/v${newVersion}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: key,
      ContentType: fileType,
      ACL: "public-read",
    });
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
      ACL: "public-read",
    });
    const publicUrl = signedUrl.split("?")[0];

    // 3. Create a new File record for the new version
    const newFile = await prisma.file.create({
      data: {
        url: publicUrl,
        type: fileTypeCategory, // Use fileTypeCategory as the enum type
        designId: designId,
        version: newVersion,
        isLatest: true,
        originalFileName: originalFileName,
        fileIdentifier: fileIdentifier,
      },
    });

    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    console.error("Error uploading new file version:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
