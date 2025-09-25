'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PricingCalculator from './PricingCalculator';
import CostEstimate from './CostEstimate';
import { Design, CalculatorOption, fileTypePrices } from '@/lib/dummydata';

const PurchaseSidebar: React.FC<PurchaseSidebarProps> = ({ design }) => {
  const [selectedFileType, setSelectedFileType] = useState('PDF');
  const [calculatorOptions, setCalculatorOptions] = useState<CalculatorOption[]>(
    design.calculatorOptions || []
  );

  const handleOptionToggle = (id: string) => {
    setCalculatorOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, checked: !option.checked } : option
      )
    );
  };

  const totalPrice = useMemo(() => {
    const basePrice = design.basePrice;
    const fileTypePrice = fileTypePrices[selectedFileType];
    const optionsPrice = calculatorOptions
      .filter((option) => option.checked)
      .reduce((sum, option) => sum + option.price, 0);
    return basePrice + fileTypePrice + optionsPrice;
  }, [design.basePrice, selectedFileType, calculatorOptions]);

  const totalKesPrice = useMemo(() => {
    return totalPrice * 130;
  }, [totalPrice]);

  return (
    <div className="sticky top-24 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          {design.tags.map((tag, index) => (
            <span
              key={index}
              className={`bg-${tag.color}-100 text-${tag.color}-800 text-xs font-semibold px-3 py-1 rounded-full dark:bg-opacity-20 dark:text-${tag.color}-300`}
            >
              {tag.name}
            </span>
          ))}
        </div>

        <fieldset className="mt-4">
          <legend className="text-lg font-bold text-gray-900 dark:text-white mb-2">Select File Type</legend>
          <div className="space-y-3">
            {Object.keys(fileTypePrices).map((fileType) => (
              <label
                key={fileType}
                htmlFor={fileType}
                className={`relative flex items-center justify-between rounded-lg p-4 cursor-pointer transition-all border-2 ${selectedFileType === fileType ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}>
                <input
                  type="radio"
                  id={fileType}
                  name="fileType"
                  value={fileType}
                  checked={selectedFileType === fileType}
                  onChange={() => setSelectedFileType(fileType)}
                  className="sr-only" />
                <span className="font-semibold text-gray-800 dark:text-gray-200">{fileType}</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">+${fileTypePrices[fileType]}</span>
                {selectedFileType === fileType && (
                  <motion.div layoutId="radio-selector" className="absolute -right-3 -top-3 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </motion.div>
                )}
              </label>
            ))}
          </div>
        </fieldset>

        {design.calculatorOptions && (
          <PricingCalculator options={calculatorOptions} onOptionToggle={handleOptionToggle} />
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Total Price:</p>
          <div>
            <AnimatePresence mode="wait">
              <motion.p
                key={totalPrice}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-4xl font-extrabold text-gray-900 dark:text-white text-right"
              >
                ${totalPrice.toLocaleString()}
              </motion.p>
            </AnimatePresence>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-right">
              KES {totalKesPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 rounded-xl h-14 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-lg font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Buy Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 rounded-xl h-14 px-6 bg-gray-200 text-gray-800 text-lg font-bold tracking-wide hover:bg-gray-300 transition-all dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 whitespace-nowrap"
          >
            <span className="material-symbols-outlined"> shopping_cart </span>
            Add to Cart
          </motion.button>
        </div>
      </div>
      <CostEstimate estimates={design.buildingCostEstimates} design={design} />
    </div>
  );
};

export default PurchaseSidebar;
