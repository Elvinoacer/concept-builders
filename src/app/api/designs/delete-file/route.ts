import { NextRequest, NextResponse } from "next/server";
import { deleteFile, deleteFiles } from "@/lib/do-spaces";
import prisma from "@/lib/prisma";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

export async function POST(request: NextRequest) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const { fileId, fileIds } = await request.json();

    if (fileId) {
      const fileToDelete = await prisma.file.findUnique({
        where: { id: fileId },
      });
      if (!fileToDelete) {
        return NextResponse.json(
          { error: "File not found in database" },
          { status: 404 },
        );
      }

      const urlParts = fileToDelete.url.split("/");
      const key = urlParts.slice(3).join("/");

      await deleteFile(key);
      await prisma.file.delete({ where: { id: fileId } });

      return NextResponse.json({
        message: `Successfully deleted file with ID: ${fileId}`,
      });
    } else if (fileIds && Array.isArray(fileIds) && fileIds.length > 0) {
      const filesToDelete = await prisma.file.findMany({
        where: { id: { in: fileIds } },
      });
      if (filesToDelete.length === 0) {
        return NextResponse.json(
          { error: "No files found in database for provided IDs" },
          { status: 404 },
        );
      }

      const keys = filesToDelete.map((file) => {
        const urlParts = file.url.split("/");
        return urlParts.slice(3).join("/");
      });

      await deleteFiles(keys);
      await prisma.file.deleteMany({ where: { id: { in: fileIds } } });

      return NextResponse.json({
        message: `Successfully deleted ${fileIds.length} files`,
      });
    } else {
      return NextResponse.json(
        {
          error:
            "Either 'fileId' or 'fileIds' must be provided in the request body",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error deleting file(s):", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
