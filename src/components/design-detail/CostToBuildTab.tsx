"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CostEstimate from "./CostEstimate";
import CostCalculatorModal from "@/components/cost-calculator/CostCalculatorModal";

const CostToBuildTab = ({ design }) => {
  const [activeTier, setActiveTier] = useState("basic");

  const basicEstimate = design.buildingCostEstimates?.find(
    (e) => e.tier?.toLowerCase() === "basic"
  );
  const luxuryEstimate = design.buildingCostEstimates?.find(
    (e) => e.tier?.toLowerCase() === "luxury"
  );

  const handleTierChange = (tier: string) => {
    setActiveTier(tier);
  };

  const currentEstimate =
    activeTier === "basic" ? basicEstimate : luxuryEstimate;

  if (!basicEstimate || !luxuryEstimate) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
          construction
        </span>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Cost estimates are not available for this design.
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Please check back later or contact us for pricing.
        </p>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const tierSwitchVariants = {
    basic: { x: 0 },
    luxury: { x: "100%" },
  };

  return (
    <motion.div
      className="text-slate-800 dark:text-gray-200"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Tier Selection Switch */}
      <motion.div className="flex justify-center mb-12" variants={itemVariants}>
        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl p-2 flex border border-gray-200 dark:border-gray-700 shadow-lg">
          {/* Animated Background Slider */}
          <motion.div
            className="absolute top-1 bottom-1 w-1/2 bg-gradient-to-r from-primary to-blue-500 rounded-xl shadow-lg"
            variants={tierSwitchVariants}
            animate={activeTier}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {[
            { id: "basic", label: "Standard Finish", icon: "home" },
            { id: "luxury", label: "Premium Finish", icon: "star" },
          ].map((tier) => (
            <motion.button
              key={tier.id}
              onClick={() => handleTierChange(tier.id)}
              className={`relative z-10 flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300 min-w-[180px] justify-center ${
                activeTier === tier.id
                  ? "text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined text-lg">
                {tier.icon}
              </span>
              <span>{tier.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Use AnimatePresence to force re-render of entire content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTier} // This key ensures complete re-render
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-12"
        >
          {/* Cost Breakdown */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {currentEstimate.tier} Finish
                </h4>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {activeTier === "basic"
                    ? "Cost Effective"
                    : "Premium Quality"}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                {currentEstimate.description}
              </p>
            </motion.div>

            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-slate-700 dark:text-gray-300 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  analytics
                </span>
                Cost Breakdown
              </h5>

              {currentEstimate.costBreakdown?.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex justify-between items-center p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4, scale: 1.02 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <span className="material-symbols-outlined text-primary text-lg">
                        {item.icon || "payments"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                        {item.item}
                      </span>
                      {item.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-lg bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    ${parseFloat(item.cost).toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Total Cost Summary */}
            <motion.div
              className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-blue-500/5 border border-primary/20"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-semibold text-slate-800 dark:text-white text-lg">
                    Total Estimated Cost
                  </h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Including all components
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                    $
                    {(currentEstimate.totalCost || currentEstimate.costBreakdown?.reduce((sum, item) => sum + parseFloat(item.cost), 0))?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {activeTier === "basic"
                      ? "Standard Package"
                      : "Premium Package"}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Cost Estimate Visualization - Pass key to force re-render */}
          <div className="flex items-start">
            <CostEstimate
              key={activeTier} // This forces complete re-render of CostEstimate
              design={design}
              activeTier={activeTier}
              currentEstimate={currentEstimate}
            />
          </div>
        </motion.div>

        <motion.div className="mt-8 text-center" variants={itemVariants}>
          <CostCalculatorModal>
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Open Full Cost Calculator
            </button>
          </CostCalculatorModal>
        </motion.div>
      </AnimatePresence>

      {/* Additional Information */}
      <motion.div
        variants={itemVariants}
        className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">
              info
            </span>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800 dark:text-white mb-2">
              Important Notes
            </h5>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                          These estimates are based on current market rates and may vary
                                          depending on your location, site conditions, and material
                                          availability. For a precise quote tailored to your specific
                                          requirements, please contact our architectural consultants.
                                        </p>                        </div>
                      </div>
                    </motion.div>    </motion.div>
  );
};

export default CostToBuildTab;
