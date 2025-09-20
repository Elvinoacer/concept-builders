// components/dashboard/purchases/PurchasesTable.jsx
"use client";
import React from "react";
import { purchasedDesigns } from "@/lib/purchases";
import PurchaseRow from "./PurchaseRow";

const PurchasesTable = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th
                className="px-3 py-2 md:px-6 md:py-4 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                scope="col"
              >
                Design
              </th>
              <th
                className="px-3 py-2 md:px-6 md:py-4 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                scope="col"
              >
                Purchase Date
              </th>
              <th
                className="px-3 py-2 md:px-6 md:py-4 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                scope="col"
              >
                Price
              </th>
              <th
                className="px-3 py-2 md:px-6 md:py-4 text-left font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-right"
                scope="col"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {purchasedDesigns.map((design) => (
              <PurchaseRow key={design.id} design={design} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchasesTable;
