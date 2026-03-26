import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";
import { Role } from "@/generated/prisma/client";

export async function GET(request: Request) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

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

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const body = await request.json();
    const { name, email, role, password } = body;

    if (!name || !email || !role || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (!Object.values(Role).includes(role)) {
      return new NextResponse("Invalid role", { status: 400 });
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

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
