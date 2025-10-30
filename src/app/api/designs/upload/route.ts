import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

if (!process.env.DO_SPACES_ACCESS_KEY || !process.env.DO_SPACES_SECRET_KEY) {
  throw new Error(
    "Missing DigitalOcean Spaces credentials in environment variables"
  );
}

const s3Client = new S3Client({
  endpoint: "https://sfo3.digitaloceanspaces.com", // Change to your region
  region: "sfo3", // Change to your region
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
  },
});

export async function POST(request: Request) {
  try {
    const { fileName, fileType, fileTypeCategory } = await request.json();

    if (!fileName || !fileType || !fileTypeCategory) {
      return new NextResponse("Missing fileName, fileType, or fileTypeCategory", {
        status: 400,
      });
    }

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
        "application/octet-stream",
      ],
      PDF: ["application/pdf"],
      IMAGE: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      FLOOR_PLAN: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
      ],
      FILE: ["application/pdf"],
      EXCEL: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    };

    if (!allowedFileTypesByCategory[fileTypeCategory]?.includes(fileType)) {
      return new NextResponse("Unsupported file type for this category", {
        status: 400,
      });
    }

    const fileExtension = fileName.split(".").pop();
    const key = `${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: key,
      ContentType: fileType,
      ACL: "public-read",
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    const url = `https://sfo3.digitaloceanspaces.com/${process.env.DO_SPACES_BUCKET}/${key}`;

    return NextResponse.json({ presignedUrl, url, originalFileName: fileName }, { status: 200 });
  } catch (error) {
    console.error("Error creating signed URL:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}