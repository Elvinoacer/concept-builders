"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Design } from "@/generated/prisma";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Calculator,
  DollarSign,
  MapPin,
  TrendingUp,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PricingCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: Design;
}

interface CostFactor {
  name: string;
  unit: string;
  price: number;
}

const PricingCalculatorModal: React.FC<PricingCalculatorModalProps> = ({
  isOpen,
  onClose,
  design,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [location, setLocation] = useState(1);
  const [finishQuality, setFinishQuality] = useState(1);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [estimatedCost, setEstimatedCost] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (design.buildingCostFactors?.options) {
      const initialQuantities: { [key: string]: number } = {};
      design.buildingCostFactors.options.forEach((option: any) => {
        initialQuantities[option.name] = 0;
      });
      setQuantities(initialQuantities);
    }
  }, [design.buildingCostFactors]);

  useEffect(() => {
    let factorCosts = 0;
    if (design.buildingCostFactors?.options) {
      design.buildingCostFactors.options.forEach((option: any) => {
        const quantity = quantities[option.name] || 0;
        factorCosts += quantity * (option.price || 0);
      });
    }

    const totalBaseCost = factorCosts;
    const finalCost = totalBaseCost * location * finishQuality;
    setEstimatedCost(finalCost);
  }, [quantities, location, finishQuality, design.buildingCostFactors]);

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -20,
      transition: {
        duration: 0.4,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden border border-white/20 dark:border-gray-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Enhanced Header */}
              <div className="relative bg-gradient-to-r from-blue-600/10 via-blue-500/10 to-cyan-500/10 dark:from-blue-600/20 dark:via-blue-500/20 dark:to-cyan-500/20 p-8 border-b border-white/20 dark:border-gray-700/50">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Calculator className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <motion.h2
                        className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        Custom Pricing Calculator
                      </motion.h2>
                      <motion.p
                        className="text-lg text-gray-600 dark:text-gray-400 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        Refine your estimate with accurate parameters and
                        real-time calculations
                      </motion.p>
                    </div>
                  </div>
                  <motion.button
                    onClick={onClose}
                    className="p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                </div>
              </div>

              {/* Main Content - Enhanced Split Layout */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Inputs */}
                <motion.div
                  className="flex-1 overflow-y-auto p-8 border-r border-gray-200/50 dark:border-gray-700/50 scrollbar-thin scrollbar-thumb-gray-400/50 scrollbar-track-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="space-y-8">
                    {/* Building Cost Factors */}
                    {design.buildingCostFactors?.options &&
                      design.buildingCostFactors.options.length > 0 && (
                        <motion.div
                          className="space-y-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                              Your Custom Specifications
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {design.buildingCostFactors.options.map(
                              (factor: any, index: number) => (
                                <motion.div
                                  key={factor.name}
                                  className="space-y-3"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.6 + index * 0.1 }}
                                >
                                  <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                    {factor.name}{" "}
                                    <span className="text-sm text-gray-500">
                                      ({factor.unit})
                                    </span>
                                  </label>
                                  <motion.div whileHover={{ scale: 1.02 }}>
                                    <Input
                                      type="number"
                                      value={quantities[factor.name] || ""}
                                      onChange={(e) =>
                                        setQuantities((prev) => ({
                                          ...prev,
                                          [factor.name]: Number(e.target.value),
                                        }))
                                      }
                                      className="h-14 text-lg rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 transition-all duration-300 px-4"
                                      placeholder="0"
                                      min="0"
                                    />
                                  </motion.div>
                                  {factor.price && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      ${factor.price.toLocaleString()} per{" "}
                                      {factor.unit}
                                    </p>
                                  )}
                                </motion.div>
                              )
                            )}
                          </div>
                        </motion.div>
                      )}

                    {/* Location & Quality */}
                    <motion.div
                      className="space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                          <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                          Location & Quality Factors
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div
                          className="space-y-3"
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Location Factor
                          </label>
                          <Select
                            onValueChange={(v) => setLocation(Number(v))}
                            defaultValue={String(location)}
                          >
                            <SelectTrigger className="h-14 text-lg rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 transition-all duration-300">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                              <SelectItem value="0.9" className="text-lg py-3">
                                🏞️ Rural (10% less)
                              </SelectItem>
                              <SelectItem value="1" className="text-lg py-3">
                                🏙️ Urban (Standard)
                              </SelectItem>
                              <SelectItem value="1.1" className="text-lg py-3">
                                🏡 Suburban (10% more)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                        <motion.div
                          className="space-y-3"
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Finish Quality
                          </label>
                          <Select
                            onValueChange={(v) => setFinishQuality(Number(v))}
                            defaultValue={String(finishQuality)}
                          >
                            <SelectTrigger className="h-14 text-lg rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 transition-all duration-300">
                              <SelectValue placeholder="Select quality" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                              <SelectItem value="1" className="text-lg py-3">
                                ⭐ Basic (Standard)
                              </SelectItem>
                              <SelectItem value="1.2" className="text-lg py-3">
                                ⭐⭐ Mid-Range (20% more)
                              </SelectItem>
                              <SelectItem value="1.5" className="text-lg py-3">
                                ⭐⭐⭐ Luxury (50% more)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Right Panel - Enhanced Summary & Total */}
                <motion.div
                  className="w-[480px] bg-gradient-to-b from-gray-50/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl p-8 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400/50 scrollbar-track-transparent border-l border-gray-200/50 dark:border-gray-700/50"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {/* Design Preview */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                      Design Summary
                    </h3>
                    <motion.div
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/30 transition-all duration-500 shadow-lg"
                      whileHover={{ y: -2, scale: 1.02 }}
                    >
                      <h4 className="font-bold text-xl text-slate-800 dark:text-white mb-2">
                        {design.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                        {design.description}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                        <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                          Base Design Price
                        </div>
                        <div className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                          ${design.basePrice?.toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Enhanced Cost Breakdown */}
                  <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                      Cost Breakdown
                    </h3>
                    <div className="space-y-4">
                      {design.buildingCostFactors?.options?.map(
                        (factor: any, index: number) => {
                          const quantity = quantities[factor.name] || 0;
                          const cost = quantity * (factor.price || 0);
                          if (cost > 0) {
                            return (
                              <motion.div
                                key={factor.name}
                                className="flex justify-between items-center p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 hover:border-blue-500/20 transition-all duration-300"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 + index * 0.1 }}
                                whileHover={{ x: 4 }}
                              >
                                <div>
                                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    {factor.name}
                                  </span>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {quantity} {factor.unit}
                                  </p>
                                </div>
                                <span className="font-bold text-lg text-slate-800 dark:text-white">
                                  ${cost.toLocaleString()}
                                </span>
                              </motion.div>
                            );
                          }
                          return null;
                        }
                      )}

                      <motion.div
                        className="flex justify-between items-center p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        <span className="font-semibold text-blue-700 dark:text-blue-300">
                          Location Factor
                        </span>
                        <span className="font-bold text-blue-700 dark:text-blue-300">
                          {location}x
                        </span>
                      </motion.div>

                      <motion.div
                        className="flex justify-between items-center p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3 }}
                      >
                        <span className="font-semibold text-amber-700 dark:text-amber-300">
                          Quality Multiplier
                        </span>
                        <span className="font-bold text-amber-700 dark:text-amber-300">
                          {finishQuality}x
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Enhanced Total Price */}
                  <motion.div
                    className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    <div className="text-center">
                      <p className="text-lg text-gray-600 dark:text-gray-400 mb-3 flex items-center justify-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Estimated Total Building Cost
                      </p>
                      <motion.p
                        key={estimatedCost}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text mb-4"
                      >
                        $
                        {estimatedCost.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                      </motion.p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Updated in real-time
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={onClose}
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <DollarSign className="w-5 h-5 mr-2" />
                        Close Calculator
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (!isMounted) {
    return null;
  }

  return createPortal(modalContent, document.body);
};

export default PricingCalculatorModal;
