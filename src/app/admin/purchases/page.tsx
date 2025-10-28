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
} from "@/components/ui/pagination";

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
  const limit = 10; // Items per page

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        searchTerm,
        status: activeTab === "All" ? status : activeTab, // Use activeTab for status if not "All"
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
    }
  }, [activeTab, searchTerm, status, startDate, endDate, currentPage]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1); // Reset page on filter change
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    setCurrentPage(1); // Reset page on filter change
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    setCurrentPage(1); // Reset page on filter change
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setStatus(tab === "All" ? "All" : tab); // Sync status with tab
    setCurrentPage(1); // Reset page on tab change
  };

  if (loading) return <div className="p-4 md:p-6">Loading purchases...</div>;
  if (error)
    return <div className="p-4 md:p-6 text-red-500">Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6"
    >
      <PurchasesHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        status={status}
        startDate={startDate}
        endDate={endDate}
        handleStatusChange={handleStatusChange}
        handleStartDateChange={handleStartDateChange}
        handleEndDateChange={handleEndDateChange}
        applyFilters={fetchPurchases} // Re-fetch on apply filters
      />
      <div className="mt-4 md:mt-6">
        <PurchasesTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        <div className="mt-4">
          <PurchasesTable purchases={purchases} />
        </div>
      </div>
      {totalPages > 1 && (
        <div className="p-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </motion.div>
  );
};

export default PurchasesPage;
