"use client";

import FileUpload from "@/components/admin/designs/FileUpload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Edit,
  Eye,
  Filter,
  MapPin,
  PlusCircle,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";

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

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Not set";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const OngoingProjectsPage = () => {
  const [projects, setProjects] = useState<OngoingProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<OngoingProject[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

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

  // Filter projects
  useEffect(() => {
    let filtered = projects;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.clientName?.toLowerCase().includes(query) ||
          project.location?.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (project) => project.category === categoryFilter
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchQuery, statusFilter, categoryFilter]);

  const fetchOngoingProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/ongoing-projects");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: OngoingProject[] = await response.json();
      setProjects(data);
      setFilteredProjects(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOngoingProjects();
  }, [fetchOngoingProjects]);

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
      const response = await fetch("/api/admin/ongoing-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Project created successfully!");
        setShowForm(false);
        fetchOngoingProjects();
        resetForm();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setClientName("");
    setLocation("");
    setStatus("PLANNING");
    setCategory("RESIDENTIAL");
    setStartDate("");
    setEstimatedCompletionDate("");
    setCompletedAt("");
    setFeaturedImage([]);
    setGallery([]);
    setSize("");
    setValue("");
    setHighlights("");
    setPublished(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await fetch(`/api/admin/ongoing-projects/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchOngoingProjects();
      toast.success("Project deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete project:", err);
      toast.error("Failed to delete project.");
    }
  };

  // Mobile Project Card Component
  const ProjectCard = ({ project }: { project: OngoingProject }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex">
        {project.featuredImage && (
          <div className="w-24 h-24 flex-shrink-0">
            <img
              className="w-24 h-24 object-cover"
              src={project.featuredImage}
              alt={project.title}
            />
          </div>
        )}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {project.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {project.clientName || "No client specified"}
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className={`ml-2 flex-shrink-0 ${getStatusColorClass(project.status)}`}
            >
              {project.status.replace("_", " ")}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              <span>{project.category.replace("_", " ")}</span>
            </div>
            {project.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{project.location}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Badge
              variant={project.published ? "default" : "secondary"}
              className="text-xs"
            >
              {project.published ? "Published" : "Draft"}
            </Badge>
            <div className="flex items-center gap-1">
              <Link href={`/ongoing-projects/${project.slug}`} target="_blank">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>
              <Link href={`/admin/ongoing-projects/${project.id}/edit`}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                onClick={() => handleDelete(project.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <CgSpinner className="animate-spin text-primary w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Loading projects...
          </p>
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
              Error Loading Projects
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {error}
            </p>
            <Button onClick={fetchOngoingProjects}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ongoing Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Manage and track all ongoing construction projects
          </p>
        </div>

        <div className="flex flex-col xs:flex-row gap-3">
          {/* Search and Filters - Mobile */}
          <div className="flex gap-2 sm:hidden">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            size="lg"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="hidden xs:inline">
              {showForm ? "Cancel" : "New Project"}
            </span>
          </Button>
        </div>
      </div>

      {/* Search and Filters - Desktop */}
      <Card className="mb-6 hidden sm:block">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search projects by title, client, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {ProjectStatus.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {ProjectCategory.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Project Creation Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create New Project
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="title" className="text-base font-semibold">
                      Project Title *
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter project title"
                      required
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
                      rows={4}
                      placeholder="Describe the project..."
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
                        <SelectTrigger>
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
                        <SelectTrigger>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label
                      htmlFor="location"
                      className="text-base font-semibold"
                    >
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Project location"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <Label htmlFor="size" className="text-base font-semibold">
                        Size
                      </Label>
                      <Input
                        id="size"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        placeholder="e.g., 5000 sq ft"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label
                        htmlFor="value"
                        className="text-base font-semibold"
                      >
                        Value
                      </Label>
                      <Input
                        id="value"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="e.g., $500,000"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label
                      htmlFor="highlights"
                      className="text-base font-semibold"
                    >
                      Highlights (one per line)
                    </Label>
                    <Textarea
                      id="highlights"
                      value={highlights}
                      onChange={(e) => setHighlights(e.target.value)}
                      rows={4}
                      placeholder="Enter key project highlights..."
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">
                      Featured Image
                    </Label>
                    <FileUpload
                      onUploadSuccess={(files) => setFeaturedImage(files)}
                      onFileRemove={() => setFeaturedImage([])}
                      initialFiles={featuredImage}
                      fileTypeCategory="IMAGE"
                      multiple={false}
                      accept="image/jpeg, image/png, image/gif, image/webp"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">
                      Gallery Images
                    </Label>
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

                  <div className="flex items-center space-x-3 pt-2">
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

              <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <CgSpinner className="animate-spin w-4 h-4 mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create Project
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {projects.length === 0 ? "No projects yet" : "No projects found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-4">
              {projects.length === 0
                ? "Get started by creating your first ongoing project."
                : "Try adjusting your search or filter criteria."}
            </p>
            <Button onClick={() => setShowForm(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Client & Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Dates
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Published
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {project.featuredImage && (
                            <div className="flex-shrink-0 h-12 w-12 mr-4">
                              <img
                                className="h-12 w-12 rounded-lg object-cover shadow-md"
                                src={project.featuredImage}
                                alt={project.title}
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-base font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
                              {project.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {project.category.replace("_", " ")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          {project.clientName || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                          {project.location || "No location"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`${getStatusColorClass(project.status)}`}
                        >
                          {project.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div>Start: {formatDate(project.startDate)}</div>
                        <div>
                          Est: {formatDate(project.estimatedCompletionDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={project.published ? "default" : "secondary"}
                        >
                          {project.published ? "Yes" : "No"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/ongoing-projects/${project.slug}`}
                            target="_blank"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link
                            href={`/admin/ongoing-projects/${project.id}/edit`}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Stats Summary */}
      {!loading && filteredProjects.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Total: {projects.length}</span>
          <span>Showing: {filteredProjects.length}</span>
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="text-xs"
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default OngoingProjectsPage;
