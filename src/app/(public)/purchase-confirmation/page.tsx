"use client";
import React from "react";
import PurchaseConfirmationHeader from "@/components/purchase-confirmation/PurchaseConfirmationHeader";
import PurchaseSummary from "@/components/purchase-confirmation/PurchaseSummary";
import ItemsPurchased from "@/components/purchase-confirmation/ItemsPurchased";
import ActionButtons from "@/components/purchase-confirmation/ActionButtons";


const PurchaseConfirmationPage = () => {
  const purchase = {
    purchaseNumber: "123456789",
    purchaseDate: "July 26, 2024",
    total: 2499.0,
    items: [
      {
        id: 1,
        name: "Modern Farmhouse Design",
        planId: "987654321",
        image: "/images/banner-1.png",
      },
    ],
  };

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1 justify-center py-8 md:py-12 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="layout-content-container flex flex-col w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <PurchaseConfirmationHeader purchaseNumber={purchase.purchaseNumber} />
            <div className="px-8 md:px-12 py-6 border-t border-gray-200 dark:border-gray-700">
              <PurchaseSummary
                purchaseDate={purchase.purchaseDate}
                total={purchase.total}
                purchaseNumber={purchase.purchaseNumber}
              />
            </div>
            <div className="px-8 md:px-12 py-6 border-t border-gray-200 dark:border-gray-700">
              <ItemsPurchased items={purchase.items} />
            </div>
            <div className="p-8 md:p-12 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-lg">
              <ActionButtons />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PurchaseConfirmationPage;
