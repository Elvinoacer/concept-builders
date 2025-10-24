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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Oops! Something went wrong.
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We couldn't retrieve your purchase details.
          </p>
          <p className="mt-1 text-sm text-red-500">
            Error: {error}
          </p>
          <div className="mt-6 space-y-3">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Homepage
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
          <svg
            className="mx-auto h-16 w-16 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Purchase Not Found
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The purchase you are looking for could not be found. It might have been an invalid link or the purchase does not exist.
          </p>
          <div className="mt-6 space-y-3">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Homepage
            </a>
          </div>
        </div>
      </div>
    );
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
