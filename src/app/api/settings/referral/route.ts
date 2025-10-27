import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        referralCode: true,
        referredByCode: true,
        referralBonus: true,
        referralBonusConverted: true,
        _count: {
          select: { referredUsers: true },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching referral info:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const { refereeCode } = body; // The code of the user who referred this user

    if (!refereeCode) {
      return new NextResponse("Missing refereeCode", { status: 400 });
    }

    // Check if the refereeCode exists and belongs to another user
    const refereeUser = await prisma.user.findUnique({
      where: {
        referralCode: refereeCode,
      },
    });

    if (!refereeUser) {
      return new NextResponse("Invalid referral code", { status: 400 });
    }

    if (refereeUser.id === userId) {
      return new NextResponse("Cannot refer yourself", { status: 400 });
    }

    // Check if the user has already been referred
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { referredByCode: true },
    });

    if (currentUser?.referredByCode) {
      return new NextResponse("You have already used a referral code", { status: 400 });
    }

    // Update the current user with the referee's code
    await prisma.user.update({
      where: { id: userId },
      data: { referredByCode: refereeCode },
    });

    // Optionally, add initial bonus to the referee or referred user here
    // This logic depends on your business rules.

    return new NextResponse("Referral code applied successfully", { status: 200 });
  } catch (error) {
    console.error("Error applying referral code:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
