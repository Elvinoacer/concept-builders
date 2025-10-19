'use client';

import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { ScrollArea } from "@/components/ui/scroll-area";

const BuildingCostEstimatesModal = ({ estimates, onClose, formatPrice }) => {
  if (!estimates || estimates.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Building Cost Estimates</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiX size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {estimates.map((estimate, index) => (
                <div key={index} className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border dark:border-gray-600 flex flex-col">
                  <h4 className="text-xl font-semibold capitalize text-gray-800 dark:text-white">
                    {estimate.tier} Finish
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 mb-4 flex-grow">
                    {estimate.description}
                  </p>
                  <div className="space-y-3 border-t border-gray-200 dark:border-gray-600 pt-4">
                    {estimate.costBreakdown.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300 w-2/3 truncate">
                          {item.item}
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white text-base">
                          {formatPrice(item.cost)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-500 mt-4 pt-4">
                      <div className="flex justify-between items-center font-bold text-lg">
                          <span className="text-gray-800 dark:text-white">Total</span>
                          <span className="text-blue-600 dark:text-blue-400">
                              {formatPrice(estimate.costBreakdown.reduce((acc, item) => acc + parseFloat(item.cost), 0))}
                          </span>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BuildingCostEstimatesModal;
