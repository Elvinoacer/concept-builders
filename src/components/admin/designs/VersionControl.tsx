import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FiActivity, FiClock, FiDownload, FiEye, FiFile } from "react-icons/fi";

interface File {
  id: string;
  url: string;
  type: string;
  version: number;
  isLatest: boolean;
  name: string;
  fileIdentifier: string;
  createdAt: string;
  size?: number;
  fileType?: string;
}

interface VersionControlProps {
  designId: string;
}

const VersionControl = ({ designId }: VersionControlProps) => {
  const [paginatedFiles, setPaginatedFiles] = useState<File[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set()
  );
  const filesPerPage = 8;

  const fetchFiles = useCallback(async () => {
    if (!designId) return;
    setIsLoadingFiles(true);
    try {
      const response = await fetch(
        `/api/designs/${designId}/files?page=${currentPage}&limit=${filesPerPage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch design files");
      }
      const data = await response.json();
      setPaginatedFiles(data.files || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching design files:", error);
      setPaginatedFiles([]);
    } finally {
      setIsLoadingFiles(false);
    }
  }, [designId, currentPage, filesPerPage]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const truncateFileName = (name: string, length = 25) => {
    if (!name) return "Unnamed File";
    const decodedName = decodeURIComponent(name);
    if (decodedName.length <= length) return decodedName;
    return `${decodedName.substring(0, length - 3)}...`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (fileType?: string) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return "📄";
      case "image":
        return "🖼️";
      case "cad":
        return "📐";
      case "excel":
        return "📊";
      default:
        return "📎";
    }
  };

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
      link.download = decodeURIComponent(fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
              className="min-w-[2.5rem]"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
            className="min-w-[2.5rem]"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and neighbors
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
              className="min-w-[2.5rem]"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
            className="min-w-[2.5rem]"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="mt-6 sm:mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FiActivity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
              File Version History
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track and manage all file versions
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {paginatedFiles.length} files
        </Badge>
      </div>

      {/* Files Table/Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {isLoadingFiles ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <CgSpinner
                className="animate-spin text-blue-500 mx-auto mb-3"
                size={32}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading files...
              </p>
            </div>
          </div>
        ) : paginatedFiles.length === 0 ? (
          <div className="text-center py-12">
            <FiFile className="mx-auto w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No files found
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Upload files to see version history
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {paginatedFiles.map((file, index) => (
                      <motion.tr
                        key={file.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {getFileIcon(file.fileType)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p
                                className="text-sm font-medium text-gray-900 dark:text-white truncate"
                                title={decodeURIComponent(
                                  file.name ||
                                    file.url.split("/").pop() ||
                                    "Unnamed File"
                                )}
                              >
                                {truncateFileName(
                                  file.name ||
                                    file.url.split("/").pop() ||
                                    "Unnamed File"
                                )}
                              </p>
                              {file.size && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatFileSize(file.size)}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              v{file.version}
                            </span>
                            {file.isLatest && (
                              <Badge
                                variant="default"
                                className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              >
                                Latest
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <FiClock className="w-3 h-3" />
                            {formatDate(file.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              file.isLatest
                                ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-300"
                                : "border-gray-200 text-gray-700 dark:border-gray-600 dark:text-gray-300"
                            }`}
                          >
                            {file.isLatest ? "Active" : "Archived"}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                              >
                                <FiEye className="w-4 h-4" />
                                <span className="text-xs">View</span>
                              </a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDownload(
                                  file.url,
                                  file.name ||
                                    file.url.split("/").pop() ||
                                    "download",
                                  file.id
                                )
                              }
                              disabled={downloadingFiles.has(file.id)}
                              className="flex items-center gap-1 text-green-600 hover:text-green-700"
                            >
                              {downloadingFiles.has(file.id) ? (
                                <CgSpinner className="w-4 h-4 animate-spin" />
                              ) : (
                                <FiDownload className="w-4 h-4" />
                              )}
                              <span className="text-xs">Download</span>
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              <div className="p-4 space-y-4">
                <AnimatePresence>
                  {paginatedFiles.map((file, index) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600 p-4"
                    >
                      {/* File Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className="text-xl mt-1 flex-shrink-0">
                            {getFileIcon(file.fileType)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-sm font-medium text-gray-900 dark:text-white truncate"
                              title={decodeURIComponent(
                                file.name ||
                                  file.url.split("/").pop() ||
                                  "Unnamed File"
                              )}
                            >
                              {truncateFileName(
                                file.name ||
                                  file.url.split("/").pop() ||
                                  "Unnamed File",
                                35
                              )}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                v{file.version}
                              </span>
                              {file.isLatest && (
                                <Badge
                                  variant="default"
                                  className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                >
                                  Latest
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs flex-shrink-0 ${
                            file.isLatest
                              ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-300"
                              : "border-gray-200 text-gray-700 dark:border-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {file.isLatest ? "Active" : "Archived"}
                        </Badge>
                      </div>

                      {/* File Details */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            <span>
                              {new Date(file.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {file.size && (
                            <span>{formatFileSize(file.size)}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1 h-9"
                        >
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 justify-center"
                          >
                            <FiEye className="w-4 h-4" />
                            <span>View</span>
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDownload(
                              file.url,
                              file.name ||
                                file.url.split("/").pop() ||
                                "download",
                              file.id
                            )
                          }
                          disabled={downloadingFiles.has(file.id)}
                          className="flex-1 h-9"
                        >
                          {downloadingFiles.has(file.id) ? (
                            <CgSpinner className="w-4 h-4 animate-spin" />
                          ) : (
                            <FiDownload className="w-4 h-4" />
                          )}
                          <span>Download</span>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <Pagination>
                <PaginationContent className="flex-wrap">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionControl;
