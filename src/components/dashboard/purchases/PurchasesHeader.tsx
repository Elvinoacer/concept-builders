// components/dashboard/purchases/PurchasesHeader.jsx
"use client";
import React from "react";

const PurchasesHeader = () => {
  return (
    <div className="mb-8">
      <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        My Purchased Designs
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Access your purchased house plans, download files, and manage your
        receipts.
      </p>
    </div>
  );
};

export default PurchasesHeader;
