// components/dashboard/purchases/PurchasesTable.jsx
"use client";
import React from "react";
import { purchasedDesigns } from "@/lib/purchases";
import PurchaseRow from "./PurchaseRow";

const PurchasesTable = () => {
  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden border border-cb-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-cb-border">
            <tr>
              <th
                className="px-3 py-2 md:px-6 md:py-4 text-left font-semibold text-cream-dim uppercase tracking-wider"
                scope="col"
              >
                Design
              </th>
              <th
                className="px-3 py-2 md:px-6 md:py-4 text-left font-semibold text-cream-dim uppercase tracking-wider"
                scope="col"
              >
                Purchase Date
              </th>
              <th
                className="px-3 py-2 md:px-6 md:py-4 text-left font-semibold text-cream-dim uppercase tracking-wider"
                scope="col"
              >
                Price
              </th>
              <th
                className="px-3 py-2 md:px-6 md:py-4 text-left font-semibold text-cream-dim uppercase tracking-wider text-right"
                scope="col"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cb-border">
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
