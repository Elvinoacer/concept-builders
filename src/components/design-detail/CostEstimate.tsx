import { BuildingCostEstimate } from '@/lib/types';
import { motion } from 'framer-motion';

interface CostEstimateProps {
  estimates: BuildingCostEstimate[];
}

const icons = {
  Basic: '🏠',
  Standard: '🏡',
  Premium: '🏛️',
};

const CostEstimate: React.FC<CostEstimateProps> = ({ estimates }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Building Cost Estimates</h2>
      <div className="space-y-4">
        {estimates.map((estimate, index) => (
          <motion.div
            key={estimate.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 border-l-4 border-blue-500 rounded-r-lg bg-gray-50 dark:bg-gray-700/50 flex items-start gap-4"
          >
            <div className="text-3xl">{icons[estimate.name]}</div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{estimate.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{estimate.description}</p>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-2">{estimate.priceRange}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CostEstimate;

