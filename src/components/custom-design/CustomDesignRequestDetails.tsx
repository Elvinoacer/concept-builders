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
import { motion } from "framer-motion";
import {
  FileText,
  Image as ImageIcon,
  Trash2,
  UploadCloud,
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
        return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-full mx-auto py-4 sm:py-6 md:py-8 lg:py-12 px-3 sm:px-4 md:px-6"
    >
      <Card className="bg-white dark:bg-gray-800 shadow-lg sm:shadow-xl md:shadow-2xl rounded-xl sm:rounded-2xl md:rounded-3xl border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 md:p-8 border-b border-gray-200 dark:border-gray-700 space-y-4 sm:space-y-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 sm:p-3 rounded-full">
              <span className="material-symbols-outlined text-white text-2xl sm:text-3xl md:text-4xl">
                edit_document
              </span>
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold sm:font-extrabold text-gray-900 dark:text-white leading-tight">
                Custom Design Request
              </CardTitle>
              <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 mt-1">
                #{request.id.substring(0, 8)}
              </p>
            </div>
          </div>
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4 w-full xs:w-auto">
            <Badge
              className={`text-xs sm:text-sm md:text-base px-3 py-1.5 sm:px-4 sm:py-2 ${currentStatus === "COMPLETED" ? "bg-green-500" : "bg-yellow-500"} w-fit`}
            >
              {currentStatus.replace(/_/g, " ")}
            </Badge>
            {isAdmin ? (
              <Select
                value={currentStatus}
                onValueChange={handleStatusChange}
                disabled={loading}
              >
                <SelectTrigger className="w-full xs:w-[140px] sm:w-[160px] md:w-[180px] h-9 sm:h-10 md:h-12 text-sm sm:text-base">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CustomDesignRequestStatus).map(
                    (statusOption) => (
                      <SelectItem
                        key={statusOption}
                        value={statusOption}
                        className="text-sm sm:text-base"
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
                variant="outline"
                className="h-9 sm:h-10 md:h-12 px-3 sm:px-4 md:px-6 text-sm sm:text-base w-full xs:w-auto"
              >
                {isEditing ? "Cancel" : "Edit Request"}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm sm:text-base md:text-lg font-semibold"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={request.name}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  required
                  className="h-9 sm:h-10 md:h-12 text-sm sm:text-base md:text-lg"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm sm:text-base md:text-lg font-semibold"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  value={request.email}
                  readOnly
                  required
                  className="h-9 sm:h-10 md:h-12 text-sm sm:text-base md:text-lg"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm sm:text-base md:text-lg font-semibold"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={request.phone || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="h-9 sm:h-10 md:h-12 text-sm sm:text-base md:text-lg"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="designType"
                  className="text-sm sm:text-base md:text-lg font-semibold"
                >
                  Type of Design
                </Label>
                {isEditing ? (
                  <Select
                    value={request.designType}
                    onValueChange={handleSelectChange}
                    required
                  >
                    <SelectTrigger className="h-9 sm:h-10 md:h-12 text-sm sm:text-base md:text-lg">
                      <SelectValue placeholder="Select design type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="Residential"
                        className="text-sm sm:text-base"
                      >
                        Residential
                      </SelectItem>
                      <SelectItem
                        value="Commercial"
                        className="text-sm sm:text-base"
                      >
                        Commercial
                      </SelectItem>
                      <SelectItem
                        value="Renovation"
                        className="text-sm sm:text-base"
                      >
                        Renovation
                      </SelectItem>
                      <SelectItem
                        value="Other"
                        className="text-sm sm:text-base"
                      >
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="designType"
                    value={request.designType}
                    readOnly
                    className="h-9 sm:h-10 md:h-12 text-sm sm:text-base md:text-lg"
                  />
                )}
              </div>
              <div className="md:col-span-2 space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm sm:text-base md:text-lg font-semibold"
                >
                  Project Description
                </Label>
                <Textarea
                  id="description"
                  value={request.description}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  rows={4}
                  className="text-sm sm:text-base md:text-lg min-h-[100px] sm:min-h-[120px] md:min-h-[140px]"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="budget"
                  className="text-sm sm:text-base md:text-lg font-semibold"
                >
                  Estimated Budget
                </Label>
                <Input
                  id="budget"
                  value={request.budget || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="h-9 sm:h-10 md:h-12 text-sm sm:text-base md:text-lg"
                />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <Label className="text-sm sm:text-base md:text-lg font-semibold">
                Attachments
              </Label>
              {request.attachments.length === 0 && newFiles.length === 0 && (
                <div className="text-center py-8 sm:py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl">
                  <span className="material-symbols-outlined text-4xl sm:text-5xl md:text-6xl text-gray-400 dark:text-gray-500">
                    cloud_off
                  </span>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 sm:mt-4 text-sm sm:text-base md:text-lg">
                    No attachments provided.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {request.attachments.map((url, index) => (
                  <div
                    key={index}
                    className="relative group flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 md:p-4 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0">{getFileIcon(url)}</div>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-xs sm:text-sm md:text-base text-blue-600 hover:underline truncate"
                    >
                      {getFileNameFromUrl(url)}
                    </a>
                    {!isAdmin && isEditing && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleExistingFileRemove(url)}
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={loading}
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                      </Button>
                    )}
                  </div>
                ))}
                {newFiles.map((file, index) => (
                  <div
                    key={file.name + index}
                    className="relative group flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 md:p-4 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex-shrink-0">
                      {getFileIcon(file.name)}
                    </div>
                    <span className="flex-1 text-xs sm:text-sm md:text-base truncate">
                      {file.name}
                    </span>
                    {!isAdmin && isEditing && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleNewFileRemove(file)}
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {!isAdmin && isEditing && (
                <div
                  className={`mt-4 sm:mt-6 flex justify-center px-4 sm:px-6 py-6 sm:py-8 md:py-10 border-2 sm:border-4 border-dashed rounded-lg sm:rounded-xl md:rounded-2xl transition-colors ${
                    isDragOver
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <div className="space-y-1 sm:space-y-2 text-center">
                    <UploadCloud
                      className={`mx-auto h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 ${isDragOver ? "text-blue-500" : "text-gray-400"}`}
                    />
                    <div className="flex flex-col xs:flex-row items-center justify-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 space-y-1 xs:space-y-0">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload more files</span>
                        <Input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          multiple
                        />
                      </label>
                      <p className="xs:pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF, PDF, DOCX up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {!isAdmin && isEditing && (
              <div className="flex justify-end pt-4 sm:pt-6">
                <Button
                  type="submit"
                  className="h-10 sm:h-12 md:h-14 px-4 sm:px-6 md:px-8 text-sm sm:text-base md:text-lg w-full sm:w-auto"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CustomDesignRequestDetails;
