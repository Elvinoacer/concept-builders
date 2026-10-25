export type FileAsset = {
  id: string;
  url: string | null;
  name: string;
  type: string;
};
export type DetailPhoto = FileAsset & { url: string };
export type PackageOption = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
};
type DesignDoc = {
  pdfFiles?: FileAsset[];
  cadFiles?: FileAsset[];
  excelFiles?: FileAsset[];
};
export type DesignDetailPayload = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  floors: number | null;
  views: number;
  categoryId: string | null;
  category?: { id: string; name: string } | null;
  planDetails: string[];
  isFeatured: boolean;
  images: FileAsset[];
  floorPlans: FileAsset[];
  packageOptions: PackageOption[];
  faq: unknown;
  architecturalPdfPrice: number | null;
  architecturalCadPrice: number | null;
  structuralPdfPrice: number | null;
  structuralCadPrice: number | null;
  billOfQuantitiesPrice: number | null;
  billOfQuantitiesPdfPrice: number | null;
  architecturalDesign?: DesignDoc | null;
  structuralDesign?: DesignDoc | null;
  billOfQuantities?: DesignDoc | null;
};
export type RelatedDesignPayload = Pick<
  DesignDetailPayload,
  "id" | "name" | "basePrice"
> & {
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  category?: { name: string } | null;
  images?: FileAsset[];
};
export type NeighborDesignPayload = {
  prev: { id: string; name: string } | null;
  next: { id: string; name: string } | null;
};
export type DocumentOption = {
  key: string;
  label: string;
  description: string;
  available: boolean;
  included: boolean;
  price: number;
};
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export function planPrice(value: number) {
  return money.format(value);
}
export function planName(name: string) {
  const code = name.match(/\((CB[\w-]+)\)\s*$/i);
  const plain = code ? name.slice(0, code.index).trim() : name;
  return {
    code: code?.[1],
    title:
      plain === plain.toUpperCase()
        ? plain.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
        : plain,
  };
}
export function documentOptions(design: DesignDetailPayload): DocumentOption[] {
  return [
    {
      key: "architecturalPdf",
      label: "Architectural PDF",
      description: "Architectural drawings in PDF format",
      available: Boolean(design.architecturalDesign?.pdfFiles?.length),
      included: true,
      price: 0,
    },
    {
      key: "architecturalCad",
      label: "Architectural CAD",
      description: "Editable architectural drawings",
      available: Boolean(design.architecturalDesign?.cadFiles?.length),
      included: false,
      price: design.architecturalCadPrice ?? 0,
    },
    {
      key: "structuralPdf",
      label: "Structural PDF",
      description: "Structural engineering drawings",
      available: Boolean(design.structuralDesign?.pdfFiles?.length),
      included: false,
      price: design.structuralPdfPrice ?? 0,
    },
    {
      key: "structuralCad",
      label: "Structural CAD",
      description: "Editable structural drawings",
      available: Boolean(design.structuralDesign?.cadFiles?.length),
      included: false,
      price: design.structuralCadPrice ?? 0,
    },
    {
      key: "billOfQuantitiesExcel",
      label: "Bill of quantities · Excel",
      description: "Material and cost breakdown in Excel",
      available: Boolean(design.billOfQuantities?.excelFiles?.length),
      included: false,
      price: design.billOfQuantitiesPrice ?? 0,
    },
    {
      key: "billOfQuantitiesPdf",
      label: "Bill of quantities · PDF",
      description: "Material and cost breakdown in PDF",
      available: Boolean(design.billOfQuantities?.pdfFiles?.length),
      included: false,
      price: design.billOfQuantitiesPdfPrice ?? 0,
    },
  ];
}
export function floorPlanName(file: FileAsset, index: number) {
  const text = file.name || file.url || "";
  if (/^(g|gf)\.(jpg|jpeg|png|webp)$/i.test(file.name) || /ground/i.test(text))
    return "Ground floor";
  if (
    /^(f|ff)\.(jpg|jpeg|png|webp)$/i.test(file.name) ||
    /first|1st/i.test(text)
  )
    return "First floor";
  if (/second|2nd/i.test(text)) return "Second floor";
  if (/roof/i.test(text)) return "Roof plan";
  return `Floor plan ${String(index + 1).padStart(2, "0")}`;
}

export function packageTotal(
  basePrice: number,
  options: DocumentOption[],
  selectedFiles: string[],
  extras: PackageOption[],
): number {
  const drawings = options
    .filter(
      (option) =>
        option.available &&
        !option.included &&
        selectedFiles.includes(option.key),
    )
    .reduce((sum, option) => sum + option.price, 0);
  return (
    basePrice + drawings + extras.reduce((sum, extra) => sum + extra.price, 0)
  );
}
