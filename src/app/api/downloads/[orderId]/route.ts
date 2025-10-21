import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSignedUrlForFiles } from "@/lib/do-spaces";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const files = order.items.flatMap((item) => item.design.files);
    const signedUrls = await getSignedUrlForFiles(files.map((file) => file.url));

    return NextResponse.json(signedUrls);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
