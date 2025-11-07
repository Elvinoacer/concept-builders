"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Design } from "@/generated/prisma";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Grid3X3,
  Image as ImageIcon,
  List,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Search,
  Star,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DesignWithCategoryAndFiles extends Design {
  category: { name: string } | null;
  files: { url: string }[];
  architecturalDesign?: {
    pdfFiles: { url: string }[];
    cadFiles: { url: string }[];
  } | null;
  structuralDesign?: {
    pdfFiles: { url: string }[];
    cadFiles: { url: string }[];
  } | null;
  billOfQuantities?: {
    excelFiles: { url: string }[];
  } | null;
}

const FeaturedDesignManagement = () => {
  const [designs, setDesigns] = useState<DesignWithCategoryAndFiles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalDesigns, setTotalDesigns] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "name" | "category" | "featured" | "date"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [updatingDesigns, setUpdatingDesigns] = useState<Set<string>>(
    new Set()
  );

  const fetchDesigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        search: searchQuery,
        sortBy,
        sortOrder,
      });
      const response = await fetch(`/api/admin/designs?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch designs");
      }
      const data = await response.json();
      setDesigns(data.designs);
      setTotalDesigns(data.totalCount);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, [currentPage, pageSize, searchQuery, sortBy, sortOrder]);

  const updateIsFeatured = async (designId: string, isFeatured: boolean) => {
    setUpdatingDesigns((prev) => new Set(prev).add(designId));

    const originalDesigns = [...designs];
    setDesigns((prevDesigns) =>
      prevDesigns.map((design) =>
        design.id === designId ? { ...design, isFeatured: isFeatured } : design
      )
    );

    try {
      const response = await fetch(`/api/admin/designs/${designId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFeatured }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update featured status"
        );
      }

      toast.success(
        isFeatured
          ? "Design added to featured!"
          : "Design removed from featured!"
      );
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
      setDesigns(originalDesigns);
    } finally {
      setUpdatingDesigns((prev) => {
        const newSet = new Set(prev);
        newSet.delete(designId);
        return newSet;
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSort = (field: "name" | "category" | "featured" | "date") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const totalPages = Math.ceil(totalDesigns / pageSize);
  const featuredDesigns = designs.filter((d) => d.isFeatured);

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-xl flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
            <div className="w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Empty State
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
    >
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {searchQuery ? "No designs found" : "No designs available"}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {searchQuery
          ? "Try adjusting your search terms or filters to find what you're looking for."
          : "There are no designs in the system yet. Designs will appear here once they are created."}
      </p>
      {searchQuery && (
        <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
      )}
    </motion.div>
  );

  // Grid View
  const GridView = () => (
    <motion.div
      layout
      className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {designs.map((design) => (
        <DesignCard key={design.id} design={design} />
      ))}
    </motion.div>
  );

  // List View
  const ListView = () => (
    <motion.div layout className="space-y-3">
      {designs.map((design) => (
        <DesignRow key={design.id} design={design} />
      ))}
    </motion.div>
  );

  // Design Card Component
  const DesignCard = ({ design }: { design: DesignWithCategoryAndFiles }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      {/* Image/Thumbnail Area */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {design.files?.[0]?.url ? (
          <img
            src={design.files[0].url}
            alt={design.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Featured Badge */}
        {design.isFeatured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )}

        {/* Actions Overlay */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
          <Button
            variant="secondary"
            size="icon"
            className="w-8 h-8 bg-white/90 hover:bg-white"
            onClick={() => window.open(design.files?.[0]?.url, "_blank")}
          >
            <Eye className="w-3 h-3" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="w-8 h-8 bg-white/90 hover:bg-white"
              >
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download Files
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1 mr-2">
            {design.name}
          </h3>
          <div className="flex-shrink-0">
            {updatingDesigns.has(design.id) ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            ) : (
              <Switch
                checked={design.isFeatured}
                onCheckedChange={(checked) =>
                  updateIsFeatured(design.id, checked)
                }
                className="data-[state=checked]:bg-yellow-500"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Category</span>
            <Badge variant="outline" className="text-xs">
              {design.category?.name || "Uncategorized"}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Files</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {design.files?.length || 0}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant={design.isFeatured ? "default" : "outline"}
            size="sm"
            onClick={() => updateIsFeatured(design.id, !design.isFeatured)}
            disabled={updatingDesigns.has(design.id)}
            className="flex-1"
          >
            {updatingDesigns.has(design.id) ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : design.isFeatured ? (
              <>
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </>
            ) : (
              <>
                <Star className="w-3 h-3 mr-1" />
                Feature
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  // Design Row Component
  const DesignRow = ({ design }: { design: DesignWithCategoryAndFiles }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-300 group"
    >
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
          {design.files?.[0]?.url ? (
            <img
              src={design.files[0].url}
              alt={design.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* Design Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {design.name}
            </h3>
            {design.isFeatured && (
              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{design.category?.name || "Uncategorized"}</span>
            <span>•</span>
            <span>{design.files?.length || 0} files</span>
            {design.createdAt && (
              <>
                <span>•</span>
                <span>{new Date(design.createdAt).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {updatingDesigns.has(design.id) ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          ) : (
            <Switch
              checked={design.isFeatured}
              onCheckedChange={(checked) =>
                updateIsFeatured(design.id, checked)
              }
              className="data-[state=checked]:bg-yellow-500"
            />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Design
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download Files
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="px-0 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Featured Design Management
              </CardTitle>
              <CardDescription className="text-base sm:text-lg mt-2">
                Curate designs to be featured on the homepage
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {featuredDesigns.length} featured
              </Badge>
              <Button variant="outline" size="sm" onClick={fetchDesigns}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 pb-0 space-y-6">
          {/* Featured Designs Section */}
          {featuredDesigns.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400 fill-current" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Currently Featured Designs
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    These designs are currently featured on the homepage
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3">
                {featuredDesigns.map((design) => (
                  <motion.div
                    key={design.id}
                    layoutId={design.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-yellow-200 dark:border-yellow-800 p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                        {design.files?.[0]?.url && (
                          <img
                            src={design.files[0].url}
                            alt={design.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                          {design.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {design.category?.name}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateIsFeatured(design.id, false)}
                      disabled={updatingDesigns.has(design.id)}
                      className="flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      {updatingDesigns.has(design.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Controls Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search designs by name or category..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 h-11 text-base"
                />
              </div>

              {/* View Controls */}
              <div className="flex gap-3">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-9 px-3"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-9 px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSort("name")}>
                      Name{" "}
                      {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort("category")}>
                      Category{" "}
                      {sortBy === "category" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort("featured")}>
                      Featured{" "}
                      {sortBy === "featured" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort("date")}>
                      Date{" "}
                      {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {designs.length} of {totalDesigns} designs
              </p>

              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="pageSize"
                  className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap"
                >
                  Show:
                </Label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </section>

          {/* Designs List */}
          <section>
            {loading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <p className="text-red-500 dark:text-red-400">Error: {error}</p>
                <Button onClick={fetchDesigns} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : designs.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {viewMode === "grid" ? <GridView /> : <ListView />}

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col xs:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1 || loading}
                        className="flex items-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </Button>

                      {/* Page Numbers - Show limited on mobile */}
                      <div className="flex items-center gap-1">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const pageNum = i + 1;
                          if (
                            totalPages <= 5 ||
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            Math.abs(pageNum - currentPage) <= 1
                          ) {
                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-10 h-10"
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages || loading}
                        className="flex items-center gap-2"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </section>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeaturedDesignManagement;
