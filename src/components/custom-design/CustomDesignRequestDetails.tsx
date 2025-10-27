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
import { Badge } from '@/components/ui/badge';

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
      className="max-w-6xl mx-auto py-12 px-4"
    >
      <Card className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between p-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-3 rounded-full">
              <span className="material-symbols-outlined text-white text-4xl">edit_document</span>
            </div>
            <div>
              <CardTitle className="text-4xl font-extrabold text-gray-900 dark:text-white">Custom Design Request</CardTitle>
              <p className="text-lg text-gray-500 dark:text-gray-400">#{request.id.substring(0, 8)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Badge className={`text-lg px-4 py-2 ${currentStatus === 'COMPLETED' ? 'bg-green-500' : 'bg-yellow-500'}`}>{currentStatus.replace(/_/g, ' ')}</Badge>
            {isAdmin ? (
              <Select value={currentStatus} onValueChange={handleStatusChange} disabled={loading}>
                <SelectTrigger className="w-[200px] h-12 text-lg">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CustomDesignRequestStatus).map((statusOption) => (
                    <SelectItem key={statusOption} value={statusOption} className="text-lg">
                      {statusOption.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="h-12 px-6 text-lg">
                {isEditing ? "Cancel" : "Edit Request"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg font-semibold">Full Name</Label>
                <Input id="name" value={request.name} onChange={handleInputChange} readOnly={!isEditing} required className="h-12 text-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg font-semibold">Email</Label>
                <Input id="email" value={request.email} readOnly required className="h-12 text-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-lg font-semibold">Phone Number</Label>
                <Input id="phone" value={request.phone || ''} onChange={handleInputChange} readOnly={!isEditing} className="h-12 text-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designType" className="text-lg font-semibold">Type of Design</Label>
                {isEditing ? (
                  <Select value={request.designType} onValueChange={handleSelectChange} required>
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder="Select design type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential" className="text-lg">Residential</SelectItem>
                      <SelectItem value="Commercial" className="text-lg">Commercial</SelectItem>
                      <SelectItem value="Renovation" className="text-lg">Renovation</SelectItem>
                      <SelectItem value="Other" className="text-lg">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id="designType" value={request.designType} readOnly className="h-12 text-lg" />
                )}
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description" className="text-lg font-semibold">Project Description</Label>
                <Textarea id="description" value={request.description} onChange={handleInputChange} readOnly={!isEditing} rows={6} required className="text-lg" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="budget" className="text-lg font-semibold">Estimated Budget</Label>
                <Input id="budget" value={request.budget || ''} onChange={handleInputChange} readOnly={!isEditing} className="h-12 text-lg" />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">Attachments</Label>
              {request.attachments.length === 0 && newFiles.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                  <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-500">cloud_off</span>
                  <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">No attachments provided.</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {request.attachments.map((url, index) => (
                  <div key={index} className="relative group flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0">{getFileIcon(url)}</div>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1 text-lg text-blue-600 hover:underline truncate">
                      {getFileNameFromUrl(url)}
                    </a>
                    {!isAdmin && isEditing && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleExistingFileRemove(url)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity" disabled={loading}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                ))}
                {newFiles.map((file, index) => (
                  <div key={file.name + index} className="relative group flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex-shrink-0">{getFileIcon(file.name)}</div>
                    <span className="flex-1 text-lg truncate">{file.name}</span>
                    {!isAdmin && isEditing && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleNewFileRemove(file)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {!isAdmin && isEditing && (
                <div
                  className={`mt-6 flex justify-center px-6 py-10 border-4 border-dashed rounded-2xl transition-colors ${
                    isDragOver
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <div className="space-y-2 text-center">
                    <UploadCloud className={`mx-auto h-16 w-16 ${isDragOver ? "text-blue-500" : "text-gray-400"}`} />
                    <div className="flex text-lg text-gray-600 dark:text-gray-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload more files</span>
                        <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} multiple />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-md text-gray-500 dark:text-gray-400">PNG, JPG, GIF, PDF, DOCX up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {!isAdmin && isEditing && (
              <div className="flex justify-end">
                <Button type="submit" className="h-14 px-8 text-lg" disabled={loading}>
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
