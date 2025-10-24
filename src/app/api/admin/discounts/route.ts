import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { DiscountType, Role } from "@/generated/prisma";

// Helper function to check admin role
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === Role.ADMIN;
}

// GET /api/admin/discounts - Get all discounts
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const discounts = await prisma.discount.findMany({
      include: {
        designs: {
          include: {
            design: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(discounts);
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/discounts - Create a new discount
export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      code,
      type,
      value,
      minPurchaseAmount,
      maxUses,
      expiresAt,
      isActive,
      designIds,
    } = body;

    if (!code || !type || value === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newDiscount = await prisma.discount.create({
      data: {
        code,
        type: type as DiscountType,
        value: parseFloat(value),
        minPurchaseAmount: minPurchaseAmount
          ? parseFloat(minPurchaseAmount)
          : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive ?? true,
        designs: designIds
          ? {
              create: designIds.map((id: string) => ({
                design: { connect: { id } },
              })),
            }
          : undefined,
      },
    });
    return NextResponse.json(newDiscount, { status: 201 });
  } catch (error: any) {
    console.error("Error creating discount:", error);
    if (error.code === "P2002") {
      // Unique constraint violation
      return NextResponse.json(
        { message: "Discount code already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/discounts/:id - Update a discount
export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "Discount ID is required" },
        { status: 400 }
      );
    }

    const updateData: { [key: string]: any } = {};
    if (body.code !== undefined) updateData.code = body.code;
    if (body.type !== undefined) updateData.type = body.type as DiscountType;
    if (body.value !== undefined) updateData.value = parseFloat(body.value);
    if (body.minPurchaseAmount !== undefined) updateData.minPurchaseAmount = body.minPurchaseAmount ? parseFloat(body.minPurchaseAmount) : null;
    if (body.maxUses !== undefined) updateData.maxUses = body.maxUses ? parseInt(body.maxUses) : null;
    if (body.expiresAt !== undefined) updateData.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    if (body.designIds) {
      await prisma.designDiscount.deleteMany({
        where: { discountId: id },
      });

      updateData.designs = {
        create: body.designIds.map((designId: string) => ({
          design: { connect: { id: designId } },
        })),
      };
    }

    const updatedDiscount = await prisma.discount.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(updatedDiscount);
  } catch (error: any) {
    console.error("Error updating discount:", error);
    if (error.code === "P2002") {
      // Unique constraint violation
      return NextResponse.json(
        { message: "Discount code already exists" },
        { status: 409 }
      );
    }
    if (error.code === "P2025") {
      // Record not found
      return NextResponse.json(
        { message: "Discount not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/discounts/:id - Delete a discount
export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Discount ID is required" },
        { status: 400 }
      );
    }

    await prisma.discount.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Discount deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting discount:", error);
    if (error.code === "P2025") {
      // Record not found
      return NextResponse.json(
        { message: "Discount not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
