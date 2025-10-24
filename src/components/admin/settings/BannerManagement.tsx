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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "", // This will store the URL after upload
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;
    if (id === "imageUpload" && files && files.length > 0) {
      const file = files[0];
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

    let imageUrl = formData.image; // Start with existing image URL or empty

    if (selectedFile) {
      // Upload the new file first
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
        imageUrl = uploadResult.url; // Get the URL of the uploaded image
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
        setLoading(false);
        return; // Stop if image upload fails
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
          image: imageUrl, // Use the new or existing image URL
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
      setEditingBanner(null);
      setFormData({ title: "", description: "", image: "" });
      setSelectedFile(null);
      setFilePreviewUrl(null);
      fetchBanners(); // Re-fetch banners to update the list
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

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
      fetchBanners(); // Re-fetch banners to update the list
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({ title: "", description: "", image: "" });
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      image: banner.image,
    });
    setSelectedFile(null); // Reset selected file
    setFilePreviewUrl(banner.image); // Set preview to existing image
    setIsModalOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Banner Management</CardTitle>
        <CardDescription>
          Add, edit, or delete banners for the hero section.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={openAddModal} className="mb-4">
          Add New Banner
        </Button>

        {loading && <p>Loading banners...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <Card key={banner.id} className="relative overflow-hidden">
              <Image
                src={banner.image}
                alt={banner.title}
                width={400}
                height={200}
                className="w-full h-40 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{banner.title}</h3>
                <p className="text-sm text-gray-500">{banner.description}</p>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(banner)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteBanner(banner.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Edit Banner" : "Add New Banner"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEditBanner} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUpload">Banner Image</Label>
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
              />
              {filePreviewUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Preview:</p>
                  <Image src={filePreviewUrl} alt="Banner Preview" width={200} height={100} className="w-full h-32 object-cover rounded-md" />
                </div>
              )}
              {selectedFile && (
                <p className="text-sm text-gray-500">Selected file: {selectedFile.name}</p>
              )}
              {!selectedFile && formData.image && (
                <p className="text-sm text-gray-500">Current image: <a href={formData.image} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View</a></p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BannerManagement;
