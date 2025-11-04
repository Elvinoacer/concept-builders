// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "@/lib/emails";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Minimum password length check
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Token valid for 24 hours

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: expires,
      },
    });

    // Send verification email
    const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email/confirm?token=${verificationToken}`;
    await sendVerificationEmail(
      user.email,
      user.name || "User",
      verificationLink
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "User registered successfully. Please check your email to verify your account.",
        data: { userId: user.id, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
