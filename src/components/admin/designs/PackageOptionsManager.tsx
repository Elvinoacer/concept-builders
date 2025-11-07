"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  FiEdit,
  FiLoader,
  FiPlus,
  FiSave,
  FiTrash,
  FiX,
  FiPackage,
  FiDollarSign,
  FiFile,
} from "react-icons/fi";
import { toast } from "sonner";
import FileUpload from "./FileUpload";
import { motion, AnimatePresence } from "framer-motion";

interface PackageOption {
  id: string;
  name: string;
  price: number;
  file?: any;
}

interface PackageOptionsManagerProps {
  designId: string;
  initialOptions: PackageOption[];
}

const PackageOptionsManager = ({
  designId,
  initialOptions,
}: PackageOptionsManagerProps) => {
  const [options, setOptions] = useState<PackageOption[]>(initialOptions);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedOption, setEditedOption] = useState<PackageOption | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newOption, setNewOption] = useState<{
    name: string;
    price: string;
    file: any[];
  }>({ name: "", price: "", file: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [deletingOptions, setDeletingOptions] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  const validateOption = (option: {
    name: string;
    price: string;
    file: any[];
  }) => {
    if (!option.name.trim()) {
      throw new Error("Package name is required");
    }
    if (!option.price || parseFloat(option.price) <= 0) {
      throw new Error("Price must be a positive number");
    }
    if (option.name.length > 100) {
      throw new Error("Package name must be less than 100 characters");
    }
  };

  const handleCreate = async () => {
    try {
      validateOption(newOption);
    } catch (error: any) {
      toast.error(error.message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/designs/${designId}/package-options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newOption.name.trim(),
          price: parseFloat(newOption.price),
          file: newOption.file?.[0],
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to create package option");
      }

      const createdOption = await response.json();
      setOptions([...options, createdOption]);
      setNewOption({ name: "", price: "", file: [] });
      setIsCreating(false);
      toast.success("Package option created successfully");
    } catch (error: any) {
      console.error("Error creating package option:", error);
      toast.error(error.message || "Failed to create package option");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editedOption) return;

    try {
      validateOption({
        name: editedOption.name,
        price: editedOption.price.toString(),
        file: editedOption.file ? [editedOption.file] : [],
      });
    } catch (error: any) {
      toast.error(error.message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/package-options/${editedOption.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editedOption.name.trim(),
          price: parseFloat(editedOption.price.toString()),
          file: editedOption.file?.[0],
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to update package option");
      }

      const updatedOption = await response.json();
      setOptions(
        options.map((opt) =>
          opt.id === updatedOption.id ? updatedOption : opt
        )
      );
      setIsEditing(null);
      setEditedOption(null);
      toast.success("Package option updated successfully");
    } catch (error: any) {
      console.error("Error updating package option:", error);
      toast.error(error.message || "Failed to update package option");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (optionId: string, optionName: string) => {
    toast.warning(`Delete "${optionName}"?`, {
      description: "This package option will be permanently removed.",
      duration: 10000,
      action: {
        label: "Delete",
        onClick: async () => {
          setDeletingOptions((prev) => new Set(prev.add(optionId)));
          try {
            const response = await fetch(`/api/package-options/${optionId}`, {
              method: "DELETE",
            });

            if (!response.ok) {
              const errorData = await response.text();
              throw new Error(errorData || "Failed to delete package option");
            }

            setOptions(options.filter((opt) => opt.id !== optionId));
            toast.success("Package option deleted successfully");
          } catch (error: any) {
            console.error("Error deleting package option:", error);
            toast.error(error.message || "Failed to delete package option");
          } finally {
            setDeletingOptions((prev) => {
              const newSet = new Set(prev);
              newSet.delete(optionId);
              return newSet;
            });
          }
        },
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  const startEdit = (option: PackageOption) => {
    setIsEditing(option.id);
    setEditedOption({ ...option });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditedOption(null);
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setNewOption({ name: "", price: "", file: [] });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-6 sm:mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FiPackage className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
              Package Options
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add-ons and additional services for your design
            </p>
          </div>
        </div>
      </div>

      {/* Existing Options */}
      <div className="space-y-3 sm:space-y-4 mb-6">
        <AnimatePresence>
          {options.map((option) => {
            const isDeleting = deletingOptions.has(option.id);
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                {isEditing === option.id && editedOption ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor={`edit-name-${option.id}`}
                          className="text-sm font-medium"
                        >
                          Package Name
                        </Label>
                        <Input
                          id={`edit-name-${option.id}`}
                          placeholder="e.g., 3D Rendering, Consultation..."
                          value={editedOption.name}
                          onChange={(e) =>
                            setEditedOption({
                              ...editedOption,
                              name: e.target.value,
                            })
                          }
                          className="text-sm h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor={`edit-price-${option.id}`}
                          className="text-sm font-medium"
                        >
                          Price
                        </Label>
                        <Input
                          id={`edit-price-${option.id}`}
                          placeholder="0.00"
                          type="number"
                          min="0"
                          step="0.01"
                          value={editedOption.price}
                          onChange={(e) =>
                            setEditedOption({
                              ...editedOption,
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="text-sm h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Associated File
                      </Label>
                      <FileUpload
                        onUploadSuccess={(files) =>
                          setEditedOption({ ...editedOption, file: files[0] })
                        }
                        onFileRemove={() =>
                          setEditedOption({ ...editedOption, file: undefined })
                        }
                        initialFiles={
                          editedOption.file ? [editedOption.file] : []
                        }
                        fileTypeCategory="FILE"
                        multiple={false}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button
                        onClick={handleUpdate}
                        disabled={isLoading}
                        className="flex-1 h-10 sm:h-9"
                      >
                        {isLoading ? (
                          <FiLoader className="animate-spin mr-2 w-4 h-4" />
                        ) : (
                          <FiSave className="mr-2 w-4 h-4" />
                        )}
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={cancelEdit}
                        disabled={isLoading}
                        className="flex-1 h-10 sm:h-9"
                      >
                        <FiX className="mr-2 w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiPackage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 dark:text-white truncate text-sm sm:text-base">
                          {option.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <FiDollarSign className="w-3 h-3 text-green-500" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {formatPrice(option.price)}
                          </p>
                          {option.file && (
                            <>
                              <span className="text-gray-300 dark:text-gray-600">
                                •
                              </span>
                              <FiFile className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                File attached
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => startEdit(option)}
                        disabled={isLoading}
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <FiEdit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(option.id, option.name)}
                        disabled={isLoading || isDeleting}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        {isDeleting ? (
                          <FiLoader className="w-4 h-4 animate-spin" />
                        ) : (
                          <FiTrash className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {options.length === 0 && !isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
          >
            <FiPackage className="mx-auto w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No package options yet
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Add your first package option to get started
            </p>
          </motion.div>
        )}
      </div>

      {/* Create New Option */}
      <AnimatePresence>
        {isCreating ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/10"
          >
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <FiPlus className="w-5 h-5 text-blue-500" />
              New Package Option
            </h4>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="new-package-name"
                    className="text-sm font-medium"
                  >
                    Package Name
                  </Label>
                  <Input
                    id="new-package-name"
                    placeholder="e.g., 3D Rendering, Consultation..."
                    value={newOption.name}
                    onChange={(e) =>
                      setNewOption({ ...newOption, name: e.target.value })
                    }
                    className="text-sm h-10 bg-white dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="new-package-price"
                    className="text-sm font-medium"
                  >
                    Price
                  </Label>
                  <Input
                    id="new-package-price"
                    placeholder="0.00"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newOption.price}
                    onChange={(e) =>
                      setNewOption({ ...newOption, price: e.target.value })
                    }
                    className="text-sm h-10 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Associated File (Optional)
                </Label>
                <FileUpload
                  onUploadSuccess={(files) =>
                    setNewOption({ ...newOption, file: files })
                  }
                  onFileRemove={() => setNewOption({ ...newOption, file: [] })}
                  initialFiles={[]}
                  fileTypeCategory="FILE"
                  multiple={false}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  onClick={handleCreate}
                  disabled={isLoading}
                  className="flex-1 h-10 sm:h-9"
                >
                  {isLoading ? (
                    <FiLoader className="animate-spin mr-2 w-4 h-4" />
                  ) : (
                    <FiPlus className="mr-2 w-4 h-4" />
                  )}
                  Create Package
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelCreate}
                  disabled={isLoading}
                  className="flex-1 h-10 sm:h-9"
                >
                  <FiX className="mr-2 w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button
              onClick={() => setIsCreating(true)}
              className="w-full sm:w-auto h-11"
            >
              <FiPlus className="mr-2 w-4 h-4" />
              Add Package Option
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PackageOptionsManager;
