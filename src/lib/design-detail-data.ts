import { Design } from "./types";

export const design: Design = {
  name: "Modern Farmhouse",
  basePrice: 500,
  description:
    "A contemporary take on the classic farmhouse style, featuring clean lines, natural materials, and an open floor plan. This design offers a perfect blend of rustic charm and modern convenience.",
  images: [
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6DIQv8NlnmwauEIdaoCDKYKtrdtei7ihU-feojNXa0L6UOTaRCQxgyYC-EjegRB016sR0FFBtEZzDTL5GaiAibKl6CvzIAvnd5GPR_dTXZD69kucJcqU8LHPDzlgcjS8g07rGECyA-KAZs4c7D2V_bwN6htTp17kD79J933EM0Jo3EcnSFOI7MhbFO88Swk5Cv3u7_4bYLOBFs78qQoQJnqRexLpTVvwD4HlXsDLVegBaueaewPYMv6gZoLhJBKHY6A8g99ZPEp0h",
      type: "main",
    },
    {
      url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      type: "3d",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmEhNpKM9kadeQ-JqBcN1OmX3nDh6LCU9TtxKD8uYxhA7LGDgS65Bqyr_F5GZM9yeQ-QZHP3NTK2PjWK_k64oqOh4e1ervZ52AzoysDVxf0rwg4wKFrg2u70S_ap90vvzEgUuL1xrUPQOTvj4wrI40ZIS8NNCFD3NJaXVeILJBgvaPkI2-NUHwhFHQAhb_4te5skfGeR8F59W4dAdtQorjk_113K_bZS7RGQaxa2UxmCbDRah7I2Sqf7ei4k0TV86GdJuhaGWRFgry",
      type: "image",
    },
    {
      url: "https://thumbs.dreamstime.com/b/modern-house-interior-exterior-design-46517595.jpg",
      type: "image",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBG7tPYHOdaBsO7AplC_1-nvLLBpTXwS7hY_2-I8pwPyJskuHWuhOy1PPoapl70eVY4aBWsSdeUC3aMLX0SLw-pvFMtEh_jcIPsEPQ4hJS9ddRzYsQwm7DN5OmFJhH9TcyQR6Ys2m05wwG1Cg4OKCPhXCJ8z9YYegFVSTarVk7GMfwRYrmddBEo12ilkrLPMmPLw_zv0y9IqR3AAOrGVqNZF0RcCQQgQPllmzxAcVZQ2BEPI7JumKOgfdnUF8IFEfJH3S1cXAiHRkz",
      type: "image",
    },
  ],
  renderings: [
    {
      url: "https://archicgi.com/wp-content/uploads/2023/03/3d-rendering-for-home-builders-options.jpg",
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBG7tPYHOdaBsO7AplC_1-nvLLBpTXwS7hY_2-I8pwPyJskuHWuhOy1PPoapl70eVY4aBWsSdeUC3aMLX0SLw-pvFMtEh_jcIPsEPQ4hJS9ddRzYsQwm7DN5OmFJhH9TcyQR6Ys2m05wwG1Cg4OKCPhXCJ8z9YYegFVSTarVk7GMfwRYrmddBEo12ilkrLPMmPLw_zv0y9IqR3AAOrGVqNZF0RcCQQgQPllmzxAcVZQ2BEPI7JumKOgfdnUF8IFEfJH3S1cXAiHRkz",
    },
  ],
  floorPlanUrl:
    "https://cubicasa-wordpress-uploads.s3.amazonaws.com/uploads/2025/08/plus-package.jpg",
  planDetails: [
    "Total Living Area: 2,800 sq. ft.",
    "Bedrooms: 4",
    "Bathrooms: 3.5",
    "Stories: 2",
    "Garage: 3-car attached",
    "Foundation Options: Slab, Crawlspace, Basement",
    "Roof Pitch: 8:12",
    "Exterior Materials: Board & Batten, Stone Accents, Metal Roof",
  ],
  faq: [
    {
      question: "Can I make modifications to this design?",
      answer:
        "Yes, we offer modification services to customize this design to your specific needs and preferences.",
    },
    {
      question: "What's included in the drawing set?",
      answer:
        "Our full drawing set includes floor plans, elevations, sections, foundation plans, roof plans, and electrical layouts.",
    },
    {
      question: "How long does it take to receive the plans?",
      answer:
        "Digital plans are delivered immediately after purchase. Printed plans are shipped within 2-3 business days.",
    },
  ],
  buildingCostEstimates: [
    {
      name: "Basic",
      description: "DIY builders, just want a rough plan to show contractor",
      priceRange: "Lowest price (entry-level)",
    },
    {
      name: "Standard",
      description:
        "People who want clarity during construction and fewer site errors",
      priceRange: "~1.5x cost of Basic",
    },
    {
      name: "Premium",
      description:
        "Clients with bigger budget, want a polished, professional design ready for permit and easy build",
      priceRange: "2x - 3x cost of Basic",
    },
  ],
  reviews: [
    {
      rating: 4.9,
      comment:
        "We built this design last year and couldn't be happier. The open floor plan is perfect for our family, and we've received countless compliments on the exterior design.",
      author: "Michael Johnson, Texas",
    },
    {
      rating: 4.5,
      comment:
        "The plans were detailed and easy to work with. Our builder appreciated the comprehensive documentation. We made a few modifications to suit our lot, but the basic design was perfect.",
      author: "Sarah Williams, Colorado",
    },
  ],
  relatedDesigns: [
    {
      name: "Contemporary House",
      description: "A sleek, modern design.",
      price: "$850.00",
      imageUrl:
        "https://res.cloudinary.com/brickandbatten/images/f_auto,q_auto/v1641000863/wordpress_assets/22826-ModContemporary-Accents_w-GauntletGray-a-ok/22826-ModContemporary-Accents_w-GauntletGray-a-ok.jpg?_i=AA",
    },
    {
      name: "Modern House",
      description: "Minimalist and functional.",
      price: "$1,250.00",
      imageUrl:
        "https://www.exceptionalvillas.com/public/upload/listing_photos_resize/w1900xh1900-Villa-Infinity-1.jpg",
    },
    {
      name: "Rustic House",
      description: "Warm and inviting.",
      price: "$1,100.00",
      imageUrl:
        "https://res.cloudinary.com/brickandbatten/images/f_auto,q_auto/v1640999050/wordpress_assets/27797-RusticTraditional-Seapearl-AmherstGray-a-ok/27797-RusticTraditional-Seapearl-AmherstGray-a-ok.jpg?_i=AA",
    },
    {
      name: "Scandinavian Home",
      description: "Simple and beautiful.",
      price: "$975.00",
      imageUrl:
        "https://www.self-build.co.uk/wp-content/uploads/2022/12/Hannu-Sally-Maki-Log-Home-side-exterior_CREDIT_Nina-Dodd.webp",
    },
  ],
  tags: [
    { name: "Best Seller", color: "green" },
    { name: "New Design", color: "blue" },
  ],
  fileTypes: ["PDF", "CAD", "PDF & CAD"],
  drawingSetsOptions: [
    { name: "Full Set" },
    { name: "Study Set" },
    { name: "Custom Set" },
  ],
  calculatorOptions: [
    {
      id: "architectural-plan",
      name: "Architectural Plan",
      price: 200,
      checked: true,
      icon: "architecture",
    },
    {
      id: "structural-plan",
      name: "Structural Plan",
      price: 300,
      checked: false,
      icon: "construction",
    },
    { id: "boq", name: "Bill of Quantities (BOQ)", price: 250, checked: false, icon: "calculate" },
    { id: "video", name: "Video", price: 100, checked: false, icon: "videocam" },
  ],
};
