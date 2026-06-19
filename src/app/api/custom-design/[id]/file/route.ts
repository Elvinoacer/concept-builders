import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendCustomDesignUpdateRequestEmail } from "@/lib/emails";
import { Role } from "@/generated/prisma/client";
import { s3Client, DO_SPACES_BUCKET_NAME, getR2KeyFromUrl } from "@/lib/r2-client";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { fileUrl } = await request.json();

    if (!fileUrl) {
      return new NextResponse("Missing fileUrl in request body", { status: 400 });
    }

    // Extract the full object key from the URL (handles CDN and R2 URLs)
    const key = getR2KeyFromUrl(fileUrl);
    const fileName = key.split('/').pop() ?? key;

    // Delete file from Cloudflare R2
    const deleteCommand = new DeleteObjectCommand({
      Bucket: DO_SPACES_BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(deleteCommand);

    // Remove file URL from attachments in database
    const updatedRequest = await prisma.customDesignRequest.update({
      where: { id: params.id },
      data: {
        attachments: {
          set: existingRequest.attachments.filter((url) => url !== fileUrl),
        },
      },
    });

    // Send email to admin about the update
    await sendCustomDesignUpdateRequestEmail(updatedRequest, `File deleted: ${fileName}`);

    // Create notification for admin
    const admin = await prisma.user.findFirst({
      where: { role: Role.ADMIN },
    });

    if (admin) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: "Custom Design Request File Deleted",
          description: `A file (${fileName}) was deleted from custom design request #${updatedRequest.id.substring(0, 8)} by ${updatedRequest.name}.`,
          icon: "Trash",
        },
      });
    }

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error) {
    console.error("Error deleting file from custom design request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
