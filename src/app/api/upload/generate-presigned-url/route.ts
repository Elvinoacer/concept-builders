import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  s3Client,
  getDoSpacesPublicUrl,
  DO_SPACES_BUCKET_NAME,
} from "@/lib/do-spaces";

// Configure route to handle large file uploads
export const maxDuration = 300; // 5 minutes
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const canManageDesigns =
      session?.user?.role === "ADMIN" || session?.user?.role === "TEAM";

    if (!canManageDesigns) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { fileName, fileType, fileTypeCategory } = await req.json();

    if (!fileName || !fileType || !fileTypeCategory) {
      return new NextResponse(
        "Missing fileName, fileType or fileTypeCategory",
        {
          status: 400,
        },
      );
    }

    const isPublicAsset =
      fileTypeCategory === "IMAGE" || fileTypeCategory === "FLOOR_PLAN";
    const objectAcl = isPublicAsset ? "public-read" : "private";

    const fileKey = `uploads/${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: DO_SPACES_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType,
      ACL: objectAcl,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 7200,
    }); // URL expires in 2 hours to support large file uploads

    const publicUrl = getDoSpacesPublicUrl(fileKey);

    return NextResponse.json({
      signedUrl,
      fileKey,
      publicUrl,
      originalFileName: fileName,
      acl: objectAcl,
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return new NextResponse("Failed to generate signed URL", { status: 500 });
  }
}
