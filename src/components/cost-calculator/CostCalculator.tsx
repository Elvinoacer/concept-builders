"use client";

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaHardHat, FaCalculator, FaChartPie, FaInfoCircle } from 'react-icons/fa';

const CostCalculator = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [buildingType, setBuildingType] = useState('residential');
  const [area, setArea] = useState(2000);
  const [quality, setQuality] = useState('standard');
  const [floors, setFloors] = useState(1);
  const [location, setLocation] = useState('suburban');
  const [sitePrep, setSitePrep] = useState('moderate');
  const [totalCost, setTotalCost] = useState(0);
  const [foundationCost, setFoundationCost] = useState(0);
  const [exteriorCost, setExteriorCost] = useState(0);
  const [interiorCost, setInteriorCost] = useState(0);
  const [mechanicalCost, setMechanicalCost] = useState(0);
  const [siteCost, setSiteCost] = useState(0);
  const [permitsCost, setPermitsCost] = useState(0);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  useEffect(() => {
    calculateCost();
  }, [buildingType, area, quality, floors, location, sitePrep]);

  const calculateCost = () => {
    const baseCosts = {
      residential: 150,
      apartment: 130,
      commercial: 200,
      industrial: 180,
    };
    const qualityMultipliers = {
      economy: 0.8,
      standard: 1.0,
      premium: 1.3,
      luxury: 1.8,
    };
    const locationMultipliers = {
      rural: 0.9,
      suburban: 1.0,
      urban: 1.2,
      metro: 1.4,
    };
    const sitePrepMultipliers = {
      simple: 0.95,
      moderate: 1.0,
      complex: 1.2,
    };

    let baseCost = baseCosts[buildingType] * area;
    let total = baseCost * qualityMultipliers[quality] * locationMultipliers[location] * sitePrepMultipliers[sitePrep];

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
    return '$' + Math.round(amount).toLocaleString();
  };

  const resetCalculator = () => {
    setBuildingType('residential');
    setArea(2000);
    setQuality('standard');
    setFloors(1);
    setLocation('suburban');
    setSitePrep('moderate');
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <FaHardHat className="text-4xl text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">BuildCost Pro</h1>
          </div>
          <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
        </header>
        <Card className="w-full flex flex-col md:flex-row overflow-hidden shadow-lg">
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3"><FaCalculator /> Project Details</h2>
            <div className="space-y-6">
              <div>
                <label>Building Type</label>
                <Select value={buildingType} onValueChange={setBuildingType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential House</SelectItem>
                    <SelectItem value="apartment">Apartment Building</SelectItem>
                    <SelectItem value="commercial">Commercial Building</SelectItem>
                    <SelectItem value="industrial">Industrial Facility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label>Total Area (sq mt)</label>
                <Input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} min="100" max="100000" />
              </div>
              <div>
                <label>Construction Quality</label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label>Number of Floors</label>
                <div className="flex items-center gap-4">
                  <Slider value={[floors]} onValueChange={(value) => setFloors(value[0])} min={1} max={10} step={1} />
                  <span className="font-bold text-primary">{floors}</span>
                </div>
              </div>
              <div>
                <label>Location Factor</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rural">Rural Area (Lower Cost)</SelectItem>
                    <SelectItem value="suburban">Suburban Area (Average Cost)</SelectItem>
                    <SelectItem value="urban">Urban Area (Higher Cost)</SelectItem>
                    <SelectItem value="metro">Metropolitan Area (Highest Cost)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label>Site Preparation Complexity</label>
                <Select value={sitePrep} onValueChange={setSitePrep}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple (Flat land)</SelectItem>
                    <SelectItem value="moderate">Moderate (Slight slope)</SelectItem>
                    <SelectItem value="complex">Complex (Steep slope, rocky)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <Button onClick={calculateCost} className="w-full">Calculate Cost</Button>
                <Button onClick={resetCalculator} variant="outline" className="w-full">Reset</Button>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-primary-light to-secondary text-white flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3"><FaChartPie /> Cost Estimate</h2>
              <div className="text-center my-4">
                <p className="text-5xl font-bold">{formatCurrency(totalCost)}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><p>Foundation & Structure</p><p>{formatCurrency(foundationCost)}</p></div>
                <div className="flex justify-between"><p>Exterior Work</p><p>{formatCurrency(exteriorCost)}</p></div>
                <div className="flex justify-between"><p>Interior Finishing</p><p>{formatCurrency(interiorCost)}</p></div>
                <div className="flex justify-between"><p>Mechanical Systems</p><p>{formatCurrency(mechanicalCost)}</p></div>
                <div className="flex justify-between"><p>Site Preparation</p><p>{formatCurrency(siteCost)}</p></div>
                <div className="flex justify-between"><p>Permits & Fees</p><p>{formatCurrency(permitsCost)}</p></div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-black bg-opacity-20 rounded-lg">
              <h3 className="font-semibold flex items-center gap-2"><FaInfoCircle /> Notes & Assumptions</h3>
              <p className="text-xs mt-2">This calculator provides estimates based on average construction costs. Actual costs may vary based on specific materials, labor rates, design complexity, and market conditions. Always consult with a professional contractor for precise quotes.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CostCalculator;
