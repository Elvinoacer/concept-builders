"use client";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { useState } from "react";
import {
  FiAlertCircle,
  FiLoader,
  FiTrash2,
  FiUploadCloud,
} from "react-icons/fi";
import { toast } from "sonner";
import DragAndDrop from "./DragAndDrop";

interface DocumentFileUploadProps {
  design: any;
  documentType: string;
  fileType: "PDF" | "CAD" | "EXCEL";
  onUploadComplete: () => void;
  title?: string;
}

export default function DocumentFileUpload({
  design,
  documentType,
  fileType,
  onUploadComplete,
  title,
}: DocumentFileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const getAcceptString = () => {
    switch (fileType) {
      case "PDF":
        return ".pdf";
      case "CAD":
        return ".dwg,.dxf,.dgn,.stp,.step,.iges,.igs";
      case "EXCEL":
        return ".xls,.xlsx,.csv";
      default:
        return "*";
    }
  };

  const getFileTypeInfo = () => {
    switch (fileType) {
      case "PDF":
        return {
          label: "PDF Document",
          maxSize: "10MB",
          description: "Upload PDF files for documentation",
        };
      case "CAD":
        return {
          label: "CAD File",
          maxSize: "50MB",
          description: "Upload CAD files for technical drawings",
        };
      case "EXCEL":
        return {
          label: "Spreadsheet",
          maxSize: "5MB",
          description: "Upload Excel files for calculations",
        };
      default:
        return {
          label: "Document",
          maxSize: "10MB",
          description: "Upload document files",
        };
    }
  };

  const fileTypeInfo = getFileTypeInfo();

  const handleDrop = (acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];

      // Check file size (basic validation)
      const maxSize = fileType === "CAD" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setError(`File size must be less than ${fileTypeInfo.maxSize}`);
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // 1. Get signed URL
      const signedUrlResponse = await fetch("/api/designs/upload-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designId: design.id,
          documentType,
          fileType,
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!signedUrlResponse.ok) {
        const errorData = await signedUrlResponse.text();
        throw new Error(errorData || "Failed to get signed URL");
      }

      const { signedUrl, publicUrl } = await signedUrlResponse.json();

      // 2. Upload file to DO Spaces
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", signedUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.setRequestHeader("x-amz-acl", "public-read");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(publicUrl);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Upload failed due to network error"));
        };

        xhr.send(file);
      });

      // 3. Success
      toast.success(`${fileTypeInfo.label} uploaded successfully`);
      onUploadComplete();
      setFile(null);
      setProgress(0);
    } catch (error: any) {
      console.error("Error uploading file:", error);
      setError(error.message || "Failed to upload file");
      toast.error(`Error uploading file: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4">
        <h5 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
          {title || fileTypeInfo.label}
        </h5>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {fileTypeInfo.description} • Max {fileTypeInfo.maxSize}
        </p>
      </div>

      {/* Drag and Drop Area */}
      <DragAndDrop
        onDrop={handleDrop}
        accept={getAcceptString()}
        disabled={uploading}
      />

      {/* Selected File */}
      {file && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
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
              onClick={handleRemoveFile}
              disabled={uploading}
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
            >
              <FiTrash2 className="w-4 h-4" />
            </Button>
          </div>
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
          disabled={!file || uploading}
          className="w-full h-11"
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2">
              <FiLoader className="w-4 h-4 animate-spin" />
              <span>Uploading... {Math.round(progress)}%</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <FiUploadCloud className="w-4 h-4" />
              <span>Upload {fileTypeInfo.label}</span>
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
