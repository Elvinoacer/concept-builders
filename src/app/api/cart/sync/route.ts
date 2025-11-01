import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Design } from "@/generated/prisma";

interface CartItem extends Design {
  quantity: number;
  selectedDocuments: any;
  selectedPackage?: string;
  selectedExtras?: any[];
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const localCartItems: CartItem[] = await req.json();

  if (!localCartItems || localCartItems.length === 0) {
    return NextResponse.json({ message: "No items to sync." }, { status: 200 });
  }

  try {
    const userCart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    await prisma.$transaction(async (tx) => {
      for (const item of localCartItems) {
        const existingItem = await tx.cartItem.findFirst({
          where: {
            cartId: userCart.id,
                      designId: item.id,
                      selectedDocuments: {
                          equals: item.selectedDocuments,
                        },
                      selectedPackage: item.selectedPackage,
            selectedExtras: {
              equals: item.selectedExtras,
            },
          },
        });

        if (existingItem) {
          await tx.cartItem.update({
            where: { id: existingItem.id },
            data: {
              quantity: existingItem.quantity + item.quantity,
            },
          });
        } else {
          await tx.cartItem.create({
            data: {
              cartId: userCart.id,
              designId: item.id,
              quantity: item.quantity,
              selectedDocuments: item.selectedDocuments,
              selectedPackage: item.selectedPackage,
              selectedExtras: item.selectedExtras,
            },
          });
        }
      }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            design: {
              include: {
                images: true,
              }
            }
          },
        },
      },
    });

    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error) {
    console.error("Error syncing cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}