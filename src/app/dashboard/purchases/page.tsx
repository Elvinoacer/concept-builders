// app/dashboard/purchases/page.jsx
"use client";
import React from "react";
import PurchasesHeader from "@/components/dashboard/purchases/PurchasesHeader";
import PurchasesTable from "@/components/dashboard/purchases/PurchasesTable";

const MyPurchasesPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <PurchasesHeader />
      <PurchasesTable />
    </div>
  );
};

export default MyPurchasesPage;
