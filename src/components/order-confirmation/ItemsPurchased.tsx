'use client';
import React from 'react';
import Image from 'next/image';

const ItemsPurchased = ({ items }) => {
  return (
    <div>
      <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight mb-4">Items Purchased</h3>
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-md size-16 shrink-0">
            <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">{item.name}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Plan ID: {item.planId}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsPurchased;
