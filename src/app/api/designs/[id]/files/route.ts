import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { fileUrl } = await request.json();

    if (!fileUrl) {
      return new NextResponse("Missing fileUrl", { status: 400 });
    }

    const updatedDesign = await prisma.design.update({
      where: { id },
      data: {
        files: {
          push: fileUrl,
        },
      },
    });

    return NextResponse.json(updatedDesign, { status: 200 });
  } catch (error) {
    console.error("Error adding file to design:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
