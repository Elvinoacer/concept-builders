import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from '@/lib/emails'; // Assuming you have an emails utility

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const verificationToken = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Token valid for 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: expires,
      },
    });

    // Send verification email
    const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email/confirm?token=${verificationToken}`;
    await sendVerificationEmail(user.email, user.name || 'User', verificationLink);

    return NextResponse.json({ success: true, message: 'Verification email sent' }, { status: 200 });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
