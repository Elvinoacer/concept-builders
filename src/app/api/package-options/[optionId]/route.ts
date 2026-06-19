import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  s3Client,
  getDoSpacesKeyFromUrl,
  DO_SPACES_BUCKET_NAME,
} from "@/lib/r2-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

async function deleteFileFromSpaces(fileUrl: string) {
  try {
    const key = getDoSpacesKeyFromUrl(fileUrl);
    const command = new DeleteObjectCommand({
      Bucket: DO_SPACES_BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting file from Spaces:", error);
    // Don't throw error, just log it
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ optionId: string }> },
) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const { optionId } = await params;
    const body = await req.json();
    const { name, price, file } = body;

    if (!name || !price) {
      return new NextResponse("Missing name or price", { status: 400 });
    }

    const existingOption = await prisma.packageOption.findUnique({
      where: { id: optionId },
      include: { file: true },
    });

    if (!existingOption) {
      return new NextResponse("Package option not found", { status: 404 });
    }

    const packageOptionData: any = {
      name,
      price: parseFloat(price),
    };

    if (file) {
      let newVersion = 1;
      let fileIdentifier = file.originalFileName;

      if (existingOption.file) {
        const oldFile = existingOption.file;
        newVersion = oldFile.version + 1;
        fileIdentifier = oldFile.fileIdentifier;
        await prisma.file.update({
          where: { id: oldFile.id },
          data: { isLatest: false },
        });
      }

      packageOptionData.file = {
        create: {
          name: file.originalFileName,
          url: file.url,
          type: "FILE",
          version: newVersion,
          isLatest: true,
          fileIdentifier: fileIdentifier,
        },
      };
    } else if (file === null && existingOption.file) {
      // If file is explicitly set to null, delete the old one and all its versions
      const allVersions = await prisma.file.findMany({
        where: { fileIdentifier: existingOption.file.fileIdentifier },
      });
      for (const version of allVersions) {
        await deleteFileFromSpaces(version.url);
      }
      await prisma.file.deleteMany({
        where: { fileIdentifier: existingOption.file.fileIdentifier },
      });
      packageOptionData.file = {
        disconnect: true,
      };
    }

    const updatedPackageOption = await prisma.packageOption.update({
      where: { id: optionId },
      data: packageOptionData,
      include: {
        file: true,
      },
    });

    return NextResponse.json(updatedPackageOption, { status: 200 });
  } catch (error) {
    console.error("Error updating package option:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ optionId: string }> },
) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const { optionId } = await params;

    const existingOption = await prisma.packageOption.findUnique({
      where: { id: optionId },
      include: { file: true },
    });

    if (!existingOption) {
      return new NextResponse("Package option not found", { status: 404 });
    }

    if (existingOption.file) {
      const allVersions = await prisma.file.findMany({
        where: { fileIdentifier: existingOption.file.fileIdentifier },
      });
      for (const version of allVersions) {
        await deleteFileFromSpaces(version.url);
      }
      await prisma.file.deleteMany({
        where: { fileIdentifier: existingOption.file.fileIdentifier },
      });
    }

    await prisma.packageOption.delete({
      where: { id: optionId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting package option:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
