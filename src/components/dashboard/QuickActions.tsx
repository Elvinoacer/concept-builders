"use client";
import React from "react";

const QuickActions = () => {
  return (
    <section className="mt-4 md:mt-8">
      <h3 className="text-gray-800 text-lg md:text-xl font-bold leading-tight tracking-[-0.015em] mb-2 md:mb-4 dark:text-white">
        Quick Actions
      </h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-base font-bold shadow-md hover:from-blue-700 hover:to-cyan-500 transition-colors w-full sm:w-auto">
          <span className="truncate">Start a New Project</span>
        </button>
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-white text-gray-800 border border-gray-300 text-base font-bold shadow-sm hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 w-full sm:w-auto">
          <span className="truncate">Browse Designs</span>
        </button>
      </div>
    </section>
  );
};

export default QuickActions;
