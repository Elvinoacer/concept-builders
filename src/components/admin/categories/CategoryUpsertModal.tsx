'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiX, FiPlus, FiSave } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";

interface CategoryUpsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryUpserted: () => void;
  category?: any;
}

const CategoryUpsertModal = ({
  isOpen,
  onClose,
  onCategoryUpserted,
  category,
}: CategoryUpsertModalProps) => {
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      setName("");
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const url = category
      ? `/api/admin/categories/${category.id}`
      : "/api/admin/categories";
    const method = category ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      toast.success(`Category ${category ? "updated" : "created"} successfully.`);
      onCategoryUpserted();
      onClose();
    } else {
      toast.error(`Error ${category ? "updating" : "creating"} category.`);
      console.error("Error upserting category:", await response.text());
    }
    setIsSaving(false);
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
            <h3 className="text-xl font-semibold text-foreground">
              {category ? "Edit Category" : "Create New Category"}
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <FiX size={20} />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="mb-4">
                <Label htmlFor="categoryName" className="block text-sm font-medium text-muted-foreground">Category Name</Label>
                <Input
                id="categoryName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                />
            </div>
            <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? <CgSpinner className="animate-spin" /> : <FiSave />}
                <span className="ml-2">{category ? "Update" : "Create"}</span>
            </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CategoryUpsertModal;