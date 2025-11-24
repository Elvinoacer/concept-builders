import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

// Configure route to handle large file uploads
export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';

const s3Client = new S3Client({
  endpoint: `https://sfo3.digitaloceanspaces.com`,
  region: "sfo3",
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
      return new NextResponse("Missing fileName or fileType", { status: 400 });
    }

    const fileKey = `uploads/${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: fileKey,
      ContentType: fileType,
      ACL: "public-read",
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 7200,
    }); // URL expires in 2 hours to support large file uploads

    const publicUrl = `https://${process.env.DO_SPACES_BUCKET}.sfo3.digitaloceanspaces.com/${fileKey}`;

    return NextResponse.json({
      signedUrl,
      fileKey,
      publicUrl,
      originalFileName: fileName,
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return new NextResponse("Failed to generate signed URL", { status: 500 });
  }
}

// trying to upload pln file  and i get missing filename or file type from this src/app/api/upload/generate-presigned-url/route.ts
