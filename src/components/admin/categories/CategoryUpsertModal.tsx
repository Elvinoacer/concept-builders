"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiX, FiPlus, FiSave, FiFolder } from "react-icons/fi";
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
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      setName("");
    }
    setErrors({});
  }, [category, isOpen]);

  const validateForm = () => {
    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Category name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    } else if (name.trim().length > 50) {
      newErrors.name = "Category name must be less than 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const url = category
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories";
      const method = category ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (response.ok) {
        toast.success(
          `Category ${category ? "updated" : "created"} successfully!`,
          {
            description: `"${name}" has been ${category ? "updated" : "added"}.`,
          }
        );
        onCategoryUpserted();
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${category ? "update" : "create"} category`
        );
      }
    } catch (error: any) {
      console.error("Error upserting category:", error);
      toast.error(
        error.message || `Error ${category ? "updating" : "creating"} category`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 xs:p-4 sm:p-6"
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              duration: 0.2,
            }}
            className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-auto flex flex-col max-h-[90dvh] border border-border/50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="p-4 xs:p-6 border-b border-border flex-shrink-0 flex justify-between items-center bg-muted/30 rounded-t-2xl">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg ${category ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"}`}
                >
                  {category ? <FiFolder size={20} /> : <FiPlus size={20} />}
                </div>
                <div className="min-w-0">
                  <h3
                    id="modal-title"
                    className="text-lg xs:text-xl font-semibold text-foreground truncate"
                  >
                    {category ? "Edit Category" : "New Category"}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {category
                      ? `Update "${category.name}"`
                      : "Create a new product category"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-9 w-9 flex-shrink-0 hover:bg-muted/50"
                aria-label="Close modal"
              >
                <FiX size={18} />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-4 xs:p-6 space-y-4 xs:space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="categoryName"
                    className="text-sm font-medium text-foreground"
                  >
                    Category Name
                  </Label>
                  <Input
                    id="categoryName"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) {
                        setErrors({ ...errors, name: undefined });
                      }
                    }}
                    placeholder="Enter category name..."
                    className={`w-full text-base ${errors.name ? "border-red-500 focus:border-red-500" : ""}`}
                    disabled={isSaving}
                    autoFocus
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      id="name-error"
                      className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                    >
                      ⚠️ {errors.name}
                    </motion.p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {name.length}/50 characters
                  </p>
                </div>

                {/* Character Count Visual */}
                <div className="w-full bg-muted rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      name.length > 45
                        ? "bg-red-500"
                        : name.length > 30
                          ? "bg-yellow-500"
                          : "bg-primary"
                    }`}
                    style={{
                      width: `${Math.min((name.length / 50) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 xs:p-6 border-t border-border flex-shrink-0 bg-muted/20 rounded-b-2xl">
                <div className="flex flex-col xs:flex-row gap-3 xs:gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSaving}
                    className="flex-1 xs:flex-none order-2 xs:order-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving || !name.trim()}
                    className="flex-1 xs:flex-none order-1 xs:order-2"
                    size="lg"
                  >
                    {isSaving ? (
                      <>
                        <CgSpinner className="animate-spin w-4 h-4" />
                        <span className="ml-2">
                          {category ? "Updating..." : "Creating..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        <span className="ml-2">
                          {category ? "Update Category" : "Create Category"}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryUpsertModal;
