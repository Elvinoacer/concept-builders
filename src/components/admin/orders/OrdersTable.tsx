"use client";

import { motion } from "framer-motion";
import Pagination from "@/components/ui/CustomPagination";
import { useState } from "react";

const OrdersTable = ({ orders }: { orders: any[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

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
                Order ID
              </th>
              <th scope="col" className="px-3 py-2 md:px-6 md:py-3 font-medium">
                Client
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
              <th scope="col" className="px-3 py-2 md:px-6 md:py-3 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((order, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <td className="px-3 py-2 md:px-6 md:py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {order.id}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4">{order.user ? order.user.name : 'N/A'}</td>
                <td className="px-3 py-2 md:px-6 md:py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-3 py-2 md:px-6 md:py-4">${order.amount.toFixed(2)}</td>
                <td className="px-3 py-2 md:px-6 md:py-4">{getStatusChip(order.status)}</td>
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
      <Pagination
        totalItems={orders.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </motion.div>
  );
};

export default OrdersTable;