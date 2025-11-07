"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banner } from "@/generated/prisma";
import { motion } from "framer-motion";
import {
  Edit,
  Eye,
  Grid3X3,
  Image as ImageIcon,
  List,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const BannerManagement = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });

  const fetchBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/banners");
      if (!response.ok) {
        throw new Error("Failed to fetch banners");
      }
      const data = await response.json();
      setBanners(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, files } = e.target as HTMLInputElement;
    if (id === "imageUpload" && files && files.length > 0) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setFilePreviewUrl(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleAddEditBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    let imageUrl = formData.image;

    if (selectedFile) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);

      try {
        const uploadResponse = await fetch("/api/files/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || "Failed to upload image");
        }

        const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.url;
        setUploadProgress(100);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
        setLoading(false);
        setIsUploading(false);
        return;
      }
    }

    const method = editingBanner ? "PUT" : "POST";
    const url = editingBanner
      ? `/api/admin/banners/${editingBanner.id}`
      : "/api/admin/banners";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save banner");
      }

      toast.success(
        editingBanner
          ? "Banner updated successfully!"
          : "Banner added successfully!"
      );
      setIsModalOpen(false);
      resetForm();
      fetchBanners();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this banner? This action cannot be undone."
      )
    )
      return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete banner");
      }

      toast.success("Banner deleted successfully!");
      fetchBanners();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingBanner(null);
    setFormData({ title: "", description: "", image: "" });
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setUploadProgress(0);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      image: banner.image,
    });
    setSelectedFile(null);
    setFilePreviewUrl(banner.image);
    setIsModalOpen(true);
  };

  const clearImageSelection = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
  };

  // Loading Skeleton
  const BannerSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse"
        >
          <div className="flex flex-col xs:flex-row gap-4">
            <div className="w-full xs:w-40 h-32 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="flex gap-2 mt-4">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
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
      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No Banners Yet
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        Get started by creating your first banner to showcase on the homepage.
      </p>
      <Button onClick={openAddModal} size="lg" className="min-h-[48px] px-6">
        <Plus className="w-5 h-5 mr-2" />
        Create First Banner
      </Button>
    </motion.div>
  );

  // Grid View
  const GridView = () => (
    <motion.div
      layout
      className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      {banners.map((banner, index) => (
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group"
        >
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
              <Button
                variant="secondary"
                size="icon"
                className="w-8 h-8 bg-white/90 hover:bg-white"
                onClick={() => openEditModal(banner)}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="w-8 h-8 bg-white/90 hover:bg-white"
                onClick={() => handleDeleteBanner(banner.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1">
              {banner.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {banner.description}
            </p>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditModal(banner)}
                className="flex-1"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(banner.image, "_blank")}
              >
                <Eye className="w-3 h-3" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteBanner(banner.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </motion.div>
      ))}
    </motion.div>
  );

  // List View
  const ListView = () => (
    <motion.div layout className="space-y-4">
      {banners.map((banner, index) => (
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex flex-col xs:flex-row gap-4 items-start xs:items-center">
            <div className="relative w-full xs:w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1">
                {banner.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {banner.description}
              </p>
            </div>
            <div className="flex gap-2 w-full xs:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditModal(banner)}
                className="flex-1 xs:flex-none"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(banner.image, "_blank")}
                className="flex-1 xs:flex-none"
              >
                <Eye className="w-3 h-3" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteBanner(banner.id)}
                className="flex-1 xs:flex-none"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
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
                Banner Management
              </CardTitle>
              <CardDescription className="text-base sm:text-lg mt-2">
                Add, edit, or delete banners for the hero section
              </CardDescription>
            </div>
            <div className="flex gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={openAddModal}
                size="lg"
                className="min-h-[44px] px-4 sm:px-6"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Add Banner</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          {loading && <BannerSkeleton />}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6"
            >
              <p className="text-red-700 dark:text-red-400 text-center">
                Error: {error}
              </p>
            </motion.div>
          )}

          {!loading && banners.length === 0 && <EmptyState />}

          {!loading && banners.length > 0 && (
            <>
              {viewMode === "grid" ? <GridView /> : <ListView />}

              {/* Summary */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {banners.length} banner
                  {banners.length !== 1 ? "s" : ""}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Banner Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">
              {editingBanner ? "Edit Banner" : "Add New Banner"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddEditBanner} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Banner Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter banner title"
                className="h-12 text-base"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                placeholder="Enter banner description"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <Label htmlFor="imageUpload" className="text-sm font-medium">
                Banner Image *
              </Label>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                    Click to upload banner image
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </label>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Uploading image... {uploadProgress}%
                  </p>
                </div>
              )}

              {/* Image Preview */}
              {filePreviewUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative bg-gray-100 dark:bg-gray-800 rounded-xl p-4"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Image Preview:
                  </p>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-white dark:bg-gray-700">
                    <Image
                      src={filePreviewUrl}
                      alt="Banner Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={clearImageSelection}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Current Image Info */}
              {!selectedFile && formData.image && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Using current image:{" "}
                    <a
                      href={formData.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:no-underline"
                    >
                      View Image
                    </a>
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 min-h-[48px] order-2 sm:order-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || isUploading}
                className="flex-1 min-h-[48px] order-1 sm:order-2"
              >
                {loading || isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingBanner ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{editingBanner ? "Update Banner" : "Create Banner"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default BannerManagement;
