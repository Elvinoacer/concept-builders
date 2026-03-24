import { OrderStatus } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      items,
      amount,
      paymentGateway,
      paymentId,
      discountCode,
      discountAmount,
      discountId,
    } = await req.json();

    if (
      !items ||
      items.length === 0 ||
      amount === undefined ||
      !paymentGateway ||
      !paymentId
    ) {
      return NextResponse.json(
        { message: "Missing required order details" },
        { status: 400 }
      );
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        amount: parseFloat(amount),
        paymentGateway,
        paymentId,
        status: OrderStatus.PAID, // Assuming payment is successful at this point
        discountCode: discountCode || null,
        discountAmount: discountAmount || null,
        discountId: discountId || null,
        items: {
          create: items.map((item: any) => ({
            designId: item.designId,
            quantity: item.quantity,
            selectedFileTypes: item.selectedFileTypes || [],
            selectedExtras: item.selectedExtras || {},
          })),
        },
      },
      include: {
        items: true, // Include order items to process them
      },
    });

    // Process delivered files for each order item
    for (const orderItem of order.items) {
      const designDetails = await prisma.design.findUnique({
        where: { id: orderItem.designId },
        include: {
          architecturalDesign: {
            include: { pdfFiles: true, cadFiles: true },
          },
          structuralDesign: {
            include: { pdfFiles: true, cadFiles: true },
          },
          billOfQuantities: {
            include: { excelFiles: true, pdfFiles: true },
          },
          packageOptions: {
            include: { file: true },
          },
        },
      });

      if (!designDetails) {
        console.warn(`Design with ID ${orderItem.designId} not found for order item ${orderItem.id}`);
        continue;
      }

      const filesToDeliver: string[] = []; // Store file IDs to be delivered

      // Add files from architectural design if selected
      if (orderItem.selectedFileTypes.includes("ARCHITECTURAL_PDF")) {
        designDetails.architecturalDesign?.pdfFiles.forEach(file => filesToDeliver.push(file.id));
      }
      if (orderItem.selectedFileTypes.includes("ARCHITECTURAL_CAD")) {
        designDetails.architecturalDesign?.cadFiles.forEach(file => filesToDeliver.push(file.id));
      }

      // Add files from structural design if selected
      if (orderItem.selectedFileTypes.includes("STRUCTURAL_PDF")) {
        designDetails.structuralDesign?.pdfFiles.forEach(file => filesToDeliver.push(file.id));
      }
      if (orderItem.selectedFileTypes.includes("STRUCTURAL_CAD")) {
        designDetails.structuralDesign?.cadFiles.forEach(file => filesToDeliver.push(file.id));
      }

      // Add files from bill of quantities if selected
      if (orderItem.selectedFileTypes.includes("BILL_OF_QUANTITIES_EXCEL")) {
        designDetails.billOfQuantities?.excelFiles.forEach(file => filesToDeliver.push(file.id));
      }
      if (orderItem.selectedFileTypes.includes("BILL_OF_QUANTITIES_PDF")) {
        designDetails.billOfQuantities?.pdfFiles.forEach(file => filesToDeliver.push(file.id));
      }

      // Add files from selected package options
      if (Array.isArray(orderItem.selectedExtras)) {
        for (const extra of orderItem.selectedExtras) {
          if (extra.type === "PACKAGE_OPTION" && extra.packageOptionId) {
            const packageOption = designDetails.packageOptions.find(
              (po) => po.id === extra.packageOptionId
            );
            if (packageOption?.file) {
              filesToDeliver.push(packageOption.file.id);
            }
          }
        }
      }

      // Create DeliveredFile records for all identified files
      if (filesToDeliver.length > 0) {
        await prisma.deliveredFile.createMany({
          data: filesToDeliver.map(fileId => ({
            orderItemId: orderItem.id,
            fileId: fileId,
          })),
          skipDuplicates: true, // Prevent errors if a file is somehow added twice
        });
      }
    }

    // If a discount was applied, increment its usage count
    if (discountId) {
      await prisma.discount.update({
        where: { id: discountId },
        data: {
          uses: {
            increment: 1,
          },
        },
      });
    }

    // TODO: Clear user's cart after successful order

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
