"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  FiEdit,
  FiTrash,
  FiMoreVertical,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import CategoryUpsertModal from "@/components/admin/categories/CategoryUpsertModal";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const AdminCategoriesPage = () => {
  interface Category {
    id: string;
    name:string;
    isFeatured: boolean;
    _count: { designs: number };
    designs?: { images?: { url: string }[] }[];
    image?: string;
  }

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/categories?search=${debouncedSearch}&page=${currentPage}&limit=8`
      );
      const data = await response.json();
      setCategories(data.categories);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const updateIsFeatured = async (categoryId: string, isFeatured: boolean) => {
    const originalCategories = [...categories];

    // Optimistically update UI
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId ? { ...category, isFeatured } : category
      )
    );

    setLoadingStates((prev) => ({ ...prev, [categoryId]: true }));

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFeatured }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to update featured status: ${response.statusText}`
        );
      }

      toast.success("Featured status updated successfully!");
    } catch (err: any) {
      toast.error(err.message);
      // Revert on error
      setCategories(originalCategories);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const handleNewCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    toast.warning("Are you sure you want to delete this category?", {
      description:
        "All designs and related data within this category will be permanently deleted.",
      action: {
        label: "Yes, Delete",
        onClick: async () => {
          setLoadingStates((prev) => ({ ...prev, [categoryId]: true }));
          try {
            const response = await fetch(
              `/api/admin/categories/${categoryId}`,
              {
                method: "DELETE",
              }
            );

            if (response.ok) {
              fetchCategories();
              toast.success("Category deleted successfully.");
            } else {
              const errorText = await response.text();
              console.error("Error deleting category:", errorText);
              toast.error("Error deleting category.");
            }
          } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Error deleting category.");
          } finally {
            setLoadingStates((prev) => ({ ...prev, [categoryId]: false }));
          }
        },
      },
      cancel: {
        label: "No, Cancel",
      },
    });
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate pagination items with ellipsis
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
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
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
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
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
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex flex-col gap-1 sm:gap-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your product categories and featured status
          </p>
        </div>
        <Button
          onClick={handleNewCategory}
          className="w-full xs:w-auto"
          size="sm"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Search Section */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48 sm:h-64">
          <div className="text-center">
            <CgSpinner
              className="animate-spin text-primary mx-auto mb-4"
              size={32}
            />
            <p className="text-sm text-muted-foreground">
              Loading categories...
            </p>
          </div>
        </div>
      ) : categories.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 sm:py-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-4xl mb-4">📁</div>
          <h3 className="text-lg font-semibold mb-2">No categories found</h3>
          <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
            {debouncedSearch
              ? "Try adjusting your search terms"
              : "Get started by creating your first category"}
          </p>
          {!debouncedSearch && (
            <Button onClick={handleNewCategory}>
              <FiPlus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
          )}
        </div>
      ) : (
        /* Content */
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-24 text-center">Designs</TableHead>
                    <TableHead className="w-32 text-center">Featured</TableHead>
                    <TableHead className="w-24 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id} className="group">
                      <TableCell>
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={
                              category.designs?.[0]?.images?.[0]?.url ||
                              category.image ||
                              "/images/category-placeholder.png"
                            }
                            alt={category.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/categories/${category.id}`}>
                          <span className="font-medium hover:underline cursor-pointer">
                            {category.name}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <Badge variant="secondary" className="min-w-[40px]">
                            {category._count.designs}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Switch
                            checked={category.isFeatured}
                            onCheckedChange={() =>
                              updateIsFeatured(
                                category.id,
                                !category.isFeatured
                              )
                            }
                            disabled={loadingStates[category.id]}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCategory(category)}
                            disabled={loadingStates[category.id]}
                            className="h-8 w-8"
                          >
                            <FiEdit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={loadingStates[category.id]}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {loadingStates[category.id] ? (
                              <CgSpinner className="w-4 h-4 animate-spin" />
                            ) : (
                              <FiTrash className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  {/* Image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <Image
                      src={
                        category.designs?.[0]?.images?.[0]?.url ||
                        category.image ||
                        "/images/category-placeholder.png"
                      }
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Link href={`/admin/categories/${category.id}`}>
                          <h3 className="font-semibold text-base hover:underline cursor-pointer truncate">
                            {category.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {category._count.designs} designs
                          </Badge>
                          {category.isFeatured && (
                            <Badge variant="default" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Mobile Actions Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                          >
                            <FiMoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditCategory(category)}
                          >
                            <FiEdit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateIsFeatured(
                                category.id,
                                !category.isFeatured
                              )
                            }
                            className="flex items-center justify-between"
                          >
                            <span>Featured</span>
                            <Switch
                              checked={category.isFeatured}
                              className="scale-75"
                              disabled={loadingStates[category.id]}
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <FiTrash className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 sm:mt-8">
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

          {/* Mobile page info */}
          <div className="lg:hidden text-center mt-3">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>
      )}

      {/* Modal */}
      <CategoryUpsertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategoryUpserted={fetchCategories}
        category={selectedCategory}
      />
    </div>
  );
};

export default AdminCategoriesPage;
