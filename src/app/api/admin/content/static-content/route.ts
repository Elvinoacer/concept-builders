import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "PAGES.md");
    const fileContent = await fs.readFile(filePath, "utf-8");

    const lines = fileContent.split("\n");

    let inPublicPages = false;
    const staticPages = [];
    const policyPages = [];

    for (const line of lines) {
      if (line.startsWith("## Public Pages")) {
        inPublicPages = true;
        continue;
      }

      if (line.startsWith("## ")) {
        if (inPublicPages) {
          inPublicPages = false;
        }
      }

      if (inPublicPages && line.startsWith("- /")) {
        const page = line.substring(2); // remove "- "
        if (
          page.includes("/privacy") ||
          page.includes("/refund") ||
          page.includes("/terms")
        ) {
          policyPages.push({ name: page });
        } else {
          staticPages.push({ name: page });
        }
      }
    }

    return NextResponse.json({
      staticPages,
      policyPages,
      staticPageCount: staticPages.length,
      policyCount: policyPages.length,
    });
  } catch (error) {
    console.error("Error reading PAGES.md:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}