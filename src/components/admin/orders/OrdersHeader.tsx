"use client";

import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { toast } from "sonner";
import { useState } from "react";

const OrdersHeader = ({ searchTerm, setSearchTerm, orders, status, startDate, endDate, handleStatusChange, handleStartDateChange, handleEndDateChange, applyFilters }) => {
  const [showFilters, setShowFilters] = useState(false);

  const exportToPDF = () => {
    if (orders.length === 0) {
      toast.error("No data to export.");
      return;
    }

    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Order ID', 'Client', 'Date', 'Amount', 'Status']],
      body: orders.map(order => [order.id, order.user ? order.user.name : 'N/A', new Date(order.createdAt).toLocaleDateString(), `${order.amount.toFixed(2)}`, order.status])
    });
    doc.save('orders.pdf');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 p-4 md:p-6 dark:bg-gray-900 dark:border-gray-800"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            Orders
          </h2>
          <p className="text-gray-500 text-sm mt-0.5 md:mt-1 dark:text-gray-400">
            Manage and process orders and refunds
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              search
            </span>
            <input
              className="form-input w-full rounded-lg border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
              placeholder="Search orders by ID, client..."
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative flex gap-2 w-full md:w-auto">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 w-full justify-center">
              <span className="material-symbols-outlined text-base">
                filter_list
              </span>
              Filter
            </button>
            {showFilters && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 z-10">
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Filter Options</h4>
                  <div className="mt-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select id="status" name="status" value={status} onChange={(e) => handleStatusChange(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                      <option>All</option>
                      <option>Paid</option>
                      <option>Pending</option>
                      <option>Refund Requested</option>
                      <option>Refunded</option>
                    </select>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Range</label>
                    <div className="flex gap-2 mt-1">
                      <input type="date" name="start-date" value={startDate} onChange={(e) => handleStartDateChange(e.target.value)} className="block w-full pl-3 pr-2 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                      <input type="date" name="end-date" value={endDate} onChange={(e) => handleEndDateChange(e.target.value)} className="block w-full pl-3 pr-2 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button onClick={() => setShowFilters(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                    <button onClick={() => { applyFilters(); setShowFilters(false); }} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark dark:bg-primary dark:hover:bg-primary-dark dark:text-primary-foreground">Apply Filters</button>
                  </div>
                </div>
              </div>
            )}
            <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 w-full justify-center">
              <span className="material-symbols-outlined text-base">
                ios_share
              </span>
              Export
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default OrdersHeader;