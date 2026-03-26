"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import DesignsList from "./DesignsList";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FiSearch, FiRefreshCw, FiAlertCircle, FiFilter } from "react-icons/fi";
import { toast } from "sonner";

interface DesignsTableProps {
  onEditClick?: (designId: string) => void;
  refreshKey?: number;
}

const DesignsTable = ({ onEditClick, refreshKey = 0 }: DesignsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingDesignId, setDeletingDesignId] = useState<string | null>(null);

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch designs: ${response.status}`);
    }
    return response.json();
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `/api/designs?search=${encodeURIComponent(debouncedSearch)}&page=${currentPage}&limit=8&refresh=${refreshKey}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: 10_000,
    },
  );

  const designs = data?.designs || [];
  const totalPages = data?.totalPages || 1;
  const loading = isLoading && !data;
  const isSearching = !!searchQuery && isValidating;
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";

  useEffect(() => {
    if (error) {
      toast.error("Failed to load designs");
    }
  }, [error]);

  useEffect(() => {
    if (!isValidating) {
      setRefreshing(false);
    }
  }, [isValidating]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await mutate();
    toast.success("Designs refreshed");
  };

  const handleDeleteDesign = async (designId: string, designName?: string) => {
    const confirmed = window.confirm(
      `Delete design${designName ? ` \"${designName}\"` : ""}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingDesignId(designId);

    try {
      const response = await fetch(`/api/designs/${designId}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to delete design");
      }

      toast.success(data?.message || "Design deleted successfully");
      await mutate();
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete design";
      toast.error(message);
    } finally {
      setDeletingDesignId(null);
    }
  };

  // Generate pagination items with ellipsis for mobile
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages =
      typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  // Loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
            <div className="space-y-2 flex-1 min-w-0">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="h-8 w-20 flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );

  // Error state
  const renderError = () => (
    <div className="space-y-4">
      <Alert variant="destructive">
        <FiAlertCircle className="h-5 w-5" />
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="flex-1">{errorMessage}</span>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <FiRefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>

      <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="text-4xl mb-4">🎨</div>
        <h3 className="text-lg font-semibold mb-2">Unable to Load Designs</h3>
        <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
          We're having trouble loading your designs. Please check your
          connection and try again.
        </p>
        <Button
          onClick={handleRefresh}
          className="flex items-center gap-2 mx-auto"
        >
          <FiRefreshCw className="h-4 w-4" />
          Refresh Designs
        </Button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-xl border border-border overflow-hidden shadow-sm"
    >
      {/* Search and Controls Section */}
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-2xl">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-sm"
              placeholder="Search designs by name, description, or category..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {(isSearching || refreshing) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <FiRefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Filter Button - Hidden on mobile */}
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2"
            >
              <FiFilter className="w-4 h-4" />
              <span>Filter</span>
            </Button>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <FiRefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden xs:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Search Results Info */}
        <AnimatePresence>
          {(searchQuery || designs.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between mt-4 text-sm text-muted-foreground"
            >
              <div>
                {searchQuery ? (
                  <span>
                    Searching for "<strong>{searchQuery}</strong>"
                  </span>
                ) : (
                  <span>
                    Showing {designs.length} design
                    {designs.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="text-xs">
                Page {currentPage} of {totalPages}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderSkeleton()}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderError()}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DesignsList
                designs={designs}
                onEditClick={onEditClick}
                onDeleteClick={handleDeleteDesign}
                deletingDesignId={deletingDesignId}
              />

              {/* Empty State */}
              {designs.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="text-4xl mb-4">🖼️</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery ? "No designs found" : "No designs yet"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
                    {searchQuery
                      ? "Try adjusting your search terms to find what you're looking for."
                      : "Get started by creating your first design to showcase your work."}
                  </p>
                  {!searchQuery && <Button>Create First Design</Button>}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && designs.length > 0 && (
        <div className="p-4 sm:p-6 border-t border-border">
          <Pagination>
            <PaginationContent className="flex-wrap">
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

              {getPaginationItems()}

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

          {/* Mobile Page Info */}
          <div className="sm:hidden text-center mt-3">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DesignsTable;
