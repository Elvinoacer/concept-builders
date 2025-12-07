import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendDesignInquiryEmail } from "@/lib/emails";
import { getAdminMessaging } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { designId, name, email, phone, inquiryType, message } = await req.json();

    if (!designId || !name || !email || !inquiryType || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Save to Database
    const inquiry = await prisma.designInquiry.create({
      data: {
        designId,
        name,
        email,
        phone: phone || "",
        inquiryType,
        message,
      },
      include: {
        design: true,
      },
    });

    // 2. Send Email to Admin
    await sendDesignInquiryEmail({
      designId: inquiry.designId,
      designName: inquiry.design.name,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      inquiryType: inquiry.inquiryType,
      message: inquiry.message,
    });

    // 3. Send Push Notification to Admin
    try {
      const adminMessaging = getAdminMessaging();
      // Fetch all admin tokens (assuming admins are users with role ADMIN)
      // For simplicity, we might just send to all tokens if we don't have a way to distinguish admin tokens easily yet,
      // OR we fetch users with role ADMIN and then their tokens.
      const adminUsers = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
      });
      
      const adminUserIds = adminUsers.map(u => u.id);
      
      const adminTokens = await prisma.deviceToken.findMany({
        where: { userId: { in: adminUserIds } },
        select: { token: true },
      });

      const tokens = adminTokens.map(t => t.token);

      if (tokens.length > 0) {
        await adminMessaging.sendEachForMulticast({
          tokens,
          notification: {
            title: "New Design Inquiry",
            body: `${name} sent a ${inquiryType.toLowerCase()} inquiry for ${inquiry.design.name}`,
          },
          data: {
            url: `/admin/inquiries/${inquiry.id}`,
            inquiryId: inquiry.id,
          },
        });
      }
    } catch (pushError) {
      console.error("Failed to send push notification:", pushError);
      // Don't fail the request if push fails
    }

    return NextResponse.json({ success: true, inquiry });
  } catch (error: any) {
    console.error("Error submitting design inquiry:", error);
    return NextResponse.json(
      { message: error.message || "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
