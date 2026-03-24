"use client";

import { useState } from "react";
import { ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  FiUploadCloud,
  FiTrash2,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import { toast } from "sonner";
import DragAndDrop from "./DragAndDrop";

interface GenericFileUploadProps {
  designId: string;
  fileRelation: string;
  onUploadComplete: () => void;
  accept: string;
  maxFiles?: number;
}

export default function GenericFileUpload({
  designId,
  fileRelation,
  onUploadComplete,
  accept,
  maxFiles = 1,
}: GenericFileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const getFileRelationInfo = () => {
    switch (fileRelation) {
      case "images":
        return {
          label: "Images",
          maxSize: "5MB per file",
          description: "Upload high-quality images (JPEG, PNG, WebP)",
        };
      case "floorPlans":
        return {
          label: "Floor Plans",
          maxSize: "10MB per file",
          description: "Upload floor plans as images or PDFs",
        };
      case "files":
        return {
          label: "Files",
          maxSize: "25MB per file",
          description: "Upload any additional documents or files",
        };
      default:
        return {
          label: "Files",
          maxSize: "10MB per file",
          description: "Upload files",
        };
    }
  };

  const fileRelationInfo = getFileRelationInfo();

  const handleDrop = (acceptedFiles: File[]) => {
    setError(null);

    if (maxFiles === 1 && acceptedFiles.length > 0) {
      setFiles([acceptedFiles[0]]);
    } else {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      setFiles(newFiles);

      if (newFiles.length >= maxFiles) {
        setError(`Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed`);
      }
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      for (const file of files) {
        // 1. Get signed URL for each file
        const signedUrlResponse = await fetch("/api/designs/upload-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            designId: designId,
            fileRelation: fileRelation,
            fileName: file.name,
            contentType: file.type,
          }),
        });

        if (!signedUrlResponse.ok) {
          const errorData = await signedUrlResponse.text();
          throw new Error(errorData || "Failed to get signed URL");
        }

        const { signedUrl } = await signedUrlResponse.json();

        // 2. Upload file to DO Spaces
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", signedUrl, true);
          xhr.setRequestHeader("Content-Type", file.type);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              setProgress(percentComplete);
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(true);
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => {
            reject(new Error("Upload failed due to network error"));
          };

          xhr.send(file);
        });
      }

      // 3. Success
      toast.success(
        `${files.length} file${files.length > 1 ? "s" : ""} uploaded successfully`,
      );
      onUploadComplete();
      setFiles([]);
      setProgress(0);
    } catch (error: any) {
      console.error("Error uploading files:", error);
      setError(error.message || "Failed to upload files");
      toast.error(`Error uploading files: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleClearAll = () => {
    setFiles([]);
    setError(null);
  };

  return (
    <div className="w-full">
      {/* File Info */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {fileRelationInfo.description} • {fileRelationInfo.maxSize}
          {maxFiles > 1 && ` • Max ${maxFiles} files`}
        </p>
      </div>

      {/* Drag and Drop Area */}
      <DragAndDrop
        onDrop={handleDrop}
        accept={accept}
        disabled={uploading || files.length >= maxFiles}
        multiple={maxFiles > 1}
      />

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Selected files ({files.length}/{maxFiles})
            </span>
            {files.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                disabled={uploading}
                className="text-xs text-red-500 hover:text-red-700 h-8"
              >
                Clear all
              </Button>
            )}
          </div>

          {files.map((file, index) => (
            <div
              key={index}
              className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiUploadCloud className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFile(index)}
                  disabled={uploading}
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                >
                  <FiTrash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="mt-4">
        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          className="w-full h-11"
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2">
              <FiLoader className="w-4 h-4 animate-spin" />
              <span>
                Uploading... {Math.round(progress)}%
                {files.length > 1 && ` (${files.length} files)`}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <FiUploadCloud className="w-4 h-4" />
              <span>
                Upload{" "}
                {files.length > 1
                  ? `${files.length} Files`
                  : fileRelationInfo.label}
              </span>
            </div>
          )}
        </Button>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="mt-3">
          <ProgressBar
            value={progress}
            className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700"
            indicatorClassName="bg-blue-500 transition-all duration-300"
          />
        </div>
      )}
    </div>
  );
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
