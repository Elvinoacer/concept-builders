import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import formidable from "formidable";
import fs from "fs";

if (!process.env.DO_SPACES_ACCESS_KEY || !process.env.DO_SPACES_SECRET_KEY) {
  throw new Error(
    "Missing DigitalOcean Spaces credentials in environment variables"
  );
}

const s3Client = new S3Client({
  endpoint: "https://sfo3.digitaloceanspaces.com",
  region: "sfo3",
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
  },
});

export async function POST(request: NextRequest) {
  try {
    const form = formidable({});
    const [fields, files] = await form.parse(request as any);

    const file = files.file[0];
    const fileTypeCategory = fields.fileTypeCategory[0];

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const fileExtension = file.originalFilename.split(".").pop();
    const key = `${uuidv4()}.${fileExtension}`;

    const fileStream = fs.createReadStream(file.filepath);

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: key,
      Body: fileStream,
      ContentType: file.mimetype,
      ACL: "public-read",
    });

    await s3Client.send(command);

    const url = `https://sfo3.digitaloceanspaces.com/${process.env.DO_SPACES_BUCKET}/${key}`;

    return NextResponse.json({ url, type: fileTypeCategory, originalFileName: file.originalFilename }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
