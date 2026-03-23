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
    <div className="min-h-screen bg-ink px-4 min-[375px]:px-5 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gold/10 rounded-lg">
              <Package className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h1
                className="text-3xl xs:text-4xl sm:text-5xl font-bold text-cream leading-tight"
                style={{
                  fontFamily:
                    'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                }}
              >
                My Digital Library
              </h1>
              <p className="text-cream-dim mt-2 text-base sm:text-lg max-w-2xl">
                Access all your purchased design plans, download files, and
                manage your projects.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-cb-muted" />
            </div>
            <input
              type="text"
              placeholder="Search your purchases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-cb-border rounded-xl leading-5 bg-surface text-cream placeholder-cb-muted focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm"
            />
          </div>
        </motion.header>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-cb-border"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-cream-dim" />
              <span className="text-sm font-medium text-cream">
                Filters & Sorting
              </span>
            </div>
            <motion.div
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                className="w-4 h-4 text-cream-dim"
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 lg:p-6 bg-card rounded-xl border border-cb-border mb-6">
            {/* File Type Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-cream mb-2">
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
                        ? "bg-gold text-ink shadow-sm"
                        : "bg-surface text-cream-dim hover:bg-ink hover:text-cream"
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
                className="block text-sm font-medium text-cream mb-2"
              >
                Sort By
              </label>
              <div className="relative">
                <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cb-muted" />
                <select
                  id="sort-order"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface border border-cb-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-cream appearance-none"
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
                    className="w-4 h-4 text-cb-muted"
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
            <p className="text-sm text-cream-dim">
              Showing {filteredDesigns.length} of {purchasedDesigns.length}{" "}
              purchases
            </p>
            {(searchQuery || filterFileType !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterFileType("all");
                }}
                className="text-sm text-gold hover:text-gold-light"
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
                  className="bg-card rounded-2xl p-6 border border-cb-border animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-surface rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-surface rounded w-3/4"></div>
                      <div className="h-3 bg-surface rounded w-1/2"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-surface rounded w-16"></div>
                        <div className="h-6 bg-surface rounded w-20"></div>
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
              <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-6 border border-cb-border">
                <Package className="w-10 h-10 text-cream-dim" />
              </div>
              <h3
                className="text-xl font-semibold text-cream mb-2"
                style={{
                  fontFamily:
                    'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                }}
              >
                {searchQuery || filterFileType !== "all"
                  ? "No Matching Purchases"
                  : "No Purchases Yet"}
              </h3>
              <p className="text-cream-dim max-w-md mx-auto mb-6">
                {searchQuery || filterFileType !== "all"
                  ? "No purchases match your current filters. Try adjusting your search or filters."
                  : "It looks like you haven't purchased any designs yet. Start exploring our collection!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/designs"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gold text-ink font-semibold rounded-xl hover:bg-gold-light transition-all shadow-sm hover:shadow-md"
                >
                  Browse Designs
                </a>
                {(searchQuery || filterFileType !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterFileType("all");
                    }}
                    className="inline-flex items-center justify-center px-6 py-3 text-cream bg-card border border-cb-border rounded-xl font-semibold hover:bg-surface transition-colors"
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
            <div className="bg-card rounded-xl p-4 border border-cb-border text-center">
              <p className="text-2xl font-bold text-cream">
                {purchasedDesigns.length}
              </p>
              <p className="text-sm text-cream-dim">
                Total Purchases
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-cb-border text-center">
              <p className="text-2xl font-bold text-cream">
                {purchasedDesigns.filter((d) => d.fileType === "PDF").length}
              </p>
              <p className="text-sm text-cream-dim">
                PDF Files
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-cb-border text-center">
              <p className="text-2xl font-bold text-cream">
                {
                  purchasedDesigns.filter((d) => d.fileType === "PDF & CAD")
                    .length
                }
              </p>
              <p className="text-sm text-cream-dim">
                CAD Files
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-cb-border text-center">
              <p className="text-2xl font-bold text-cream">
                $
                {purchasedDesigns
                  .reduce((total, design) => total + (design.price || 0), 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-cream-dim">
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
