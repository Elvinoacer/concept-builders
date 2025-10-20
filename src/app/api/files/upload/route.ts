
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  endpoint: "https://sfo3.digitaloceanspaces.com", // Change to your region
  region: "sfo3", // Change to your region
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY as string,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY as string,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("Missing file", { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read",
    });

    await s3Client.send(command);
    const fileUrl = `https://sfo3.digitaloceanspaces.com/${process.env.DO_SPACES_BUCKET}/${fileName}`;

    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
