import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendInvoiceEmail } from "@/lib/emails";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const projectId = params.projectId;

  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        invoiceItems: true,
      },
      orderBy: {
        issueDate: "desc",
      },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching project invoices:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const projectId = params.projectId;

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

    if (
      !invoiceNumber ||
      !issueDate ||
      !dueDate ||
      !totalAmount ||
      !status ||
      !type
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newInvoice = await prisma.invoice.create({
      data: {
        projectId,
        invoiceNumber,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        totalAmount: parseFloat(totalAmount),
        status,
        type,
        documentUrl,
        invoiceItems: {
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
        userId: newInvoice.project.userId,
        icon: "file_text", // Using a generic icon for invoice
        title: `New Invoice #${newInvoice.invoiceNumber}`,
        description: `A new invoice for project '${newInvoice.project.name}' has been generated. Total: ${newInvoice.totalAmount.toFixed(2)}. Due: ${format(newInvoice.dueDate, "MMM dd, yyyy")}.`,
      },
    });

    // Send email to the client
    if (newInvoice.project.user.email && newInvoice.project.user.name) {
      await sendInvoiceEmail(newInvoice);
    }

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error("Error creating project invoice:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
