'use client';
import React, { useState, useMemo } from 'react';
import { purchasedDesigns } from '@/lib/purchases-data';
import { motion, AnimatePresence } from 'framer-motion';
import PurchaseListItem from '@/components/dashboard/PurchaseListItem';

// Augment data for demonstration purposes
const augmentedDesigns = purchasedDesigns.map((design, index) => ({
  ...design,
  id: index + 1,
  purchaseDate: new Date(2025, 9, 22 - index * 5).toISOString(), // Staggered dates
  fileType: index % 2 === 0 ? 'PDF & CAD' : 'PDF',
  addOns: index % 2 === 0 ? ['Structural Plan', 'BOQ', 'Video'] : ['Video'],
  status: 'Completed',
}));

const PurchasesPage = () => {
  const [sortOrder, setSortOrder] = useState('date_desc');
  const [filterFileType, setFilterFileType] = useState('all');

  const sortedAndFilteredDesigns = useMemo(() => {
    let items = [...augmentedDesigns];

    // Filtering
    if (filterFileType !== 'all') {
      items = items.filter(d => d.fileType === filterFileType);
    }

    // Sorting
    items.sort((a, b) => {
      switch (sortOrder) {
        case 'date_asc':
          return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'date_desc':
        default:
          return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
      }
    });

    return items;
  }, [sortOrder, filterFileType]);

  return (
    <div className="dark:bg-gray-950 min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
          My Digital Library
        </h2>
        <p className="text-gray-500 mt-1 dark:text-gray-400 max-w-2xl">
          Access all your purchased design plans, download files, and manage your projects.
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Filter by:</p>
          <div className="flex gap-2">
            <button onClick={() => setFilterFileType('all')} className={`px-3 py-1 text-sm rounded-full transition-colors ${filterFileType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'}`}>All</button>
            <button onClick={() => setFilterFileType('PDF')} className={`px-3 py-1 text-sm rounded-full transition-colors ${filterFileType === 'PDF' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'}`}>PDF</button>
            <button onClick={() => setFilterFileType('PDF & CAD')} className={`px-3 py-1 text-sm rounded-full transition-colors ${filterFileType === 'PDF & CAD' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'}`}>PDF & CAD</button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-order" className="text-sm font-medium text-gray-600 dark:text-gray-300">Sort by:</label>
          <select id="sort-order" value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
            <option value="date_desc">Newest</option>
            <option value="date_asc">Oldest</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Design List */}
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {sortedAndFilteredDesigns.map((design) => (
            <PurchaseListItem key={design.id} design={design} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PurchasesPage;
