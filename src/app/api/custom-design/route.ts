import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { sendCustomDesignRequestEmail } from "@/lib/emails";
import { Role } from "@/generated/prisma/client";

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

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string | null;
    const designType = formData.get("designType") as string;
    const description = formData.get("description") as string;
    const budget = formData.get("budget") as string | null;
    const files = formData.getAll("files") as File[];

    if (!name || !email || !designType || !description) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const uploadedFileUrls: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileExtension = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExtension}`;

        const command = new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET as string,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
          ACL: "public-read",
        });

        await s3Client.send(command);
        const fileUrl = `https://sfo3.digitaloceanspaces.com/${process.env.DO_SPACES_BUCKET}/${fileName}`;
        uploadedFileUrls.push(fileUrl);
      }
    }

    const customDesignRequest = await prisma.customDesignRequest.create({
      data: {
        name,
        email,
        phone,
        designType,
        description,
        budget,
        attachments: uploadedFileUrls,
      },
    });

    // Send email to admin
    await sendCustomDesignRequestEmail(customDesignRequest);

    // Create notification for admin
    const admin = await prisma.user.findFirst({
      where: { role: Role.ADMIN },
    });

    if (admin) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: "New Custom Design Request",
          description: `A new custom design request has been submitted by ${name}`,
          icon: "Paperclip",
        },
      });

      // Send Push Notification
      try {
        const { getAdminMessaging } = await import("@/lib/firebase-admin");
        const adminMessaging = getAdminMessaging();
        
        const adminTokens = await prisma.deviceToken.findMany({
          where: { userId: admin.id },
          select: { token: true },
        });

        const tokens = adminTokens.map(t => t.token);

        if (tokens.length > 0) {
          await adminMessaging.sendEachForMulticast({
            tokens,
            notification: {
              title: "New Custom Design Request",
              body: `${name} submitted a request for ${designType}`,
            },
            data: {
              url: `/admin/custom-design-requests/${customDesignRequest.id}`,
              requestId: customDesignRequest.id,
            },
          });
        }
      } catch (pushError) {
        console.error("Failed to send push notification:", pushError);
      }
    }

    return NextResponse.json(customDesignRequest, { status: 201 });
  } catch (error) {
    console.error("Error submitting custom design request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
