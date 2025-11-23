import { client } from "@/lib/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { calculateItemTotal } from "@/lib/calculate-total";
import { DiscountType } from "@/generated/prisma";

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
      const itemForCalculation = {
        ...item,
        selectedExtras: item.selectedExtras as any[],
      };
      return total + calculateItemTotal(itemForCalculation);
    }, 0);

    let appliedDiscountAmount = 0;

    // Handle Discount
    if (discountCode) {
      const discount = await prisma.discount.findUnique({
        where: { code: discountCode },
      });

      if (discount) {
        // Validate Discount
        let isValid = true;
        let errorMessage = "";

        if (!discount.isActive) {
          isValid = false;
          errorMessage = "Discount is not active";
        } else if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
          isValid = false;
          errorMessage = "Discount has expired";
        } else if (discount.maxUses && discount.uses >= discount.maxUses) {
          isValid = false;
          errorMessage = "Discount has reached its maximum uses";
        } else if (discount.minPurchaseAmount && calculatedTotal < discount.minPurchaseAmount) {
          isValid = false;
          errorMessage = `Minimum purchase of ${discount.minPurchaseAmount.toFixed(2)} required`;
        }

        if (isValid) {
           const existingOrderWithDiscount = await prisma.order.findFirst({
            where: {
              userId: userId,
              discountId: discount.id,
              status: {
                in: ['PAID', 'REFUND_REQUESTED'],
              },
            },
          });

          if (existingOrderWithDiscount) {
             isValid = false;
             errorMessage = "You have already used this discount code";
          }
        }

        if (isValid) {
          if (discount.type === DiscountType.PERCENTAGE) {
            appliedDiscountAmount = calculatedTotal * (discount.value / 100);
          } else if (discount.type === DiscountType.FIXED_AMOUNT) {
            appliedDiscountAmount = discount.value;
          }

          // Cap discount at total
          appliedDiscountAmount = Math.min(appliedDiscountAmount, calculatedTotal);
          
          calculatedTotal -= appliedDiscountAmount;

        } else {
             console.warn(`Invalid discount code provided: ${discountCode} - ${errorMessage}`);
             return NextResponse.json({ error: errorMessage }, { status: 400 });
        }
      } else {
          return NextResponse.json({ error: "Invalid discount code" }, { status: 404 });
      }
    }

    if (calculatedTotal <= 0) {
      return NextResponse.json(
        { error: "Total amount must be greater than 0" },
        { status: 400 }
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
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: (calculatedTotal + appliedDiscountAmount).toFixed(2),
              },
              discount: {
                currency_code: "USD",
                value: appliedDiscountAmount.toFixed(2),
              },
            },
          },
          // We can optionally verify items here, but total is what matters for payment
          description: `Order for Cart ${userCart.id}`,
        },
      ],
      application_context: {
        brand_name: "Concept Builders",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXTAUTH_URL}/purchase-confirmation`,
        cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
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
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderID: response.result.id,
      status: response.result.status,
    });

  } catch (error: any) {
    console.error("PayPal Order Creation Error:", error);
    return NextResponse.json(
      { error: "Internal server error during order creation" },
      { status: 500 }
    );
  }
}
