import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  endpoint: "https://sfo3.digitaloceanspaces.com",
  region: "sfo3",
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY as string,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY as string,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { fileName, contentType } = await request.json();

    if (!fileName || !contentType) {
      return new NextResponse("Missing fileName or contentType", { status: 400 });
    }

    const fileExtension = fileName.split(".").pop();
    const key = `${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: key,
      ContentType: contentType,
      ACL: "public-read",
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    const fileUrl = `https://sfo3.digitaloceanspaces.com/${process.env.DO_SPACES_BUCKET}/${key}`;


    return NextResponse.json({ presignedUrl, url: fileUrl, originalFileName: fileName }, { status: 200 });
  } catch (error) {
    console.error("Error creating presigned URL:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}