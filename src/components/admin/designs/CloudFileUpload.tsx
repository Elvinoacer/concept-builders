"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  FiFile,
  FiTrash,
  FiX,
  FiUpload,
  FiImage,
  FiFileText,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { ProgressBar } from "@/components/ui/progress";
import { toast } from "sonner";

interface CloudFileUploadProps {
  onUploadSuccess: (
    files: { url: string; type: string; originalFileName: string }[]
  ) => void;
  onFileRemove: (fileUrl: string) => void;
  initialFiles: { url: string; type: string; name: string }[];
  fileTypeCategory: string;
  multiple?: boolean;
  accept?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  error?: string;
}

const CloudFileUpload = ({
  onUploadSuccess,
  initialFiles = [],
  fileTypeCategory,
  multiple = false,
  accept,
  onFileRemove,
}: CloudFileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState(initialFiles);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [removingFiles, setRemovingFiles] = useState<Map<string, boolean>>(
    new Map()
  );

  useEffect(() => {
    setUploadedFiles(initialFiles);
  }, [initialFiles]);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach(({ file, errors }) => {
          errors.forEach((error: any) => {
            toast.error(`${file.name}: ${error.message}`);
          });
        });
      }

      if (!multiple && acceptedFiles.length > 1) {
        toast.error("Only one file is allowed");
        return;
      }

      const newUploadingFiles: UploadingFile[] = acceptedFiles.map((file) => ({
        file,
        progress: 0,
      }));
      setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

      const newFilesData = await Promise.all(
        acceptedFiles.map(async (file) => {
          try {
            const response = await fetch(
              `/api/upload-cloud-vercel-files?filename=${encodeURIComponent(
                file.name
              )}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": file.type,
                },
                body: file,
              }
            );

            if (!response.ok) {
              throw new Error("Upload failed");
            }

            const { url, originalFileName } = await response.json();

            setUploadingFiles((prev) =>
              prev.filter((f) => f.file.name !== file.name)
            );
            return { url, type: fileTypeCategory, originalFileName };
          } catch (error) {
            console.error("Upload error:", error);
            setUploadingFiles((prev) =>
              prev.map((f) =>
                f.file.name === file.name
                  ? { ...f, error: "Upload failed. Please try again." }
                  : f
              )
            );
            toast.error(`Failed to upload ${file.name}`);
            return null;
          }
        })
      );

      const successfulUploads = newFilesData.filter((f) => f) as {
        url: string;
        type: string;
        originalFileName: string;
      }[];
      if (successfulUploads.length > 0) {
        setUploadedFiles((prev) => [...prev, ...successfulUploads]);
        onUploadSuccess(successfulUploads);
        toast.success(
          `Successfully uploaded ${successfulUploads.length} file${
            successfulUploads.length > 1 ? "s" : ""
          }`
        );
      }
    },
    [uploadedFiles, onUploadSuccess, fileTypeCategory, multiple]
  );

  const buildAcceptObject = (acceptInput?: string) => {
    if (!acceptInput) return undefined;

    const values = acceptInput
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (values.length === 0) return undefined;

    return values.reduce<Record<string, string[]>>((acc, value) => {
      acc[value] = [];
      return acc;
    }, {});
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: buildAcceptObject(accept),
    maxSize: 50 * 1024 * 1024, // 50MB max file size
  });

  const handleRemove = async (fileUrl: string) => {
    setRemovingFiles((prev) => new Map(prev.set(fileUrl, true)));
    try {
      await onFileRemove(fileUrl);
      setUploadedFiles((prev) => prev.filter((file) => file.url !== fileUrl));
      toast.success("File removed successfully");
    } catch (error) {
      toast.error("Failed to remove file");
    } finally {
      setRemovingFiles((prev) => {
        const newMap = new Map(prev);
        newMap.delete(fileUrl);
        return newMap;
      });
    }
  };

  const handleRemoveUploading = (fileName: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.file.name !== fileName));
    toast.info("Upload cancelled");
  };

  const getFileIcon = (fileName: string, fileType: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (fileType === "IMAGE" || /\.(jpe?g|png|gif|bmp|webp)$/i.test(fileName)) {
      return <FiImage className="text-blue-500 flex-shrink-0" size={20} />;
    } else if (/\.pdf$/i.test(fileName)) {
      return <FiFileText className="text-red-500 flex-shrink-0" size={20} />;
    } else if (/\.(dwg|dxf|pln)$/i.test(fileName)) {
      return <FiFileText className="text-orange-500 flex-shrink-0" size={20} />;
    } else if (/\.(xls|xlsx)$/i.test(fileName)) {
      return <FiFileText className="text-green-500 flex-shrink-0" size={20} />;
    } else {
      return <FiFile className="text-gray-500 flex-shrink-0" size={20} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getAcceptableFileTypes = () => {
    if (!accept) return "any files";

    const types = accept.split(",").map((type) => {
      if (type.includes("image/")) return "images";
      if (type.includes("application/pdf")) return "PDFs";
      if (
        type.includes(".dwg") ||
        type.includes(".dxf") ||
        type.includes(".pln")
      )
        return "CAD files";
      if (type.includes(".xls") || type.includes(".xlsx")) return "Excel files";
      return type;
    });

    return types.join(", ");
  };

  return (
    <div className="w-full">
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer 
          transition-all duration-200 ease-in-out min-h-[120px] flex flex-col items-center justify-center
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50/50 shadow-lg scale-[1.02]"
              : "border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50"
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-blue-100 rounded-full">
            <FiUpload className="text-blue-600" size={24} />
          </div>

          <div className="space-y-2">
            {isDragActive ? (
              <p className="text-blue-600 font-medium text-base sm:text-lg">
                Drop files here...
              </p>
            ) : (
              <>
                <p className="text-gray-700 font-medium text-base sm:text-lg">
                  Drag & drop files here
                </p>
                <p className="text-gray-500 text-sm">
                  or{" "}
                  <span className="text-blue-600 font-medium">
                    browse files
                  </span>
                </p>
              </>
            )}
          </div>

          <div className="text-xs text-gray-400 mt-2">
            {multiple ? "Multiple files allowed" : "Single file only"} • Max
            50MB • {getAcceptableFileTypes()}
          </div>
        </div>
      </div>

      {/* Uploading Files Section */}
      {uploadingFiles.length > 0 && (
        <div className="mt-4 sm:mt-6 space-y-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <CgSpinner className="animate-spin text-blue-500" size={16} />
            Uploading {uploadingFiles.length} file
            {uploadingFiles.length > 1 ? "s" : ""}
          </h4>

          <div className="space-y-2">
            {uploadingFiles.map((uploadingFile, index) => (
              <div
                key={`uploading-${index}`}
                className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {getFileIcon(uploadingFile.file.name, fileTypeCategory)}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uploadingFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(uploadingFile.file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {uploadingFile.error ? (
                      <span className="text-xs text-red-500 font-medium">
                        Failed
                      </span>
                    ) : (
                      <span className="text-xs text-blue-600 font-medium">
                        {uploadingFile.progress}%
                      </span>
                    )}
                    <button
                      onClick={() =>
                        handleRemoveUploading(uploadingFile.file.name)
                      }
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                      title="Cancel upload"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                </div>

                {uploadingFile.error ? (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <FiX size={12} />
                    {uploadingFile.error}
                  </p>
                ) : (
                  <ProgressBar
                    value={uploadingFile.progress}
                    className="mt-2 h-1.5 bg-gray-100"
                    indicatorClassName="bg-blue-500 transition-all duration-300"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Files Section */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 sm:mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Files ({uploadedFiles.length})
          </h4>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {uploadedFiles.map((file, index) => {
              const fileName =
                file.originalFileName ||
                decodeURIComponent(file.url.split("/").pop() || "Unknown File");
              const isImage =
                file.type === "IMAGE" ||
                (file.type === "FLOOR_PLAN" &&
                  /\.(jpe?g|png|gif|bmp|webp)$/i.test(fileName));
              const isRemoving = removingFiles.get(file.url);

              return (
                <div
                  key={`uploaded-${index}`}
                  className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* File Preview */}
                  {isImage ? (
                    <div className="aspect-square w-full relative">
                      <img
                        src={file.url}
                        alt={fileName}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                  ) : (
                    <div className="aspect-square w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                      {getFileIcon(fileName, file.type)}
                      <div className="mt-2 text-center">
                        <p className="text-xs text-gray-500 font-medium truncate w-full px-2">
                          {fileName.split(".").pop()?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* File Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p
                      className="text-white text-xs font-medium truncate"
                      title={fileName}
                    >
                      {fileName}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={() => handleRemove(file.url)}
                      disabled={isRemoving}
                      className="p-1.5 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove file"
                    >
                      {isRemoving ? (
                        <CgSpinner className="animate-spin" size={14} />
                      ) : (
                        <FiTrash size={14} />
                      )}
                    </button>
                  </div>

                  {/* Loading Overlay */}
                  {isRemoving && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <CgSpinner
                        className="animate-spin text-white"
                        size={20}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {uploadedFiles.length === 0 && uploadingFiles.length === 0 && (
        <div className="mt-4 text-center py-8">
          <FiFile className="mx-auto text-gray-300" size={48} />
          <p className="text-gray-500 text-sm mt-2">No files uploaded yet</p>
          <p className="text-gray-400 text-xs mt-1">
            Files you upload will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default CloudFileUpload;
