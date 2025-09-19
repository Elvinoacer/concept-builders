'use client';
import React from 'react';

const ConfirmationHeader = ({ orderNumber }) => {
  return (
    <div className="p-8 md:p-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full text-white mb-4">
        <span className="material-symbols-outlined !text-4xl">check</span>
      </div>
      <h2 className="text-gray-900 dark:text-white tracking-tight text-3xl font-bold leading-tight pb-2">Order Confirmed!</h2>
      <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
        Thank you for your purchase. Your order #{orderNumber} has been successfully placed. You will receive an email confirmation shortly.
      </p>
    </div>
  );
};

export default ConfirmationHeader;
