"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import {
  FiArrowLeft,
  FiFileText,
  FiHome,
  FiImage,
  FiLayers,
  FiSave,
  FiUpload,
} from "react-icons/fi";
import { toast } from "sonner";

interface Design {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  priceRange?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  floors?: number;
  categoryId?: string;
  planDetails?: string[];
  folderId?: string;
}

interface Category {
  id: string;
  name: string;
}

interface Folder {
  id: string;
  name: string;
}

const EditDesignPage = () => {
  const [design, setDesign] = useState<Design | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState<{ [key: string]: FileList | null }>({});
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetchDesign();
      fetchCategories();
      fetchFolders();
    }
  }, [id]);

  const fetchDesign = async () => {
    try {
      const response = await fetch(`/api/designs/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch design");
      }
      const data = await response.json();
      setDesign(data);
    } catch (error) {
      console.error("Error fetching design:", error);
      toast.error("Failed to fetch design details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await fetch("/api/admin/folders");
      if (response.ok) {
        const data = await response.json();
        setFolders(data || []);
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setDesign(
      (prev) =>
        ({
          ...prev,
          [name]:
            type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
        }) as Design
    );
  };

  const handleSelectChange = (name: string, value: string) => {
    setDesign(
      (prev) =>
        ({
          ...prev,
          [name]: value === "" ? null : value,
        }) as Design
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target;
    setFiles((prev) => ({ ...prev, [name]: fileList }));
  };

  const handlePlanDetailsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const details = e.target.value
      .split("\n")
      .filter((detail) => detail.trim() !== "");
    setDesign((prev) => ({ ...prev, planDetails: details }) as Design);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!design) return;

    setSaving(true);

    try {
      const formData = new FormData();

      // Append basic design data
      formData.append("name", design.name);
      formData.append("description", design.description);
      formData.append("basePrice", design.basePrice.toString());
      if (design.priceRange) formData.append("priceRange", design.priceRange);
      if (design.bedrooms)
        formData.append("bedrooms", design.bedrooms.toString());
      if (design.bathrooms)
        formData.append("bathrooms", design.bathrooms.toString());
      if (design.area) formData.append("area", design.area.toString());
      if (design.floors) formData.append("floors", design.floors.toString());
      if (design.categoryId) formData.append("categoryId", design.categoryId);
      if (design.folderId) formData.append("folderId", design.folderId);
      if (design.planDetails) {
        design.planDetails.forEach((detail, index) => {
          formData.append(`planDetails[${index}]`, detail);
        });
      }

      // Append files
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          for (let i = 0; i < files[key]!.length; i++) {
            formData.append(key, files[key]![i]);
          }
        }
      });

      const response = await fetch(`/api/designs/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        toast.success("Design updated successfully!");
        router.push(`/admin/designs/${id}`);
      } else {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to update design");
      }
    } catch (error: any) {
      console.error("Error updating design:", error);
      toast.error(
        error.message || "An error occurred while updating the design."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <CgSpinner
            className="animate-spin text-blue-500 mx-auto mb-4"
            size={32}
          />
          <p className="text-gray-600 dark:text-gray-400">Loading design...</p>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiHome className="mx-auto w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Design Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The design you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/admin/designs")}>
            <FiArrowLeft className="mr-2" />
            Back to Designs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin/designs/${id}`)}
              className="h-10 w-10"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Edit Design
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
                Update design details and upload files
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs sm:text-sm">
            ID: {design.id}
          </Badge>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information Card */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <FiHome className="w-5 h-5 text-blue-500" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Design Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={design.name}
                      onChange={handleInputChange}
                      placeholder="Enter design name"
                      className="h-11 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="basePrice" className="text-sm font-medium">
                      Base Price *
                    </Label>
                    <Input
                      id="basePrice"
                      name="basePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={design.basePrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="h-11 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={design.description}
                    onChange={handleInputChange}
                    placeholder="Describe the design features, style, and key aspects..."
                    className="min-h-[120px] text-sm sm:text-base resize-vertical"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms" className="text-sm font-medium">
                      Bedrooms
                    </Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      min="0"
                      value={design.bedrooms || ""}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="h-11 text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms" className="text-sm font-medium">
                      Bathrooms
                    </Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      min="0"
                      value={design.bathrooms || ""}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="h-11 text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area" className="text-sm font-medium">
                      Area (sq ft)
                    </Label>
                    <Input
                      id="area"
                      name="area"
                      type="number"
                      min="0"
                      value={design.area || ""}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="h-11 text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floors" className="text-sm font-medium">
                      Floors
                    </Label>
                    <Input
                      id="floors"
                      name="floors"
                      type="number"
                      min="0"
                      value={design.floors || ""}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="h-11 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="categoryId" className="text-sm font-medium">
                      Category
                    </Label>
                    <Select
                      value={design.categoryId || ""}
                      onValueChange={(value) =>
                        handleSelectChange("categoryId", value)
                      }
                    >
                      <SelectTrigger className="h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Category</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="folderId" className="text-sm font-medium">
                      Folder
                    </Label>
                    <Select
                      value={design.folderId || ""}
                      onValueChange={(value) =>
                        handleSelectChange("folderId", value)
                      }
                    >
                      <SelectTrigger className="h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Select a folder" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Folder</SelectItem>
                        {folders.map((folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceRange" className="text-sm font-medium">
                    Price Range
                  </Label>
                  <Input
                    id="priceRange"
                    name="priceRange"
                    value={design.priceRange || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., $50k - $70k"
                    className="h-11 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planDetails" className="text-sm font-medium">
                    Plan Details (one per line)
                  </Label>
                  <Textarea
                    id="planDetails"
                    name="planDetails"
                    value={design.planDetails?.join("\n") || ""}
                    onChange={handlePlanDetailsChange}
                    placeholder="3 Bedrooms&#10;2 Bathrooms&#10;Open-plan kitchen&#10;..."
                    className="min-h-[100px] text-sm sm:text-base resize-vertical"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enter each plan detail on a new line
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* File Uploads Card */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <FiUpload className="w-5 h-5 text-blue-500" />
                  File Uploads
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload new files to update the design
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="images"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <FiImage className="w-4 h-4" />
                      Images
                    </Label>
                    <Input
                      id="images"
                      name="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="h-11"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Multiple images allowed (JPEG, PNG, WebP)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="renderings"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <FiImage className="w-4 h-4" />
                      3D Renderings
                    </Label>
                    <Input
                      id="renderings"
                      name="renderings"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="h-11"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      High-quality renderings and visualizations
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="floorPlanUrl"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <FiLayers className="w-4 h-4" />
                      Floor Plan
                    </Label>
                    <Input
                      id="floorPlanUrl"
                      name="floorPlanUrl"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="h-11"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Floor plans as images or PDFs
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="documents"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <FiFileText className="w-4 h-4" />
                      Documents
                    </Label>
                    <Input
                      id="documents"
                      name="documents"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileChange}
                      className="h-11"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDFs, Word docs, Excel sheets
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/designs/${id}`)}
                disabled={saving}
                className="h-11 flex-1 sm:flex-none order-2 sm:order-1"
              >
                <FiArrowLeft className="mr-2 w-4 h-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="h-11 flex-1 sm:flex-none order-1 sm:order-2"
              >
                {saving ? (
                  <>
                    <CgSpinner className="animate-spin mr-2 w-4 h-4" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2 w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditDesignPage;
