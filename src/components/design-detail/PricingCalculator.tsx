'use client';

import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PricingCalculatorProps {
  design: any;
  customArea: number;
  setCustomArea: (value: number) => void;
  customStories: number;
  setCustomStories: (value: number) => void;
  customBedrooms: number;
  setCustomBedrooms: (value: number) => void;
  customBathrooms: number;
  setCustomBathrooms: (value: number) => void;
}

const PricingCalculator: React.FC<PricingCalculatorProps> = ({ 
  design,
  customArea,
  setCustomArea,
  customStories,
  setCustomStories,
  customBedrooms,
  setCustomBedrooms,
  customBathrooms,
  setCustomBathrooms,
}) => {
  return (
    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
      <h4 className="font-bold text-lg dark:text-white mb-4">Customize Your Package</h4>
      <div className="space-y-4">
        {design.areaPrice > 0 && (
          <div className="grid grid-cols-2 items-center">
            <Label htmlFor="area">Area (sq ft)</Label>
            <Input id="area" type="number" value={customArea} onChange={(e) => setCustomArea(Number(e.target.value))} />
          </div>
        )}
        {design.storiesPrice > 0 && (
          <div className="grid grid-cols-2 items-center">
            <Label htmlFor="stories">Stories</Label>
            <Input id="stories" type="number" value={customStories} onChange={(e) => setCustomStories(Number(e.target.value))} />
          </div>
        )}
        {design.bedroomsPrice > 0 && (
          <div className="grid grid-cols-2 items-center">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input id="bedrooms" type="number" value={customBedrooms} onChange={(e) => setCustomBedrooms(Number(e.target.value))} />
          </div>
        )}
        {design.bathroomsPrice > 0 && (
          <div className="grid grid-cols-2 items-center">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input id="bathrooms" type="number" value={customBathrooms} onChange={(e) => setCustomBathrooms(Number(e.target.value))} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCalculator;
