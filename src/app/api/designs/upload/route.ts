import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  endpoint: "https://fra1.digitaloceanspaces.com", // Change to your region
  region: "fra1", // Change to your region
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
  },
});

export async function POST(request: Request) {
  try {
    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return new NextResponse("Missing fileName or fileType", { status: 400 });
    }

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: fileName,
      ContentType: fileType,
      ACL: "public-read",
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({ signedUrl }, { status: 200 });
  } catch (error) {
    console.error("Error creating signed URL:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
