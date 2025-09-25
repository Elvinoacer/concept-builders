'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Design, locationMultipliers, finishQualityMultipliers } from '@/lib/dummydata';

const PricingCalculatorModal: React.FC<PricingCalculatorModalProps> = ({ isOpen, onClose, design }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const parseDetail = (detailKey: string): number => {
    if (!design || !design.planDetails) return 0;
    const detailString = design.planDetails.find(d => d.startsWith(detailKey));
    if (!detailString) return 0;
    const match = detailString.match(/[\d,.]+/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
  }

  const [area, setArea] = useState(parseDetail("Total Living Area"));
  const [bedrooms, setBedrooms] = useState(parseDetail("Bedrooms"));
  const [bathrooms, setBathrooms] = useState(parseDetail("Bathrooms"));
  const [storeys, setStoreys] = useState(parseDetail("Stories"));
  const [location, setLocation] = useState(locationMultipliers[1].value);
  const [finishQuality, setFinishQuality] = useState(finishQualityMultipliers['Mid-Range']);
  const [estimatedCost, setEstimatedCost] = useState(0);

  useEffect(() => {
    if (design) {
      setArea(parseDetail("Total Living Area"));
      setBedrooms(parseDetail("Bedrooms"));
      setBathrooms(parseDetail("Bathrooms"));
      setStoreys(parseDetail("Stories"));
    }
  }, [design]);

  useEffect(() => {
    const baseCostPerSqFt = 250;
    const areaCost = area * baseCostPerSqFt;
    const bedroomsCost = bedrooms * 5000;
    const bathroomsCost = bathrooms * 7000;
    const storeysCost = storeys > 1 ? areaCost * (storeys - 1) * 0.5 : 0;
    const totalBaseCost = areaCost + bedroomsCost + bathroomsCost + storeysCost;
    const finalCost = totalBaseCost * location * finishQuality;
    setEstimatedCost(finalCost);
  }, [area, bedrooms, bathrooms, storeys, location, finishQuality]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Custom Pricing Calculator</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Adjust the parameters to get a more accurate cost estimate.</p>
            </div>
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium dark:text-gray-300">Area (sq. ft.)</label>
                        <Input type="number" value={area} onChange={e => setArea(Number(e.target.value))} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium dark:text-gray-300">Stories</label>
                        <Input type="number" value={storeys} onChange={e => setStoreys(Number(e.target.value))} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium dark:text-gray-300">Bedrooms</label>
                        <Input type="number" value={bedrooms} onChange={e => setBedrooms(Number(e.target.value))} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium dark:text-gray-300">Bathrooms</label>
                        <Input type="number" value={bathrooms} onChange={e => setBathrooms(Number(e.target.value))} className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium dark:text-gray-300">Location</label>
                        <Select onValueChange={v => setLocation(Number(v))} defaultValue={String(location)}>
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {locationMultipliers.map(l => <SelectItem key={l.name} value={String(l.value)}>{l.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium dark:text-gray-300">Finish Quality</label>
                        <Select onValueChange={v => setFinishQuality(Number(v))} defaultValue={String(finishQuality)}>
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {Object.entries(finishQualityMultipliers).map(([name, value]) => <SelectItem key={name} value={String(value)}>{name}</SelectItem>)}                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-lg text-gray-600 dark:text-gray-400">Estimated Building Cost</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mt-2">
                        ${estimatedCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                <Button onClick={onClose}>Close</Button>
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
