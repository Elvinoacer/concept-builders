const { FileType } = require('../src/generated/prisma');

const categoriesData = [
  {
    name: "Bungalows",
    image: "/images/banner-1.png",
  },
  {
    name: "Duplexes",
    image: "/images/banner-2.png",
  },
  {
    name: "Apartments",
    image: "/images/banner-3.png",
  },
  {
    name: "Modern",
    image: "/images/banner-1.png",
  },
  {
    name: "Traditional",
    image: "/images/banner-2.png",
  },
  {
    name: "Luxury",
    image: "/images/banner-3.png",
  },
  {
    name: "Mansion",
    image: "/images/banner-1.png",
  },
  {
    name: "Tiny Homes",
    image: "/images/banner-2.png",
  },
  {
    name: "Farmhouse",
    image: "/images/banner-3.png",
  }
];

const designsData = [
  {
    name: "Modern Minimalist Home",
    category: "Modern",
    description:
      "A beautiful and spacious modern home with a minimalist design.",
    basePrice: 999,
    priceRange: "$999 - $4999",
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    floors: 2,
    planDetails: ["Detailed Floor Plans", "3D Renderings", "Electrical Plans"],
    packageOptions: [
      { name: "architecturalPdf", price: 50 },
      { name: "architecturalCad", price: 100 },
    ],
  },
  {
    name: "Cozy Cottage",
    category: "Traditional",
    description:
      "A charming cottage perfect for a small family or as a vacation home.",
    basePrice: 799,
    priceRange: "$799 - $3999",
    bedrooms: 2,
    bathrooms: 1,
    area: 1500,
    floors: 1,
    planDetails: ["Detailed Floor Plans", "3D Renderings", "Electrical Plans"],
    packageOptions: [
      { name: "architecturalPdf", price: 40 },
      { name: "structuralPdf", price: 80 },
    ],
  },
  {
    name: "Luxury Villa",
    category: "Luxury",
    description:
      "An expansive and luxurious villa with all the modern amenities.",
    basePrice: 1999,
    priceRange: "$1999 - $9999",
    bedrooms: 5,
    bathrooms: 4,
    area: 5000,
    floors: 2,
    planDetails: ["Detailed Floor Plans", "3D Renderings", "Electrical Plans"],
    packageOptions: [
      { name: "architecturalPdf", price: 100 },
      { name: "architecturalCad", price: 200 },
      { name: "structuralPdf", price: 150 },
      { name: "structuralCad", price: 300 },
      { name: "billOfQuantities", price: 250 },
    ],
  },
  {
    name: "The Grandeur",
    category: "Mansion",
    description: "A magnificent mansion for those who demand the very best.",
    basePrice: 4999,
    priceRange: "$4999 - $19999",
    bedrooms: 8,
    bathrooms: 10,
    area: 12000,
    floors: 3,
    planDetails: ["Detailed Floor Plans", "3D Renderings", "Electrical Plans", "Smart Home Integration"],
    packageOptions: [
      { name: "architecturalPdf", price: 250 },
      { name: "architecturalCad", price: 500 },
      { name: "structuralPdf", price: 400 },
      { name: "structuralCad", price: 800 },
      { name: "billOfQuantities", price: 700 },
    ],
  },
  {
    name: "The Homesteader",
    category: "Farmhouse",
    description: "A classic farmhouse with a modern twist.",
    basePrice: 1299,
    priceRange: "$1299 - $6999",
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    floors: 2,
    planDetails: ["Detailed Floor Plans", "3D Renderings", "Electrical Plans", "Barn and Stable Plans"],
    packageOptions: [
      { name: "architecturalPdf", price: 70 },
      { name: "structuralPdf", price: 120 },
      { name: "billOfQuantities", price: 100 },
    ],
  },
  {
    name: "The Urbanite",
    category: "Apartments",
    description: "A stylish and compact apartment for city living.",
    basePrice: 599,
    priceRange: "$599 - $2999",
    bedrooms: 1,
    bathrooms: 1,
    area: 800,
    floors: 1,
    planDetails: ["Detailed Floor Plans", "3D Renderings", "Electrical Plans"],
    packageOptions: [
      { name: "architecturalPdf", price: 30 },
    ],
  },
  {
    name: "The Weekender",
    category: "Tiny Homes",
    description: "A small and efficient home for weekend getaways.",
    basePrice: 299,
    priceRange: "$299 - $1999",
    bedrooms: 1,
    bathrooms: 1,
    area: 400,
    floors: 1,
    planDetails: ["Detailed Floor Plans", "3D Renderings", "Electrical Plans"],
    packageOptions: [
      { name: "architecturalPdf", price: 20 },
    ],
  },
  {
    name: "The Gemini",
    category: "Duplexes",
    description: "A versatile duplex for multi-generational living or rental income.",
    basePrice: 1599,
    priceRange: "$1599 - $8999",
    bedrooms: 6,
    bathrooms: 4,
    area: 4000,
    floors: 2,
    planDetails: ["Detailed Floor Plans", "3D Renderings", "Electrical Plans"],
    packageOptions: [
      { name: "architecturalPdf", price: 80 },
      { name: "structuralPdf", price: 130 },
      { name: "billOfQuantities", price: 110 },
    ],
  }
];

module.exports = {
  categoriesData,
  designsData,
};
