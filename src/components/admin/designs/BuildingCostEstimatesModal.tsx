"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiDollarSign, FiHome, FiInfo } from "react-icons/fi";

interface CostBreakdownItem {
  item: string;
  cost: string | number;
}

interface Estimate {
  tier: string;
  description: string;
  costBreakdown: CostBreakdownItem[];
}

interface BuildingCostEstimatesModalProps {
  estimates: Estimate[];
  onClose: () => void;
  formatPrice: (price: number | string) => string;
}

const BuildingCostEstimatesModal = ({
  estimates,
  onClose,
  formatPrice,
}: BuildingCostEstimatesModalProps) => {
  if (!estimates || estimates.length === 0) return null;

  const calculateTotal = (costBreakdown: CostBreakdownItem[]) => {
    return costBreakdown.reduce((acc, item) => {
      const cost =
        typeof item.cost === "string" ? parseFloat(item.cost) : item.cost;
      return acc + (isNaN(cost) ? 0 : cost);
    }, 0);
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "basic":
        return "from-blue-500 to-blue-600";
      case "standard":
        return "from-green-500 to-green-600";
      case "premium":
        return "from-purple-500 to-purple-600";
      case "luxury":
        return "from-amber-500 to-amber-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "basic":
        return "🏠";
      case "standard":
        return "🏡";
      case "premium":
        return "🏘️";
      case "luxury":
        return "🏰";
      default:
        return "🏠";
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm"
        onClick={handleOverlayClick}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl mx-auto flex flex-col max-h-[95dvh] sm:max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex justify-between items-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FiHome size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-bold leading-tight">
                  Building Cost Estimates
                </h3>
                <p className="text-blue-100 text-xs sm:text-sm mt-1">
                  Detailed cost breakdown for each finish level
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <FiX size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {estimates.map((estimate, index) => {
                  const totalCost = calculateTotal(estimate.costBreakdown);
                  const tierColor = getTierColor(estimate.tier);
                  const tierIcon = getTierIcon(estimate.tier);

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      {/* Tier Header */}
                      <div
                        className={`bg-gradient-to-r ${tierColor} p-4 sm:p-5 text-white`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{tierIcon}</span>
                            <div>
                              <h4 className="text-lg sm:text-xl font-semibold capitalize">
                                {estimate.tier} Finish
                              </h4>
                              <p className="text-blue-100 text-xs sm:text-sm opacity-90">
                                Complete cost breakdown
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs opacity-90">
                              Total Estimate
                            </div>
                            <div className="text-lg sm:text-xl font-bold">
                              {formatPrice(totalCost)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {estimate.description && (
                        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-600">
                          <div className="flex items-start gap-2">
                            <FiInfo className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                              {estimate.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Cost Breakdown */}
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <FiDollarSign className="w-4 h-4 text-green-500" />
                          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Cost Breakdown
                          </h5>
                        </div>

                        <div className="space-y-3 max-h-60 sm:max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700/50">
                          {estimate.costBreakdown.map((item, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center py-2 px-3 bg-white dark:bg-gray-600/30 rounded-lg border border-gray-100 dark:border-gray-500/30 hover:border-gray-200 dark:hover:border-gray-400/50 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                <span
                                  className="text-sm text-gray-700 dark:text-gray-300 truncate"
                                  title={item.item}
                                >
                                  {item.item}
                                </span>
                              </div>
                              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base flex-shrink-0 ml-2">
                                {formatPrice(item.cost)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Total Summary */}
                        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-500">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Total {estimate.tier} Finish
                            </span>
                            <div className="text-right">
                              <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                                {formatPrice(totalCost)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {estimate.costBreakdown.length} items
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Summary Footer */}
              <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FiInfo className="w-4 h-4 text-blue-500" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      These estimates include material and labor costs
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Prices may vary based on location and market conditions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-700/50 rounded-b-2xl">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
                For accurate pricing, consult with our construction experts
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto"
              >
                Close Estimates
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BuildingCostEstimatesModal;
