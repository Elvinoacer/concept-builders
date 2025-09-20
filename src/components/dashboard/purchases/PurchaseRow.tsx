// components/dashboard/purchases/PurchaseRow.jsx
"use client";
import { Purchase } from "@/lib/types";

const PurchaseRow = ({ design }: { design: Purchase }) => {
  return (
    <tr>
      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {design.name}
        </div>
      </td>
      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
        {design.purchaseDate}
      </td>
      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
        ${design.price.toFixed(2)}
      </td>
      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-right">
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-4">
          <button className="flex items-center gap-1.5 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 transition-colors">
            <span className="material-symbols-outlined text-base">
              download
            </span>
            Download
          </button>
          <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            <span className="material-symbols-outlined text-base">
              receipt_long
            </span>
            Resend Receipt
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PurchaseRow;
