"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PurchaseConfirmationHeader from "@/components/purchase-confirmation/PurchaseConfirmationHeader";
import PurchaseSummary from "@/components/purchase-confirmation/PurchaseSummary";
import ItemsPurchased from "@/components/purchase-confirmation/ItemsPurchased";
import ActionButtons from "@/components/purchase-confirmation/ActionButtons";
import { toast } from "sonner";

const PurchaseConfirmationPage = () => {
  const searchParams = useSearchParams();
  const purchaseId = searchParams.get("purchaseId");
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (purchaseId) {
      const fetchPurchase = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/purchases/${purchaseId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch purchase details");
          }
          const data = await response.json();
          setPurchase(data);
        } catch (error) {
          setError(error.message);
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPurchase();
    }
  }, [purchaseId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!purchase) {
    return <div>Purchase not found</div>;
  }

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1 justify-center py-8 md:py-12 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="layout-content-container flex flex-col w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <PurchaseConfirmationHeader purchaseNumber={purchase.id} />
            <div className="px-8 md:px-12 py-6 border-t border-gray-200 dark:border-gray-700">
              <PurchaseSummary
                purchaseDate={new Date(purchase.createdAt).toLocaleDateString()}
                total={purchase.amount}
                purchaseNumber={purchase.id}
              />
            </div>
            <div className="px-8 md:px-12 py-6 border-t border-gray-200 dark:border-gray-700">
              <ItemsPurchased items={purchase.items} />
            </div>
            <div className="p-8 md:p-12 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-lg">
              <ActionButtons orderId={purchase.id} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PurchaseConfirmationPage;
