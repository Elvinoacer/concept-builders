
import CostCard from "@/components/admin/costs/CostCard";
import CostsHeader from "@/components/admin/costs/CostsHeader";
import HistoricalCostChart from "@/components/admin/costs/HistoricalCostChart";
import { costsData } from "@/lib/costs-data";

const CostsPage = () => {
  return (
    <div className="flex-1 p-4 md:p-10">
      <div className="flex flex-col gap-8">
        <CostsHeader />
        <section>
          <h2 className="text-lg md:text-xl font-bold leading-tight tracking-tight mb-2 md:mb-4">
            Current Month Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {costsData.map((cost, index) => (
              <CostCard
                key={index}
                service={cost.service}
                cost={cost.cost}
                change={cost.change}
                changeType={cost.changeType}
                icon={cost.icon}
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
