import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { FileType } from "@/generated/prisma/client";
import {
  s3Client,
  getDoSpacesPublicUrl,
  DO_SPACES_BUCKET_NAME,
} from "@/lib/r2-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string; itemId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { orderId, itemId } = await params;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const fileTypeCategory = formData.get("fileTypeCategory") as string; // e.g., PDF, CAD, EXCEL, FILE

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    if (!fileTypeCategory || !Object.values(FileType).includes(fileTypeCategory as FileType)) {
      return NextResponse.json({ message: "Invalid fileTypeCategory" }, { status: 400 });
    }

    const orderItem = await prisma.orderItem.findUnique({
      where: { id: itemId },
      include: { order: true },
    });

    if (!orderItem || orderItem.orderId !== orderId) {
      return NextResponse.json({ message: "Order item not found" }, { status: 404 });
    }

    // Upload file to DigitalOcean Spaces
    const fileKey = `order-files/${orderId}/${itemId}/${uuidv4()}-${file.name}`;
    const uploadCommand = new PutObjectCommand({
      Bucket: DO_SPACES_BUCKET_NAME,
      Key: fileKey,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
      ACL: "public-read",
    });

    await s3Client.send(uploadCommand);
    const fileUrl = getDoSpacesPublicUrl(fileKey);

    // Create File record
    const newFile = await prisma.file.create({
      data: {
        name: file.name,
        url: fileUrl,
        type: fileTypeCategory as FileType,
        size: file.size,
      },
    });

    // Create DeliveredFile record
    const deliveredFile = await prisma.deliveredFile.create({
      data: {
        orderItemId: itemId,
        fileId: newFile.id,
      },
    });

    return NextResponse.json(
      { message: "File uploaded and delivered successfully", file: newFile, deliveredFile },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading file for order item:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
