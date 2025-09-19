'use client';
import React from 'react';

const DeliveryDetails = ({ delivery }) => {
  return (
    <div>
      <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight mb-4">Delivery Details</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Name</p>
          <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">{delivery.name}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Email</p>
          <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">{delivery.email}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Address</p>
          <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal text-right">{delivery.address}</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;
