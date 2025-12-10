import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CustomDesignRequestStatus, Role } from "@/generated/prisma";
import { sendCustomDesignRequestStatusUpdateEmail } from "@/lib/emails";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== Role.ADMIN) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!status || !Object.values(CustomDesignRequestStatus).includes(status)) {
      return new NextResponse("Invalid status provided", { status: 400 });
    }

    const updatedRequest = await prisma.customDesignRequest.update({
      where: { id },
      data: { status },
    });

    // Find the client user to send notification and email
    const clientUser = await prisma.user.findUnique({
      where: { email: updatedRequest.email },
    });

    if (clientUser) {
      // Create notification for client
      await prisma.notification.create({
        data: {
          userId: clientUser.id,
          title: "Custom Design Request Status Update",
          description: `Your custom design request #${updatedRequest.id.substring(0, 8)} status has been updated to ${status}.`,
          icon: "Info",
        },
      });

      // Send email to client
      await sendCustomDesignRequestStatusUpdateEmail(updatedRequest, clientUser.email);
    }

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (error) {
    console.error("Error updating custom design request status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
