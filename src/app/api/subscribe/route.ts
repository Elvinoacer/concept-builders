import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Basic email format validation
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    // Check if already subscribed
    const existingSubscription = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      return NextResponse.json({ message: "You are already subscribed!" }, { status: 200 });
    }

    await prisma.newsletterSubscription.create({
      data: {
        email,
      },
    });

    return NextResponse.json({ message: "Successfully subscribed to our newsletter!" }, { status: 201 });
  } catch (error: any) {
    console.error("Error subscribing to newsletter:", error);
    // Handle unique constraint error specifically if it's not caught by findUnique above
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json({ message: "You are already subscribed!" }, { status: 200 });
    }
    return NextResponse.json({ message: "Failed to subscribe to newsletter." }, { status: 500 });
  }
}
