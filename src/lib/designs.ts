// src/lib/designs.ts

export interface Design {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  pricing: {
    pdf: number;
    cad: number;
    fullPackage: number; // Includes construction cost estimates, etc.
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    area: number; // in sq. ft.
    floors: number;
  };
}

export const designs: Design[] = [
  {
    id: 1,
    name: "Modern Minimalist Home",
    category: "Modern",
    description: "A beautiful and spacious modern home with a minimalist design.",
    image: "/images/banner-1.png",
    pricing: {
      pdf: 999,
      cad: 2499,
      fullPackage: 4999,
    },
    details: {
      bedrooms: 3,
      bathrooms: 2,
      area: 2200,
      floors: 2,
    },
  },
  {
    id: 2,
    name: "Cozy Cottage",
    category: "Traditional",
    description: "A charming cottage perfect for a small family or as a vacation home.",
    image: "/images/banner-2.png",
    pricing: {
      pdf: 799,
      cad: 1999,
      fullPackage: 3999,
    },
    details: {
      bedrooms: 2,
      bathrooms: 1,
      area: 1500,
      floors: 1,
    },
  },
  {
    id: 3,
    name: "Luxury Villa",
    category: "Luxury",
    description: "An expansive and luxurious villa with all the modern amenities.",
    image: "/images/banner-3.png",
    pricing: {
      pdf: 1999,
      cad: 4999,
      fullPackage: 9999,
    },
    details: {
      bedrooms: 5,
      bathrooms: 4,
      area: 5000,
      floors: 2,
    },
  },
];