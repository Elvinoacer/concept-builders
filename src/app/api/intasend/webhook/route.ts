import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("X-IntaSend-Signature");
    const secret = process.env.INTASEND_WEBHOOK_SECRET;

    if (!secret) {
      console.error("IntaSend webhook secret is not configured.");
      return NextResponse.json({ error: "Webhook secret not configured." }, { status: 500 });
    }

    const body = await req.text();

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(body);
    const calculatedSignature = hmac.digest("hex");

    if (calculatedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 403 });
    }

    const data = JSON.parse(body);

    if (data.state === "COMPLETE") {
      const cartId = data.api_ref;
      const paymentId = data.invoice_id;

      const existingOrder = await prisma.order.findUnique({
        where: { paymentId },
      });

      if (existingOrder) {
        return NextResponse.json({ success: true });
      }

      const userCart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { items: { include: { design: true } }, discount: true }, // Include discount details
      });

      if (!userCart) {
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });
      }

      const totalAmount = userCart.items.reduce((acc, item) => {
        let itemTotal = item.design.basePrice * item.quantity;
        if (item.selectedFileType === 'pdf') {
          itemTotal += item.design.pdfPrice || 0;
        } else if (item.selectedFileType === 'cad') {
          itemTotal += item.design.cadPrice || 0;
        } else if (item.selectedFileType === 'pdf-and-cad') {
          itemTotal += item.design.pdfAndCadPrice || 0;
        }
        if (item.selectedExtras) {
          const extras = JSON.parse(item.selectedExtras as string);
          extras.forEach((extra: any) => {
            itemTotal += extra.price;
          });
        }
        return acc + itemTotal;
      }, 0);

      await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            userId: userCart.userId,
            amount: totalAmount,
            status: "PAID",
            paymentGateway: "INTASEND",
            paymentId: paymentId,
            cartId: userCart.id, // Store cartId in the order
            discountCode: userCart.discountCode || null,
            discountAmount: userCart.discountAmount || null,
            discountId: userCart.discountId || null,
          },
        });

        await tx.orderItem.createMany({
          data: userCart.items.map((item) => ({
            orderId: order.id,
            designId: item.designId,
            quantity: item.quantity,
            selectedFileType: item.selectedFileType,
            selectedPackage: item.selectedPackage,
            selectedExtras: item.selectedExtras,
          })),
        });

        if (userCart.discountId) {
          await tx.discount.update({
            where: { id: userCart.discountId },
            data: {
              uses: {
                increment: 1,
              },
            },
          });
        }

        await tx.notification.create({
          data: {
            userId: userCart.userId,
            title: "Order Created",
            description: `Your order #${order.id} has been created successfully.`,
            icon: "ShoppingCart",
          },
        });

        // Clear discount fields from the cart after successful order
        await tx.cart.update({
          where: { id: userCart.id },
          data: {
            discountCode: null,
            discountAmount: null,
            discountId: null,
          },
        });

        await tx.cart.delete({ where: { id: userCart.id } });
      });
    } else {
      console.log("Payment failed:", data);
      const cartId = data.api_ref;
      const userCart = await prisma.cart.findUnique({
        where: { id: cartId },
      });
      if (userCart) {
        await prisma.notification.create({
          data: {
            userId: userCart.userId,
            title: "Payment Failed",
            description: `Your payment for order in cart ${cartId} failed.`,
            icon: "AlertTriangle",
          },
        });
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("IntaSend webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
