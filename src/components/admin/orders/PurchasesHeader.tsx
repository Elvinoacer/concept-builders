"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  Download,
  FileText,
  Calendar,
  ChevronDown,
  Check,
} from "lucide-react";

const PurchasesHeader = ({
  searchTerm,
  setSearchTerm,
  status,
  startDate,
  endDate,
  handleStatusChange,
  handleStartDateChange,
  handleEndDateChange,
  applyFilters,
  handleExportToPdf,
  handleExportToCsv,
}: any) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters]);

  const statusOptions = [
    { value: "All", label: "All Status" },
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
    { value: "Refund Requested", label: "Refund Requested" },
    { value: "Refunded", label: "Refunded" },
  ];

  const handleApplyFilters = () => {
    applyFilters();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    handleStatusChange("All");
    handleStartDateChange("");
    handleEndDateChange("");
    setSearchTerm("");
    applyFilters();
    setShowFilters(false);
  };

  const hasActiveFilters =
    status !== "All" || startDate || endDate || searchTerm;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 xs:p-5 sm:p-6 lg:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Header Content */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              Purchases
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm xs:text-base sm:text-lg mt-1 xs:mt-2">
              Manage and process customer purchases and refunds
            </p>
          </div>

          {/* Actions Section */}
          <div className="flex flex-col xs:flex-row gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 lg:flex-initial lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                className="w-full h-12 xs:h-11 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl pl-10 pr-4 text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Search by ID, client, email..."
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && applyFilters()}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 xs:gap-3" ref={filtersRef}>
              {/* Filter Button */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 xs:px-4 xs:py-3 text-sm font-medium rounded-xl border transition-all duration-200 min-h-[44px] ${
                    hasActiveFilters
                      ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden xs:inline">Filter</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </motion.button>

                {/* Filters Dropdown */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg z-50 ${
                        isMobile
                          ? "left-0 right-0 mx-2 xs:mx-0 xs:w-80"
                          : "right-0 w-80"
                      }`}
                    >
                      <div className="p-4 xs:p-5">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Filter Purchases
                          </h3>
                          <button
                            onClick={() => setShowFilters(false)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Status
                          </label>
                          <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                            {statusOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => handleStatusChange(option.value)}
                                className={`flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                                  status === option.value
                                    ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
                                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                                }`}
                              >
                                {status === option.value && (
                                  <Check className="w-4 h-4" />
                                )}
                                <span className="text-xs xs:text-sm">
                                  {option.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Date Range */}
                        <div className="space-y-3 mt-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Date Range
                          </label>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                  handleStartDateChange(e.target.value)
                                }
                                className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <input
                                type="date"
                                value={endDate}
                                onChange={(e) =>
                                  handleEndDateChange(e.target.value)
                                }
                                className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col xs:flex-row gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={handleClearFilters}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            Clear All
                          </button>
                          <button
                            onClick={handleApplyFilters}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Apply Filters
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Export Buttons - Hidden on mobile, shown on xs and up */}
              <div className="hidden xs:flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExportToPdf}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200 min-h-[44px]"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">PDF</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExportToCsv}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200 min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">CSV</span>
                </motion.button>
              </div>

              {/* Mobile Export Dropdown */}
              <div className="xs:hidden relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200 min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  <ChevronDown className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50"
                    >
                      <div className="p-2">
                        <button
                          onClick={handleExportToPdf}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          Export as PDF
                        </button>
                        <button
                          onClick={handleExportToCsv}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Export as CSV
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 flex flex-wrap gap-2"
          >
            <span className="text-sm text-gray-500 dark:text-gray-400 self-center">
              Active filters:
            </span>
            {status !== "All" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm">
                Status: {status}
                <button
                  onClick={() => handleStatusChange("All")}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {startDate && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm">
                From: {startDate}
                <button
                  onClick={() => handleStartDateChange("")}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {endDate && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm">
                To: {endDate}
                <button
                  onClick={() => handleEndDateChange("")}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline transition-colors"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default PurchasesHeader;
