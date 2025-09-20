"use client";
import React from "react";

const SummaryCards = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium dark:text-gray-400">
              Total Projects
            </p>
            <h3 className="text-gray-800 text-xl md:text-2xl font-bold mt-0.5 md:mt-1 dark:text-white">
              24
            </h3>
            <p className="text-green-500 text-sm mt-1 flex items-center">
              <span className="material-symbols-outlined text-base mr-1">
                arrow_upward
              </span>
              +12% from last month
            </p>
          </div>
          <div className="text-blue-500 flex items-center justify-center rounded-full bg-blue-100 p-3 dark:bg-blue-900 dark:text-blue-200">
            <span className="material-symbols-outlined text-2xl">folder</span>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium dark:text-gray-400">
              Active Clients
            </p>
            <h3 className="text-gray-800 text-xl md:text-2xl font-bold mt-0.5 md:mt-1 dark:text-white">
              18
            </h3>
            <p className="text-green-500 text-sm mt-1 flex items-center">
              <span className="material-symbols-outlined text-base mr-1">
                arrow_upward
              </span>
              +8% from last month
            </p>
          </div>
          <div className="text-green-500 flex items-center justify-center rounded-full bg-green-100 p-3 dark:bg-green-900 dark:text-green-200">
            <span className="material-symbols-outlined text-2xl">group</span>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium dark:text-gray-400">
              Revenue
            </p>
            <h3 className="text-gray-800 text-xl md:text-2xl font-bold mt-0.5 md:mt-1 dark:text-white">
              $42.8K
            </h3>
            <p className="text-green-500 text-sm mt-1 flex items-center">
              <span className="material-symbols-outlined text-base mr-1">
                arrow_upward
              </span>
              +23% from last month
            </p>
          </div>
          <div className="text-purple-500 flex items-center justify-center rounded-full bg-purple-100 p-3 dark:bg-purple-900 dark:text-purple-200">
            <span className="material-symbols-outlined text-2xl">payments</span>
          </div>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium dark:text-gray-400">
              Tasks Completed
            </p>
            <h3 className="text-gray-800 text-xl md:text-2xl font-bold mt-0.5 md:mt-1 dark:text-white">
              89%
            </h3>
            <p className="text-green-500 text-sm mt-1 flex items-center">
              <span className="material-symbols-outlined text-base mr-1">
                arrow_upward
              </span>
              +5% from last month
            </p>
          </div>
          <div className="text-orange-500 flex items-center justify-center rounded-full bg-orange-100 p-3 dark:bg-orange-900 dark:text-orange-200">
            <span className="material-symbols-outlined text-2xl">
              check_circle
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummaryCards;
