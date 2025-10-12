import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { referral } = await request.json();

    if (referral) {
      await prisma.referralVisit.create({
        data: {
          source: referral,
        },
      });
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
