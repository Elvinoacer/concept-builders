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
import {
  CustomDesignRequest,
  CustomDesignRequestStatus,
} from "@/generated/prisma";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Image as ImageIcon,
  Trash2,
  UploadCloud,
  Edit3,
  X,
  Save,
  Loader2,
  User,
  Mail,
  Phone,
  Building,
  FileEdit,
  DollarSign,
  Calendar,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface CustomDesignRequestDetailsProps {
  initialRequest: CustomDesignRequest;
  isAdmin: boolean;
}

const CustomDesignRequestDetails: React.FC<CustomDesignRequestDetailsProps> = ({
  initialRequest,
  isAdmin,
}) => {
  const [request, setRequest] = useState<CustomDesignRequest>(initialRequest);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<CustomDesignRequestStatus>(
    initialRequest.status
  );

  useEffect(() => {
    setCurrentStatus(initialRequest.status);
  }, [initialRequest.status]);

  const handleStatusChange = async (newStatus: CustomDesignRequestStatus) => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/custom-design-requests/${request.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      const updatedRequest = await response.json();
      setRequest(updatedRequest);
      setCurrentStatus(updatedRequest.status);
      toast.success("Status updated successfully!");
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setRequest((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setRequest((prev) => ({
      ...prev,
      designType: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleNewFileRemove = (fileToRemove: File) => {
    setNewFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileToRemove)
    );
  };

  const handleExistingFileRemove = async (fileUrlToRemove: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/custom-design/${request.id}/file`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileUrl: fileUrlToRemove }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete file");
      }

      setRequest((prev) => ({
        ...prev,
        attachments: prev.attachments.filter((url) => url !== fileUrlToRemove),
      }));
      toast.success("File deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting file:", error);
      toast.error(error.message || "Failed to delete file.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", request.name);
    formData.append("email", request.email);
    formData.append("phone", request.phone || "");
    formData.append("designType", request.designType);
    formData.append("description", request.description);
    formData.append("budget", request.budget || "");
    formData.append("existingAttachments", JSON.stringify(request.attachments));

    newFiles.forEach((file) => {
      formData.append("newFiles", file);
    });

    try {
      const response = await fetch(`/api/custom-design/${request.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update request");
      }

      const updatedRequest = await response.json();
      setRequest(updatedRequest);
      setIsEditing(false);
      setNewFiles([]);
      toast.success("Request updated successfully!");
    } catch (error: any) {
      console.error("Error updating custom design request:", error);
      toast.error(error.message || "Failed to update custom design request.");
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return <ImageIcon className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFileNameFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split("/");
      return pathSegments[pathSegments.length - 1];
    } catch (e) {
      return url;
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      setNewFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(e.dataTransfer.files),
      ]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: CustomDesignRequestStatus) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500 hover:bg-green-600";
      case "IN_PROGRESS":
        return "bg-blue-500 hover:bg-blue-600";
      case "PENDING":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "CANCELLED":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-full mx-auto py-3 sm:py-4 md:py-6 px-3 sm:px-4 md:px-6"
    >
      <Card className="bg-white dark:bg-gray-800 shadow-sm sm:shadow-md md:shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <CardHeader className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 sm:p-3 rounded-xl flex-shrink-0">
                <FileEdit className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight truncate">
                  Design Request
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                  <Badge variant="outline" className="text-xs">
                    #{request.id.substring(0, 8)}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(request.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3 w-full xs:w-auto">
              <Badge
                className={`text-xs px-3 py-1.5 ${getStatusColor(currentStatus)}`}
              >
                {currentStatus.replace(/_/g, " ")}
              </Badge>

              {isAdmin ? (
                <Select
                  value={currentStatus}
                  onValueChange={handleStatusChange}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full xs:w-[140px] h-9 text-sm">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CustomDesignRequestStatus).map(
                      (statusOption) => (
                        <SelectItem
                          key={statusOption}
                          value={statusOption}
                          className="text-sm"
                        >
                          {statusOption.replace(/_/g, " ")}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              ) : (
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  size="sm"
                  className="w-full xs:w-auto h-9 text-sm"
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column - Personal Info */}
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={request.name}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    required
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={request.email}
                    readOnly
                    required
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-semibold flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={request.phone || ""}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              {/* Right Column - Project Info */}
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="designType"
                    className="text-sm font-semibold flex items-center gap-2"
                  >
                    <Building className="w-4 h-4" />
                    Type of Design
                  </Label>
                  {isEditing ? (
                    <Select
                      value={request.designType}
                      onValueChange={handleSelectChange}
                      required
                    >
                      <SelectTrigger className="h-10 text-sm">
                        <SelectValue placeholder="Select design type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Renovation">Renovation</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="designType"
                      value={request.designType}
                      readOnly
                      className="h-10 text-sm"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="budget"
                    className="text-sm font-semibold flex items-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    Estimated Budget
                  </Label>
                  <Input
                    id="budget"
                    value={request.budget || ""}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className="h-10 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Project Description
              </Label>
              <Textarea
                id="description"
                value={request.description}
                onChange={handleInputChange}
                readOnly={!isEditing}
                rows={4}
                className="text-sm min-h-[120px] resize-none"
                required
                placeholder="Describe your project requirements, preferences, and any specific details..."
              />
            </div>

            {/* Attachments Section */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold">
                Attachments ({request.attachments.length + newFiles.length})
              </Label>

              <AnimatePresence>
                {request.attachments.length === 0 && newFiles.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No attachments provided
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3">
                    {request.attachments.map((url, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative group flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:shadow-sm transition-shadow"
                      >
                        {getFileIcon(url)}
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-sm text-blue-600 hover:underline truncate"
                        >
                          {getFileNameFromUrl(url)}
                        </a>
                        {!isAdmin && isEditing && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleExistingFileRemove(url)}
                            className="h-6 w-6 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            disabled={loading}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </motion.div>
                    ))}
                    {newFiles.map((file, index) => (
                      <motion.div
                        key={file.name + index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative group flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                      >
                        {getFileIcon(file.name)}
                        <span className="flex-1 text-sm truncate">
                          {file.name}
                        </span>
                        {!isAdmin && isEditing && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleNewFileRemove(file)}
                            className="h-6 w-6 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              {/* File Upload Area */}
              {!isAdmin && isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className={`mt-4 flex justify-center px-4 py-6 border-2 border-dashed rounded-lg transition-colors ${
                    isDragOver
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <div className="text-center">
                    <UploadCloud
                      className={`mx-auto h-8 w-8 mb-2 ${isDragOver ? "text-blue-500" : "text-gray-400"}`}
                    />
                    <div className="flex flex-col xs:flex-row items-center justify-center text-sm text-gray-600 dark:text-gray-400 space-y-1 xs:space-y-0">
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer font-medium text-blue-600 hover:text-blue-700"
                      >
                        Upload files
                      </label>
                      <Input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        multiple
                      />
                      <span className="xs:pl-1">or drag and drop</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Supports images, PDFs, and documents up to 10MB
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            {!isAdmin && isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CustomDesignRequestDetails;
