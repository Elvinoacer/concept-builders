'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CostEstimate from './CostEstimate';

const CostToBuildTab = ({ design }) => {
  const [activeTier, setActiveTier] = useState('basic');

  const basicEstimate = design.buildingCostEstimates.find(e => e.tier.toLowerCase() === 'basic');
  const luxuryEstimate = design.buildingCostEstimates.find(e => e.tier.toLowerCase() === 'luxury');

  const handleTierChange = (tier) => {
    setActiveTier(tier);
  };

  const currentEstimate = activeTier === 'basic' ? basicEstimate : luxuryEstimate;

  if (!basicEstimate || !luxuryEstimate) {
    return <p>Cost estimates are not available for this design.</p>;
  }

  const estimates = design.buildingCostEstimates
    ? Object.entries(design.buildingCostEstimates as any).map(
        ([name, value]) => ({ name, ...(value as object) })
      )
    : [];

  return (
    <div className="text-gray-800 dark:text-gray-200">
      <div className="flex justify-center mb-8">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex">
          <button
            onClick={() => handleTierChange('basic')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTier === 'basic' ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => handleTierChange('luxury')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTier === 'luxury' ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Luxury
          </button>
        </div>
      </div>

      <motion.div
        key={activeTier}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div>
          <h4 className="text-xl font-bold mb-4">{currentEstimate.tier} Finish</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{currentEstimate.description}</p>
          <div className="space-y-4">
            {currentEstimate.costBreakdown.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <span>{item.item}</span>
                <span className="font-semibold">{`${parseFloat(item.cost).toLocaleString()}`}</span>
              </div>
            ))}
          </div>
        </div>
        <CostEstimate estimates={estimates} design={design} />
      </motion.div>
    </div>
  );
};

export default CostToBuildTab;
