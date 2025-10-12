
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    let where = {};

    if (role === "team") {
      where = {
        role: { in: ["ADMIN", "TEAM"] },
      };
    } else if (role === "clients") {
      where = {
        role: "CLIENT",
      };
    }

    const users = await prisma.user.findMany({ where });
    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, password } = body;

    if (!name || !email || !role || !password) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        hashedPassword: hashedPassword,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
