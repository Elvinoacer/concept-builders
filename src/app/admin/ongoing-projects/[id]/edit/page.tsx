"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import FileUpload from "@/components/admin/designs/FileUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";

const ProjectStatus = [
  "PLANNING",
  "IN_PROGRESS",
  "ON_HOLD",
  "NEARING_COMPLETION",
  "COMPLETED",
];
const ProjectCategory = [
  "RESIDENTIAL",
  "COMMERCIAL",
  "INDUSTRIAL",
  "RENOVATION",
  "INFRASTRUCTURE",
  "INTERIOR_FIT_OUT",
];

interface OngoingProject {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  clientName: string | null;
  location: string | null;
  status: string;
  category: string;
  startDate: string | null;
  estimatedCompletionDate: string | null;
  completedAt: string | null;
  featuredImage: string | null;
  gallery: any;
  size: string | null;
  value: string | null;
  highlights: string[];
  published: boolean;
  createdAt: string;
}

const EditOngoingProjectPage = ({ params }: { params: { id: string } }) => {
  const [project, setProject] = useState<OngoingProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("PLANNING");
  const [category, setCategory] = useState("RESIDENTIAL");
  const [startDate, setStartDate] = useState("");
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("");
  const [completedAt, setCompletedAt] = useState("");
  const [featuredImage, setFeaturedImage] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [size, setSize] = useState("");
  const [value, setValue] = useState("");
  const [highlights, setHighlights] = useState("");
  const [published, setPublished] = useState(false);

  const fetchOngoingProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/ongoing-projects/${params.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: OngoingProject = await response.json();
      setProject(data);
      setTitle(data.title);
      setDescription(data.description || "");
      setClientName(data.clientName || "");
      setLocation(data.location || "");
      setStatus(data.status);
      setCategory(data.category);
      setStartDate(
        data.startDate
          ? new Date(data.startDate).toISOString().split("T")[0]
          : ""
      );
      setEstimatedCompletionDate(
        data.estimatedCompletionDate
          ? new Date(data.estimatedCompletionDate).toISOString().split("T")[0]
          : ""
      );
      setCompletedAt(
        data.completedAt
          ? new Date(data.completedAt).toISOString().split("T")[0]
          : ""
      );
      setFeaturedImage(
        data.featuredImage
          ? [{ url: data.featuredImage, name: "Featured Image" }]
          : []
      );
      setGallery(
        data.gallery
          ? data.gallery.map((img) => ({ url: img.url, name: img.caption }))
          : []
      );
      setSize(data.size || "");
      setValue(data.value || "");
      setHighlights(data.highlights.join("\n"));
      setPublished(data.published);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchOngoingProject();
  }, [fetchOngoingProject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      title,
      description,
      clientName,
      location,
      status,
      category,
      startDate: startDate ? new Date(startDate) : null,
      estimatedCompletionDate: estimatedCompletionDate
        ? new Date(estimatedCompletionDate)
        : null,
      completedAt: completedAt ? new Date(completedAt) : null,
      featuredImage: featuredImage.length > 0 ? featuredImage[0].url : null,
      gallery: gallery.map((img) => ({ url: img.url, caption: img.name })),
      size,
      value,
      highlights: highlights.split("\n"),
      published,
    };

    try {
      const response = await fetch(`/api/admin/ongoing-projects/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Ongoing project updated successfully!");
        router.push("/admin/ongoing-projects");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Error updating ongoing project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
            Edit Ongoing Project
          </h2>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {ProjectStatus.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {ProjectCategory.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedCompletionDate">
                Estimated Completion Date
              </Label>
              <Input
                id="estimatedCompletionDate"
                type="date"
                value={estimatedCompletionDate}
                onChange={(e) => setEstimatedCompletionDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completedAt">Completed At</Label>
              <Input
                id="completedAt"
                type="date"
                value={completedAt}
                onChange={(e) => setCompletedAt(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <Input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="highlights">Highlights (one per line)</Label>
            <Textarea
              id="highlights"
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label>Featured Image</Label>
            <FileUpload
              onUploadSuccess={(files) => setFeaturedImage(files)}
              onFileRemove={() => setFeaturedImage([])}
              initialFiles={featuredImage}
              fileTypeCategory="IMAGE"
              multiple={false}
              accept="image/jpeg, image/png, image/gif, image/webp"
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label>Gallery</Label>
            <FileUpload
              onUploadSuccess={(files) =>
                setGallery((prev) => [...prev, ...files])
              }
              onFileRemove={(fileUrl) =>
                setGallery((prev) => prev.filter((f) => f.url !== fileUrl))
              }
              initialFiles={gallery}
              fileTypeCategory="IMAGE"
              multiple
              accept="image/jpeg, image/png, image/gif, image/webp"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <CgSpinner className="animate-spin mr-2" />
              ) : (
                <PlusCircle className="mr-2" />
              )}
              {isSubmitting ? "Updating..." : "Update Project"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditOngoingProjectPage;
