"use client";

import React, { useState, useEffect } from 'react';
import { CustomDesignRequest, CustomDesignRequestStatus } from '@/generated/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';
import { FileText, Image as ImageIcon, Trash2, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [currentStatus, setCurrentStatus] = useState<CustomDesignRequestStatus>(initialRequest.status);

  useEffect(() => {
    setCurrentStatus(initialRequest.status);
  }, [initialRequest.status]);

  const handleStatusChange = async (newStatus: CustomDesignRequestStatus) => {
    if (!isAdmin) return; // Only admin can change status
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/custom-design-requests/${request.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setNewFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
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
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <ImageIcon className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFileNameFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/');
      return pathSegments[pathSegments.length - 1];
    } catch (e) {
      return url; // Fallback if URL is malformed
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
      className="max-w-4xl mx-auto py-8"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Custom Design Request #{request.id.substring(0, 8)}</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status: <Badge className="ml-1">{currentStatus}</Badge></p>
          </div>
          {isAdmin ? (
            <Select value={currentStatus} onValueChange={handleStatusChange} disabled={loading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(CustomDesignRequestStatus).map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {statusOption.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            !isAdmin && (
              <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
                {isEditing ? "Cancel" : "Edit Request"}
              </Button>
            )
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={request.name}
                onChange={handleInputChange}
                readOnly={!isEditing}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={request.email}
                readOnly
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={request.phone || ''}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="designType">Type of Design</Label>
              {isEditing ? (
                <Select value={request.designType} onValueChange={handleSelectChange} required>
                  <SelectTrigger>
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
                <Input id="designType" value={request.designType} readOnly />
              )}
            </div>
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={request.description}
                onChange={handleInputChange}
                readOnly={!isEditing}
                rows={5}
                required
              />
            </div>
            <div>
              <Label htmlFor="budget">Estimated Budget</Label>
              <Input
                id="budget"
                value={request.budget || ''}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label>Attachments</Label>
              {request.attachments.length === 0 && newFiles.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No attachments provided.</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {request.attachments.map((url, index) => (
                  <div
                    key={index}
                    className="relative flex items-center space-x-2 p-3 border rounded-md bg-gray-50 dark:bg-gray-700"
                  >
                    {url.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                      <Image src={url} alt="Attachment" width={40} height={40} className="rounded-md object-cover" />
                    ) : (
                      <div className="flex-shrink-0">{getFileIcon(url)}</div>
                    )}
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
                        size="sm"
                        onClick={() => handleExistingFileRemove(url)}
                        className="text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {newFiles.map((file, index) => (
                  <div
                    key={file.name + index}
                    className="relative flex items-center space-x-2 p-3 border rounded-md bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="flex-shrink-0">{getFileIcon(file.name)}</div>
                    <span className="flex-1 text-sm truncate">{file.name}</span>
                    {!isAdmin && isEditing && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNewFileRemove(file)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {!isAdmin && isEditing && (
                <div
                  className={`mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
                    isDragOver
                      ? "border-primary bg-primary/10"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <div className="space-y-1 text-center">
                    <UploadCloud
                      className={`mx-auto h-8 w-8 md:h-12 md:w-12 ${
                        isDragOver ? "text-primary" : "text-gray-400"
                      }`}
                    />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
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
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF, PDF, DOCX up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {!isAdmin && isEditing && (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CustomDesignRequestDetails;
