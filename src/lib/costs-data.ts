
import { Cost } from "./types";

export const costsData: Cost[] = [
  {
    service: "DigitalOcean Usage",
    cost: "$250.00",
    change: "10% vs last month",
    changeType: "increase",
    icon: "storage",
  },
  {
    service: "Email Costs (Resend)",
    cost: "$50.00",
    change: "5% vs last month",
    changeType: "decrease",
    icon: "email",
  },
  {
    service: "Hosting Bills",
    cost: "$100.00",
    change: "2% vs last month",
    changeType: "increase",
    icon: "dns",
  },
];

export const historicalCostData = [
  { name: "Jan", value: 109 },
  { name: "Feb", value: 21 },
  { name: "Mar", value: 41 },
  { name: "Apr", value: 93 },
  { name: "May", value: 33 },
  { name: "Jun", value: 101 },
  { name: "Jul", value: 61 },
  { name: "Aug", value: 45 },
  { name: "Sep", value: 121 },
  { name: "Oct", value: 149 },
  { name: "Nov", value: 1 },
  { name: "Dec", value: 81 },
];
