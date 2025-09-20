"use client";

import { ordersData } from "@/lib/orders-data";
import { motion } from "framer-motion";
import Pagination from "./Pagination";

const OrdersTable = () => {
  const getStatusChip = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {status}
          </span>
        );
      case "Refund Requested":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            {status}
          </span>
        );
      case "Refunded":
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-4">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            search
          </span>
          <input
            className="form-input w-full rounded-lg border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
            placeholder="Search orders by ID, client..."
            type="search"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 w-full justify-center">
            <span className="material-symbols-outlined text-base">
              filter_list
            </span>
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 w-full justify-center">
            <span className="material-symbols-outlined text-base">
              ios_share
            </span>
            Export
          </button>
        </div>
      </div>
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
            {ordersData.map((order, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <td className="px-3 py-2 md:px-6 md:py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {order.orderId}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4">{order.client}</td>
                <td className="px-3 py-2 md:px-6 md:py-4">{order.date}</td>
                <td className="px-3 py-2 md:px-6 md:py-4">{order.amount}</td>
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
      <Pagination />
    </motion.div>
  );
};

export default OrdersTable;
