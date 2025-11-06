"use client";

import CostCalculator from "@/components/cost-calculator/CostCalculator";

const CostCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-4 xs:py-6 sm:py-8">
        <CostCalculator />
      </div>
    </div>
  );
};

export default CostCalculatorPage;
