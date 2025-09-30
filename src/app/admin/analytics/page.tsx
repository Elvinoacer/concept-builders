
import AnalyticsHeader from "@/components/admin/analytics/AnalyticsHeader";
import StatCard from "@/components/admin/analytics/StatCard";
import { statsData, textChartColors } from "@/lib/dummydata";
import WebsiteTrafficChart from "@/components/admin/analytics/WebsiteTrafficChart";
import ProductViewsChart from "@/components/admin/analytics/ProductViewsChart";
import ReferralSourcesChart from "@/components/admin/analytics/ReferralSourcesChart";
import ConversionRateChart from "@/components/admin/analytics/ConversionRateChart";

const AnalyticsPage = () => {
  
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
