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
    const { amount, currency = "KES" } = body;

    const userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!userCart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
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
      process.env.NODE_ENV !== "production"
    );

    const host = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const collection = intasend.collection();
    const resp = await collection.charge({
      first_name: session.user.name?.split(' ')[0] || 'User',
      last_name: session.user.name?.split(' ')[1] || '',
      email: session.user.email || '',
      host: host,
      amount: Number(amount),
      currency,
      redirect_url: `${host}/purchase-confirmation`,
      api_ref: userCart.id, // Pass cart ID as api_ref
    });

    return NextResponse.json(resp);
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to generate checkout link" },
      { status: 500 }
    );
  }
}