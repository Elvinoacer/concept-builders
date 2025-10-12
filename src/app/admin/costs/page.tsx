"use client";

import { useEffect, useState } from "react";
import CostCard from "@/components/admin/costs/CostCard";
import CostsHeader from "@/components/admin/costs/CostsHeader";
import HistoricalCostChart from "@/components/admin/costs/HistoricalCostChart";
// import { costsData } from "@/lib/costs-data"; // Removed as we will fetch dynamically

const CostsPage = () => {
  const [digitalOceanCosts, setDigitalOceanCosts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDigitalOceanCosts = async () => {
      try {
        const res = await fetch("/api/admin/digitalocean-costs");
        if (!res.ok) {
          throw new Error("Failed to fetch DigitalOcean costs");
        }
        const data = await res.json();
        setDigitalOceanCosts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDigitalOceanCosts();
  }, []);

  const staticCostsData = [
    // Example static data, you can fetch these from other APIs or manage them differently
    {
      service: "Resend Emails",
      cost: "25.00",
      change: "+5%",
      changeType: "increase",
      icon: "email",
    },
    {
      service: "Hosting (Vercel)",
      cost: "20.00",
      change: "-2%",
      changeType: "decrease",
      icon: "cloud",
    },
  ];

  const allCostsData = [
    ...(digitalOceanCosts
      ? [
          {
            service: "DigitalOcean Spaces",
            cost: digitalOceanCosts.totalUsage
              ? `$${digitalOceanCosts.totalUsage.toFixed(2)}`
              : "$0.00",
            change: "+0%", // Placeholder
            changeType: "increase", // Placeholder
            icon: "storage",
            details: `Storage: ${digitalOceanCosts.storageUsedGB} GB, Bandwidth: ${digitalOceanCosts.bandwidthUsedGB} GB`,
          },
        ]
      : []),
    ...staticCostsData,
  ];

  if (loading) {
    return <div className="flex-1 p-4 md:p-10">Loading costs...</div>;
  }

  if (error) {
    return (
      <div className="flex-1 p-4 md:p-10 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-10">
      <div className="flex flex-col gap-8">
        <CostsHeader />
        <section>
          <h2 className="text-lg md:text-xl font-bold leading-tight tracking-tight mb-2 md:mb-4">
            Current Month Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allCostsData.map((cost, index) => (
              <CostCard
                key={index}
                service={cost.service}
                cost={cost.cost}
                change={cost.change}
                changeType={cost.changeType}
                icon={cost.icon}
                details={cost.details}
              />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold leading-tight tracking-tight mb-4">
            Historical Cost Analysis
          </h2>
          <HistoricalCostChart />
        </section>
      </div>
    </div>
  );
};

export default CostsPage;
