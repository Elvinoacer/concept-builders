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
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <FaHardHat className="text-3xl sm:text-4xl text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BuildCost Pro
            </h1>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span
              className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {isDarkMode ? "Dark" : "Light"}
            </span>
            <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
          </div>
        </header>

        <Card
          className={`w-full flex flex-col lg:flex-row overflow-hidden shadow-lg transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Input Section */}
          <div
            className={`w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center gap-3 transition-colors duration-300 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <FaCalculator className="text-primary" /> Project Details
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {/* Building Type */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Building Type
                </label>
                <Select value={buildingType} onValueChange={setBuildingType}>
                  <SelectTrigger
                    className={`w-full transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className={
                      isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                    }
                  >
                    <SelectItem value="residential">
                      Residential House
                    </SelectItem>
                    <SelectItem value="apartment">
                      Apartment Building
                    </SelectItem>
                    <SelectItem value="commercial">
                      Commercial Building
                    </SelectItem>
                    <SelectItem value="industrial">
                      Industrial Facility
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Total Area */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
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
                  className={`transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>

              {/* Construction Quality */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Construction Quality
                </label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger
                    className={`w-full transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className={
                      isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                    }
                  >
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Number of Floors */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Number of Floors
                </label>
                <div className="flex items-center gap-3 sm:gap-4">
                  <Slider
                    value={[floors]}
                    onValueChange={(value) => setFloors(value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className={`flex-1 transition-colors duration-300 ${
                      isDarkMode ? "[&_[data-slot=track]]:bg-gray-600" : ""
                    }`}
                  />
                  <span
                    className={`font-bold min-w-8 text-center transition-colors duration-300 ${
                      isDarkMode ? "text-primary-300" : "text-primary"
                    }`}
                  >
                    {floors}
                  </span>
                </div>
              </div>

              {/* Location Factor */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Location Factor
                </label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger
                    className={`w-full transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className={
                      isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                    }
                  >
                    <SelectItem value="rural">
                      Rural Area (Lower Cost)
                    </SelectItem>
                    <SelectItem value="suburban">
                      Suburban Area (Average Cost)
                    </SelectItem>
                    <SelectItem value="urban">
                      Urban Area (Higher Cost)
                    </SelectItem>
                    <SelectItem value="metro">
                      Metropolitan Area (Highest Cost)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Site Preparation Complexity */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Site Preparation Complexity
                </label>
                <Select value={sitePrep} onValueChange={setSitePrep}>
                  <SelectTrigger
                    className={`w-full transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className={
                      isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                    }
                  >
                    <SelectItem value="simple">Simple (Flat land)</SelectItem>
                    <SelectItem value="moderate">
                      Moderate (Slight slope)
                    </SelectItem>
                    <SelectItem value="complex">
                      Complex (Steep slope, rocky)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <Button onClick={calculateCost} className="w-full sm:flex-1">
                  Calculate Cost
                </Button>
                <Button
                  onClick={resetCalculator}
                  variant="outline"
                  className={`w-full sm:flex-1 transition-colors duration-300 ${
                    isDarkMode
                      ? "border-gray-600 text-gray-200 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-primary to-secondary text-white flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 flex items-center gap-3">
                <FaChartPie /> Cost Estimate
              </h2>
              <div className="text-center my-4 sm:my-6">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                  {formatCurrency(totalCost)}
                </p>
                <p className="text-sm sm:text-base mt-2 opacity-90">
                  Total Estimated Cost
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <p>Foundation & Structure</p>
                  <p className="font-semibold">
                    {formatCurrency(foundationCost)}
                  </p>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <p>Exterior Work</p>
                  <p className="font-semibold">
                    {formatCurrency(exteriorCost)}
                  </p>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <p>Interior Finishing</p>
                  <p className="font-semibold">
                    {formatCurrency(interiorCost)}
                  </p>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <p>Mechanical Systems</p>
                  <p className="font-semibold">
                    {formatCurrency(mechanicalCost)}
                  </p>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <p>Site Preparation</p>
                  <p className="font-semibold">{formatCurrency(siteCost)}</p>
                </div>
                <div className="flex justify-between items-center py-2">
                  <p>Permits & Fees</p>
                  <p className="font-semibold">{formatCurrency(permitsCost)}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-black bg-opacity-20 rounded-lg">
              <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
                <FaInfoCircle /> Notes & Assumptions
              </h3>
              <p className="text-xs sm:text-sm mt-2 opacity-90 leading-relaxed">
                This calculator provides estimates based on average construction
                costs. Actual costs may vary based on specific materials, labor
                rates, design complexity, and market conditions. Always consult
                with a professional contractor for precise quotes.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CostCalculator;
