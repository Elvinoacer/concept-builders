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
    const { amount, currency = "KES", discountCode, discountAmount, discountId } = body;

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

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "A valid amount is required" },
        { status: 400 }
      );
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

    console.log('IntaSend Checkout API: Request received.');
    console.log('Body:', body);
    console.log('User ID:', userId);
    console.log('User Cart ID:', userCart.id);

    // Fetch USD to KES exchange rate
    const exchangeRateRes = await fetch(`${req.nextUrl.origin}/api/exchange-rate`);
    if (!exchangeRateRes.ok) {
      throw new Error('Failed to fetch exchange rate for IntaSend payment');
    }
    const exchangeRateData = await exchangeRateRes.json();
    const usdToKesRate = exchangeRateData.usdToKesRate;

    if (!usdToKesRate) {
      throw new Error('USD to KES exchange rate not available.');
    }

    const amountKES = (Number(amount) * usdToKesRate).toFixed(2); // Round to 2 decimal places
    console.log('Converted amount to KES:', amountKES);

    const collection = intasend.collection();
    const resp = await collection.charge({
      first_name: session.user.name?.split(" ")[0] || "User",
      last_name: session.user.name?.split(" ")[1] || "",
      email: session.user.email || "",
      host: host,
      amount: Number(amountKES), // Ensure it's a number after toFixed
      currency,
      redirect_url: `${host}/purchase-confirmation?purchaseId=${userCart.id}`, // Append cartId as purchaseId
      api_ref: userCart.id, // Pass cart ID as api_ref
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
        console.error("IntaSend API Response Error (raw buffer):", error.response.data);
      }
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 500 }
    );
  }
}
