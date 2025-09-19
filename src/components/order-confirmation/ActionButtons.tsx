'use client';
import React from 'react';

const ActionButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-sm font-bold leading-normal tracking-[0.015em] grow hover:opacity-90 transition-opacity">
        <span className="material-symbols-outlined mr-2">download</span>
        <span className="truncate">Download Plans</span>
      </button>
      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-gray-200 text-gray-800 text-sm font-bold leading-normal tracking-[0.015em] grow hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
        <span className="material-symbols-outlined mr-2">send</span>
        <span className="truncate">Resend Receipt</span>
      </button>
    </div>
  );
};

export default ActionButtons;
