
import AnalyticsHeader from "@/components/admin/analytics/AnalyticsHeader";
import StatCard from "@/components/admin/analytics/StatCard";
import { statsData } from "@/lib/analytics-data";
import WebsiteTrafficChart from "@/components/admin/analytics/WebsiteTrafficChart";
import ProductViewsChart from "@/components/admin/analytics/ProductViewsChart";
import ReferralSourcesChart from "@/components/admin/analytics/ReferralSourcesChart";
import ConversionRateChart from "@/components/admin/analytics/ConversionRateChart";

const AnalyticsPage = () => {
  const textChartColors = ["text-chart-1", "text-chart-2", "text-chart-3", "text-chart-4"];
  return (
    <div className="w-full max-w-7xl mx-auto bg-background text-foreground">
      <div className="flex flex-col gap-8 p-4 md:p-8">
        <AnalyticsHeader />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
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
          <WebsiteTrafficChart />
          <ProductViewsChart />
          <ReferralSourcesChart />
          <ConversionRateChart />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
