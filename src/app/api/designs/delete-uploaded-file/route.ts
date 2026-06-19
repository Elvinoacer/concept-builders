import { NextRequest, NextResponse } from "next/server";
import { deleteFile } from "@/lib/r2-client";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

export async function POST(request: NextRequest) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { error: "'key' must be provided in the request body" },
        { status: 400 },
      );
    }

    await deleteFile(key);

    return NextResponse.json({
      message: `Successfully deleted file with key: ${key}`,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
