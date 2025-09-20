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
