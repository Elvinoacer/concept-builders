import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendCustomDesignUpdateRequestEmail } from "@/lib/emails";
import { Role } from "@/generated/prisma/client";

const s3Client = new S3Client({
  endpoint: "https://sfo3.digitaloceanspaces.com", // Change to your region
  region: "sfo3", // Change to your region
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY as string,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY as string,
  },
});

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

    // Extract file name from URL
    const urlParts = fileUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    // Delete file from DigitalOcean Spaces
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET as string,
      Key: fileName,
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
