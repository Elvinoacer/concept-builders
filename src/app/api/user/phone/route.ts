import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { phone } = body;

    if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
      return NextResponse.json(
        { message: "Please provide a valid phone number." },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: {
        id: session.user?.id,
      },
      data: {
        phone: phone.trim(),
      },
    });

    return NextResponse.json(
      { message: "Phone number saved." },
      { status: 200 },
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        {
          message:
            "This phone number is already in use by another account. Please use a different number.",
          code: "PHONE_ALREADY_EXISTS",
        },
        { status: 409 },
      );
    }

    console.error("[PHONE_POST]", error);
    return NextResponse.json(
      { message: "Unable to save phone number right now. Please try again." },
      { status: 500 },
    );
  }
}
