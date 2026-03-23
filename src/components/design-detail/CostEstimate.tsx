import { costEstimateIcons } from "@/lib/dummydata";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface CostEstimateProps {
  design: any;
  activeTier: string;
  currentEstimate: any;
}

const CostEstimate: React.FC<CostEstimateProps> = ({
  design,
  activeTier,
  currentEstimate,
}) => {
  const [openBreakdown, setOpenBreakdown] = useState(false);

  const handleToggleBreakdown = () => {
    setOpenBreakdown(!openBreakdown);
  };

  const containerVariants: any = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  const breakdownVariants: any = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  if (!currentEstimate) {
    return (
      <motion.div
        className="bg-card/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border border-cb-border"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center text-sm sm:text-base text-muted">
          No cost estimate available.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-card/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border border-cb-border w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={`cost-estimate-${activeTier}`}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-4 sm:mb-6 md:mb-8"
      >
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-cream mb-2 sm:mb-3">
          {currentEstimate.tier} Finish Estimate
        </h2>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-cream-dim">
          Detailed breakdown of construction costs
        </p>
      </motion.div>

      <motion.div
        className={`p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border-2 transition-all duration-500 cursor-pointer ${
          openBreakdown
            ? "border-gold bg-gold/5 shadow-gold/10"
            : "border-cb-border bg-surface/50 hover:border-gold/30"
        } ring-1 sm:ring-2 ring-gold/10`}
        whileHover={{ y: -2 }}
        onClick={handleToggleBreakdown}
      >
        <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
          <motion.div
            className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-gold to-gold-light flex items-center justify-center text-ink shadow-xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-lg sm:text-xl md:text-2xl">
              {(costEstimateIcons as any)[currentEstimate.tier] ||
                (costEstimateIcons as any)[currentEstimate.name] ||
                "🏠"}
            </span>
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-4">
              <div className="flex-1 min-w-0">
                <motion.h3
                  className="font-bold text-base sm:text-lg md:text-xl text-cream mb-1 sm:mb-2 line-clamp-1"
                  animate={{
                    color: openBreakdown ? "var(--gold)" : "",
                  }}
                >
                  {currentEstimate.tier} Finish
                </motion.h3>
                <p className="text-xs sm:text-sm md:text-base text-cream-dim leading-relaxed mb-2 sm:mb-3 line-clamp-2">
                  {currentEstimate.description}
                </p>
                <motion.p
                  className="text-lg sm:text-xl md:text-2xl font-black text-gold"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentEstimate.priceRange ||
                    `$${(currentEstimate.totalCost || currentEstimate.costBreakdown?.reduce((sum: number, item: any) => sum + parseFloat(item.cost), 0))?.toLocaleString()}`}
                </motion.p>
              </div>

              <motion.button
                className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-surface border border-cb-border flex items-center justify-center text-cream hover:bg-gold hover:text-ink transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleBreakdown();
                }}
              >
                <motion.span
                  animate={{ rotate: openBreakdown ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="material-symbols-outlined text-sm sm:text-base md:text-lg"
                >
                  expand_more
                </motion.span>
              </motion.button>
            </div>

            <AnimatePresence>
              {openBreakdown && (
                <motion.div
                  variants={breakdownVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="overflow-hidden"
                >
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-cb-border">
                    <h4 className="font-bold text-sm sm:text-base md:text-lg text-cream mb-3 sm:mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-gold text-sm sm:text-base">
                        analytics
                      </span>
                      Detailed Cost Breakdown
                    </h4>
                    <motion.ul
                      className="space-y-2 sm:space-y-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {currentEstimate.costBreakdown?.map(
                        (item: any, itemIndex: number) => (
                          <motion.li
                            key={itemIndex}
                            className="flex justify-between items-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-surface/50 border border-cb-border hover:bg-surface transition-colors duration-300"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemIndex * 0.1 + 0.3 }}
                            whileHover={{ x: 2 }}
                          >
                            <span className="text-xs sm:text-sm text-cream-dim font-bold truncate flex-1 pr-2">
                              {item.item}
                            </span>
                            <span className="font-black text-cream text-xs sm:text-sm flex-shrink-0">
                              {item.cost}
                            </span>
                          </motion.li>
                        )
                      )}
                    </motion.ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CostEstimate;
