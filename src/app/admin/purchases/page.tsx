"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import PurchasesHeader from "@/components/admin/orders/PurchasesHeader";
import PurchasesTabs from "@/components/admin/orders/PurchasesTabs";
import PurchasesTable from "@/components/admin/orders/PurchasesTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { convertToCSV } from "@/lib/csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PurchasesPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [statusCounts, setStatusCounts] = useState({});
  const limit = 10;

  const handleExportToPdf = () => {
    if (purchases.length === 0) {
      toast.warning("No data to export to PDF.");
      return;
    }

    const doc = new jsPDF();
    const tableColumn = ["ID", "Created At", "Status", "Amount", "User", "Email"];
    const tableRows = [];

    purchases.forEach((purchase) => {
      const purchaseData = [
        purchase.id,
        new Date(purchase.createdAt).toLocaleDateString(),
        purchase.status,
        `$${purchase.amount}`,
        purchase.user.name,
        purchase.user.email,
      ];
      tableRows.push(purchaseData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.text("Purchases", 14, 15);
    doc.save("purchases.pdf");
  };

  const handleExportToCsv = () => {
    if (purchases.length === 0) {
      toast.warning("No data to export to CSV.");
      return;
    }

    const csv = convertToCSV(purchases);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "purchases.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchStatusCounts = async () => {
    try {
      const res = await fetch("/api/admin/orders/status-counts");
      if (!res.ok) {
        throw new Error("Failed to fetch status counts");
      }
      const data = await res.json();
      setStatusCounts(data);
    } catch (err) {
      console.error("Error fetching status counts:", err);
    }
  };

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        searchTerm,
        status: activeTab === "All" ? status : activeTab,
        startDate,
        endDate,
      });

      const res = await fetch(`/api/admin/orders?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch purchases");
      }
      const data = await res.json();
      setPurchases(data.orders);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error fetching purchases:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, searchTerm, status, startDate, endDate, currentPage]);

  useEffect(() => {
    fetchPurchases();
    fetchStatusCounts();
  }, [fetchPurchases]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPurchases();
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    setCurrentPage(1);
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top on page change for better mobile UX
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setStatus(tab === "All" ? "All" : tab);
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Generate pagination range with ellipsis for mobile
  const getPaginationRange = () => {
    const delta = 1; // number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // Loading state with enhanced UI
  if (loading && purchases.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">
              Loading Purchases
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Fetching your order data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state with enhanced UI
  if (error && purchases.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-red-600 dark:text-red-400 text-xl font-bold mb-2">
            Unable to Load Purchases
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-base mb-6">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRefresh}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6 lg:p-8"
    >
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Purchases
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Manage and track all customer orders and purchases
              </p>
            </div>

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 w-full lg:w-auto"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="text-sm font-medium">
                {refreshing ? "Refreshing..." : "Refresh"}
              </span>
            </motion.button>
          </div>

          <PurchasesHeader
            searchTerm={searchTerm}
            setSearchTerm={handleSearch}
            status={status}
            startDate={startDate}
            endDate={endDate}
            handleStatusChange={handleStatusChange}
            handleStartDateChange={handleStartDateChange}
            handleEndDateChange={handleEndDateChange}
            applyFilters={fetchPurchases}
            handleExportToPdf={handleExportToPdf}
            handleExportToCsv={handleExportToCsv}
          />
        </div>

        {/* Content Section */}
        <div className="space-y-4 sm:space-y-6">
          {/* Tabs Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <PurchasesTabs
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              statusCounts={statusCounts}
            />
          </div>

          {/* Table Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Updating purchases...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <PurchasesTable purchases={purchases} />
                </div>

                {/* Empty State */}
                {purchases.length === 0 && (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📦</span>
                    </div>
                    <h3 className="text-gray-900 dark:text-white text-lg font-semibold mb-2">
                      No purchases found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
                      {searchTerm || status !== "All" || startDate || endDate
                        ? "Try adjusting your filters or search terms"
                        : "There are no purchases to display at the moment"}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pagination Section */}
          {totalPages > 1 && purchases.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              {/* Mobile: Compact pagination */}
              <div className="block sm:hidden">
                <Pagination>
                  <PaginationContent className="flex w-full justify-between">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`h-10 px-4 ${
                          currentPage === 1
                            ? "pointer-events-none opacity-30"
                            : "cursor-pointer"
                        }`}
                      />
                    </PaginationItem>

                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`h-10 px-4 ${
                          currentPage === totalPages
                            ? "pointer-events-none opacity-30"
                            : "cursor-pointer"
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              {/* Desktop: Full pagination */}
              <div className="hidden sm:block">
                <Pagination>
                  <PaginationContent className="flex-wrap">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer min-h-[40px] min-w-[40px]"
                        }
                      />
                    </PaginationItem>

                    {getPaginationRange().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === "..." ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={currentPage === page}
                            onClick={() => handlePageChange(page as number)}
                            className="cursor-pointer min-h-[40px] min-w-[40px]"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer min-h-[40px] min-w-[40px]"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              {/* Results Summary */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {purchases.length} results on page {currentPage} of{" "}
                  {totalPages}
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && purchases.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 dark:text-red-400 text-sm">
                    {error}
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium flex items-center space-x-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Spacing */}
        <div className="h-6 sm:h-8 lg:h-12"></div>
      </div>
    </motion.div>
  );
};

export default PurchasesPage;