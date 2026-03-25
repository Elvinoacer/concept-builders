import { client } from "@/lib/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { calculateItemTotal } from "@/lib/calculate-total";
import { validateAndApplyDiscount } from "@/lib/validate-discount";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const { discountCode } = body;

    // Fetch user cart
    const userCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            design: {
              include: {
                packageOptions: true,
              },
            },
          },
        },
      },
    });

    if (!userCart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (!userCart.items || userCart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total amount from cart items
    let calculatedTotal = userCart.items.reduce((total, item) => {
      const selectedExtras = Array.isArray(item.selectedExtras)
        ? (item.selectedExtras as Array<{ price?: number }>).map((extra) => ({
            price: typeof extra?.price === "number" ? extra.price : 0,
          }))
        : [];

      const itemForCalculation = {
        ...item,
        selectedExtras,
      };
      return total + calculateItemTotal(itemForCalculation);
    }, 0);

    if (discountCode) {
      const discountResult = await validateAndApplyDiscount(
        discountCode,
        calculatedTotal,
        userId,
      );

      if (!discountResult.valid) {
        return NextResponse.json(
          { error: discountResult.error },
          { status: 400 },
        );
      }

      calculatedTotal = discountResult.finalTotal;
    }

    if (calculatedTotal <= 0) {
      return NextResponse.json(
        { error: "Total amount must be greater than 0" },
        { status: 400 },
      );
    }

    const PaypalClient = client();
    const req = new paypal.orders.OrdersCreateRequest();
    req.headers["Prefer"] = "return=representation";

    req.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: calculatedTotal.toFixed(2),
          },
          // We can optionally verify items here, but total is what matters for payment
          description: `Order for Cart ${userCart.id}`,
        },
      ],
      application_context: {
        brand_name: "Concept Builders",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
      },
    });

    const response = await PaypalClient.execute(req);

    if (response.statusCode !== 201) {
      console.error("PayPal Order Creation Failed:", {
        status: response.statusCode,
        error: response.result,
      });

      return NextResponse.json(
        {
          error: `Failed to create order: ${
            response.result?.message ||
            `PayPal API error (${response.statusCode})`
          }`,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      orderID: response.result.id,
      status: response.result.status,
    });
  } catch (error: unknown) {
    console.error("PayPal Order Creation Error:", error);
    return NextResponse.json(
      { error: "Internal server error during order creation" },
      { status: 500 },
    );
  }
}
