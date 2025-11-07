"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import {
  PlusCircle,
  ArrowLeft,
  Save,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Ruler,
} from "lucide-react";

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

const getStatusColorClass = (status: string) => {
  switch (status) {
    case "PLANNING":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "COMPLETED":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "ON_HOLD":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "NEARING_COMPLETION":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const EditOngoingProjectPage = ({ params }: { params: { id: string } }) => {
  const [project, setProject] = useState<OngoingProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
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

  // Track form changes
  useEffect(() => {
    if (project) {
      const currentFormState = {
        title,
        description,
        clientName,
        location,
        status,
        category,
        startDate,
        estimatedCompletionDate,
        completedAt,
        featuredImage: featuredImage.length > 0 ? featuredImage[0].url : null,
        gallery: gallery.map((img) => img.url),
        size,
        value,
        highlights: highlights.split("\n").filter((h) => h.trim()),
        published,
      };

      const originalState = {
        title: project.title,
        description: project.description || "",
        clientName: project.clientName || "",
        location: project.location || "",
        status: project.status,
        category: project.category,
        startDate: project.startDate
          ? new Date(project.startDate).toISOString().split("T")[0]
          : "",
        estimatedCompletionDate: project.estimatedCompletionDate
          ? new Date(project.estimatedCompletionDate)
              .toISOString()
              .split("T")[0]
          : "",
        completedAt: project.completedAt
          ? new Date(project.completedAt).toISOString().split("T")[0]
          : "",
        featuredImage: project.featuredImage,
        gallery: project.gallery
          ? project.gallery.map((img: any) => img.url)
          : [],
        size: project.size || "",
        value: project.value || "",
        highlights: project.highlights,
        published: project.published,
      };

      setHasChanges(
        JSON.stringify(currentFormState) !== JSON.stringify(originalState)
      );
    }
  }, [
    project,
    title,
    description,
    clientName,
    location,
    status,
    category,
    startDate,
    estimatedCompletionDate,
    completedAt,
    featuredImage,
    gallery,
    size,
    value,
    highlights,
    published,
  ]);

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
          ? data.gallery.map((img: any) => ({
              url: img.url,
              name: img.caption || "Gallery Image",
            }))
          : []
      );
      setSize(data.size || "");
      setValue(data.value || "");
      setHighlights(data.highlights.join("\n"));
      setPublished(data.published);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load project");
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
      highlights: highlights.split("\n").filter((h) => h.trim()),
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
        toast.success("Project updated successfully!");
        router.push("/admin/ongoing-projects");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Error updating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        router.push("/admin/ongoing-projects");
      }
    } else {
      router.push("/admin/ongoing-projects");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <CgSpinner className="animate-spin text-primary w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Project
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {error}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={fetchOngoingProject}>Try Again</Button>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/ongoing-projects")}
              >
                Back to Projects
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Back</span>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Edit Project
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
              Update project details and information
            </p>
          </div>
        </div>

        {project && (
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className={getStatusColorClass(project.status)}
            >
              {project.status.replace("_", " ")}
            </Badge>
            <Badge variant={project.published ? "default" : "secondary"}>
              {project.published ? "Published" : "Draft"}
            </Badge>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Project Details
            </CardTitle>
            <CardDescription>
              Update the project information, status, and media
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSubmit}>
              <div className="p-4 sm:p-6 space-y-6">
                {/* Project Basic Info */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                  {/* Left Column - Basic Info */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label
                        htmlFor="title"
                        className="text-base font-semibold flex items-center gap-2"
                      >
                        Project Title *
                      </Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter project title"
                        required
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label
                        htmlFor="clientName"
                        className="text-base font-semibold"
                      >
                        Client Name
                      </Label>
                      <Input
                        id="clientName"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Enter client name"
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label
                        htmlFor="description"
                        className="text-base font-semibold"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the project..."
                        rows={4}
                        className="bg-white dark:bg-gray-700 resize-vertical min-h-[120px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-4">
                        <Label
                          htmlFor="status"
                          className="text-base font-semibold"
                        >
                          Status
                        </Label>
                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger className="bg-white dark:bg-gray-700">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {ProjectStatus.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-4">
                        <Label
                          htmlFor="category"
                          className="text-base font-semibold"
                        >
                          Category
                        </Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="bg-white dark:bg-gray-700">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {ProjectCategory.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Location & Details */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label
                        htmlFor="location"
                        className="text-base font-semibold flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Project location"
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-4">
                        <Label
                          htmlFor="size"
                          className="text-base font-semibold flex items-center gap-2"
                        >
                          <Ruler className="w-4 h-4" />
                          Size
                        </Label>
                        <Input
                          id="size"
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          placeholder="e.g., 5000 sq ft"
                          className="bg-white dark:bg-gray-700"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label
                          htmlFor="value"
                          className="text-base font-semibold flex items-center gap-2"
                        >
                          <DollarSign className="w-4 h-4" />
                          Value
                        </Label>
                        <Input
                          id="value"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          placeholder="e.g., $500,000"
                          className="bg-white dark:bg-gray-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label
                        htmlFor="highlights"
                        className="text-base font-semibold"
                      >
                        Key Highlights (one per line)
                      </Label>
                      <Textarea
                        id="highlights"
                        value={highlights}
                        onChange={(e) => setHighlights(e.target.value)}
                        placeholder="Enter key project highlights, one per line..."
                        rows={4}
                        className="bg-white dark:bg-gray-700 resize-vertical min-h-[120px]"
                      />
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Switch
                        id="published"
                        checked={published}
                        onCheckedChange={setPublished}
                      />
                      <Label
                        htmlFor="published"
                        className="text-base font-semibold cursor-pointer"
                      >
                        Publish Project
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Dates Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Project Timeline
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <Label
                        htmlFor="startDate"
                        className="text-base font-semibold"
                      >
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label
                        htmlFor="estimatedCompletionDate"
                        className="text-base font-semibold"
                      >
                        Estimated Completion
                      </Label>
                      <Input
                        id="estimatedCompletionDate"
                        type="date"
                        value={estimatedCompletionDate}
                        onChange={(e) =>
                          setEstimatedCompletionDate(e.target.value)
                        }
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label
                        htmlFor="completedAt"
                        className="text-base font-semibold"
                      >
                        Actual Completion
                      </Label>
                      <Input
                        id="completedAt"
                        type="date"
                        value={completedAt}
                        onChange={(e) => setCompletedAt(e.target.value)}
                        className="bg-white dark:bg-gray-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Media Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Media & Gallery
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">
                        Featured Image
                      </Label>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <FileUpload
                          onUploadSuccess={(files) => setFeaturedImage(files)}
                          onFileRemove={() => setFeaturedImage([])}
                          initialFiles={featuredImage}
                          fileTypeCategory="IMAGE"
                          multiple={false}
                          accept="image/jpeg, image/png, image/gif, image/webp"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-semibold">
                        Gallery Images
                      </Label>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <FileUpload
                          onUploadSuccess={(files) =>
                            setGallery((prev) => [...prev, ...files])
                          }
                          onFileRemove={(fileUrl) =>
                            setGallery((prev) =>
                              prev.filter((f) => f.url !== fileUrl)
                            )
                          }
                          initialFiles={gallery}
                          fileTypeCategory="IMAGE"
                          multiple
                          accept="image/jpeg, image/png, image/gif, image/webp"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !hasChanges}
                    className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <CgSpinner className="animate-spin w-4 h-4 mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Project
                      </>
                    )}
                  </Button>
                </div>

                {!hasChanges && (
                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No changes made to save
                    </p>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Project Preview Info */}
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400"
        >
          <div className="text-center md:text-left">
            <span className="font-medium">Created: </span>
            {new Date(project.createdAt).toLocaleDateString()}
          </div>
          <div className="text-center">
            <span className="font-medium">Slug: </span>
            {project.slug}
          </div>
          <div className="text-center md:text-right">
            <span className="font-medium">Last Updated: </span>
            {new Date().toLocaleDateString()}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EditOngoingProjectPage;
