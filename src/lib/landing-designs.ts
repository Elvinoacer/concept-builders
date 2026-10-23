import { landingImageUrl } from "./landing-media";

export type LandingImage = { url: string; name?: string; type?: string | null };

export type LandingDesign = {
  id?: string;
  name: string;
  category?: { name?: string | null } | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  basePrice?: number;
  isFeatured?: boolean;
  images?: LandingImage[];
};

export type LandingPlan = {
  id?: string;
  name: string;
  category: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  basePrice?: number;
  images: LandingImage[];
};

export function toLandingPlan(design: LandingDesign): LandingPlan | null {
  const seen = new Set<string>();
  const images = (design.images ?? []).filter((image) => {
    if (!image.url || seen.has(image.url)) return false;
    if (image.type && image.type !== "IMAGE") return false;
    seen.add(image.url);
    return true;
  });
  if (!images.length) return null;
  return {
    id: design.id,
    name: design.name,
    category: design.category?.name?.trim() || "House plans",
    bedrooms: design.bedrooms,
    bathrooms: design.bathrooms,
    area: design.area,
    basePrice: design.basePrice,
    images: images.map((image) => ({
      ...image,
      url: landingImageUrl(image.url),
    })),
  };
}

export function imageLabel(image: LandingImage, index: number): string {
  let name = image.name ?? image.url.split("/").pop() ?? "";
  try {
    name = decodeURIComponent(name);
  } catch {
    /* Retain a malformed filename as an unlabeled view. */
  }
  if (/aerial|top.down/i.test(name)) return "Aerial view";
  if (/rear|back.elevation/i.test(name)) return "Rear elevation";
  if (/front/i.test(name)) return "Front elevation";
  if (/side/i.test(name)) return "Side view";
  return `Perspective ${String(index + 1).padStart(2, "0")}`;
}

export function planDestination(plan: LandingPlan): string {
  if (plan.id) return `/designs/${plan.id}`;
  return `/custom-design?${new URLSearchParams({ style: plan.category, image: plan.images[0].url })}`;
}

export function planFacts(plan: LandingPlan): string[] {
  return [
    plan.bedrooms ? `${plan.bedrooms} beds` : null,
    plan.bathrooms ? `${plan.bathrooms} baths` : null,
    plan.area ? `${plan.area.toLocaleString()} sq ft` : null,
  ].filter((fact): fact is string => Boolean(fact));
}

// Verified against the published catalog on 24 October 2026. The local poster
// is an optimized copy of this record's A_2 exterior, keeping arrival independent
// of database latency. Opening the preview fetches all current published views.
export const CINEMATIC_HOME: LandingPlan = {
  id: "cmtw3ljrq001b04leoivjo3py",
  name: "FIVE BEDROOM VILLA MAISONETTE (CB3023)",
  category: "Villas",
  images: [
    {
      url: "/images/landing/cb3023-arrival.webp",
      name: "Front elevation",
      type: "IMAGE",
    },
  ],
};

// Existing public architectural renders from public/cloudimages.md. These are
// inspiration galleries, with no invented catalog IDs, prices, or room counts.
const cdn = "https://cdn.conceptbuilders.co.ke/design_images";
function publicImages(folder: string, names: string[]): LandingImage[] {
  return names.map((name) => ({
    name,
    url: landingImageUrl(
      `${cdn}/${encodeURIComponent(folder)}/${encodeURIComponent(name)}`,
    ),
  }));
}

export const EDITORIAL_HOMES: LandingPlan[] = [
  {
    name: "The contemporary villa",
    category: "Maisonettes",
    images: publicImages("DAVENS NJORO", [
      "Maisonette_Contemporary_Villa2.jpg",
      "Maisonette_Contemporary_Villa4.jpg",
      "Top-Down_Aerial_View.jpg",
      "Maisonette_Contemporary_Villa1.jpg",
      "Maisonette_Contemporary_Villa3.jpg",
      "Maisonette_Contemporary_Villa5.jpg",
    ]),
  },
  {
    name: "The modern bungalow",
    category: "Bungalows",
    images: publicImages("DAVID 3BD", [
      "modern_3-bedroombungalow1.jpg",
      "modern_3-bedroombungalow2.jpg",
      "modern_3-bedroombungalow3.jpg",
    ]),
  },
  {
    name: "The courtyard bungalow",
    category: "Bungalows",
    images: publicImages("DOUGLAS UK", [
      "4-Bedroom_L-Shaped_Bungalow_Front_Elevation1.jpg",
      "4-Bedroom_L-Shaped_Bungalow_Aerial1.jpg",
      "4-Bedroom_L-Shaped_Bungalow_Side1.jpg",
    ]),
  },
  {
    name: "The urban apartment",
    category: "Apartments",
    images: publicImages("ELLY KUTWA", [
      "Modern_5-Storey_Apartment_Block_Front_Facade1.jpg",
      "Modern_5-Storey_Apartment_Block_Front_Facade2.jpg",
      "Modern_5-Storey_Apartment_Block_Rear_Elevation1.jpg",
    ]),
  },
];

export type PreviewHandler = (
  plan: LandingPlan,
  collection: LandingPlan[],
) => void;
