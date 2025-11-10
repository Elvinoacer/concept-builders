
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const allCount = await prisma.order.count();
    const pendingCount = await prisma.order.count({
      where: { status: "PENDING" },
    });
    const paidCount = await prisma.order.count({ where: { status: "PAID" } });
    const refundRequestedCount = await prisma.order.count({
      where: { status: "REFUND_REQUESTED" },
    });
    const refundedCount = await prisma.order.count({
      where: { status: "REFUNDED" },
    });

    return NextResponse.json({
      All: allCount,
      Pending: pendingCount,
      Paid: paidCount,
      "Refund Requested": refundRequestedCount,
      Refunded: refundedCount,
    });
  } catch (error) {
    console.error("Error fetching order status counts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
