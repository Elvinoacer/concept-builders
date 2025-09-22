'use client';

import { motion } from 'framer-motion';
import { CalculatorOption } from '@/lib/types';

interface PricingCalculatorProps {
  options: CalculatorOption[];
  onOptionToggle: (id: string) => void;
}

const PricingCalculator: React.FC<PricingCalculatorProps> = ({ options, onOptionToggle }) => {
  return (
    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
      <h4 className="font-bold text-lg dark:text-white mb-4">Customize Your Package</h4>
      <div className="space-y-4">
        {options.map((option) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                id={option.id}
                checked={option.checked}
                onChange={() => onOptionToggle(option.id)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={option.id} className="ml-3 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300">
                {option.icon && <span className="material-symbols-outlined mr-2">{option.icon}</span>}
                {option.name}
                {option.id === 'video' && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">New</span>}
              </label>
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">+${option.price.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PricingCalculator;
