import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import {
  s3Client,
  getDoSpacesPublicUrl,
  DO_SPACES_BUCKET_NAME,
} from "@/lib/do-spaces";

export async function POST(request: NextRequest) {
  try {
    const { fileName, contentType } = await request.json();

    if (!fileName || !contentType) {
      return new NextResponse("Missing fileName or contentType", { status: 400 });
    }

    const fileExtension = fileName.split(".").pop();
    const key = `${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: DO_SPACES_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      ACL: "public-read",
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    const fileUrl = getDoSpacesPublicUrl(key);


    return NextResponse.json({ presignedUrl, url: fileUrl, originalFileName: fileName }, { status: 200 });
  } catch (error) {
    console.error("Error creating presigned URL:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}