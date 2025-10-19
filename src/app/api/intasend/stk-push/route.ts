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
    const { first_name, last_name, email, amount, phone_number } = body;

    const userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!userCart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
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
    const resp = await collection.mpesaStkPush({
      first_name,
      last_name,
      email,
      amount: Number(amount),
      phone_number,
      api_ref: userCart.id, // Pass cart ID as api_ref
      callback_url: `${host}/api/intasend/webhook`,
    });

    return NextResponse.json(resp);
  } catch (error: any) {
    console.error(
      "IntaSend STK Push Error:",
      error.response?.data || error.message || error
    );
    return NextResponse.json(
      {
        error:
          error.response?.data?.detail || "Failed to initiate M-Pesa STK Push",
      },
      { status: error.response?.status || 500 }
    );
  }
}