import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { purchaseId: string } }
) {
  const { purchaseId } = params;

  try {
    const purchase = await prisma.order.findUnique({
      where: { id: purchaseId },
      include: {
        items: {
          include: {
            design: {
              include: {
                files: true,
              },
            },
          },
        },
        user: true,
      },
    });

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    return NextResponse.json(purchase);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
