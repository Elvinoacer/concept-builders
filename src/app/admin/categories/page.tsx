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
} from "@/components/ui/pagination";
import Link from "next/link";
import { FiEdit, FiTrash } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import CategoryUpsertModal from "@/components/admin/categories/CategoryUpsertModal";
import Image from "next/image";

const AdminCategoriesPage = () => {
  interface Category {
    id: string;
    name: string;
    isFeatured: boolean;
    _count: { designs: number };
    designs?: { files?: { url: string }[] }[];
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

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/categories?search=${searchQuery}&page=${currentPage}&limit=10`
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
  }, [searchQuery, currentPage]);

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

  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={handleNewCategory}>New Category</Button>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-24">
          <CgSpinner className="animate-spin text-primary" size={32} />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No categories found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Designs</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Image
                    src={
                      category.designs?.[0]?.files?.[0]?.url ||
                      category.image ||
                      "/images/category-placeholder.png"
                    }
                    alt={category.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell>
                  <Link href={`/admin/categories/${category.id}`}>
                    <span className="cursor-pointer hover:underline">
                      {category.name}
                    </span>
                  </Link>
                </TableCell>
                <TableCell>{category._count.designs}</TableCell>
                <TableCell>
                  <Input
                    type="checkbox"
                    checked={category.isFeatured}
                    onChange={() =>
                      updateIsFeatured(category.id, !category.isFeatured)
                    }
                    className="w-5 h-5"
                    disabled={loadingStates[category.id]}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCategory(category)}
                      disabled={loadingStates[category.id]}
                    >
                      <FiEdit />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={loadingStates[category.id]}
                    >
                      {loadingStates[category.id] ? (
                        <CgSpinner className="animate-spin" />
                      ) : (
                        <FiTrash />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
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
