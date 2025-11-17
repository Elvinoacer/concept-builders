import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/do-spaces";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file found", { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const { publicUrl } = await uploadFile(
      fileBuffer,
      file.name,
      file.type
    );

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
