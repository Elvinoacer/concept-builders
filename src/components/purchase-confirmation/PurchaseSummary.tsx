'use client';
import React from 'react';

const PurchaseSummary = ({ purchaseNumber, purchaseDate, total }) => {
  return (
    <div>
      <h3 className="text-gray-900 dark:text-white text-base md:text-lg font-bold leading-tight tracking-tight mb-2 md:mb-4">Design Purchase Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Purchase Number</p>
          <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">#{purchaseNumber}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Purchase Date</p>
          <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">{purchaseDate}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Total</p>
          <p className="text-gray-800 dark:text-gray-200 text-sm font-bold leading-normal">${total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSummary;
