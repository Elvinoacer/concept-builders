"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Mail,
  User,
  Phone,
} from "lucide-react";
import { useState } from "react";

const PurchasesTable = ({ purchases }: { purchases: any[] }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const getStatusChip = (status: string) => {
    const statusConfig = {
      PAID: {
        bg: "bg-green-100",
        text: "text-green-800",
        darkBg: "dark:bg-green-900",
        darkText: "dark:text-green-200",
        label: "Paid",
      },
      PENDING: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        darkBg: "dark:bg-blue-900",
        darkText: "dark:text-blue-200",
        label: "Pending",
      },
      REFUND_REQUESTED: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        darkBg: "dark:bg-yellow-900",
        darkText: "dark:text-yellow-200",
        label: "Refund Requested",
      },
      REFUNDED: {
        bg: "bg-red-100",
        text: "text-red-800",
        darkBg: "dark:bg-red-900",
        darkText: "dark:text-red-200",
        label: "Refunded",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      darkBg: "dark:bg-gray-900",
      darkText: "dark:text-gray-200",
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.darkBg} ${config.darkText} whitespace-nowrap`}
      >
        {config.label}
      </span>
    );
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ChevronDown className="w-3 h-3 opacity-40" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Mobile Card View
  const MobileCardView = ({
    purchase,
    index,
  }: {
    purchase: any;
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {purchase.id}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatDate(purchase.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-3">
          {getStatusChip(purchase.status)}
          <button
            onClick={() =>
              setExpandedRow(expandedRow === purchase.id ? null : purchase.id)
            }
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {expandedRow === purchase.id ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Client</p>
          <p className="text-gray-900 dark:text-white font-medium truncate">
            {purchase.user?.name || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Amount</p>
          <p className="text-gray-900 dark:text-white font-medium">
            {formatCurrency(purchase.amount)}
          </p>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expandedRow === purchase.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            {/* Design Details */}
            <div className="mb-4">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
                Designs
              </p>
              <div className="space-y-2">
                {purchase.items && purchase.items.length > 0 ? (
                  purchase.items.map((item: any, itemIndex: number) => (
                    <div
                      key={itemIndex}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-900 dark:text-white flex-1 truncate">
                        {item.design?.name || "Unnamed Design"}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No items
                  </p>
                )}
              </div>
            </div>

            {/* Client Contact */}
            <div className="mb-4">
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
                Client Contact
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                <User className="w-4 h-4" />
                <span>{purchase.user?.name || "N/A"}</span>
              </div>
              {purchase.user?.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{purchase.user.email}</span>
                </div>
              )}
              {purchase.user?.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <Phone className="w-4 h-4" />
                  <span className="truncate">{purchase.user.phone}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button className="p-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // Desktop Table View
  const DesktopTableView = () => (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-700 dark:text-gray-300 uppercase">
          <tr>
            {[
              { key: "id", label: "Purchase ID" },
              { key: "user", label: "Client" },
              { key: "phone", label: "Phone" },
              { key: "items", label: "Design Name" },
              { key: "quantity", label: "Quantity" },
              { key: "createdAt", label: "Date" },
              { key: "amount", label: "Amount" },
              { key: "status", label: "Status" },
              { key: "actions", label: "Actions" },
            ].map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-4 py-3 font-medium whitespace-nowrap ${
                  column.key === "actions" ? "text-right" : "text-left"
                } ${column.key !== "actions" ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" : ""}`}
                onClick={() =>
                  column.key !== "actions" && handleSort(column.key)
                }
              >
                <div
                  className={`flex items-center gap-1 ${column.key === "actions" ? "justify-end" : ""}`}
                >
                  {column.label}
                  {column.key !== "actions" && getSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          <AnimatePresence>
            {purchases.map((purchase, index) => (
              <motion.tr
                key={purchase.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <td className="px-4 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="truncate max-w-[120px]">
                      {purchase.id}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="text-gray-900 dark:text-white font-medium">
                      {purchase.user?.name || "N/A"}
                    </span>
                    {purchase.user?.email && (
                      <span className="text-gray-500 dark:text-gray-400 text-xs truncate">
                        {purchase.user.email}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-gray-900 dark:text-white">
                    {purchase.user?.phone || "N/A"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="max-w-[200px]">
                    <span className="text-gray-900 dark:text-white line-clamp-2">
                      {purchase.items && purchase.items.length > 0
                        ? purchase.items
                            .map((item: any) => item.design?.name || "N/A")
                            .join(", ")
                        : "N/A"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-gray-900 dark:text-white">
                    {purchase.items && purchase.items.length > 0
                      ? purchase.items
                          .map((item: any) => item.quantity)
                          .join(", ")
                      : "N/A"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-gray-900 dark:text-white whitespace-nowrap">
                    {formatDate(purchase.createdAt)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {formatCurrency(purchase.amount)}
                  </span>
                </td>
                <td className="px-4 py-4">{getStatusChip(purchase.status)}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );

  // Empty State
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
    >
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">📦</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No purchases found
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        There are no purchases to display at the moment. Check back later or
        adjust your filters.
      </p>
    </motion.div>
  );

  if (purchases.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-4 sm:mt-6"
    >
      {/* Mobile View */}
      <div className="block lg:hidden space-y-3">
        {purchases.map((purchase, index) => (
          <MobileCardView key={purchase.id} purchase={purchase} index={index} />
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <DesktopTableView />
      </div>

      {/* Summary */}
      <div className="mt-4 px-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {purchases.length} purchase{purchases.length !== 1 ? "s" : ""}
        </p>
      </div>
    </motion.div>
  );
};

export default PurchasesTable;
