'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FiX, FiPlus, FiEdit, FiTrash, FiSave } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoriesModal = ({ isOpen, onClose }: CategoriesModalProps) => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = async () => {
    setIsLoading(true);
    const response = await fetch(
      `/api/categories?search=${searchQuery}&page=${currentPage}&limit=5`
    );
    const data = await response.json();
    setCategories(data.categories);
    setTotalPages(data.totalPages);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, currentPage, searchQuery]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    const response = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newCategoryName }),
    });

    if (response.ok) {
      setNewCategoryName("");
      fetchCategories();
    } else {
      console.error("Error creating category:", await response.text());
    }
    setIsCreating(false);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleUpdateCategory = async (categoryId: string) => {
    setLoadingStates(prev => ({ ...prev, [categoryId]: true }));
    const response = await fetch(`/api/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: editingCategoryName }),
    });

    if (response.ok) {
      setEditingCategoryId(null);
      setEditingCategoryName("");
      fetchCategories();
    } else {
      console.error("Error updating category:", await response.text());
    }
    setLoadingStates(prev => ({ ...prev, [categoryId]: false }));
  };

  const handleDeleteCategory = async (categoryId: string) => {
    toast.warning("Are you sure you want to delete this category?", {
      description: "All designs and related data within this category will be permanently deleted.",
      action: {
        label: "Yes, Delete",
        onClick: async () => {
          setLoadingStates(prev => ({ ...prev, [categoryId]: true }));
          const response = await fetch(`/api/categories/${categoryId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            fetchCategories();
            toast.success("Category deleted successfully.");
          } else {
            console.error("Error deleting category:", await response.text());
            toast.error("Error deleting category.");
          }
          setLoadingStates(prev => ({ ...prev, [categoryId]: false }));
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

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex-shrink-0 flex justify-between items-center bg-muted/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <FiPlus className="text-primary" size={24} />
            <h3 className="text-xl font-semibold text-foreground">Manage Categories</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <FiX size={20} />
          </Button>
        </div>
        <ScrollArea className="h-[60vh]">
          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Create New Category</h3>
              <form onSubmit={handleCreateCategory} className="bg-card p-4 rounded-md shadow-sm">
                <div className="mb-4">
                  <Label htmlFor="newCategoryName" className="block text-sm font-medium text-muted-foreground">Category Name</Label>
                  <Input
                    id="newCategoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isCreating}>
                  {isCreating ? <CgSpinner className="animate-spin" /> : "Create"}
                </Button>
              </form>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Existing Categories</h3>
              <div className="mb-4">
                <Input
                  placeholder="Search categories..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center h-24">
                  <CgSpinner className="animate-spin text-primary" size={32} />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center text-muted-foreground">No categories found.</div>
              ) : (
                <ul className="space-y-2">
                  {categories.map((category: any) => (
                    <li key={category.id} className="bg-muted p-4 rounded-md shadow-sm flex items-center justify-between">
                      {editingCategoryId === category.id ? (
                        <Input
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="flex-grow"
                        />
                      ) : (
                        <Link href={`/admin/categories/${category.id}`}>
                          <span className="cursor-pointer hover:underline">{category.name}</span>
                        </Link>
                      )}
                      <div className="flex items-center gap-2">
                        {editingCategoryId === category.id ? (
                          <Button variant="ghost" size="icon" onClick={() => handleUpdateCategory(category.id)} disabled={loadingStates[category.id]}>
                            {loadingStates[category.id] ? <CgSpinner className="animate-spin" /> : <FiSave />}
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)} disabled={loadingStates[category.id]}>
                            <FiEdit />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)} disabled={loadingStates[category.id]}>
                          {loadingStates[category.id] ? <CgSpinner className="animate-spin" /> : <FiTrash />}
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="p-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
};

export default CategoriesModal;
