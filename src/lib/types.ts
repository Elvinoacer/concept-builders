export interface BuildingCostEstimate {
  name: 'Basic' | 'Standard' | 'Premium';
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
  type: 'sent' | 'received';
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

export interface BlogPost {
  title: string;
  author: string;
  status: string;
  publishedDate: string;
}

export interface Purchase {
  id: number;
  name: string;
  purchaseDate: string;
  price: number;
}
