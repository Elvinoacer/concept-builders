import { NextRequest, NextResponse } from "next/server";
import IntaSend from "intasend-node";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await req.json();
    const {
      first_name,
      last_name,
      email,
      amount,
      phone_number,
      discountCode,
      discountAmount,
      discountId,
    } = body;

    let userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!userCart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Update cart with discount details if provided
    if (discountId || discountCode || discountAmount) {
      userCart = await prisma.cart.update({
        where: { id: userCart.id },
        data: {
          discountCode: discountCode || null,
          discountAmount: discountAmount || null,
          discountId: discountId || null,
        },
      });
    }

    if (
      !process.env.INTASEND_PUBLISHABLE_KEY ||
      !process.env.INTASEND_SECRET_KEY
    ) {
      return NextResponse.json(
        { error: "IntaSend keys not configured" },
        { status: 500 }
      );
    }

    const intasend = new IntaSend(
      process.env.INTASEND_PUBLISHABLE_KEY,
      process.env.INTASEND_SECRET_KEY,
      // process.env.NODE_ENV !== "production"
      false
    );

    const host = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    // Fetch USD to KES exchange rate
    const exchangeRateRes = await fetch(
      `${req.nextUrl.origin}/api/exchange-rate`
    );
    if (!exchangeRateRes.ok) {
      throw new Error("Failed to fetch exchange rate for IntaSend payment");
    }
    const exchangeRateData = await exchangeRateRes.json();
    const usdToKesRate = exchangeRateData.usdToKesRate;

    if (!usdToKesRate) {
      throw new Error("USD to KES exchange rate not available.");
    }

    const amountKES = (Number(amount) * usdToKesRate).toFixed(2); // Round to 2 decimal places

    const collection = intasend.collection();
    const resp = await collection.mpesaStkPush({
      first_name,
      last_name,
      email,
      host: host,
      amount: Number(amountKES),
      phone_number: phone_number.startsWith("0")
        ? `254${phone_number.substring(1)}`
        : phone_number, // Ensure correct format
      api_ref: userCart.id, // Use 'api_ref' for consistency
      callback_url: `${host}/api/intasend/webhook`,
    });

    return NextResponse.json(resp);
  } catch (error: any) {
    let errorMessage = "Failed to initiate M-Pesa STK Push";
    if (error.response?.data) {
      try {
        const errorData = JSON.parse(error.response.data.toString());
        errorMessage = errorData.detail || errorMessage;
        console.error("IntaSend STK Push Error:", errorData);
      } catch (e) {
        console.error(
          "IntaSend STK Push Error (raw buffer):",
          error.response.data
        );
      }
    } else {
      console.error("IntaSend STK Push Error:", error.message || error);
    }

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: error.response?.status || 500 }
    );
  }
}
