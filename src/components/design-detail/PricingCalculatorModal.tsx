"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import { X, Calculator, Home, Layers, MapPin, Star } from "lucide-react";

interface PricingCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: Design;
}

const PricingCalculatorModal: React.FC<PricingCalculatorModalProps> = ({
  isOpen,
  onClose,
  design,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [location, setLocation] = useState(1);
  const [finishQuality, setFinishQuality] = useState(1);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [estimatedCost, setEstimatedCost] = useState(0);

  useEffect(() => {
    if (design.buildingCostFactors?.options) {
      const initialQuantities: { [key: string]: number } = {};
      design.buildingCostFactors.options.forEach((option: any) => {
        initialQuantities[option.name] = 0; // Initialize with 0
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
    const finalCost =
      totalBaseCost * location * finishQuality;
    setEstimatedCost(finalCost);
  }, [
    quantities,
    location,
    finishQuality,
    design.buildingCostFactors,
  ]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Custom Pricing Calculator
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Refine your estimate with accurate parameters
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Main Content - Split Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Inputs */}
              <div className="flex-1 overflow-y-auto p-6 border-r border-gray-100 dark:border-gray-800 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                <div className="space-y-6">
                  {/* Building Cost Factors */}
                  {design.buildingCostFactors?.options && design.buildingCostFactors.options.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Home className="w-5 h-5 text-blue-600" />
                        Your Custom Specifications
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {design.buildingCostFactors.options.map((factor: any) => (
                          <div key={factor.name} className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {factor.name} ({factor.unit})
                            </label>
                            <Input
                              type="number"
                              value={quantities[factor.name] || ''}
                              onChange={(e) => setQuantities(prev => ({
                                ...prev,
                                [factor.name]: Number(e.target.value)
                              }))}
                              className="h-12 text-lg"
                              placeholder="0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Location & Quality */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      Location & Quality
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Location Factor
                        </label>
                        <Select
                          onValueChange={(v) => setLocation(Number(v))}
                          defaultValue={String(location)}
                        >
                          <SelectTrigger className="h-12 text-lg">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.9">
                              Rural (10% less)
                            </SelectItem>
                            <SelectItem value="1">Urban (Standard)</SelectItem>
                            <SelectItem value="1.1">
                              Suburban (10% more)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Finish Quality
                        </label>
                        <Select
                          onValueChange={(v) => setFinishQuality(Number(v))}
                          defaultValue={String(finishQuality)}
                        >
                          <SelectTrigger className="h-12 text-lg">
                            <SelectValue placeholder="Select quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Basic (Standard)</SelectItem>
                            <SelectItem value="1.2">
                              Mid-Range (20% more)
                            </SelectItem>
                            <SelectItem value="1.5">
                              Luxury (50% more)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  
                </div>
              </div>

              {/* Right Panel - Summary & Total */}
              <div className="w-96 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                {/* Design Preview */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Design Summary
                  </h3>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                      {design.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {design.description}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Base Price
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        ${design.basePrice?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Cost Breakdown
                  </h3>
                  <div className="space-y-3">
                    {design.buildingCostFactors?.options?.map((factor: any) => {
                      const quantity = quantities[factor.name] || 0;
                      const cost = quantity * (factor.price || 0);
                      if (cost > 0) {
                        return (
                          <div key={factor.name} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              {factor.name} ({quantity} {factor.unit})
                            </span>
                            <span className="font-medium">
                              ${cost.toLocaleString()}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Location Factor
                      </span>
                      <span className="font-medium">{location}x</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Quality Multiplier
                      </span>
                      <span className="font-medium">{finishQuality}x</span>
                    </div>
                    
                  </div>
                </div>

                {/* Total Price - Always Visible */}
                <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Estimated Building Cost
                    </p>
                    <motion.p
                      key={estimatedCost}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text"
                    >
                      $
                      {estimatedCost.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </motion.p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Updated in real-time
                    </p>
                  </div>
                  <Button
                    onClick={onClose}
                    className="w-full mt-4 h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    Close Calculator
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!isMounted) {
    return null;
  }

  return createPortal(modalContent, document.body);
};

export default PricingCalculatorModal;