// components/dashboard/purchases/PurchaseRow.jsx
"use client";
import { Purchase } from "@/lib/types";

const PurchaseRow = ({ design }: { design: Purchase }) => {
  return (
    <tr>
      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
        <div className="font-medium text-cream">
          {design.name}
        </div>
      </td>
      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-cream-dim">
        {design.purchaseDate}
      </td>
      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-cream-dim">
        ${design.price.toFixed(2)}
      </td>
      <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-right">
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 sm:gap-4">
          <button className="flex items-center gap-1.5 text-sm font-medium text-gold hover:text-gold-light transition-colors">
            <span className="material-symbols-outlined text-base">
              download
            </span>
            Download
          </button>
          <button className="flex items-center gap-1.5 text-sm font-medium text-cream-dim hover:text-cream transition-colors">
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
