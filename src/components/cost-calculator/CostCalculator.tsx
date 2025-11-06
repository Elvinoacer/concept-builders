"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import {
  FaCalculator,
  FaChartPie,
  FaHardHat,
  FaInfoCircle,
  FaSyncAlt,
} from "react-icons/fa";

import {
  qualityPrices,
  locationMultipliers,
  sitePrepMultipliers,
} from "@/lib/cost-calculator-data";

const CostCalculator = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [buildingType, setBuildingType] = useState("residential");
  const [area, setArea] = useState(2000);
  const [quality, setQuality] = useState("basic");
  const [floors, setFloors] = useState(1);
  const [location, setLocation] = useState("suburban");
  const [sitePrep, setSitePrep] = useState("moderate");
  const [totalCost, setTotalCost] = useState(0);
  const [foundationCost, setFoundationCost] = useState(0);
  const [exteriorCost, setExteriorCost] = useState(0);
  const [interiorCost, setInteriorCost] = useState(0);
  const [mechanicalCost, setMechanicalCost] = useState(0);
  const [siteCost, setSiteCost] = useState(0);
  const [permitsCost, setPermitsCost] = useState(0);

  useEffect(() => {
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  useEffect(() => {
    calculateCost();
  }, [buildingType, area, quality, floors, location, sitePrep]);

  const calculateCost = () => {
    let baseCost = qualityPrices[quality] * area;
    let total =
      baseCost * locationMultipliers[location] * sitePrepMultipliers[sitePrep];

    if (floors > 1) {
      total *= 1 + (floors - 1) * 0.1;
    }

    setTotalCost(total);
    setFoundationCost(total * 0.15);
    setExteriorCost(total * 0.25);
    setInteriorCost(total * 0.3);
    setMechanicalCost(total * 0.15);
    setSiteCost(total * 0.08);
    setPermitsCost(total * 0.07);
  };

  const formatCurrency = (amount) => {
    return "KES " + Math.round(amount).toLocaleString();
  };

  const resetCalculator = () => {
    setBuildingType("residential");
    setArea(2000);
    setQuality("basic");
    setFloors(1);
    setLocation("suburban");
    setSitePrep("moderate");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8">
        {/* Header */}
        <header className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
            <div className="p-2 xs:p-3 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-xl xs:rounded-2xl">
              <FaHardHat className="text-xl xs:text-2xl sm:text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent leading-tight">
                BuildCost Pro
              </h1>
              <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Accurate construction cost estimation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end xs:self-auto">
            <span
              className={`text-xs xs:text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {isDarkMode ? "🌙 Dark" : "☀️ Light"}
            </span>
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              className="scale-90 xs:scale-100"
            />
          </div>
        </header>

        {/* Main Calculator Card */}
        <Card
          className={`w-full flex flex-col lg:flex-row overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Input Section */}
          <div
            className={`w-full lg:w-1/2 p-4 xs:p-5 sm:p-6 lg:p-8 transition-colors duration-300 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-lg xs:text-xl sm:text-2xl font-semibold mb-4 xs:mb-5 sm:mb-6 flex items-center gap-2 xs:gap-3 transition-colors duration-300 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <FaCalculator className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span>Project Details</span>
            </h2>

            <div className="space-y-3 xs:space-y-4 sm:space-y-5">
              {/* Building Type */}
              <div>
                <label
                  className={`block text-xs xs:text-sm font-medium mb-1 xs:mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Building Type
                </label>
                <Select value={buildingType} onValueChange={setBuildingType}>
                  <SelectTrigger
                    className={`w-full text-xs xs:text-sm transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                    }`}
                  >
                    <SelectValue placeholder="Select building type" />
                  </SelectTrigger>
                  <SelectContent
                    className={
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                  >
                    <SelectItem
                      value="residential"
                      className="text-xs xs:text-sm"
                    >
                      Residential House
                    </SelectItem>
                    <SelectItem
                      value="apartment"
                      className="text-xs xs:text-sm"
                    >
                      Apartment Building
                    </SelectItem>
                    <SelectItem
                      value="commercial"
                      className="text-xs xs:text-sm"
                    >
                      Commercial Building
                    </SelectItem>
                    <SelectItem
                      value="industrial"
                      className="text-xs xs:text-sm"
                    >
                      Industrial Facility
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Total Area */}
              <div>
                <label
                  className={`block text-xs xs:text-sm font-medium mb-1 xs:mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Total Area (sq mt)
                </label>
                <Input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  min="100"
                  max="100000"
                  className={`text-xs xs:text-sm transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  }`}
                  placeholder="Enter area in square meters"
                />
                <div className="mt-1">
                  <Slider
                    value={[area]}
                    onValueChange={(value) => setArea(value[0])}
                    min={100}
                    max={10000}
                    step={100}
                    className={`transition-colors duration-300 ${
                      isDarkMode
                        ? "[&_[data-slot=track]]:bg-gray-600 [&_[data-slot=range]]:bg-gradient-to-r from-blue-600 to-cyan-400"
                        : "[&_[data-slot=range]]:bg-gradient-to-r from-blue-600 to-cyan-400"
                    }`}
                  />
                </div>
              </div>

              {/* Construction Quality */}
              <div>
                <label
                  className={`block text-xs xs:text-sm font-medium mb-1 xs:mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Construction Quality
                </label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger
                    className={`w-full text-xs xs:text-sm transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                    }`}
                  >
                    <SelectValue placeholder="Select quality level" />
                  </SelectTrigger>
                  <SelectContent
                    className={
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                  >
                    <SelectItem value="basic" className="text-xs xs:text-sm">
                      Basic
                    </SelectItem>
                    <SelectItem value="standard" className="text-xs xs:text-sm">
                      Standard
                    </SelectItem>
                    <SelectItem value="premium" className="text-xs xs:text-sm">
                      Premium
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Number of Floors */}
              <div>
                <label
                  className={`block text-xs xs:text-sm font-medium mb-1 xs:mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Number of Floors
                </label>
                <div className="flex items-center gap-2 xs:gap-3">
                  <Slider
                    value={[floors]}
                    onValueChange={(value) => setFloors(value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className={`flex-1 transition-colors duration-300 ${
                      isDarkMode
                        ? "[&_[data-slot=track]]:bg-gray-600 [&_[data-slot=range]]:bg-gradient-to-r from-blue-600 to-cyan-400"
                        : "[&_[data-slot=range]]:bg-gradient-to-r from-blue-600 to-cyan-400"
                    }`}
                  />
                  <span
                    className={`font-bold min-w-6 xs:min-w-8 text-center text-xs xs:text-sm transition-colors duration-300 ${
                      isDarkMode ? "text-cyan-300" : "text-blue-600"
                    }`}
                  >
                    {floors}
                  </span>
                </div>
              </div>

              {/* Location Factor */}
              <div>
                <label
                  className={`block text-xs xs:text-sm font-medium mb-1 xs:mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Location Factor
                </label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger
                    className={`w-full text-xs xs:text-sm transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                    }`}
                  >
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent
                    className={
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                  >
                    <SelectItem value="rural" className="text-xs xs:text-sm">
                      Rural Area (Lower Cost)
                    </SelectItem>
                    <SelectItem value="suburban" className="text-xs xs:text-sm">
                      Suburban Area (Average Cost)
                    </SelectItem>
                    <SelectItem value="urban" className="text-xs xs:text-sm">
                      Urban Area (Higher Cost)
                    </SelectItem>
                    <SelectItem value="metro" className="text-xs xs:text-sm">
                      Metropolitan Area (Highest Cost)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Site Preparation Complexity */}
              <div>
                <label
                  className={`block text-xs xs:text-sm font-medium mb-1 xs:mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Site Preparation Complexity
                </label>
                <Select value={sitePrep} onValueChange={setSitePrep}>
                  <SelectTrigger
                    className={`w-full text-xs xs:text-sm transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                    }`}
                  >
                    <SelectValue placeholder="Select site complexity" />
                  </SelectTrigger>
                  <SelectContent
                    className={
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                  >
                    <SelectItem value="simple" className="text-xs xs:text-sm">
                      Simple (Flat land)
                    </SelectItem>
                    <SelectItem value="moderate" className="text-xs xs:text-sm">
                      Moderate (Slight slope)
                    </SelectItem>
                    <SelectItem value="complex" className="text-xs xs:text-sm">
                      Complex (Steep slope, rocky)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Buttons */}
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 pt-2 xs:pt-3">
                <Button
                  onClick={calculateCost}
                  className="w-full xs:flex-1 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white text-xs xs:text-sm py-2 xs:py-2.5"
                >
                  <FaCalculator className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
                  Calculate Cost
                </Button>
                <Button
                  onClick={resetCalculator}
                  variant="outline"
                  className={`w-full xs:flex-1 text-xs xs:text-sm py-2 xs:py-2.5 transition-colors duration-300 ${
                    isDarkMode
                      ? "border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <FaSyncAlt className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="w-full lg:w-1/2 p-4 xs:p-5 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-600 to-cyan-400 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-4 xs:mb-5 sm:mb-6 flex items-center gap-2 xs:gap-3">
                <FaChartPie className="text-white flex-shrink-0" />
                <span>Cost Estimate</span>
              </h2>

              {/* Total Cost Display */}
              <div className="text-center my-4 xs:my-5 sm:my-6">
                <p className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {formatCurrency(totalCost)}
                </p>
                <p className="text-xs xs:text-sm mt-1 xs:mt-2 text-blue-100 font-medium">
                  Total Estimated Cost
                </p>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 xs:space-y-3 sm:space-y-4 text-xs xs:text-sm">
                <div className="flex justify-between items-center py-2 border-b border-blue-400/30">
                  <p className="text-blue-50">Foundation & Structure</p>
                  <p className="font-semibold text-white text-right">
                    {formatCurrency(foundationCost)}
                  </p>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-400/30">
                  <p className="text-blue-50">Exterior Work</p>
                  <p className="font-semibold text-white text-right">
                    {formatCurrency(exteriorCost)}
                  </p>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-400/30">
                  <p className="text-blue-50">Interior Finishing</p>
                  <p className="font-semibold text-white text-right">
                    {formatCurrency(interiorCost)}
                  </p>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-400/30">
                  <p className="text-blue-50">Mechanical Systems</p>
                  <p className="font-semibold text-white text-right">
                    {formatCurrency(mechanicalCost)}
                  </p>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-400/30">
                  <p className="text-blue-50">Site Preparation</p>
                  <p className="font-semibold text-white text-right">
                    {formatCurrency(siteCost)}
                  </p>
                </div>
                <div className="flex justify-between items-center py-2">
                  <p className="text-blue-50">Permits & Fees</p>
                  <p className="font-semibold text-white text-right">
                    {formatCurrency(permitsCost)}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes & Assumptions */}
            <div className="mt-4 xs:mt-5 sm:mt-6 p-3 xs:p-4 bg-black/20 rounded-lg xs:rounded-xl border border-white/10">
              <h3 className="font-semibold flex items-center gap-2 text-xs xs:text-sm text-white mb-2">
                <FaInfoCircle className="text-blue-200 flex-shrink-0" />
                <span>Notes & Assumptions</span>
              </h3>
              <p className="text-xs xs:text-sm text-blue-100 leading-relaxed">
                This calculator provides estimates based on average construction
                costs. Actual costs may vary based on materials, labor rates,
                design complexity, and market conditions. Consult with a
                professional contractor for precise quotes.
              </p>
            </div>
          </div>
        </Card>

        {/* Mobile Quick Actions */}
        <div className="lg:hidden mt-4 xs:mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FaInfoCircle className="text-blue-500" />
              Quick Tips
            </h3>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <p>• Adjust area and quality for most accurate estimates</p>
              <p>• Consider location factors for regional pricing</p>
              <p>• Add 10-15% contingency for unexpected costs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;
