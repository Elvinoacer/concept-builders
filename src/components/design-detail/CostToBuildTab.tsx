'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, PlusCircle } from 'lucide-react';

const CostToBuildTab = ({ design }) => {
  const [activeTier, setActiveTier] = useState('basic');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const basicEstimate = design.buildingCostEstimates.find(e => e.tier.toLowerCase() === 'basic');
  const luxuryEstimate = design.buildingCostEstimates.find(e => e.tier.toLowerCase() === 'luxury');

  const handleTierChange = (tier) => {
    setActiveTier(tier);
  };

  const handleOptionToggle = (option) => {
    setSelectedOptions(prev =>
      prev.some(item => item.name === option.name)
        ? prev.filter(item => item.name !== option.name)
        : [...prev, option]
    );
  };

  const currentEstimate = activeTier === 'basic' ? basicEstimate : luxuryEstimate;
  const optionsTotal = selectedOptions.reduce((total, option) => total + option.price, 0);
  const totalCost = (currentEstimate ? currentEstimate.costBreakdown.reduce((acc, item) => acc + parseFloat(item.cost), 0) : 0) + optionsTotal;

  if (!basicEstimate || !luxuryEstimate) {
    return <p>Cost estimates are not available for this design.</p>;
  }

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
                <span className="font-semibold">{`$${parseFloat(item.cost).toLocaleString()}`}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h4 className="text-xl font-bold mb-4">Cost Calculator</h4>
            <div className="space-y-3">
              {design.calculatorOptions.map((option, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all ${
                    selectedOptions.some(item => item.name === option.name)
                      ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => handleOptionToggle(option)}
                >
                  <div className="flex items-center">
                    {selectedOptions.some(item => item.name === option.name) ? (
                      <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                    ) : (
                      <PlusCircle className="w-5 h-5 text-gray-500 mr-3" />
                    )}
                    <span>{option.name}</span>
                  </div>
                  <span className="font-semibold">${option.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Estimated Cost:</span>
                <span>${totalCost.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This is an estimate and does not include the cost of land or site preparation. Prices may vary based on your location and chosen materials.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CostToBuildTab;
