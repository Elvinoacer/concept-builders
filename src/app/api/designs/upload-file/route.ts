import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSignedUrlForUpload } from "@/lib/do-spaces";
import { FileType } from "@/generated/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const canManageDesigns =
      session?.user?.role === "ADMIN" || session?.user?.role === "TEAM";

    if (!canManageDesigns) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { designId, fileRelation, fileName, contentType } = await req.json();

    if (!designId || !fileRelation || !fileName || !contentType) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 1. Get signed URL
    const { signedUrl, publicUrl } = await getSignedUrlForUpload(
      fileName,
      contentType,
    );

    // 2. Determine the FileType enum value and the foreign key
    let fileType: FileType;
    let connectData: any;
    let whereClause: any;

    if (fileRelation === "images") {
      fileType = FileType.IMAGE;
      connectData = { designImage: { connect: { id: designId } } };
      whereClause = { designImageId: designId };
    } else if (fileRelation === "floorPlans") {
      fileType = FileType.FLOOR_PLAN;
      connectData = { designFloorPlan: { connect: { id: designId } } };
      whereClause = { designFloorPlanId: designId };
    } else {
      fileType = FileType.FILE;
      connectData = { design: { connect: { id: designId } } };
      whereClause = { designId: designId };
    }

    // 3. Handle versioning
    const existingFile = await prisma.file.findFirst({
      where: {
        name: fileName,
        ...whereClause,
      },
      orderBy: {
        version: "desc",
      },
    });

    let newVersion = 1;
    if (existingFile) {
      newVersion = existingFile.version + 1;
      await prisma.file.update({
        where: { id: existingFile.id },
        data: { isLatest: false },
      });
    }

    // 4. Create File record and connect it to the design
    await prisma.file.create({
      data: {
        name: fileName,
        url: publicUrl,
        type: fileType,
        version: newVersion,
        isLatest: true,
        fileIdentifier: fileName,
        ...connectData,
      },
    });

    return NextResponse.json({ signedUrl, publicUrl });
  } catch (error) {
    console.error("Error getting signed URL:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
