import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const designs = await prisma.design.findMany({
      where: {
        faq: {
          some: {
            answer: "",
          },
        },
      },
    });

    const designsWithUnansweredFaqs = designs.map(design => {
        const unansweredFaqs = (design.faq as any[]).filter(faq => faq.answer === "");
        return {
            ...design,
            faq: unansweredFaqs
        }
    })

    return NextResponse.json(designsWithUnansweredFaqs);
  } catch (error) {
    console.error("Failed to fetch unanswered FAQs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
