import { FileType } from "../src/generated/prisma/client";
import { createPrismaClient } from "./client";

const { prisma, pool } = createPrismaClient();

/**
 * Design data derived from cloudimages.md
 * Each entry represents one design with its cloud-hosted images.
 * Categories are mapped to match existing ones where possible.
 */
const cloudDesigns = [
  {
    name: "Maisonette Contemporary Villa",
    category: "Maisonettes",
    description:
      "A striking contemporary maisonette villa featuring a spacious compound layout with a dedicated guest wing. The design showcases modern architectural lines with expansive outdoor areas, offering luxury and privacy in a multi-unit residential setting.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Maisonette_Contemporary_Villa2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Compound.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Maisonette_Contemporary_Villa1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Top-Down_Aerial_View.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/The_Guest_Wing3.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/The_Guest_Wing2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/The_Guest_Wing1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Maisonette_Contemporary_Villa9.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Maisonette_Contemporary_Villa8.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Maisonette_Contemporary_Villa7.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Maisonette_Contemporary_Villa6.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Maisonette_Contemporary_Villa5.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Maisonette_Contemporary_Villa4.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVENS%20NJORO/Maisonette_Contemporary_Villa3.jpg",
    ],
  },
  {
    name: "Modern 3-Bedroom Bungalow",
    category: "Bungalows",
    description:
      "A sleek modern 3-bedroom bungalow with clean geometric lines and a flat roof design. Features include a stylish fence and gate design, multiple exterior perspectives, and a well-thought-out layout suited for compact to medium-sized plots.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    bedrooms: 3,
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow3.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow4.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow5.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow6.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow7.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow8.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow9.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow10.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow11.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow12.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow13.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow14.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow15.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow16.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow_fenceview.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DAVID%203BD/modern_3-bedroombungalow_gateview.jpg",
    ],
  },
  {
    name: "4-Bedroom L-Shaped Bungalow",
    category: "Bungalows",
    description:
      "A distinctive 4-bedroom L-shaped bungalow offering generous living spaces with an efficient layout. Showcased through aerial views, front elevation perspectives, and multiple side angles that highlight the unique L-shaped footprint and contemporary façade treatment.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    bedrooms: 4,
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/DOUGLAS%20UK/4-Bedroom_L-Shaped_Bungalow_Aerial1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DOUGLAS%20UK/4-Bedroom_L-Shaped_Bungalow_Aerial2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DOUGLAS%20UK/4-Bedroom_L-Shaped_Bungalow_Front_Elevation1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DOUGLAS%20UK/4-Bedroom_L-Shaped_Bungalow_Front_Elevation2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DOUGLAS%20UK/4-Bedroom_L-Shaped_Bungalow_Front_Elevation3.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DOUGLAS%20UK/4-Bedroom_L-Shaped_Bungalow_Side1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DOUGLAS%20UK/4-Bedroom_L-Shaped_Bungalow_Side2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DOUGLAS%20UK/4-Bedroom_L-Shaped_Bungalow_Side3.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/DOUGLAS%20UK/4-Bedroom_L-Shaped_Bungalow_Side4.jpg",
    ],
  },
  {
    name: "Modern 5-Storey Apartment Block",
    category: "Apartments",
    description:
      "A modern 5-storey apartment block design featuring a bold contemporary façade with front, rear, and side elevation views. Ideal for urban residential development, the design balances aesthetic appeal with functional multi-unit living spaces.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    floors: 5,
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/ELLY%20KUTWA/Modern_5-Storey_Apartment_Block_Front_Facade1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/ELLY%20KUTWA/Modern_5-Storey_Apartment_Block_Front_Facade2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/ELLY%20KUTWA/Modern_5-Storey_Apartment_Block_Front_Facade3.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/ELLY%20KUTWA/Modern_5-Storey_Apartment_Block_Rear_Elevation1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/ELLY%20KUTWA/Modern_5-Storey_Apartment_Block_Rear_Elevation2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/ELLY%20KUTWA/Modern_5-Storey_Apartment_Block_Rear_Elevation3.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/ELLY%20KUTWA/Modern_5-Storey_Apartment_Block_Side_Elevation1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/ELLY%20KUTWA/Modern_5-Storey_Apartment_Block_Side_Elevation2.jpg",
    ],
  },
  {
    name: "Townhouse Community",
    category: "Townhouses",
    description:
      "A comprehensive townhouse community design featuring aerial views of the entire development, individual unit perspectives, architectural details, main gate entrances, streetscapes, and side elevations. A complete residential estate concept designed for modern community living.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Aerial_Views1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Aerial_Views2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Aerial_Views3.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Aerial_Views4.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Aerial_Views5.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Architectural_Detail1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Architectural_Detail2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Direct_Individual_Unit_Perspectives1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Direct_Individual_Unit_Perspectives2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Direct_Individual_Unit_Perspectives3.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Main_Gate1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Main_Gate2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Overcast.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Side1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Side2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Streetscape1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Streetscape2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/GICHURU%20REAL%20ESTATE/Townhouse_Community_Streetscape3.jpg",
    ],
  },
  {
    name: "Modern 3-Bedroom Flat-Roof Home",
    category: "Bungalows",
    description:
      "A modern 3-bedroom flat-roof home presented with interior living space renders, floor plan layouts, rear elevation views, and multiple three-quarter exterior perspectives. A design that blends contemporary exterior aesthetics with thoughtfully designed interior spaces.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    bedrooms: 3,
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/IRUNGU/Modern_3-Bedroom_Flat-Roof_Interior_Design_Living_Spaces1.jpeg",
      "https://cdn.conceptbuilders.co.ke/design_images/IRUNGU/Modern_3-Bedroom_Flat-Roof_Interior_Design_Living_Spaces2.jpeg",
      "https://cdn.conceptbuilders.co.ke/design_images/IRUNGU/Modern_3-Bedroom_Flat-Roof_Interior_Design_Living_Spaces3.jpeg",
      "https://cdn.conceptbuilders.co.ke/design_images/IRUNGU/Modern_3-Bedroom_Flat-Roof_Layouts1.jpeg",
      "https://cdn.conceptbuilders.co.ke/design_images/IRUNGU/Modern_3-Bedroom_Flat-Roof_Layouts2.jpeg",
      "https://cdn.conceptbuilders.co.ke/design_images/IRUNGU/Modern_3-Bedroom_Flat-Roof_Rear_Elevations.jpeg",
      "https://cdn.conceptbuilders.co.ke/design_images/IRUNGU/Modern_3-Bedroom_Flat-Roof_Three-Quarter_Exterior_Perspectives1.jpeg",
      "https://cdn.conceptbuilders.co.ke/design_images/IRUNGU/Modern_3-Bedroom_Flat-Roof_Three-Quarter_Exterior_Perspectives2.jpeg",
      "https://cdn.conceptbuilders.co.ke/design_images/IRUNGU/Modern_3-Bedroom_Flat-Roof_Three-Quarter_Exterior_Perspectives3.jpeg",
      "https://cdn.conceptbuilders.co.ke/design_images/IRUNGU/Modern_3-Bedroom_Flat-Roof_Three-Quarter_Exterior_Perspectives4.jpeg",
      "https://cdn.conceptbuilders.co.ke/design_images/IRUNGU/Modern_3-Bedroom_Flat-Roof_Three-Quarter_Exterior_Perspectives5.jpeg",
    ],
  },
  {
    name: "Modern 4-Bedroom Luxury Maisonette",
    category: "Maisonettes",
    description:
      "An elegant 4-bedroom luxury maisonette design combining spacious multi-level living with premium architectural finishes. Features a grand exterior with contemporary styling, designed for families seeking upscale duplex-style accommodation.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    bedrooms: 4,
    floors: 2,
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/JAMES%20MERCY%20NJERI/RENDERS%2001/Modern%204-Bedroom%20Luxury%20Maisonette1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JAMES%20MERCY%20NJERI/RENDERS%2001/Modern%204-Bedroom%20Luxury%20Maisonette2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JAMES%20MERCY%20NJERI/RENDERS%2001/Modern%204-Bedroom%20Luxury%20Maisonette3.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JAMES%20MERCY%20NJERI/RENDERS%2001/Modern%204-Bedroom%20Luxury%20Maisonette4.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JAMES%20MERCY%20NJERI/RENDERS%2001/Modern%204-Bedroom%20Luxury%20Maisonette5.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JAMES%20MERCY%20NJERI/RENDERS%2001/Modern%204-Bedroom%20Luxury%20Maisonette6.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JAMES%20MERCY%20NJERI/RENDERS%2001/Modern%204-Bedroom%20Luxury%20Maisonette7.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JAMES%20MERCY%20NJERI/RENDERS%2001/Modern%204-Bedroom%20Luxury%20Maisonette8.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JAMES%20MERCY%20NJERI/RENDERS%2001/Modern%204-Bedroom%20Luxury%20Maisonette9.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JAMES%20MERCY%20NJERI/RENDERS%2001/Modern%204-Bedroom%20Luxury%20Maisonette10.jpg",
    ],
  },
  {
    name: "Modern Luxury English Country Cottage",
    category: "Cottages",
    description:
      "A modern reinterpretation of the classic English country cottage, blending timeless charm with contemporary luxury. Features traditional cottage proportions enhanced with modern materials, landscaping, and premium finishes throughout.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/JASON/Modern%20Luxury%20English%20Country%20Cottage1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JASON/Modern%20Luxury%20English%20Country%20Cottage2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JASON/Modern%20Luxury%20English%20Country%20Cottage3.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JASON/Modern%20Luxury%20English%20Country%20Cottage4.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JASON/Modern%20Luxury%20English%20Country%20Cottage5.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JASON/Modern%20Luxury%20English%20Country%20Cottage6.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JASON/Modern%20Luxury%20English%20Country%20Cottage7.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JASON/Modern%20Luxury%20English%20Country%20Cottage8.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JASON/Modern%20Luxury%20English%20Country%20Cottage9.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JASON/Modern%20Luxury%20English%20Country%20Cottage10.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JASON/Modern%20Luxury%20English%20Country%20Cottage11.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/JASON/Modern%20Luxury%20English%20Country%20Cottage12.jpg",
    ],
  },
  {
    name: "The Oasis Infinity-Edge Vista Pool",
    category: "Landscaping & Outdoors",
    description:
      "A luxury infinity-edge pool design offering panoramic vista views. The Oasis concept features a resort-style pool area with elegant landscaping, perfect as an add-on to premium residential properties or standalone outdoor living design.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool1.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool2.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool3.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool4.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool5.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool6.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool7.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool8.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool9.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool10.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool11.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool12.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool13.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool14.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool15.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool16.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool17.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool18.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/POOL/The%20Oasis%20Infinity-Edge%20Vista%20Pool19.jpg",
    ],
  },
];

/**
 * Extract a human-readable image name from its URL.
 * e.g. "Modern%204-Bedroom%20Luxury%20Maisonette1.jpg" → "Modern 4-Bedroom Luxury Maisonette 1"
 */
function imageNameFromUrl(url: string): string {
  const filename = decodeURIComponent(url.split("/").pop() || "image");
  // Remove extension
  return filename.replace(/\.(jpg|jpeg|png|webp)$/i, "");
}

async function main() {
  console.log("🌱 Starting cloud designs seed...\n");

  // Track created categories so we don't hit the DB repeatedly
  const categoryCache = new Map<string, string>();

  for (const designData of cloudDesigns) {
    // 1. Ensure category exists (upsert by name)
    let categoryId = categoryCache.get(designData.category);

    if (!categoryId) {
      const existing = await prisma.category.findUnique({
        where: { name: designData.category },
      });

      if (existing) {
        categoryId = existing.id;
        console.log(`  ↳ Using existing category: "${designData.category}"`);
      } else {
        const created = await prisma.category.create({
          data: {
            name: designData.category,
          },
        });
        categoryId = created.id;
        console.log(`  ↳ Created new category: "${designData.category}"`);
      }

      categoryCache.set(designData.category, categoryId);
    }

    // 2. Create the Design with its images in a single transaction
    const createdDesign = await prisma.design.create({
      data: {
        name: designData.name,
        description: designData.description,
        basePrice: designData.basePrice,
        priceRange: designData.priceRange,
        categoryId: categoryId,
        bedrooms: designData.bedrooms ?? null,
        floors: designData.floors ?? null,
        planDetails: [],
        buildingCostEstimates: [],
        faq: [],
        // Create images as File records linked via the "DesignImages" relation
        images: {
          create: designData.images.map((url) => ({
            name: imageNameFromUrl(url),
            url: url,
            type: FileType.IMAGE,
          })),
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    console.log(
      `✅ Created design: "${createdDesign.name}" (${createdDesign.images.length} images) → Category: "${createdDesign.category?.name}"`
    );
  }

  console.log(
    `\n🎉 Cloud designs seed completed! ${cloudDesigns.length} designs created.`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
