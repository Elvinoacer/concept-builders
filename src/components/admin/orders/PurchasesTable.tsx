"use client";

import { motion } from "framer-motion";

const PurchasesTable = ({ purchases }: { purchases: any[] }) => {
  const getStatusChip = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {status}
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {status}
          </span>
        );
      case "REFUND_REQUESTED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            {status}
          </span>
        );
      case "REFUNDED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 mt-4 dark:bg-gray-800 dark:border-gray-700">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-3 py-2 md:px-6 md:py-3 font-medium">
                Purchase ID
              </th>
              <th scope="col" className="px-3 py-2 md:px-6 md:py-3 font-medium">
                Client
              </th>
              <th scope="col" className="px-3 py-2 md:px-6 md:py-3 font-medium">
                Design Name
              </th>
              <th scope="col" className="px-3 py-2 md:px-6 md:py-3 font-medium">
                Quantity
              </th>
              <th scope="col" className="px-3 py-2 md:px-6 md:py-3 font-medium">
                Date
              </th>
              <th scope="col" className="px-3 py-2 md:px-6 md:py-3 font-medium">
                Amount
              </th>
              <th scope="col" className="px-3 py-2 md:px-6 md:py-3 font-medium">
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-2 md:px-6 md:py-3 font-medium text-right"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <td className="px-3 py-2 md:px-6 md:py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {purchase.id}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4">
                  {purchase.user ? purchase.user.name : "N/A"}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4">
                  {purchase.items && purchase.items.length > 0
                    ? purchase.items
                        .map((item: any) => item.design?.name || "N/A")
                        .join(", ")
                    : "N/A"}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4">
                  {purchase.items && purchase.items.length > 0
                    ? purchase.items
                        .map((item: any) => item.quantity)
                        .join(", ")
                    : "N/A"}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4">
                  {new Date(purchase.createdAt).toLocaleDateString()}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4">
                  ${purchase.amount.toFixed(2)}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4">
                  {getStatusChip(purchase.status)}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4 text-right">
                  <a
                    href="#"
                    className="font-medium text-primary hover:underline dark:text-blue-400"
                  >
                    View
                  </a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default PurchasesTable;
