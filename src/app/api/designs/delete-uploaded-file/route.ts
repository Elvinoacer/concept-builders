
import { NextRequest, NextResponse } from "next/server";
import { deleteFile } from "@/lib/do-spaces";

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "'key' must be provided in the request body" }, { status: 400 });
    }

    await deleteFile(key);

    return NextResponse.json({ message: `Successfully deleted file with key: ${key}` });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
