import { motion } from "framer-motion";
import { FiDownload, FiEye } from "react-icons/fi"; // Import icons
import { useState, useEffect, useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CgSpinner } from "react-icons/cg";

interface File {
  id: string;
  url: string;
  type: string;
  version: number;
  isLatest: boolean;
  originalFileName: string;
  fileIdentifier: string;
  createdAt: string; // Assuming createdAt is a string from the API
}

interface VersionControlProps {
  designId: string;
}

const VersionControl = ({ designId }: VersionControlProps) => {
  const [paginatedFiles, setPaginatedFiles] = useState<File[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const filesPerPage = 10; // Define how many files per page

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
      setPaginatedFiles(data.files);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching design files:", error);
    } finally {
      setIsLoadingFiles(false);
    }
  }, [designId, currentPage, filesPerPage]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const truncateFileName = (name: string, length = 30) => {
    if (name.length <= length) return name;
    return `${name.substring(0, length / 2)}...${name.substring(name.length - length / 2)}`;
  };

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-4">
        File Versions
      </h2>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        {isLoadingFiles ? (
          <div className="flex items-center justify-center h-24">
            <CgSpinner className="animate-spin text-primary" size={32} />
          </div>
        ) : paginatedFiles.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">
            No files found for this design.
          </div>
        ) : (
          <table className="w-full min-w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-muted-foreground uppercase bg-muted">
              <tr>
                <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
                  File Name
                </th>
                <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
                  Version
                </th>
                <th scope="col" className="hidden md:table-cell px-2 py-2 md:px-4 md:py-3 sm:px-6">
                  Uploaded Date
                </th>
                <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
                  Status
                </th>
                <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedFiles.map((file, index) => (
                <motion.tr
                  key={file.id} // Use file.id as key
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border-b border-border hover:bg-muted"
                >
                  <th
                    scope="row"
                    className="px-2 py-2 md:px-4 md:py-4 sm:px-6 font-medium text-foreground whitespace-nowrap"
                  >
                    <span title={decodeURIComponent(file.originalFileName || file.url.split('/').pop() || '')}>
                      {truncateFileName(decodeURIComponent(file.originalFileName || file.url.split('/').pop() || ''))}
                    </span>
                  </th>
                  <td className="px-2 py-2 md:px-4 md:py-4 sm:px-6 whitespace-nowrap">
                    v{file.version} {file.isLatest && <span className="text-xs text-green-500">(Latest)</span>}
                  </td>
                  <td className="hidden md:table-cell px-2 py-2 md:px-4 md:py-4 sm:px-6 whitespace-nowrap">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-2 md:px-4 md:py-4 sm:px-6 whitespace-nowrap">
                    {file.isLatest ? "Active" : "Archived"}
                  </td>
                  <td className="px-2 py-2 md:px-4 md:py-4 sm:px-6 text-right">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline whitespace-nowrap mr-2"
                    >
                      <FiEye className="inline-block w-4 h-4 mr-1" /> View
                    </a>
                    <button
                      onClick={() => handleDownload(file.url, decodeURIComponent(file.originalFileName || file.url.split('/').pop() || ''))}
                      className="font-medium text-green-500 hover:underline whitespace-nowrap"
                    >
                      <FiDownload className="inline-block w-4 h-4 mr-1" /> Download
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {totalPages > 1 && (
        <div className="p-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default VersionControl;