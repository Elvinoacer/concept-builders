import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { sendCustomDesignRequestEmail } from "@/lib/emails";
import { Role } from "@/generated/prisma/client";
import {
  s3Client,
  getDoSpacesPublicUrl,
  DO_SPACES_BUCKET_NAME,
} from "@/lib/do-spaces";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string | null;
    const designType = formData.get("designType") as string;
    const description = formData.get("description") as string;
    const budget = formData.get("budget") as string | null;
    const referenceDesignId = formData.get("referenceDesignId") as
      | string
      | null;
    const referenceImageUrl = formData.get("referenceImage") as string | null;
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

    const customDesignRequest = await prisma.customDesignRequest.create({
      data: {
        name,
        email,
        phone,
        designType,
        description,
        budget,
        referenceDesignId,
        referenceImageUrl,
        attachments: uploadedFileUrls,
      },
    });

    // Send email to admin (non-fatal — DB save already succeeded)
    try {
      await sendCustomDesignRequestEmail(customDesignRequest);
    } catch (emailError) {
      console.error("Custom design email failed:", emailError);
    }

    // Create notification for admin
    const admin = await prisma.user.findFirst({
      where: { role: Role.ADMIN },
    });

    if (admin) {
      try {
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

          const tokens = adminTokens.map((t) => t.token);

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
      } catch (notificationError) {
        console.error("Notification creation failed:", notificationError);
      }
    }

    return NextResponse.json(customDesignRequest, { status: 201 });
  } catch (error) {
    console.error("Error submitting custom design request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
