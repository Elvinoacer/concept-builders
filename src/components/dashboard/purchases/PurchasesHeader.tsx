// components/dashboard/purchases/PurchasesHeader.jsx
"use client";
import React from "react";

const PurchasesHeader = () => {
  return (
    <div className="mb-4 md:mb-8">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-cream">
        My Purchased Designs
      </h2>
      <p className="mt-1 md:mt-2 text-cream-dim">
        Access your purchased house plans, download files, and manage your
        receipts.
      </p>
    </div>
  );
};

export default PurchasesHeader;
