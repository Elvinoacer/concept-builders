import { FileType, DocumentType } from "../src/generated/prisma/client";
import { createPrismaClient } from "./client";
import designData from "../design.json"; // design.json contains a single object

const { prisma, pool } = createPrismaClient();

async function main() {
  console.log("Start seeding design...");

  const design = designData; // Access the single design object

  // 1. Create or connect Category
  let category = await prisma.category.findUnique({
    where: { id: design.categoryId },
  });

  if (!category) {
    // If category doesn't exist, create a dummy one or handle error
    // For now, let's create a simple one if not found
    category = await prisma.category.create({
      data: {
        id: design.categoryId,
        name: "Default Category", // You might want to make this dynamic
      },
    });
    console.log(`Created new category: ${category.name}`);
  }

  // Helper function to create files
  const createFile = async (fileData: any, designId?: string) => {
    if (!fileData) return null;
    return prisma.file.create({
      data: {
        name: fileData.name,
        url: fileData.url,
        type: fileData.type as FileType,
        designId: designId,
      },
    });
  };

  // Helper function to create DesignDocuments and their associated files
  const createDesignDocuments = async (
    docData: any,
    designId: string,
    docType: DocumentType
  ) => {
    if (!docData) return null;

    const createdPdfFiles = await Promise.all(
      (docData.pdfFiles || []).map((file: any) => createFile(file))
    );
    const createdCadFiles = await Promise.all(
      (docData.cadFiles || []).map((file: any) => createFile(file))
    );
    const createdExcelFiles = await Promise.all(
      (docData.excelFiles || []).map((file: any) => createFile(file))
    );

    return prisma.designDocuments.create({
      data: {
        type: docType,
        description: docData.description,
        overview: docData.overview,
        pdfFiles: {
          connect: createdPdfFiles.filter(Boolean).map((f) => ({ id: f!.id })),
        },
        cadFiles: {
          connect: createdCadFiles.filter(Boolean).map((f) => ({ id: f!.id })),
        },
        excelFiles: {
          connect: createdExcelFiles
            .filter(Boolean)
            .map((f) => ({ id: f!.id })),
        },
      },
    });
  };

  // Create DesignDocuments first to get their IDs
  const architecturalDesignDoc = await createDesignDocuments(
    design.architecturalDesign,
    design.id,
    DocumentType.ARCHITECTURAL
  );
  const structuralDesignDoc = await createDesignDocuments(
    design.structuralDesign,
    design.id,
    DocumentType.STRUCTURAL
  );
  const billOfQuantitiesDoc = await createDesignDocuments(
    design.billOfQuantities,
    design.id,
    DocumentType.BILL_OF_QUANTITIES
  );

  // Create the main Design record
  const createdDesign = await prisma.design.create({
    data: {
      name: design.name,
      description: design.description,
      basePrice: design.basePrice,
      priceRange: design.priceRange,
      bedrooms: design.bedrooms,
      bathrooms: design.bathrooms,
      area: design.area,
      floors: design.floors,
      planDetails: design.planDetails,
      minBuildingCost: design.minBuildingCost,
      maxBuildingCost: design.maxBuildingCost,
      buildingCostEstimates: design.buildingCostEstimates, // JSON field
      architecturalPdfPrice: design.architecturalPdfPrice,
      architecturalCadPrice: design.architecturalCadPrice,
      structuralPdfPrice: design.structuralPdfPrice,
      structuralCadPrice: design.structuralCadPrice,
      billOfQuantitiesPrice: design.billOfQuantitiesPrice,
      categoryId: category.id,
      // Connect DesignDocuments
      architecturalDesign: architecturalDesignDoc
        ? { connect: { id: architecturalDesignDoc.id } }
        : undefined,
      structuralDesign: structuralDesignDoc
        ? { connect: { id: structuralDesignDoc.id } }
        : undefined,
      billOfQuantities: billOfQuantitiesDoc
        ? { connect: { id: billOfQuantitiesDoc.id } }
        : undefined,
      // Create and connect images
      images: {
        create: await Promise.all(
          (design.images || []).map((image: any) => ({
            name: image.name,
            url: image.url,
            type: image.type as FileType,
          }))
        ),
      },
      // Create and connect floor plans
      floorPlans: {
        create: await Promise.all(
          (design.floorPlans || []).map((floorPlan: any) => ({
            name: floorPlan.name,
            url: floorPlan.url,
            type: floorPlan.type as FileType,
          }))
        ),
      },
      // Create and connect package options
      packageOptions: {
        create: await Promise.all(
          (design.packageOptions || []).map(async (option: any) => {
            const file = option.file
              ? await prisma.file.create({
                  data: {
                    name: option.file.name,
                    url: option.file.url,
                    type: option.file.type as FileType,
                  },
                })
              : undefined;
            return {
              name: option.name,
              price: option.price,
              fileId: file ? file.id : undefined,
            };
          })
        ),
      },
    },
  });
  console.log(`Created design with id: ${createdDesign.id}`);

  console.log("Seeding design finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
