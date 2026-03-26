type UploadLike = {
  url: string;
  name?: string;
  originalFileName?: string;
};

type PackageOptionLike = {
  name: string;
  price: string | number;
  file?: UploadLike[];
};

type DocumentCollectionLike = {
  pdfFiles?: UploadLike[];
  cadFiles?: UploadLike[];
  excelFiles?: UploadLike[];
};

type DesignPayloadInput = {
  name: string;
  description: string;
  bedrooms?: string;
  bathrooms?: string;
  area?: string;
  floors?: string;
  categoryId: string;
  folderId?: string;
  architecturalPdfPrice?: string;
  architecturalCadPrice?: string;
  structuralPdfPrice?: string;
  structuralCadPrice?: string;
  billOfQuantitiesPrice?: string;
  billOfQuantitiesPdfPrice?: string;
  images: UploadLike[];
  floorPlans: UploadLike[];
  files: UploadLike[];
  architecturalDesign: DocumentCollectionLike;
  structuralDesign: DocumentCollectionLike;
  billOfQuantities: DocumentCollectionLike;
  packageOptions: PackageOptionLike[];
};

type FilePayload = {
  name: string;
  url: string;
  type: string;
};

const toFilePayloadList = (files: UploadLike[], type: string): FilePayload[] =>
  files.map((file) => ({
    name:
      file.originalFileName ||
      file.name ||
      decodeURIComponent(file.url.split("/").pop() || "file"),
    url: file.url,
    type,
  }));

const parseIntOrNull = (value?: string) => {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseFloatOrNull = (value?: string) => {
  if (!value) return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export function buildDesignUpsertPayload(input: DesignPayloadInput) {
  const archPdfPrice = parseFloatOrNull(input.architecturalPdfPrice) || 0;
  const archCadPrice = parseFloatOrNull(input.architecturalCadPrice) || 0;
  const structPdfPrice = parseFloatOrNull(input.structuralPdfPrice) || 0;
  const structCadPrice = parseFloatOrNull(input.structuralCadPrice) || 0;
  const boqExcelPrice = parseFloatOrNull(input.billOfQuantitiesPrice) || 0;
  const boqPdfPrice = parseFloatOrNull(input.billOfQuantitiesPdfPrice) || 0;

  const basePrice = archPdfPrice;
  const totalPrice =
    archPdfPrice +
    archCadPrice +
    structPdfPrice +
    structCadPrice +
    boqExcelPrice +
    boqPdfPrice;

  const packageOptions = input.packageOptions
    .filter((opt) => opt.name?.trim() && `${opt.price}`.trim() !== "")
    .map((opt) => {
      const firstFile = opt.file?.[0];

      return {
        name: opt.name,
        price: Number.parseFloat(`${opt.price}`) || 0,
        ...(firstFile
          ? {
              file: {
                create: {
                  name:
                    firstFile.originalFileName ||
                    firstFile.name ||
                    decodeURIComponent(
                      firstFile.url.split("/").pop() || "file",
                    ),
                  url: firstFile.url,
                  type: "FILE",
                },
              },
            }
          : {}),
      };
    });

  return {
    name: input.name,
    description: input.description,
    basePrice,
    priceRange: `${basePrice.toLocaleString()} - ${totalPrice.toLocaleString()}`,
    bedrooms: parseIntOrNull(input.bedrooms),
    bathrooms: parseIntOrNull(input.bathrooms),
    area: parseFloatOrNull(input.area),
    floors: parseIntOrNull(input.floors),
    categoryId: input.categoryId,
    folderId: input.folderId,
    architecturalPdfPrice: archPdfPrice || null,
    architecturalCadPrice: archCadPrice || null,
    structuralPdfPrice: structPdfPrice || null,
    structuralCadPrice: structCadPrice || null,
    billOfQuantitiesPrice: boqExcelPrice || null,
    billOfQuantitiesPdfPrice: boqPdfPrice || null,
    images: { create: toFilePayloadList(input.images, "IMAGE") },
    floorPlans: { create: toFilePayloadList(input.floorPlans, "FLOOR_PLAN") },
    files: { create: toFilePayloadList(input.files, "FILE") },
    architecturalDesign: {
      pdfFiles: toFilePayloadList(
        input.architecturalDesign.pdfFiles || [],
        "PDF",
      ),
      cadFiles: toFilePayloadList(
        input.architecturalDesign.cadFiles || [],
        "CAD",
      ),
    },
    structuralDesign: {
      pdfFiles: toFilePayloadList(input.structuralDesign.pdfFiles || [], "PDF"),
      cadFiles: toFilePayloadList(input.structuralDesign.cadFiles || [], "CAD"),
    },
    billOfQuantities: {
      excelFiles: toFilePayloadList(
        input.billOfQuantities.excelFiles || [],
        "EXCEL",
      ),
      pdfFiles: toFilePayloadList(input.billOfQuantities.pdfFiles || [], "PDF"),
    },
    packageOptions: {
      create: packageOptions,
    },
  };
}
