"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FiX,
  FiPlus,
  FiEdit,
  FiTrash,
  FiSave,
  FiSearch,
  FiFolder,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoriesModal = ({ isOpen, onClose }: CategoriesModalProps) => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounced search
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/categories?search=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=8`
      );
      const data = await response.json();
      setCategories(data.categories || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, currentPage]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNewCategoryName("");
      setEditingCategoryId(null);
      setEditingCategoryName("");
      setSearchQuery("");
      setCurrentPage(1);
    }
  }, [isOpen]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (response.ok) {
        setNewCategoryName("");
        fetchCategories();
        toast.success("Category created successfully");
      } else {
        const error = await response.text();
        toast.error(error || "Error creating category");
      }
    } catch (error) {
      toast.error("Failed to create category");
      console.error("Error creating category:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleUpdateCategory = async (categoryId: string) => {
    if (!editingCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [categoryId]: true }));
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editingCategoryName.trim() }),
      });

      if (response.ok) {
        setEditingCategoryId(null);
        setEditingCategoryName("");
        fetchCategories();
        toast.success("Category updated successfully");
      } else {
        const error = await response.text();
        toast.error(error || "Error updating category");
      }
    } catch (error) {
      toast.error("Failed to update category");
      console.error("Error updating category:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const handleDeleteCategory = async (
    categoryId: string,
    categoryName: string
  ) => {
    toast.warning(`Delete "${categoryName}"?`, {
      description:
        "This action cannot be undone. All designs in this category will be moved to uncategorized.",
      duration: 10000,
      action: {
        label: "Delete",
        onClick: async () => {
          setLoadingStates((prev) => ({ ...prev, [categoryId]: true }));
          try {
            const response = await fetch(`/api/categories/${categoryId}`, {
              method: "DELETE",
            });

            if (response.ok) {
              fetchCategories();
              toast.success("Category deleted successfully");
            } else {
              const error = await response.text();
              toast.error(error || "Error deleting category");
            }
          } catch (error) {
            toast.error("Failed to delete category");
            console.error("Error deleting category:", error);
          } finally {
            setLoadingStates((prev) => ({ ...prev, [categoryId]: false }));
          }
        },
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
              className="min-w-[2.5rem]"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
            className="min-w-[2.5rem]"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and neighbors
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
              className="min-w-[2.5rem]"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
            className="min-w-[2.5rem]"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl mx-auto flex flex-col max-h-[95dvh] sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border flex-shrink-0 flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FiFolder size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                    Manage Categories
                  </h3>
                  <p className="text-blue-100 text-xs sm:text-sm mt-1">
                    Organize your designs with categories
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/20 text-white"
              >
                <FiX size={18} className="sm:w-5 sm:h-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 sm:p-6 space-y-6">
                {/* Create Category Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FiPlus className="text-primary" size={20} />
                    <h3 className="text-lg font-semibold text-foreground">
                      Create New Category
                    </h3>
                  </div>
                  <form
                    onSubmit={handleCreateCategory}
                    className="bg-muted/30 p-4 sm:p-5 rounded-xl border border-border"
                  >
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor="newCategoryName"
                          className="text-sm font-medium text-foreground"
                        >
                          Category Name
                        </Label>
                        <Input
                          id="newCategoryName"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="e.g., Modern Houses, Apartments, Villas..."
                          className="text-sm sm:text-base h-11 bg-background"
                          maxLength={50}
                        />
                        <p className="text-xs text-muted-foreground">
                          {newCategoryName.length}/50 characters
                        </p>
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-11 text-base font-medium"
                        disabled={isCreating || !newCategoryName.trim()}
                      >
                        {isCreating ? (
                          <>
                            <CgSpinner
                              className="animate-spin mr-2"
                              size={18}
                            />
                            Creating...
                          </>
                        ) : (
                          <>
                            <FiPlus className="mr-2" size={18} />
                            Create Category
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Existing Categories Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FiFolder className="text-primary" size={20} />
                    <h3 className="text-lg font-semibold text-foreground">
                      Existing Categories
                    </h3>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <FiSearch
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      placeholder="Search categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 text-sm sm:text-base h-11 bg-background"
                    />
                  </div>

                  {/* Categories List */}
                  {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <CgSpinner
                        className="animate-spin text-primary"
                        size={32}
                      />
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="text-center py-8 bg-muted/30 rounded-xl border border-border">
                      <FiFolder
                        className="mx-auto text-muted-foreground mb-3"
                        size={32}
                      />
                      <p className="text-muted-foreground font-medium">
                        No categories found
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {searchQuery
                          ? "Try a different search term"
                          : "Create your first category to get started"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {categories.map((category: any) => (
                        <div
                          key={category.id}
                          className="bg-background p-4 rounded-xl border border-border hover:border-primary/50 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <FiFolder
                                className="text-blue-500 flex-shrink-0"
                                size={20}
                              />
                              {editingCategoryId === category.id ? (
                                <Input
                                  value={editingCategoryName}
                                  onChange={(e) =>
                                    setEditingCategoryName(e.target.value)
                                  }
                                  className="flex-1 text-sm sm:text-base h-9"
                                  placeholder="Category name..."
                                  autoFocus
                                />
                              ) : (
                                <Link
                                  href={`/admin/categories/${category.id}`}
                                  className="min-w-0 flex-1"
                                >
                                  <span className="block text-sm sm:text-base font-medium text-foreground hover:text-primary cursor-pointer truncate">
                                    {category.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {category._count?.designs || 0} designs
                                  </span>
                                </Link>
                              )}
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {editingCategoryId === category.id ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleUpdateCategory(category.id)
                                  }
                                  disabled={loadingStates[category.id]}
                                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  {loadingStates[category.id] ? (
                                    <CgSpinner
                                      className="animate-spin"
                                      size={16}
                                    />
                                  ) : (
                                    <FiSave size={16} />
                                  )}
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditCategory(category)}
                                  disabled={
                                    loadingStates[category.id] ||
                                    editingCategoryId !== null
                                  }
                                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <FiEdit size={16} />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleDeleteCategory(
                                    category.id,
                                    category.name
                                  )
                                }
                                disabled={
                                  loadingStates[category.id] ||
                                  editingCategoryId !== null
                                }
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                {loadingStates[category.id] ? (
                                  <CgSpinner
                                    className="animate-spin"
                                    size={16}
                                  />
                                ) : (
                                  <FiTrash size={16} />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pt-4 border-t border-border">
                      <Pagination>
                        <PaginationContent className="flex-wrap">
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => handlePageChange(currentPage - 1)}
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>

                          {renderPaginationItems()}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() => handlePageChange(currentPage + 1)}
                              className={
                                currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                      <div className="text-center mt-2">
                        <p className="text-xs text-muted-foreground">
                          Page {currentPage} of {totalPages}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoriesModal;
