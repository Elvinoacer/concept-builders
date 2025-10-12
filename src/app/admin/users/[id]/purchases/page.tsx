"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const PurchaseHistoryPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchPurchases = async () => {
        try {
          const response = await fetch(`/api/users/${id}/purchases`);
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
              setPurchases(data);
            } else {
              console.error("API did not return an array for purchases:", data);
              setPurchases([]);
            }
          } else {
            console.error("Failed to fetch purchases:", response.statusText);
            setPurchases([]);
          }
        } catch (error) {
          console.error("Error fetching purchases:", error);
          setPurchases([]);
        } finally {
          setLoading(false);
        }
      };
      fetchPurchases();
    }
  }, [id]);

  const handleIssueRefund = async (purchaseId: string) => {
    await fetch(`/api/users/${id}/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ purchaseId }),
    });
  };

  const handleResendReceipt = async (purchaseId: string) => {
    await fetch(`/api/users/${id}/resend-receipt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ purchaseId }),
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 p-4 md:p-8 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Purchase History</h1>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-800 dark:divide-gray-700">
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No purchases found.
                  </td>
                </tr>
              ) : (
                purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-sm text-gray-500 dark:text-gray-400">
                      {purchase.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-sm text-gray-500 dark:text-gray-400">
                      {purchase.amount}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-sm text-gray-500 dark:text-gray-400">
                      {purchase.status}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-right text-sm font-medium">
                      <button onClick={() => handleResendReceipt(purchase.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Resend Receipt
                      </button>
                      <button onClick={() => handleIssueRefund(purchase.id)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        Issue Refund
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;
