import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";
import { Role, UserStatus } from "@/generated/prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  const { id } = await params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        bio: true,
        adminRole: true,
        referralCode: true,
        referredByCode: true,
        accounts: { select: { provider: true } },
        orders: { select: { id: true, amount: true, createdAt: true } },
        projects: { select: { id: true, name: true, status: true } },
        reviews: { select: { id: true, rating: true, comment: true } },
        wishlist: { select: { id: true, name: true } },
        folders: { select: { id: true, name: true } },
        loginHistory: {
          select: { createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        }, // Latest 5 logins
      },
    });
    if (!user) {
      return new NextResponse("Not Found", { status: 404 });
    }
    return NextResponse.json(user);
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  const { id } = await params;
  try {
    const data = await request.json();

    const updateData: {
      name?: string;
      email?: string;
      role?: Role;
      status?: UserStatus;
      bio?: string | null;
      adminRole?: string | null;
    } = {};

    if (typeof data.name === "string") updateData.name = data.name;
    if (typeof data.email === "string") updateData.email = data.email;
    if (typeof data.bio === "string" || data.bio === null)
      updateData.bio = data.bio;
    if (typeof data.adminRole === "string" || data.adminRole === null)
      updateData.adminRole = data.adminRole;

    if (data.role) {
      if (!Object.values(Role).includes(data.role)) {
        return new NextResponse("Invalid role", { status: 400 });
      }
      updateData.role = data.role;
    }

    if (data.status) {
      if (!Object.values(UserStatus).includes(data.status)) {
        return new NextResponse("Invalid status", { status: 400 });
      }
      updateData.status = data.status;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(updatedUser);
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  const { id } = await params;
  try {
    await prisma.user.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
