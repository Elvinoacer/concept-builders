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
        className="text-center py-8 sm:py-10 md:py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <span className="material-symbols-outlined text-4xl sm:text-5xl md:text-6xl text-muted mb-3 sm:mb-4">
          construction
        </span>
        <p className="text-sm sm:text-base md:text-lg text-cream-dim">
          Cost estimates are not available for this design.
        </p>
        <p className="text-xs sm:text-sm text-muted mt-1 sm:mt-2">
          Please check back later or contact us for pricing.
        </p>
      </motion.div>
    );
  }

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
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
      className="text-cream"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex justify-center mb-6 sm:mb-8 md:mb-12"
        variants={itemVariants}
      >
        <div className="relative bg-surface rounded-lg sm:rounded-xl md:rounded-2xl p-1 sm:p-2 flex border border-cb-border shadow-2xl">
          <motion.div
            className="absolute top-1 bottom-1 w-1/2 bg-gold rounded-lg sm:rounded-xl shadow-xl"
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
              className={`relative z-10 flex items-center gap-1 sm:gap-2 md:gap-3 px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 min-w-[100px] sm:min-w-[120px] md:min-w-[140px] lg:min-w-[160px] justify-center ${
                activeTier === tier.id
                  ? "text-ink"
                  : "text-muted hover:text-cream"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined text-sm sm:text-base md:text-lg">
                {tier.icon}
              </span>
              <span className="hidden xs:inline">{tier.label}</span>
              <span className="xs:hidden">{tier.label.split(" ")[0]}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTier}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12"
        >
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <motion.div variants={itemVariants}>
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 mb-2">
                <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-cream">
                  {currentEstimate.tier} Finish
                </h4>
                <div className="px-2 sm:px-3 py-1 rounded-full bg-gold/10 text-gold text-xs sm:text-sm font-bold w-fit">
                  {activeTier === "basic"
                    ? "Cost Effective"
                    : "Premium Quality"}
                </div>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-cream-dim leading-relaxed">
                {currentEstimate.description}
              </p>
            </motion.div>

            <div className="space-y-3 sm:space-y-4">
              <h5 className="text-base sm:text-lg font-bold text-cream flex items-center gap-2">
                <span className="material-symbols-outlined text-gold text-sm sm:text-base">
                  analytics
                </span>
                Cost Breakdown
              </h5>

              {currentEstimate.costBreakdown?.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex justify-between items-center p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl bg-card/50 border border-cb-border hover:border-gold/30 transition-all duration-300 group cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 2, scale: 1.01 }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300 flex-shrink-0">
                      <span className="material-symbols-outlined text-gold text-sm sm:text-base md:text-lg">
                        {item.icon || "payments"}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-cream group-hover:text-gold transition-colors text-sm sm:text-base truncate block">
                        {item.item}
                      </span>
                      {item.description && (
                        <p className="text-xs sm:text-sm text-muted mt-0.5 sm:mt-1 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-black text-base sm:text-lg text-gold flex-shrink-0 ml-2 sm:ml-3">
                    ${parseFloat(item.cost).toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-4 sm:mt-6 md:mt-8 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl bg-gold/5 border border-gold/20"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <div className="min-w-0">
                  <h5 className="font-bold text-cream text-sm sm:text-base md:text-lg">
                    Total Estimated Cost
                  </h5>
                  <p className="text-xs sm:text-sm text-cream-dim">
                    Including all components
                  </p>
                </div>
                <div className="text-left sm:text-right min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-gold">
                    $
                    {(
                      currentEstimate.totalCost ||
                      currentEstimate.costBreakdown?.reduce(
                        (sum: number, item: any) => sum + parseFloat(item.cost),
                        0
                      )
                    )?.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-muted mt-0.5 sm:mt-1">
                    {activeTier === "basic"
                      ? "Standard Package"
                      : "Premium Package"}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex items-start">
            <CostEstimate
              key={activeTier}
              design={design}
              activeTier={activeTier}
              currentEstimate={currentEstimate}
            />
          </div>
        </motion.div>

        <motion.div
          className="mt-6 sm:mt-8 text-center"
          variants={itemVariants}
        >
          <CostCalculatorModal>
            <button className="inline-flex items-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 border border-transparent text-xs sm:text-sm md:text-base font-bold rounded-xl shadow-xl text-ink bg-gold hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-all duration-300">
              Open Full Cost Calculator
            </button>
          </CostCalculatorModal>
        </motion.div>
      </AnimatePresence>

      <motion.div
        variants={itemVariants}
        className="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl bg-surface/50 border border-cb-border"
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gold/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-gold text-base sm:text-lg md:text-xl">
              info
            </span>
          </div>
          <div className="min-w-0">
            <h5 className="font-bold text-cream mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">
              Important Notes
            </h5>
            <p className="text-xs sm:text-sm text-cream-dim leading-relaxed">
              These estimates are based on current market rates and may vary
              depending on your location, site conditions, and material
              availability. For a precise quote tailored to your specific
              requirements, please contact our architectural consultants.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CostToBuildTab;
