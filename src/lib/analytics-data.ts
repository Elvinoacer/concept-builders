
import { Stat } from "./types";

export const statsData: Stat[] = [
  {
    label: "Traffic",
    value: "12,345",
    change: "+12%",
    changeType: "increase",
  },
  {
    label: "Product Views",
    value: "8,765",
    change: "-5%",
    changeType: "decrease",
  },
  {
    label: "Referrals",
    value: "3,456",
    change: "+8%",
    changeType: "increase",
  },
  {
    label: "Conversion Rate",
    value: "5.2%",
    change: "+2%",
    changeType: "increase",
  },
];

export const websiteTrafficData = [
  { name: "Jan", value: 192.5 },
  { name: "Feb", value: 37 },
  { name: "Mar", value: 72 },
  { name: "Apr", value: 163 },
  { name: "May", value: 58 },
  { name: "Jun", value: 177 },
  { name: "Jul", value: 107 },
  { name: "Aug", value: 79 },
  { name: "Sep", value: 212 },
  { name: "Oct", value: 256 },
  { name: "Nov", value: 2 },
  { name: "Dec", value: 142 },
];

export const productViewsData = [
  { name: "Product A", value: 90 },
  { name: "Product B", value: 50 },
  { name: "Product C", value: 40 },
  { name: "Product D", value: 30 },
  { name: "Product E", value: 90 },
  { name: "Product F", value: 30 },
  { name: "Product G", value: 50 },
];

export const referralSourcesData = [
  { name: "Google", value: 1250, percentage: 85 },
  { name: "Facebook", value: 980, percentage: 70 },
  { name: "Instagram", value: 750, percentage: 60 },
  { name: "Direct", value: 520, percentage: 45 },
  { name: "Other", value: 310, percentage: 25 },
];

export const conversionRateData = {
  converted: 80,
  rate: 5.2,
};

export const textChartColors = [
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-red-500",
  "text-purple-500",
  "text-pink-500",
  "text-indigo-500",
  "text-gray-500",
];
