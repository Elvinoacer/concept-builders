"use client";
import PurchaseListItem from "@/components/dashboard/PurchaseListItem";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Filter, SortAsc, Package, Search } from "lucide-react";

const PurchasesPage = () => {
  const { data: session } = useSession();
  const [sortOrder, setSortOrder] = useState("date_desc");
  const [filterFileType, setFilterFileType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [purchasedDesigns, setPurchasedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchPurchasedDesigns = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          sortOrder,
          filterFileType,
          search: searchQuery,
        }).toString();
        const response = await fetch(`/api/purchases?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch purchases");
        }
        const data = await response.json();
        setPurchasedDesigns(data);
      } catch (error) {
        console.error("Error fetching purchased designs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchPurchasedDesigns();
    }
  }, [session, sortOrder, filterFileType, searchQuery]);

  const filteredDesigns = purchasedDesigns.filter(
    (design) =>
      design.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 min-[375px]:px-5 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                My Digital Library
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-base sm:text-lg max-w-2xl">
                Access all your purchased design plans, download files, and
                manage your projects.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search your purchases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:text-white text-sm"
            />
          </div>
        </motion.header>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filters & Sorting
              </span>
            </div>
            <motion.div
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </button>
        </div>

        {/* Controls */}
        <motion.div
          initial={false}
          animate={{
            height: showFilters ? "auto" : "0",
            opacity: showFilters ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="lg:!h-auto lg:!opacity-100 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 lg:p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
            {/* File Type Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                File Type
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "All Files" },
                  { value: "PDF", label: "PDF Only" },
                  { value: "PDF & CAD", label: "PDF & CAD" },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFilterFileType(type.value)}
                    className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-2 ${
                      filterFileType === type.value
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Order */}
            <div className="flex-1 max-w-xs">
              <label
                htmlFor="sort-order"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Sort By
              </label>
              <div className="relative">
                <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  id="sort-order"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white appearance-none"
                >
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="price_desc">Highest Price</option>
                  <option value="price_asc">Lowest Price</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        {!loading && purchasedDesigns.length > 0 && (
          <div className="flex items-center justify-between mb-4 px-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredDesigns.length} of {purchasedDesigns.length}{" "}
              purchases
            </p>
            {(searchQuery || filterFileType !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterFileType("all");
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Design List */}
        <div className="flex flex-col gap-4">
          {loading ? (
            // Skeleton Loading
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDesigns.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery || filterFileType !== "all"
                  ? "No Matching Purchases"
                  : "No Purchases Yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                {searchQuery || filterFileType !== "all"
                  ? "No purchases match your current filters. Try adjusting your search or filters."
                  : "It looks like you haven't purchased any designs yet. Start exploring our collection!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/designs"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-500 transition-all shadow-sm hover:shadow-md"
                >
                  Browse Designs
                </a>
                {(searchQuery || filterFileType !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterFileType("all");
                    }}
                    className="inline-flex items-center justify-center px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredDesigns.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <PurchaseListItem design={design} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Quick Stats */}
        {!loading && purchasedDesigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {purchasedDesigns.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Purchases
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {purchasedDesigns.filter((d) => d.fileType === "PDF").length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                PDF Files
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {
                  purchasedDesigns.filter((d) => d.fileType === "PDF & CAD")
                    .length
                }
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                CAD Files
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                $
                {purchasedDesigns
                  .reduce((total, design) => total + (design.price || 0), 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Spent
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PurchasesPage;
