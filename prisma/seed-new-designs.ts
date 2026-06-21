import { FileType, ProjectCategory, ProjectStatus } from "../src/generated/prisma/client";
import { createPrismaClient } from "./client";

const { prisma, pool } = createPrismaClient();

// ─── Design data parsed from public/new_designs.md ──────────────────────────

const newDesigns = [
  {
    name: "Contemporary High-End Villa",
    category: "Villas",
    description:
      "A breathtaking contemporary high-end villa that redefines luxury living. This design features bold geometric volumes, floor-to-ceiling glazing, and expansive outdoor terraces that blur the line between interior and exterior spaces. The villa showcases a dramatic double-height living area, a rooftop entertainment deck, and meticulously landscaped grounds with mature trees. Premium materials including natural stone cladding, hardwood accents, and frameless glass balustrades create an atmosphere of refined elegance throughout.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    bedrooms: 5,
    bathrooms: 6,
    floors: 2,
    area: 650,
    isFeatured: true,
    planDetails: [
      "Double-height living area",
      "Rooftop entertainment deck",
      "Floor-to-ceiling glazing",
      "Natural stone cladding",
      "Landscaped compound",
      "Staff quarters",
      "3-car garage",
      "Infinity pool ready",
    ],
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682274.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682275.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682276.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682277.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682278.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682279.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682280.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682281.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682282.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682283.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682284.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682285.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682286.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682287.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682288.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682289.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682290.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682291.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682292.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Contemporary_High-End_Villa_Design/5839352555878682293.jpg",
    ],
  },
  {
    name: "Modern Commercial Complex",
    category: "Commercial",
    description:
      "A striking modern commercial complex designed for mixed-use business operations. The building features a sleek curtain-wall glass façade, bold cantilevered overhangs, and a welcoming ground-level retail arcade. The design accommodates office suites, retail spaces, and a rooftop terrace ideal for corporate events. Sustainability is at the forefront with provisions for solar panels, rainwater harvesting, and natural ventilation strategies that reduce operational costs.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    floors: 4,
    area: 1200,
    isFeatured: false,
    planDetails: [
      "Curtain-wall glass façade",
      "Ground-floor retail arcade",
      "Open-plan office floors",
      "Rooftop corporate terrace",
      "Solar panel ready",
      "Ample basement parking",
      "ADA-compliant access",
      "Fire escape stairwells",
    ],
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Commercial/A_1%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Commercial/A_2%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Commercial/A_3%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Commercial/A_4%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Commercial/A_5%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Commercial/A_6%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Commercial/A_7%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Commercial/A_8%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Commercial/A_9%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Commercial/A_10%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Commercial/A_11%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Commercial/A_12%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Commercial/A_13%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Commercial/A_14%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Commercial/A_15%20-%20Photo.jpg",
    ],
  },
  {
    name: "Modern Contemporary Residential Architecture",
    category: "Maisonettes",
    description:
      "An architecturally bold contemporary residential design that pushes the boundaries of modern living. Featuring an asymmetric roofline, expansive glass walls, and cantilevered upper floors, this home creates dramatic visual interest from every angle. The open-concept interior flows seamlessly to covered patios and a private garden courtyard. Designed for the discerning homeowner who values both form and function, with premium finishes including exposed concrete, timber cladding, and powder-coated aluminium detailing.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    bedrooms: 4,
    bathrooms: 4,
    floors: 2,
    area: 380,
    isFeatured: true,
    planDetails: [
      "Asymmetric roofline design",
      "Cantilevered upper floors",
      "Garden courtyard",
      "Open-concept living",
      "Covered outdoor patios",
      "Exposed concrete finishes",
      "Timber cladding accents",
      "Smart home wiring ready",
    ],
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_1%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_2%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_3%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_4%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_5%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_6%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_7%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_8%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_9%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_10%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_11%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_12%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_13%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_14%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_15%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/Modern_Contemporary_Residential_Architecture/A_16%20-%20Photo.jpg",
    ],
  },
  {
    name: "Modern Contemporary Residential House",
    category: "Maisonettes",
    description:
      "A sophisticated modern contemporary residential house designed for comfortable family living. This design balances warmth and modernity with a combination of stone veneer, clean white render, and dark window frames that create a timeless yet current aesthetic. The home features generous living spaces, a master suite with a private balcony, and flexible rooms that adapt to the homeowner's lifestyle. The landscaped garden and paved driveway complete the picture of suburban luxury.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    bedrooms: 4,
    bathrooms: 3,
    floors: 2,
    area: 320,
    isFeatured: false,
    planDetails: [
      "Stone veneer accents",
      "Master suite with balcony",
      "Flexible bonus room",
      "Landscaped front garden",
      "Double carport",
      "Utility / laundry room",
      "Guest washroom on ground floor",
      "Energy-efficient design",
    ],
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/modern_contemporary_residential_house_designs/A_9%20-%20Photo%20(1).jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/modern_contemporary_residential_house_designs/A_10%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/modern_contemporary_residential_house_designs/A_11%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/modern_contemporary_residential_house_designs/A_12%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/modern_contemporary_residential_house_designs/A_13%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/modern_contemporary_residential_house_designs/A_14%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/modern_contemporary_residential_house_designs/A_15%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/modern_contemporary_residential_house_designs/A_16%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupa/modern_contemporary_residential_house_designs/A_17%20-%20Photo.jpg",
    ],
  },
  {
    name: "Modern Contemporary Villa",
    category: "Villas",
    description:
      "A refined modern contemporary villa that harmonises minimalist architecture with lavish proportions. The design features a clean horizontal profile with floating roof planes, wrap-around verandas, and large pivot doors that open onto manicured gardens. Interiors are defined by double-volume spaces, a floating staircase, and floor-to-ceiling windows that flood every room with natural light. A perfect blend of indoor-outdoor living for tropical and temperate climates.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    bedrooms: 4,
    bathrooms: 5,
    floors: 2,
    area: 480,
    isFeatured: true,
    planDetails: [
      "Floating roof planes",
      "Wrap-around verandas",
      "Pivot entry doors",
      "Double-volume spaces",
      "Floating staircase",
      "Manicured gardens",
      "Indoor-outdoor flow",
      "Guest suite with en-suite",
    ],
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Contemporary_Villa/A_12%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Contemporary_Villa/A_14%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Contemporary_Villa/A_16%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Contemporary_Villa/A_18%20-%20Photo.jpg",
    ],
  },
  {
    name: "Modern Luxury Villa",
    category: "Villas",
    description:
      "An opulent modern luxury villa designed for those who demand the finest in residential architecture. This expansive estate features a dramatic curving façade, multiple outdoor entertainment zones, a private motor court, and resort-style amenities including a swimming pool and spa area. The design incorporates premium materials such as travertine stone, brushed brass fixtures, and engineered hardwood flooring. Every space has been crafted to deliver an unparalleled living experience, from the grand foyer to the panoramic rooftop lounge.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    bedrooms: 6,
    bathrooms: 7,
    floors: 2,
    area: 850,
    isFeatured: true,
    planDetails: [
      "Grand foyer entrance",
      "Private motor court",
      "Swimming pool & spa",
      "Rooftop panoramic lounge",
      "Home cinema room",
      "Wine cellar",
      "Staff quarters",
      "4-car garage",
      "Smart home automation",
      "Travertine stone finishes",
    ],
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_1%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_2%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_3%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_4%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_5%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_6%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_7%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_8%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_9%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_10%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_11%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_12%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_13%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_14%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_15%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_16%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_17%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_18%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_19%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_20%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_21%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_22%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_23%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_24%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_25%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_26%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_27%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_28%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_29%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_30%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/A_31%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/B_32%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/B_33%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Modern_Luxury_Villa/B_34%20-%20Photo.jpg",
    ],
  },
  {
    name: "Neo-Classical Blend Residence",
    category: "Villas",
    description:
      "A magnificent neo-classical blend residence that marries the grandeur of classical architecture with the comforts of contemporary design. The façade features symmetrical proportions, ornamental columns, arched windows, and decorative cornices rendered in a modern palette. Inside, the home boasts a sweeping central staircase, coffered ceilings, and formal reception rooms alongside casual family spaces. This design appeals to homeowners who appreciate timeless elegance complemented by modern functionality and technology integration.",
    basePrice: 0,
    priceRange: "Contact for pricing",
    bedrooms: 5,
    bathrooms: 6,
    floors: 2,
    area: 720,
    isFeatured: true,
    planDetails: [
      "Symmetrical classical façade",
      "Ornamental columns & cornices",
      "Arched window features",
      "Sweeping central staircase",
      "Coffered ceilings",
      "Formal reception rooms",
      "Family living wing",
      "Landscaped formal gardens",
      "Staff quarters",
      "3-car garage with workshop",
    ],
    images: [
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_1%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_2%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_3%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_4%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_5%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_6%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_7%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_8%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_9%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_10%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_11%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_12%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_13%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_14%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_15%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_16%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_17%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_18%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_19%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_20%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_21%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_22%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_23%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_24%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_25%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_26%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_27%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_28%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_29%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_30%20-%20Photo.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/Neo-Classical_Blend/A_31%20-%20Photo.jpg",
    ],
  },
];

// ─── Ongoing Projects ───────────────────────────────────────────────────────

const ongoingProjects = [
  {
    title: "Riverside Modern Residence",
    slug: "riverside-modern-residence",
    description:
      "A contemporary 4-bedroom residential project currently under construction in a prime riverside location. The build features reinforced concrete framing with modern finishes, large window openings for natural light, and a carefully landscaped compound.",
    clientName: "Private Client",
    location: "Nairobi, Kenya",
    status: ProjectStatus.IN_PROGRESS,
    category: ProjectCategory.RESIDENTIAL,
    size: "320 sqm",
    highlights: [
      "Reinforced concrete structure",
      "Large window openings",
      "Modern finishes",
      "Landscaped compound",
    ],
    featuredImage:
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/projects/5816906597228285725.jpg",
    gallery: [
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/projects/5816906597228285725.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/projects/5816906597228285726.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/projects/5816906597228285727.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/projects/5816906597228285728.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/projects/5816906597228285729.jpg",
    ],
    published: true,
  },
  {
    title: "Hillside Contemporary Villa",
    slug: "hillside-contemporary-villa",
    description:
      "An ambitious hillside villa project taking shape with panoramic views. The construction showcases precision masonry work, a multi-level layout that follows the natural terrain, and provisions for a rooftop garden and entertainment area.",
    clientName: "Private Client",
    location: "Kiambu, Kenya",
    status: ProjectStatus.IN_PROGRESS,
    category: ProjectCategory.RESIDENTIAL,
    size: "450 sqm",
    highlights: [
      "Hillside terrain integration",
      "Multi-level layout",
      "Panoramic views",
      "Rooftop garden provisions",
    ],
    featuredImage:
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/projects/5816906597228285730.jpg",
    gallery: [
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/projects/5816906597228285730.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/projects/5816906597228285731.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/projects/5816906597228285732.jpg",
    ],
    published: true,
  },
  {
    title: "Garden Estate Family Home",
    slug: "garden-estate-family-home",
    description:
      "A warm and inviting family home project nearing completion in a serene garden estate. This build features a combination of face brick and rendered walls, a spacious living-dining layout, and generous outdoor spaces including a paved barbecue area and children's play zone.",
    clientName: "Private Client",
    location: "Nakuru, Kenya",
    status: ProjectStatus.NEARING_COMPLETION,
    category: ProjectCategory.RESIDENTIAL,
    size: "280 sqm",
    highlights: [
      "Face brick & render combo",
      "Spacious living-dining layout",
      "Barbecue & outdoor area",
      "Children's play zone",
    ],
    featuredImage:
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/projects/5830081164595629733.jpg",
    gallery: [
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/projects/5830081164595629733.jpg",
      "https://cdn.conceptbuilders.co.ke/design_images/groupb/projects/5830081164595629734.jpg",
    ],
    published: true,
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function imageNameFromUrl(url: string): string {
  const filename = decodeURIComponent(url.split("/").pop() || "image");
  return filename.replace(/\.(jpg|jpeg|png|webp)$/i, "");
}

// ─── Main seed function ─────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting new designs seed...\n");

  // ── 1. Seed Designs ─────────────────────────────────────────────────────

  const categoryCache = new Map<string, string>();

  for (const designData of newDesigns) {
    // Check if a design with the same name already exists
    const existingDesign = await prisma.design.findFirst({
      where: { name: designData.name },
    });

    if (existingDesign) {
      console.log(`  ⏭  Skipping existing design: "${designData.name}"`);
      continue;
    }

    // Ensure category exists
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
          data: { name: designData.category },
        });
        categoryId = created.id;
        console.log(`  ↳ Created new category: "${designData.category}"`);
      }

      categoryCache.set(designData.category, categoryId);
    }

    // Create the design with all related data
    const createdDesign = await prisma.design.create({
      data: {
        name: designData.name,
        description: designData.description,
        basePrice: designData.basePrice,
        priceRange: designData.priceRange,
        categoryId: categoryId,
        bedrooms: designData.bedrooms ?? null,
        bathrooms: designData.bathrooms ?? null,
        floors: designData.floors ?? null,
        area: designData.area ?? null,
        isFeatured: designData.isFeatured ?? false,
        planDetails: designData.planDetails ?? [],
        buildingCostEstimates: [],
        faq: [],
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

  // ── 2. Seed Ongoing Projects ────────────────────────────────────────────

  console.log("\n🏗️  Seeding ongoing projects...\n");

  for (const projectData of ongoingProjects) {
    // Check if a project with the same slug already exists
    const existingProject = await prisma.ongoingProject.findUnique({
      where: { slug: projectData.slug },
    });

    if (existingProject) {
      console.log(
        `  ⏭  Skipping existing project: "${projectData.title}"`
      );
      continue;
    }

    const createdProject = await prisma.ongoingProject.create({
      data: {
        title: projectData.title,
        slug: projectData.slug,
        description: projectData.description,
        clientName: projectData.clientName,
        location: projectData.location,
        status: projectData.status,
        category: projectData.category,
        size: projectData.size,
        highlights: projectData.highlights,
        featuredImage: projectData.featuredImage,
        gallery: projectData.gallery,
        published: projectData.published,
      },
    });

    console.log(`✅ Created ongoing project: "${createdProject.title}"`);
  }

  console.log(
    `\n🎉 Seed completed! ${newDesigns.length} designs and ${ongoingProjects.length} ongoing projects processed.`
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
