import { s3Client } from "@/lib/do-spaces";
import prisma from "@/lib/prisma";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user.role === "ADMIN";
    const { id } = await params;

    const design = await prisma.design.findUnique({
      where: { id },
      include: {
        files: true,
        images: true,
        floorPlans: true,
        reviews: {
          include: {
            author: true,
          },
        },

        architecturalDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          },
        },
        structuralDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          },
        },
        billOfQuantities: {
          include: {
            excelFiles: true,
            pdfFiles: true,
          },
        },
        packageOptions: {
          include: {
            file: true,
          },
        },
      },
    });

    if (!design) {
      return new NextResponse("Design not found", { status: 404 });
    }

    if (!isAdmin) {
      const sanitizeFileUrls = (files: any[]) => {
        if (files) {
          files.forEach((file) => {
            if (file) {
              (file as any).url = null;
            }
          });
        }
      };

      sanitizeFileUrls(design.files);
      if (design.architecturalDesign) {
        sanitizeFileUrls(design.architecturalDesign.pdfFiles);
        sanitizeFileUrls(design.architecturalDesign.cadFiles);
      }
      if (design.structuralDesign) {
        sanitizeFileUrls(design.structuralDesign.pdfFiles);
        sanitizeFileUrls(design.structuralDesign.cadFiles);
      }
      if (design.billOfQuantities) {
        sanitizeFileUrls(design.billOfQuantities.excelFiles);
        sanitizeFileUrls(design.billOfQuantities.pdfFiles);
      }
      if (design.packageOptions) {
        design.packageOptions.forEach((option) => {
          if (option.file) {
            (option.file as any).url = null;
          }
        });
      }
    }

    return NextResponse.json(design, { status: 200 });
  } catch (error) {
    console.error("Error fetching design:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      description,
      basePrice,
      priceRange,
      bedrooms,
      bathrooms,
      area,
      floors,
      categoryId,
      architecturalPdfPrice,
      architecturalCadPrice,
      structuralPdfPrice,
      structuralCadPrice,
      billOfQuantitiesPrice,
      billOfQuantitiesPdfPrice,
      images,
      floorPlans,
      files,
      packageOptions,
      architecturalDesign,
      structuralDesign,
      billOfQuantities,
      folderId,
    } = body;

    const updateData: any = {
      name,
      description,
      basePrice,
      priceRange,
      bedrooms,
      bathrooms,
      area,
      floors,
      categoryId,
      architecturalPdfPrice,
      architecturalCadPrice,
      structuralPdfPrice,
      structuralCadPrice,
      billOfQuantitiesPrice,
      billOfQuantitiesPdfPrice,
      folderId,
    };

    if (images) {
      updateData.images = {
        deleteMany: {},
        create: images.create,
      };
    }

    if (floorPlans) {
      updateData.floorPlans = {
        deleteMany: {},
        create: floorPlans.create,
      };
    }

    if (files) {
      updateData.files = {
        deleteMany: {},
        create: files.create,
      };
    }

    if (packageOptions) {
      updateData.packageOptions = {
        deleteMany: {},
        create: packageOptions.create,
      };
    }

    if (architecturalDesign) {
      updateData.architecturalDesign = {
        upsert: {
          create: {
            type: "ARCHITECTURAL",
            pdfFiles: { create: architecturalDesign.pdfFiles },
            cadFiles: { create: architecturalDesign.cadFiles },
          },
          update: {
            pdfFiles: {
              deleteMany: {},
              create: architecturalDesign.pdfFiles,
            },
            cadFiles: {
              deleteMany: {},
              create: architecturalDesign.cadFiles,
            },
          },
        },
      };
    }

    if (structuralDesign) {
      updateData.structuralDesign = {
        upsert: {
          create: {
            type: "STRUCTURAL",
            pdfFiles: { create: structuralDesign.pdfFiles },
            cadFiles: { create: structuralDesign.cadFiles },
          },
          update: {
            pdfFiles: {
              deleteMany: {},
              create: structuralDesign.pdfFiles,
            },
            cadFiles: {
              deleteMany: {},
              create: structuralDesign.cadFiles,
            },
          },
        },
      };
    }

    if (billOfQuantities) {
      updateData.billOfQuantities = {
        upsert: {
          create: {
            type: "BILL_OF_QUANTITIES",
            excelFiles: { create: billOfQuantities.excelFiles },
            pdfFiles: { create: billOfQuantities.pdfFiles },
          },
          update: {
            excelFiles: {
              deleteMany: {},
              create: billOfQuantities.excelFiles,
            },
            pdfFiles: {
              deleteMany: {},
              create: billOfQuantities.pdfFiles,
            },
          },
        },
      };
    }

    const updatedDesign = await prisma.design.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/");
    revalidatePath(`/admin/designs`);
    revalidatePath(`/admin/designs/${id}`);
    revalidatePath(`/designs/${id}`);

    return NextResponse.json(updatedDesign, { status: 200 });
  } catch (error) {
    console.error("Error updating design:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log(`Starting deletion process for design: ${id}`);

    // 1. Fetch the design to get file details before deletion
    const design = await prisma.design.findUnique({
      where: { id },
      include: {
        images: true,
        floorPlans: true,
        packageOptions: {
          include: {
            file: true,
          },
        },
        architecturalDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          },
        },
        structuralDesign: {
          include: {
            pdfFiles: true,
            cadFiles: true,
          },
        },
        billOfQuantities: {
          include: {
            excelFiles: true,
          },
        },
      },
    });

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    // 2. Extract ALL file URLs for deletion from DigitalOcean Spaces
    const fileUrls: string[] = [];
    const addFileUrls = (files: Array<{ url: string }>) => {
      files.forEach((file) => {
        if (file.url && file.url.startsWith("http")) {
          fileUrls.push(file.url);
        }
      });
    };

    addFileUrls(design.images);
    addFileUrls(design.floorPlans);
    design.packageOptions.forEach((option) => {
      if (option.file?.url) {
        fileUrls.push(option.file.url);
      }
    });
    if (design.architecturalDesign) {
      addFileUrls(design.architecturalDesign.pdfFiles);
      addFileUrls(design.architecturalDesign.cadFiles);
    }
    if (design.structuralDesign) {
      addFileUrls(design.structuralDesign.pdfFiles);
      addFileUrls(design.structuralDesign.cadFiles);
    }
    if (design.billOfQuantities) {
      addFileUrls(design.billOfQuantities.excelFiles);
    }

    console.log(`Found ${fileUrls.length} files to delete from Spaces`);

    // 3. Delete files from DigitalOcean Spaces (non-blocking)
    if (fileUrls.length > 0) {
      deleteFilesFromSpacesBackground(fileUrls).catch((error) => {
        console.error("Background file deletion failed:", error);
      });
    }

    // 4. Delete the design from the database (cascading deletes will handle the rest)
    await prisma.design.delete({
      where: { id },
    });

    console.log(`Successfully deleted design: ${id}`);

    // 5. Revalidate paths
    revalidatePath("/");
    revalidatePath("/admin/designs");
    revalidatePath("/designs");
    revalidatePath("/api/designs");

    return NextResponse.json({
      success: true,
      message: "Design deleted successfully",
      deletedFilesCount: fileUrls.length,
      designName: design.name,
    });
  } catch (error) {
    console.error("Error deleting design:", error);

    // More specific error handling
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (
        errorMessage.includes("foreign key") ||
        errorMessage.includes("constraint")
      ) {
        return NextResponse.json(
          {
            error:
              "Cannot delete design because it is referenced by other records. Please remove all references first.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: `Failed to delete design: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error while deleting design" },
      { status: 500 }
    );
  }
}

// Background file deletion - doesn't block the response
async function deleteFilesFromSpacesBackground(fileUrls: string[]) {
  try {
    console.log(
      `Starting background deletion of ${fileUrls.length} files from Spaces`
    );

    const deletePromises = fileUrls.map(async (fileUrl) => {
      try {
        const key = extractKeyFromUrl(fileUrl);
        if (!key) {
          console.warn(`Skipping invalid URL: ${fileUrl}`);
          return;
        }

        const command = new DeleteObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET!,
          Key: key,
        });

        await s3Client.send(command);
        console.log(`✓ Deleted from Spaces: ${key}`);
      } catch (error) {
        console.error(`✗ Failed to delete from Spaces: ${fileUrl}`, error);
        // Don't throw - continue with other deletions
      }
    });

    const results = await Promise.allSettled(deletePromises);

    const successful = results.filter(
      (result) => result.status === "fulfilled"
    ).length;
    const failed = results.filter(
      (result) => result.status === "rejected"
    ).length;

    console.log(
      `Background file deletion completed: ${successful} successful, ${failed} failed`
    );
  } catch (error) {
    console.error("Background file deletion process failed:", error);
  }
}

// Helper function to extract key from URL (compatible with your existing upload format)
function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Remove leading slash if present
    let key = pathname.startsWith("/") ? pathname.substring(1) : pathname;

    // If the URL contains the bucket name in the path, remove it
    const bucketName = process.env.DO_SPACES_BUCKET;
    if (bucketName && key.startsWith(`${bucketName}/`)) {
      key = key.substring(bucketName.length + 1);
    }

    // Handle different DigitalOcean Spaces URL formats
    // Your existing upload might create URLs like:
    // https://bucket.region.digitaloceanspaces.com/key
    // or https://region.digitaloceanspaces.com/bucket/key

    return key;
  } catch (error) {
    console.error(`Invalid URL format: ${url}`, error);
    return null;
  }
}

// Alternative: If you want to wait for file deletion (slower but more reliable)
async function deleteFilesFromSpacesWait(fileUrls: string[]) {
  const deletePromises = fileUrls.map(async (fileUrl) => {
    const key = extractKeyFromUrl(fileUrl);
    if (!key) return;

    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET!,
        Key: key,
      });

      await s3Client.send(command);
      return { success: true, key };
    } catch (error) {
      console.error(`Failed to delete: ${key}`, error);
      return { success: false, key, error };
    }
  });

  const results = await Promise.allSettled(deletePromises);
  return results;
}
