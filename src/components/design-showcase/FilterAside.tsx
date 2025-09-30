'use client';

import { motion } from 'framer-motion';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { designShowcaseData } from "@/lib/dummydata/designShowcase";

interface FilterAsideProps {
  onClose?: () => void;
  searchParams: ReadonlyURLSearchParams;
  updateSearchParams: (name: string, value: string | null) => void;
  handleClearFilters: () => void;
}

const FilterAside: React.FC<FilterAsideProps> = ({ onClose, searchParams, updateSearchParams, handleClearFilters }) => {
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentBedrooms = searchParams.get('bedrooms') || 'Any';
  const currentStyles = searchParams.get('styles')?.split(',') || [];
  const currentMinSize = searchParams.get('minSize') || '500'; // Default min size

  const handleStyleChange = (style: string, isChecked: boolean) => {
    let newStyles = [...currentStyles];
    if (isChecked) {
      newStyles.push(style);
    } else {
      newStyles = newStyles.filter(s => s !== style);
    }
    updateSearchParams('styles', newStyles.length > 0 ? newStyles.join(',') : null);
  };

  return (
    <motion.aside
      className="w-full md:pr-8"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{designShowcaseData.filterAside.title}</h2>
          <button onClick={onClose} className="md:hidden">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">{designShowcaseData.filterAside.priceRangeTitle}</h3>
          <div className="flex items-center gap-2">
            <input
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm h-12 px-4"
              placeholder={designShowcaseData.filterAside.minPricePlaceholder}
              type="number"
              value={currentMinPrice}
              onChange={(e) => updateSearchParams('minPrice', e.target.value)}
            />
            <span className="text-gray-500">-</span>
            <input
              className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm h-12 px-4"
              placeholder={designShowcaseData.filterAside.maxPricePlaceholder}
              type="number"
              value={currentMaxPrice}
              onChange={(e) => updateSearchParams('maxPrice', e.target.value)}
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">{designShowcaseData.filterAside.bedroomsTitle}</h3>
          <div className="flex flex-wrap gap-2">
            {designShowcaseData.filterAside.bedroomOptions.map(option => (
              <button
                key={option}
                onClick={() => updateSearchParams('bedrooms', option === 'Any' ? null : option)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  currentBedrooms === option
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-400 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-slate-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">{designShowcaseData.filterAside.architecturalStyleTitle}</h3>
          <div className="space-y-2">
            {designShowcaseData.filterAside.architecturalStyles.map(style => (
              <label key={style} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                  type="checkbox"
                  checked={currentStyles.includes(style)}
                  onChange={(e) => handleStyleChange(style, e.target.checked)}
                />
                {style}
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">{designShowcaseData.filterAside.sizeTitle}</h3>
          <input
            className="w-full"
            max="5000"
            min="500"
            step="100"
            type="range"
            value={currentMinSize}
            onChange={(e) => updateSearchParams('minSize', e.target.value)}
          />
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{currentMinSize}</span>
            <span>{designShowcaseData.filterAside.maxSizeText}</span>
          </div>
        </div>
        <button
          onClick={handleClearFilters}
          className="w-full rounded-lg bg-gray-200 dark:bg-gray-700 py-2.5 font-bold text-slate-800 dark:text-gray-200 transition hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {designShowcaseData.filterAside.clearFiltersButtonText}
        </button>
      </div>
    </motion.aside>
  );
};

export default FilterAside;
