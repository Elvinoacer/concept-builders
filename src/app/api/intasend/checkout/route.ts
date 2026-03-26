import { NextRequest, NextResponse } from "next/server";
import IntaSend from "intasend-node";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { calculateItemTotal } from "@/lib/calculate-total";
import { validateAndApplyDiscount } from "@/lib/validate-discount";

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

    let appliedDiscountAmount = 0;
    let appliedDiscountId: string | null = null;

    // Handle Discount
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

      appliedDiscountAmount = discountResult.appliedAmount;
      appliedDiscountId = discountResult.discount.id;
      calculatedTotal = discountResult.finalTotal;

      await prisma.cart.update({
        where: { id: userCart.id },
        data: {
          discountAmount: appliedDiscountAmount,
          discountCode,
          discountId: appliedDiscountId,
        },
      });
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
