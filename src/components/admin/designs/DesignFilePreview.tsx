"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import {
  FaFileExcel,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";
import {
  FiArchive,
  FiCode,
  FiDownload,
  FiEye,
  FiFile,
  FiFolder,
  FiImage,
  FiMusic,
  FiTrash,
  FiVideo,
} from "react-icons/fi";
import { toast } from "sonner";

interface File {
  id: string;
  url: string;
  type: string;
  originalFileName: string;
  name?: string;
  size?: number;
  uploadedAt?: string;
}

interface DesignFilePreviewProps {
  designId: string;
}

const getFileIcon = (fileName: string, fileType?: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  const isImage = fileType === "IMAGE" || [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "svg",
    "webp",
    "bmp",
    "tiff",
  ].includes(extension);

  if (isImage)
    return <FiImage className="w-6 h-6 text-blue-500 flex-shrink-0" />;
  if (extension === "pdf")
    return <FaFilePdf className="w-6 h-6 text-red-500 flex-shrink-0" />;
  if (["xls", "xlsx", "csv"].includes(extension))
    return <FaFileExcel className="w-6 h-6 text-green-500 flex-shrink-0" />;
  if (["doc", "docx"].includes(extension))
    return <FaFileWord className="w-6 h-6 text-blue-600 flex-shrink-0" />;
  if (["ppt", "pptx"].includes(extension))
    return (
      <FaFilePowerpoint className="w-6 h-6 text-orange-500 flex-shrink-0" />
    );
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension))
    return <FiArchive className="w-6 h-6 text-yellow-500 flex-shrink-0" />;
  if (["mp4", "avi", "mov", "wmv", "flv"].includes(extension))
    return <FiVideo className="w-6 h-6 text-purple-500 flex-shrink-0" />;
  if (["mp3", "wav", "aac", "flac"].includes(extension))
    return <FiMusic className="w-6 h-6 text-pink-500 flex-shrink-0" />;
  if (["js", "ts", "jsx", "tsx", "html", "css", "json"].includes(extension))
    return <FiCode className="w-6 h-6 text-gray-600 flex-shrink-0" />;

  return <FiFile className="w-6 h-6 text-gray-500 flex-shrink-0" />;
};

const formatFileSize = (bytes?: number | null) => {
  if (bytes === undefined || bytes === null) return "Unknown Size";
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "Unknown date";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getFileTypeCategory = (fileType: string) => {
  const typeMap: Record<string, string> = {
    IMAGE: "Images",
    FLOOR_PLAN: "Floor Plans",
    PDF: "PDF Documents",
    CAD: "CAD Files",
    EXCEL: "Spreadsheets",
    FILE: "Other Files",
    VIDEO: "Videos",
    AUDIO: "Audio Files",
    ARCHIVE: "Archives",
  };
  return typeMap[fileType] || fileType;
};

const DesignFilePreview = ({ designId }: DesignFilePreviewProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set()
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/designs/${designId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch design files");
      }
      const data = await response.json();

      const allFiles = [
        ...(data.images || []).map((file: File) => ({
          ...file,
          type: "IMAGE",
        })),
        ...(data.floorPlans || []).map((file: File) => ({
          ...file,
          type: "FLOOR_PLAN",
        })),
        ...(data.files || []).map((file: File) => ({ ...file, type: "FILE" })),
        ...(data.architecturalDesign?.pdfFiles || []).map((file: File) => ({
          ...file,
          type: "PDF",
        })),
        ...(data.architecturalDesign?.cadFiles || []).map((file: File) => ({
          ...file,
          type: "CAD",
        })),
        ...(data.structuralDesign?.pdfFiles || []).map((file: File) => ({
          ...file,
          type: "PDF",
        })),
        ...(data.structuralDesign?.cadFiles || []).map((file: File) => ({
          ...file,
          type: "CAD",
        })),
        ...(data.billOfQuantities?.excelFiles || []).map((file: File) => ({
          ...file,
          type: "EXCEL",
        })),
      ];

      setFiles(allFiles);

      // Auto-expand categories with files
      const categories = new Set(allFiles.map((file) => file.type));
      setExpandedCategories(categories);
    } catch (error) {
      console.error("Error fetching design files:", error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (designId) {
      fetchFiles();
    }
  }, [designId]);

  const groupedFiles = files.reduce(
    (acc, file) => {
      const { type } = file;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(file);
      return acc;
    },
    {} as Record<string, File[]>
  );

  const handleDownload = async (
    url: string,
    fileName: string,
    fileId: string
  ) => {
    setDownloadingFiles((prev) => new Set(prev.add(fileId)));

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(objectUrl);
      toast.success(`Downloaded "${fileName}"`);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error(`Failed to download "${fileName}"`);
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    toast.warning(`Delete "${fileName}"?`, {
      description: "This file will be permanently removed from the design.",
      duration: 10000,
      action: {
        label: "Delete",
        onClick: async () => {
          setDeletingFiles((prev) => new Set(prev.add(fileId)));
          try {
            const response = await fetch("/api/designs/delete-file", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileId }),
            });

            if (response.ok) {
              toast.success(`"${fileName}" deleted successfully`);
              fetchFiles();
            } else {
              const errorText = await response.text();
              throw new Error(errorText || "Failed to delete file");
            }
          } catch (error: any) {
            console.error("Error deleting file:", error);
            toast.error(`Failed to delete "${fileName}"`);
          } finally {
            setDeletingFiles((prev) => {
              const newSet = new Set(prev);
              newSet.delete(fileId);
              return newSet;
            });
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const getTotalFilesCount = () => {
    return Object.values(groupedFiles).reduce(
      (total, files) => total + files.length,
      0
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <FiFolder className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            Files
          </h3>
          <div className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            <CgSpinner className="animate-spin text-gray-500" size={14} />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse"
            >
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-500 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <FiFolder className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
              Design Files
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getTotalFilesCount()} file{getTotalFilesCount() !== 1 ? "s" : ""}{" "}
              available
            </p>
          </div>
        </div>
        <button
          onClick={fetchFiles}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Refresh files"
        >
          <CgSpinner className="w-4 h-4" />
        </button>
      </div>

      {/* Files List */}
      <AnimatePresence>
        {Object.keys(groupedFiles).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedFiles).map(([type, filesInCategory]) => {
              const isExpanded = expandedCategories.has(type);
              const categoryName = getFileTypeCategory(type);

              return (
                <motion.div
                  key={type}
                  initial={false}
                  animate={{ opacity: 1 }}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(type)}
                    className="w-full p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`transform transition-transform ${isExpanded ? "rotate-90" : ""}`}
                      >
                        <FiFolder className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                          {categoryName}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {filesInCategory.length} file
                          {filesInCategory.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-400 dark:text-gray-500">
                      <svg
                        className={`w-4 h-4 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Files in Category */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-200 dark:border-gray-600"
                      >
                        <div className="p-2 space-y-2">
                          {filesInCategory.map((file) => {
                            const fileName =
                              file.name ||
                              file.originalFileName ||
                              (file.url ? decodeURIComponent(file.url.split("/").pop() || "Unknown File") : "Unknown File");
                            const isDeleting = deletingFiles.has(file.id);
                            const isDownloading = downloadingFiles.has(file.id);
                            const isImage = file.type === "IMAGE" || [
                              "png",
                              "jpg",
                              "jpeg",
                              "gif",
                              "svg",
                              "webp",
                              "bmp",
                            ].includes(
                              fileName.split(".").pop()?.toLowerCase() || ""
                            );

                            return (
                              <motion.div
                                key={file.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors group"
                              >
                                {/* File Icon/Preview */}
                                <div className="flex-shrink-0">
                                  {isImage ? (
                                    <img
                                      src={file.url}
                                      alt={fileName}
                                      className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                                      {getFileIcon(fileName, file.type)}
                                    </div>
                                  )}
                                </div>

                                {/* File Info */}
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="text-sm font-medium text-gray-800 dark:text-white truncate"
                                    title={fileName}
                                  >
                                    {fileName}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {formatFileSize(file.size)}
                                    </span>
                                    {file.uploadedAt && (
                                      <>
                                        <span className="text-gray-300 dark:text-gray-600">
                                          •
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {formatDate(file.uploadedAt)}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    title="Preview file"
                                  >
                                    <FiEye className="w-4 h-4" />
                                  </a>
                                  <button
                                    onClick={() =>
                                      handleDownload(
                                        file.url,
                                        fileName,
                                        file.id
                                      )
                                    }
                                    disabled={isDownloading}
                                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Download file"
                                  >
                                    {isDownloading ? (
                                      <CgSpinner className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <FiDownload className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteFile(file.id, fileName)
                                    }
                                    disabled={isDeleting}
                                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Delete file"
                                  >
                                    {isDeleting ? (
                                      <CgSpinner className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <FiTrash className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <FiFolder className="mx-auto w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No files uploaded yet
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Upload files to see them here
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesignFilePreview;
