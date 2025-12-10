import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  const { invoiceId } = await params;

  try {
    // Simulating a database lookup
    const order = await prisma.order.findUnique({
      where: { id: invoiceId },
      include: {
        items: {
          include: {
            design: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      // If no order is found, return a 404 error
      return new NextResponse("Invoice not found", { status: 404 });
    }

    const invoiceData = {
      id: order.id,
      invoiceNumber: `INV-${order.id.slice(0, 8).toUpperCase()}`,
      date: order.createdAt.toISOString(),
      dueDate: new Date(
        new Date(order.createdAt).setDate(
          new Date(order.createdAt).getDate() + 30
        )
      ).toISOString(),
      status: order.status,
      user: {
        name: order.user.name,
        email: order.user.email,
      },
      items: order.items.map((item) => ({
        id: item.id,
        name: item.design.name,
        description: item.selectedFileType,
        quantity: item.quantity,
        rate: item.price,
      })),
      subtotal: order.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
      taxRate: 0, // Assuming no tax for now
      tax: 0,
      total: order.total,
    };

    return NextResponse.json(invoiceData);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
