"use client";
import { useEffect, useState } from "react";
import AnalyticsHeader from "@/components/admin/analytics/AnalyticsHeader";
import StatCard from "@/components/admin/analytics/StatCard";
import WebsiteTrafficChart from "@/components/admin/analytics/WebsiteTrafficChart";
import ProductViewsChart from "@/components/admin/analytics/ProductViewsChart";
import ReferralSourcesChart from "@/components/admin/analytics/ReferralSourcesChart";
import ConversionRateChart from "@/components/admin/analytics/ConversionRateChart";
import { textChartColors } from "@/lib/analytics-data";

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState("Last 30 Days");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/admin/analytics?timePeriod=${timePeriod}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const data = await res.json();
        setAnalyticsData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-background text-foreground">
      <div className="flex flex-col gap-8 p-4 md:p-8">
        <AnalyticsHeader
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {analyticsData?.statsData.map((stat: any, index: number) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              color={textChartColors[index]}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <WebsiteTrafficChart data={analyticsData?.websiteTrafficData} />
          <ProductViewsChart data={analyticsData?.productViewsData} />
          <ReferralSourcesChart data={analyticsData?.referralSourcesData} />
          <ConversionRateChart data={analyticsData?.conversionRateData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
