import { useState } from 'react';
import { motion } from 'framer-motion';
import { BuildingCostEstimate, Design, costEstimateIcons, costBreakdown } from '@/lib/dummydata';
import { Button } from '@/components/ui/button';
import PricingCalculatorModal from './PricingCalculatorModal';

const CostEstimate: React.FC<CostEstimateProps> = ({ estimates, design }) => {
  const [openBreakdown, setOpenBreakdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const newEstimates = (estimates || []).filter(e => e.name.toLowerCase() === 'basic' || e.name.toLowerCase() === 'luxury');

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Building Cost Estimates</h2>
        <div className="space-y-4">
          {newEstimates.map((estimate, index) => (
            <motion.div
              key={estimate.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 border-l-4 border-blue-500 rounded-r-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="flex items-start gap-4">
                  <div className="text-3xl">{costEstimateIcons[estimate.name]}</div>
                  <div className='flex-1'>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{estimate.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{estimate.description}</p>
                      <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-2">{estimate.priceRange}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setOpenBreakdown(openBreakdown === estimate.name ? null : estimate.name)}>
                      {openBreakdown === estimate.name ? 'Hide' : 'Show'} Breakdown
                  </Button>
              </div>
              {openBreakdown === estimate.name && (
                  <div className="mt-4 pl-10">
                      <h4 className="font-semibold text-md mb-2 dark:text-white">Cost Breakdown</h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {estimate.costBreakdown.map(item => (
                              <li key={item.item} className="flex justify-between">
                                  <span>{item.item}</span>
                                  <span>{item.cost}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              )}
            </motion.div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button size="lg" onClick={() => setIsModalOpen(true)}>
              <span className="material-symbols-outlined mr-2">calculate</span>
              Pricing Calculator
          </Button>
        </div>
      </div>
      <PricingCalculatorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} design={design} />
    </>
  );
};

export default CostEstimate;
