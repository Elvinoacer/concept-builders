import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getAdminMessaging } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, body, userIds, sendToAll } = await req.json();

    if (!title || !body) {
      return NextResponse.json(
        { message: "Title and body are required" },
        { status: 400 }
      );
    }

    let tokens: string[] = [];

    if (sendToAll) {
      const deviceTokens = await prisma.deviceToken.findMany({
        select: { token: true },
      });
      tokens = deviceTokens.map((dt: { token: string }) => dt.token);
    } else if (userIds && userIds.length > 0) {
      const deviceTokens = await prisma.deviceToken.findMany({
        where: {
          userId: {
            in: userIds,
          },
        },
        select: { token: true },
      });
      tokens = deviceTokens.map((dt: { token: string }) => dt.token);
    } else {
      return NextResponse.json(
        { message: "No recipients specified" },
        { status: 400 }
      );
    }

    if (tokens.length === 0) {
      return NextResponse.json(
        { message: "No devices found for the selected recipients" },
        { status: 404 }
      );
    }

    // Send notifications in batches of 500 (Firebase limit)
    const messaging = getAdminMessaging();
    const batchSize = 500;
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < tokens.length; i += batchSize) {
      const batchTokens = tokens.slice(i, i + batchSize);
      
      const message = {
        notification: {
          title,
          body,
        },
        tokens: batchTokens,
      };

      const response = await messaging.sendEachForMulticast(message);
      successCount += response.successCount;
      failureCount += response.failureCount;

      // Optional: Handle invalid tokens by removing them from DB
      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(batchTokens[idx]);
          }
        });
        
        // Remove failed tokens
        if (failedTokens.length > 0) {
            await prisma.deviceToken.deleteMany({
                where: {
                    token: {
                        in: failedTokens
                    }
                }
            });
        }
      }
    }

    // Create a notification record in the database for history/in-app view
    // Assuming we have a Notification model. If not, we might need to create one or skip this.
    // For now, let's assume we just send the push.

    return NextResponse.json({
      message: "Notifications sent",
      successCount,
      failureCount,
    });
  } catch (error: any) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
