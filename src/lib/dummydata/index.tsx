import { SVGProps } from "react";

export interface BuildingCostEstimate {
  name: "Basic" | "Standard" | "Premium" | "Luxury";
  description: string;
  priceRange: string;
}

export interface CalculatorOption {
  id: string;
  name: string;
  price: number;
  checked: boolean;
  icon?: string;
}

export interface Design {
  id: number;
  name: string;
  basePrice: number;
  description: string;
  images: { url: string; type: string }[];
  renderings: { url: string }[];
  floorPlanUrl: string;
  planDetails: string[];
  faq: { question: string; answer: string }[];
  buildingCostEstimates: BuildingCostEstimate[];
  reviews: { rating: number; comment: string; author: string }[];
  relatedDesigns: {
    name: string;
    description: string;
    price: string;
    imageUrl: string;
  }[];
  tags: { name: string; color: string }[];
  priceRange: string;
  fileTypes: string[];
  drawingSetsOptions: { name: string }[];
  calculatorOptions?: CalculatorOption[];
}

export interface Message {
  id: number;
  type: "sent" | "received";
  sender: {
    name: string;
    avatar: string;
  };
  time: string;
  content: string;
  attachment?: {
    name: string;
    size: string;
    preview: string;
  };
}

export interface Stat {
  label: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  color?: string;
}

export interface Cost {
  service: string;
  cost: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: string;
}



export interface Purchase {
  id: number;
  name: string;
  purchaseDate: string;
  price: number;
}

export * from "./customDesign";

export * from "./designsPage";
export * from "./designDetailPage";
export * from "./chat";
export * from "./analytics";
export * from "./content";

export * from "./folders";
export * from "./orders";
export * from "./team";
export * from "./users";
export * from "./messages";
export * from "./notifications";
export * from "./projects";
export * from "./projectDetails";
export const costEstimateIcons = {
  Basic: "🏠",
  Luxury: "🏛️",
};

export const costBreakdown = {
  Basic: [
    { item: "Foundation & Structure", cost: "$20,000 - $30,000" },
    { item: "Exterior Finishes", cost: "$15,000 - $25,000" },
    { item: "Interior Finishes", cost: "$25,000 - $40,000" },
    { item: "Plumbing & Electrical", cost: "$10,000 - $15,000" },
  ],
  Luxury: [
    { item: "Reinforced Foundation & Structure", cost: "$40,000 - $60,000" },
    { item: "Premium Exterior Finishes", cost: "$35,000 - $55,000" },
    { item: "High-End Interior Finishes", cost: "$50,000 - $80,000" },
    { item: "Advanced Plumbing & Electrical", cost: "$20,000 - $30,000" },
  ],
};





export const designTabIcons = {
  Basic: "🏠",
  Standard: "🏡",
  Premium: "🏛️",
};

export const locationMultipliers = [
  { name: "Urban Area", value: 1.2 },
  { name: "Suburban Area", value: 1.0 },
  { name: "Rural Area", value: 0.8 },
];

export const finishQualityMultipliers = {
  Basic: 1.0,
  "Mid-Range": 1.5,
  Luxury: 2.0,
};

export const fileTypePrices = {
  PDF: 0,
  CAD: 100,
  "PDF & CAD": 150,
};

export const adminStats = {
  totalSales: 125000,
  totalVisitors: 50000,
  conversionRate: 2.5,
  totalOrders: 150,
  kpis: [
    { title: 'Total Revenue', key: 'totalSales', prefix: '$', change: '+12.5%', icon: 'monetization_on' },
    { title: 'Total Visitors', key: 'totalVisitors', prefix: '', change: '+8.2%', icon: 'people' },
    { title: 'Conversion Rate', key: 'conversionRate', suffix: '%', change: '-1.8%', icon: 'touch_app' },
    { title: 'Total Orders', key: 'totalOrders', prefix: '', change: '+5.3%', icon: 'shopping_cart' },
  ],
  trendingProducts: [
    { id: 1, name: "Modern Farmhouse", sales: 25 },
    { id: 2, name: "Luxury Duplex", sales: 18 },
    { id: 3, name: "Cozy Apartment", sales: 12 },
  ],
  trafficSources: [
    { source: "Google", visitors: 20000 },
    { source: "Facebook", visitors: 15000 },
    { source: "Instagram", visitors: 10000 },
    { source: "Direct", visitors: 5000 },
  ],
  monthlySales: [
    { month: "Jan", sales: 10000 },
    { month: "Feb", sales: 12000 },
    { month: "Mar", sales: 15000 },
    { month: "Apr", sales: 13000 },
    { month: "May", sales: 18000 },
    { month: "Jun", sales: 20000 },
  ],
};



export const contactHeader = {
  title: "Get in Touch",
  description:
    "We're here to help. Reach out to us with any questions or feedback.",
};

export const contactInfo = [
  {
    icon: "call",
    title: "Phone",
    value: "254741360865",
  },
  {
    icon: "email",
    title: "Email",
    value: "support@conceptbuilders.com",
  },
  {
    icon: "chat",
    title: "Live Chat",
    value: "Chat with us now",
  },
];

export const location = {
  position: { lat: -0.303043, lng: 36.059429 },
  destination: "Concept+Builders",
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=-0.303043,36.059429`,
  apiKey: "AIzaSyA4LjOh_5kbr4YzACmeRUaFwcr5-JV10q4",
};

export const aboutHeader = {
  title: "Building Dreams, One Home at a Time",
  description:
    "Concept Builders is a leading architectural design and construction platform dedicated to transforming your dream home into a reality. We offer a comprehensive suite of services, from initial design concepts to final construction, ensuring a seamless and personalized experience for every client.",
};

export const mission = {
  title: "Our Mission",
  description:
    "Our mission is to empower individuals and families to create their ideal living spaces by providing innovative, sustainable, and cost-effective architectural solutions. We strive to deliver exceptional quality and customer satisfaction, making the journey of building a home an enjoyable and rewarding experience.",
};

export const vision = {
  title: "Our Vision",
  description:
    "We envision a future where everyone has access to high-quality architectural design and construction services, regardless of their budget or location. We aim to be the go-to platform for homeowners, builders, and architects, fostering collaboration and innovation in the industry.",
};

export const values = [
  {
    title: "Innovation",
    description:
      "We are committed to pushing the boundaries of architectural design and construction, constantly exploring new technologies and techniques to deliver innovative and sustainable solutions.",
    image:
      "https://www.klepierre.com/assets/f1920x1080-q85/bd703d88/building_intelligent_modeling.jpg",
  },
  {
    title: "Quality",
    description:
      "We are dedicated to delivering the highest quality of workmanship and materials, ensuring that every project we undertake is built to last and exceeds our clients' expectations.",
    image:
      "https://totalfix-ng.com/wp-content/uploads/2013/06/3d-building-560x200.jpg",
  },
  {
    title: "Integrity",
    description:
      "We believe in honesty, transparency, and ethical practices in all our dealings with clients, partners, and employees. We are committed to building trust and long-lasting relationships.",
    image:
      "https://www.langryndt.com/wp-content/uploads/2024/11/thesiliconreview-reinforcing-steel-essential-for-structural-integrity.webp",
  },
  {
    title: "Collaboration",
    description:
      "We foster a collaborative environment where clients, architects, and builders work together to achieve a shared vision. We believe that the best results are achieved through open communication and teamwork.",
    image:
      "https://imageio.forbes.com/specials-images/imageserve/62cf20533d9cf5a643bce373/Partnership-of-business-concept--Group-of-businessperson--Customer-support--Teamwork-/960x0.jpg?format=jpg&width=960",
  },
];

export const slides = [
  {
    title: "Build Your Dream Home",
    description:
      "Explore our curated collection of house plans and start your journey to homeownership today.",
    image: "/images/banner-1.png",
  },
  {
    title: "Luxurious and Affordable Designs",
    description:
      "Find the perfect balance of luxury and affordability with our wide range of house plans.",
    image: "/images/banner-2.png",
  },
  {
    title: "Customizable Plans to Fit Your Needs",
    description:
      "Our team of experts can help you customize any of our plans to create your perfect home.",
    image: "/images/banner-3.png",
  },
];

export const steps = [
  {
    number: 1,
    title: "Explore & Discover",
    description:
      "Browse our curated collection of house plans. Use filters to find the perfect design that fits your lifestyle and budget.",
    icon: "search",
  },
  {
    number: 2,
    title: "Purchase & Customize",
    description:
      "Securely purchase your chosen plan. Opt for our customization services to tweak the design to your exact specifications.",
    icon: "shopping_cart",
  },
  {
    number: 3,
    title: "Download & Build",
    description:
      "Instantly download your complete architectural drawings and partner with your local builder to bring your dream home to life.",
    icon: "construction",
  },
];

export const marqueeItems = [
  "Architectural Excellence",
  "Innovative Designs",
  "Sustainable Building",
  "Client-Centric Approach",
  "Quality Craftsmanship",
  "Modern Solutions",
];

export interface Testimonial {
  name: string;
  testimonial: string;
  image: string;
  title: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "John Doe",
    testimonial:
      "Concept Builders made our dream home a reality. The process was seamless and the team was a pleasure to work with.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    title: "Homeowner",
  },
  {
    name: "Jane Smith",
    testimonial:
      "The attention to detail and commitment to quality is what sets Concept Builders apart. I highly recommend them.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    title: "Real Estate Developer",
  },
  {
    name: "Peter Jones",
    testimonial:
      "I was impressed with the level of professionalism and expertise. The final result exceeded my expectations.",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    title: "Homeowner",
  },
];

export interface Category {
  name: string;
  image: string;
}

export const categories: Category[] = [
  {
    name: "Bungalows",
    image: "https://www.karmod.com/media/page2/Prefab-Bungalows.jpg",
  },
  {
    name: "Duplexes",
    image:
      "https://res.akamaized.net/domain/image/upload/t_web/c_fill,w_720,h_480/v1564363376/2015392229_1_1_190621_050142-w1920-h1280_ihnkgz.jpg",
  },
  {
    name: "Apartments",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/564730784.jpg?k=62d1662f0d9c9c35b55c38772bc26b0e295894082a5b4b8a69f790c4991286a9&o=&hp=1",
  },
  {
    name: "Modern",
    image:
      "https://i0.wp.com/integrum.co.ke/wp-content/uploads/2025/07/best-home-design-in-Kenya-for-country-houses-1-scaled.webp?fit=1024%2C768&ssl=1",
  },
  {
    name: "Traditional",
    image: "https://newtrad.org/wp-content/uploads/2018/10/balt.jpg",
  },
  {
    name: "Luxury",
    image:
      "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/izdcG.gHez5Y/v1/-1x-1.webp",
  },
];

export interface DesignCard {
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

export const designs: DesignCard[] = [
  {
    id: 1,
    name: "Modern Minimalist Home",
    category: "Modern",
    description:
      "A beautiful and spacious modern home with a minimalist design.",
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
    description:
      "A charming cottage perfect for a small family or as a vacation home.",
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
    description:
      "An expansive and luxurious villa with all the modern amenities.",
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





export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/design-showcase", label: "Design Showcase" },
  { href: "/designs", label: "Plans" },
  { href: "/custom-design", label: "Custom Design" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export const footerLinks = {
  about: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/custom-design", label: "Custom Design" },
  ],
  legal: [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/refund", label: "Refund Policy" },
  ],
  contact: [
    { href: "/contact", label: "Contact Us", icon: "email" },
    { href: "/support/chat", label: "Live Chat", icon: "chat_bubble" },
  ],
};

export const socialLinks = [
  {
    href: "#",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    ),
  },
  {
    href: "#",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 2.8 3.2 2.8 5.5 0 3.9-3.1 7.1-7 7.1-3.9 0-7-3.2-7-7.1 0-2.3 1.2-4.1 2.8-5.5-1.3-1.3-2-3.4-2-3.4s-1.4 2.8-1.4 5.5c0 4.9 3.9 8.9 8.6 8.9s8.6-4 8.6-8.9c0-2.7-1.4-5.5-1.4-5.5z"></path>
        <path d="M12 22v-7.5"></path>
      </svg>
    ),
  },
  {
    href: "#",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
  },
  {
    href: "#",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect width="4" height="12" x="2" y="9"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
  },
];
