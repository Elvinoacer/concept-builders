import { NextRequest, NextResponse } from "next/server";
import IntaSend from "intasend-node";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { calculateItemTotal } from "@/lib/calculate-total";
import { DiscountType } from "@/generated/prisma/client";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await req.json();
    const { currency = "KES", discountCode } = body;

    // Find user cart
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
        } else if (
          discount.expiresAt &&
          new Date(discount.expiresAt) < new Date()
        ) {
          isValid = false;
          errorMessage = "Discount has expired";
        } else if (discount.maxUses && discount.uses >= discount.maxUses) {
          isValid = false;
          errorMessage = "Discount has reached its maximum uses";
        } else if (
          discount.minPurchaseAmount &&
          calculatedTotal < discount.minPurchaseAmount
        ) {
          isValid = false;
          errorMessage = `Minimum purchase of ${discount.minPurchaseAmount.toFixed(2)} required`;
        }

        if (isValid) {
          // Check if user already used it
          const existingOrderWithDiscount = await prisma.order.findFirst({
            where: {
              userId: userId,
              discountId: discount.id,
              status: {
                in: ["PAID", "REFUND_REQUESTED"],
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
          appliedDiscountAmount = Math.min(
            appliedDiscountAmount,
            calculatedTotal,
          );

          calculatedTotal -= appliedDiscountAmount;

          // Update cart with valid discount
          await prisma.cart.update({
            where: { id: userCart.id },
            data: {
              discountAmount: appliedDiscountAmount,
              discountCode: discountCode,
              discountId: discount.id,
            },
          });
        } else {
          console.warn(
            `Invalid discount code provided: ${discountCode} - ${errorMessage}`,
          );
          return NextResponse.json({ error: errorMessage }, { status: 400 });
        }
      } else {
        return NextResponse.json(
          { error: "Invalid discount code" },
          { status: 404 },
        );
      }
    }

    if (calculatedTotal <= 0) {
      return NextResponse.json(
        { error: "A valid amount is required" },
        { status: 400 },
      );
    }

    if (
      !process.env.INTASEND_PUBLISHABLE_KEY ||
      !process.env.INTASEND_SECRET_KEY
    ) {
      return NextResponse.json(
        { error: "IntaSend keys not configured" },
        { status: 500 },
      );
    }

    const isTestMode = process.env.INTASEND_TEST_MODE === "true";

    const intasend = new IntaSend(
      process.env.INTASEND_PUBLISHABLE_KEY,
      process.env.INTASEND_SECRET_KEY,
      isTestMode,
    );

    const host = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Fetch USD to KES exchange rate
    let usdToKesRate = 130;
    try {
      const exchangeRateRes = await fetch(
        `${req.nextUrl.origin}/api/exchange-rate`,
      );
      if (exchangeRateRes.ok) {
        const exchangeRateData = await exchangeRateRes.json();
        if (exchangeRateData.usdToKesRate) {
          usdToKesRate = exchangeRateData.usdToKesRate;
        }
      }
    } catch (e) {
      console.error("Failed to fetch exchange rate, using fallback");
    }

    const amountKES = (calculatedTotal * usdToKesRate).toFixed(2);

    console.log("🔧 Initializing IntaSend Checkout:", {
      calculatedTotalUSD: calculatedTotal,
      amountKES: amountKES,
      discountApplied: appliedDiscountAmount,
    });

    // Prepare API Ref
    const apiRef = `cart_${userCart.id}_${Date.now()}`;

    const collection = intasend.collection();
    const resp = await collection.charge({
      first_name: session.user.name?.split(" ")[0] || "User",
      last_name: session.user.name?.split(" ")[1] || "",
      email: session.user.email || "",
      host: host,
      amount: Number(amountKES),
      currency,
      redirect_url: `${host}/purchase-confirmation?purchaseId=${userCart.id}`,
      api_ref: apiRef,
    });

    return NextResponse.json(resp);
  } catch (error: any) {
    console.error("IntaSend Checkout API Error:", error);
    let errorMessage = "Failed to generate checkout link";
    if (error.message) {
      errorMessage = error.message;
    }
    if (error.response?.data) {
      try {
        const errorData = JSON.parse(error.response.data.toString());
        errorMessage = errorData.detail || errorMessage;
        console.error("IntaSend API Response Error:", errorData);
      } catch (e) {
        console.error(
          "IntaSend API Response Error (raw buffer):",
          error.response.data,
        );
      }
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 500 },
    );
  }
}
