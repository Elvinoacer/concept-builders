"use client";
import React from "react";

interface Payment {
  id: number;
  name: string;
  amount: number;
  status: string;
  statusColor: string;
  date: string;
}

const Payments = ({ payments }: { payments: Payment[] }) => {
  const getStatusClasses = (statusColor: string) => {
    switch (statusColor) {
      case "green":
        return "bg-emerald-900/30 text-emerald-300";
      case "yellow":
        return "bg-amber-900/30 text-amber-300";
      default:
        return "bg-surface text-cream-dim";
    }
  };

  return (
    <div className="rounded-lg border border-cb-border bg-card shadow-sm overflow-hidden">
      <div className="p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-cream">
          Payments
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-cb-border">
          <thead className="bg-surface">
            <tr>
              <th
                className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-cream-dim"
                scope="col"
              >
                Payment
              </th>
              <th
                className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-cream-dim"
                scope="col"
              >
                Amount
              </th>
              <th
                className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-cream-dim"
                scope="col"
              >
                Status
              </th>
              <th
                className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-cream-dim"
                scope="col"
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cb-border bg-card">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="hover:bg-surface"
              >
                <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-sm font-medium text-cream">
                  {payment.name}
                </td>
                <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-sm text-cream-dim">
                  ${payment.amount.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-sm text-cream-dim">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                      payment.statusColor
                    )}`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-sm text-cream-dim">
                  {payment.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
