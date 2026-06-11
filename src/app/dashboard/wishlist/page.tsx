"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Heart,
  Search,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

interface WishlistItem {
  id: string;
  name: string;
  basePrice: number;
  images: { url: string }[];
  category?: string;
  createdAt?: string;
}

const WishlistSkeleton = () => (
  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
    {[...Array(8)].map((_, index) => (
      <div
        key={index}
        className="bg-card rounded-2xl shadow-sm border border-cb-border overflow-hidden animate-pulse"
      >
        <div className="relative h-48 bg-surface"></div>
        <div className="p-4 sm:p-6">
          <div className="h-5 bg-surface rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-surface rounded w-1/2 mb-4"></div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <div className="h-10 bg-surface rounded w-full"></div>
            <div className="h-10 bg-surface rounded w-full"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const WishlistPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "price-low" | "price-high"
  >("newest");
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;

  const fetchWishlist = async () => {
    if (!session) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/wishlist");
      if (!response.ok) throw new Error("Failed to fetch wishlist");
      const data: WishlistItem[] = await response.json();
      setWishlist(data);
    } catch (error: any) {
      console.error("Error fetching wishlist:", error);
      toast.error(`Failed to load your wishlist: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [session]);

  const handleRemoveFromWishlist = async (designId: string) => {
    if (!session) {
      toast.error("You must be logged in to modify your wishlist.");
      return;
    }

    const originalWishlist = [...wishlist];
    setWishlist((prev) => prev.filter((item) => item.id !== designId));

    toast.promise(
      fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designId }),
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to remove item.");
        return res.json();
      }),
      {
        loading: "Removing from wishlist...",
        success: "Design removed from wishlist!",
        error: (err) => {
          setWishlist(originalWishlist);
          return `Failed to remove design: ${err.message}`;
        },
      }
    );
  };

  const filteredAndSortedWishlist = useMemo(() => {
    let filtered = wishlist.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
        );
        break;
      case "price-low":
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-high":
        filtered.sort((a, b) => b.basePrice - a.basePrice);
        break;
    }

    return filtered;
  }, [wishlist, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedWishlist.length / itemsPerPage);
  const currentItems = useMemo(
    () =>
      filteredAndSortedWishlist.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredAndSortedWishlist, currentPage]
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink px-4 min-[375px]:px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-6 sm:py-8">
          <header className="mb-6 sm:mb-8">
            <div className="h-8 bg-surface rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-surface rounded w-64 animate-pulse"></div>
          </header>
          <WishlistSkeleton />
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-6 border border-cb-border">
            <Heart className="w-10 h-10 text-cream-dim" />
          </div>
          <h2
            className="text-2xl font-bold text-cream mb-3"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            Your Wishlist is Empty
          </h2>
          <p className="text-cream-dim mb-8 leading-relaxed">
            You haven&apos;t added any designs yet. Explore our collection and save
            your favorites to build your dream home!
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/designs")}
            className="bg-gold text-ink px-8 py-4 rounded-xl font-semibold shadow-sm hover:shadow-md hover:bg-gold-light transition-all"
          >
            Explore Designs
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink px-4 min-[375px]:px-5 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gold/10 rounded-lg">
              <Heart className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h1
                className="text-3xl xs:text-4xl sm:text-5xl font-bold text-cream leading-tight"
                style={{
                  fontFamily:
                    'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                }}
              >
                My Wishlist
              </h1>
              <p className="text-cream-dim mt-2 text-base sm:text-lg">
                Your saved designs for future projects
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-2xl p-4 border border-cb-border text-center">
              <p className="text-2xl font-bold text-cream">
                {wishlist.length}
              </p>
              <p className="text-sm text-cream-dim">
                Total Items
              </p>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-cb-border text-center">
              <p className="text-2xl font-bold text-cream">
                $
                {wishlist
                  .reduce((total, item) => total + item.basePrice, 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-cream-dim">
                Total Value
              </p>
            </div>
          </div>
        </motion.header>

        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cb-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Search your wishlist..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-cb-border bg-surface text-cream placeholder-cb-muted focus:outline-none focus:ring-2 focus:ring-gold transition-shadow"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cb-muted hover:text-cream p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 bg-card border border-cb-border rounded-xl text-sm font-medium text-cream-dim"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Sort Options */}
            <div
              className={`flex flex-col sm:flex-row gap-4 ${showFilters ? "flex" : "hidden sm:flex"}`}
            >
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-surface border border-cb-border rounded-xl text-sm text-cream focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Results Count */}
            <div
              className={`text-sm text-cream-dim ${showFilters ? "block" : "hidden sm:block"}`}
            >
              Showing {currentItems.length} of{" "}
              {filteredAndSortedWishlist.length} items
            </div>
          </div>
        </div>

        {/* Wishlist Grid */}
        {currentItems.length === 0 && searchTerm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-6 border border-cb-border">
              <Search className="w-10 h-10 text-cream-dim" />
            </div>
            <h3
              className="text-xl font-semibold text-cream mb-2"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              No Results Found
            </h3>
            <p className="text-cream-dim mb-6">
              No designs in your wishlist match &quot;{searchTerm}&quot;.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="text-gold hover:text-gold-light font-medium"
            >
              Clear search
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <AnimatePresence>
                {currentItems.map((design, index) => (
                  <motion.div
                    key={design.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                    className="bg-card rounded-2xl shadow-sm border border-cb-border overflow-hidden group hover:shadow-md hover:border-border-gold transition-all duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                      <Image
                        src={
                          design.images?.[0]?.url ||
                          "/images/design-placeholder.jpg"
                        }
                        alt={design.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                        sizes="(max-width: 475px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveFromWishlist(design.id)}
                        className="absolute top-3 right-3 bg-card/90 p-2 rounded-full text-cream-dim hover:text-destructive shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                        aria-label="Remove from wishlist"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-cream line-clamp-2 leading-tight mb-2">
                        {design.name}
                      </h3>
                      <p className="text-gold font-semibold text-lg mb-4">
                        {design.basePrice === 0 ? "Custom Quote" : `$${design.basePrice.toFixed(2)}`}
                      </p>

                      {/* Actions */}
                      <div className="mt-auto space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => router.push(`/designs/${design.id}`)}
                          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 bg-gold text-ink text-sm font-semibold shadow-sm hover:shadow-md hover:bg-gold-light transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-cb-border">
                <p className="text-sm text-cream-dim">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredAndSortedWishlist.length
                  )}{" "}
                  of {filteredAndSortedWishlist.length} items
                </p>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-cb-border text-cream-dim shadow-sm hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden xs:block">Previous</span>
                  </motion.button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1;
                      if (
                        totalPages <= 5 ||
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                              currentPage === pageNumber
                                ? "bg-gold text-ink"
                                : "bg-card border border-cb-border text-cream-dim hover:bg-surface"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span key={pageNumber} className="px-2 text-cb-muted">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-cb-border text-cream-dim shadow-sm hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden xs:block">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
