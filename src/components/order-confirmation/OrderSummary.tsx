'use client';
import React from 'react';

const OrderSummary = ({ orderNumber, orderDate, total }) => {
  return (
    <div>
      <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight mb-4">Order Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Order Number</p>
          <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">#{orderNumber}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Order Date</p>
          <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">{orderDate}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Total</p>
          <p className="text-gray-800 dark:text-gray-200 text-sm font-bold leading-normal">${total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
