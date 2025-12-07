import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendInvoiceEmail } from "@/lib/emails";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; invoiceId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, invoiceId } = await params;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        projectId: projectId,
      },
      include: {
        invoiceItems: true,
      },
    });

    if (!invoice) {
      return new NextResponse("Invoice not found", { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching project invoice detail:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; invoiceId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, invoiceId } = await params;

  try {
    const body = await request.json();
    const {
      invoiceNumber,
      issueDate,
      dueDate,
      totalAmount,
      status,
      type,
      documentUrl,
      invoiceItems,
    } = body;

    const updatedInvoice = await prisma.invoice.update({
      where: {
        id: invoiceId,
        projectId: projectId,
      },
      data: {
        invoiceNumber,
        issueDate: issueDate ? new Date(issueDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
        status,
        type,
        documentUrl,
        invoiceItems: {
          deleteMany: {},
          create: invoiceItems.map((item: any) => ({
            description: item.description,
            quantity: parseInt(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
            total: parseFloat(item.total),
          })),
        },
      },
      include: {
        invoiceItems: true,
        project: { include: { user: true } }, // Include project and user to get client email
      },
    });

    // Create notification for the client
    await prisma.notification.create({
      data: {
        userId: updatedInvoice.project.userId,
        icon: "file_text", // Using a generic icon for invoice
        title: `Invoice #${updatedInvoice.invoiceNumber} Updated`,
        description: `Invoice for project '${updatedInvoice.project.name}' has been updated. Total: ${updatedInvoice.totalAmount.toFixed(2)}. Due: ${format(updatedInvoice.dueDate, "MMM dd, yyyy")}.`,
      },
    });

    // Send email to the client
    if (updatedInvoice.project.user.email && updatedInvoice.project.user.name) {
      await sendInvoiceEmail(updatedInvoice);
    }

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("Error updating project invoice:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; invoiceId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, invoiceId } = await params;

  try {
    await prisma.invoice.delete({
      where: {
        id: invoiceId,
        projectId: projectId,
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting project invoice:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
