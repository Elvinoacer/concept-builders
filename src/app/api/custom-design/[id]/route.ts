import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { sendCustomDesignRequestEmail, sendCustomDesignUpdateRequestEmail } from "@/lib/emails";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Role } from "@/generated/prisma/client";
import {
  s3Client,
  getDoSpacesPublicUrl,
  DO_SPACES_BUCKET_NAME,
} from "@/lib/r2-client";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingRequest = await prisma.customDesignRequest.findUnique({
      where: { id: params.id },
    });

    if (!existingRequest || existingRequest.email !== session.user.email) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string | null;
    const designType = formData.get("designType") as string;
    const description = formData.get("description") as string;
    const budget = formData.get("budget") as string | null;
    const existingAttachments = JSON.parse(formData.get("existingAttachments") as string || "[]");
    const newFiles = formData.getAll("newFiles") as File[];

    const uploadedFileUrls: string[] = [...existingAttachments];

    if (newFiles && newFiles.length > 0) {
      for (const file of newFiles) {
        if (file.size === 0) continue; // Skip empty files
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileExtension = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExtension}`;

        const command = new PutObjectCommand({
          Bucket: DO_SPACES_BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
          ACL: "public-read",
        });

        await s3Client.send(command);
        const fileUrl = getDoSpacesPublicUrl(fileName);
        uploadedFileUrls.push(fileUrl);
      }
    }

    const updatedRequest = await prisma.customDesignRequest.update({
      where: { id: params.id },
      data: {
        name,
        phone,
        designType,
        description,
        budget,
        attachments: uploadedFileUrls,
      },
    });

    // Send email to admin about the update
    await sendCustomDesignUpdateRequestEmail(updatedRequest);

    // Create notification for admin
    const admin = await prisma.user.findFirst({
      where: { role: Role.ADMIN },
    });

    if (admin) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: "Custom Design Request Updated",
          description: `Custom design request #${updatedRequest.id.substring(0, 8)} by ${updatedRequest.name} has been updated.`,
          icon: "Edit",
        },
      });
    }

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error) {
    console.error("Error updating custom design request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
