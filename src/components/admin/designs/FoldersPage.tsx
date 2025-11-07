"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

import {
  FiFolder,
  FiMoreVertical,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiFileText,
  FiChevronRight,
  FiFolderPlus,
} from "react-icons/fi";

const FoldersPage = ({ folders, loading, onRefresh }) => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center sm:text-left mb-6 sm:mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground"
        >
          Design Assets
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-2 text-sm sm:text-base max-w-2xl mx-auto sm:mx-0"
        >
          Organize and manage your design files with folders, upload to cloud
          storage, and maintain version control.
        </motion.p>
      </div>

      {/* Folder Structure */}
      <FolderStructure
        folders={folders}
        loading={loading}
        onRefresh={onRefresh}
      />
    </div>
  );
};

// Folder Structure Component
const FolderStructure = ({ folders, loading, onRefresh }) => {
  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: now.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const getFolderSize = (folder) => {
    const size = folder.size || 0;
    if (size === 0) return "Empty";
    if (size < 1024) return `${size} files`;
    if (size < 1048576) return `${Math.round(size / 1024)}K files`;
    return `${Math.round(size / 1048576)}M files`;
  };

  // Loading Skeleton
  const renderSkeleton = () => (
    <div className="space-y-3">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
            <div className="space-y-2 flex-1 min-w-0">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20 flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );

  // Empty State
  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl"
    >
      <FiFolderPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No folders yet
      </h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
        Create your first folder to start organizing your design assets and
        files.
      </p>
      <Button className="flex items-center gap-2 mx-auto">
        <FiFolderPlus className="w-4 h-4" />
        Create First Folder
      </Button>
    </motion.div>
  );

  // Mobile Folder Card
  const MobileFolderCard = ({ folder, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start gap-3">
        {/* Folder Icon */}
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex-shrink-0">
          <FiFolder className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground truncate text-sm leading-tight">
                {folder.name}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FiFileText className="w-3 h-3" />
                  <span>{getFolderSize(folder)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiCalendar className="w-3 h-3" />
                  <span>{formatDate(folder.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Mobile Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiMoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/admin/designs/folders/${folder.id}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FiEye className="w-4 h-4" />
                    View Folder
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <FiEdit className="w-4 h-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <Link href={`/admin/designs/folders/${folder.id}`}>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <FiEye className="w-3 h-3 mr-1" />
                Open
              </Button>
            </Link>

            {folder.isPublic && (
              <Badge variant="outline" className="text-xs">
                Public
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Desktop Table Row
  const DesktopTableRow = ({ folder, index }) => (
    <motion.tr
      key={folder.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 group"
    >
      {/* Folder Name with Icon */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex-shrink-0">
            <FiFolder className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-foreground truncate max-w-[200px]">
              {folder.name}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <span>{getFolderSize(folder)}</span>
              {folder.isPublic && (
                <Badge variant="outline" className="text-xs">
                  Public
                </Badge>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Last Modified - Hidden on mobile */}
      <td className="hidden lg:table-cell px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FiCalendar className="w-4 h-4" />
          <span>{formatDate(folder.updatedAt)}</span>
        </div>
      </td>

      {/* File Count - Hidden on smaller screens */}
      <td className="hidden md:table-cell px-4 py-4">
        <div className="text-sm text-muted-foreground">
          {folder.fileCount || 0} items
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-2">
          {/* Quick View Button */}
          <Link href={`/admin/designs/folders/${folder.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2"
            >
              <FiEye className="w-4 h-4" />
              <span>Open</span>
            </Button>
          </Link>

          {/* Desktop Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiMoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/designs/folders/${folder.id}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FiEye className="w-4 h-4" />
                  View Folder
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <FiEdit className="w-4 h-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                <FiTrash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile View Button */}
          <Link
            href={`/admin/designs/folders/${folder.id}`}
            className="sm:hidden"
          >
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <FiChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </td>
    </motion.tr>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 sm:mb-8"
    >
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Folder Structure
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {folders.length} folder{folders.length !== 1 ? "s" : ""} •{" "}
            {folders.reduce((acc, folder) => acc + (folder.fileCount || 0), 0)}{" "}
            total files
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderSkeleton()}
          </motion.div>
        ) : folders.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {renderEmptyState()}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3 sm:space-y-0"
          >
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
              {folders.map((folder, index) => (
                <MobileFolderCard
                  key={folder.id}
                  folder={folder}
                  index={index}
                />
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Folder
                    </th>
                    <th
                      scope="col"
                      className="hidden lg:table-cell px-4 py-3 font-medium"
                    >
                      Last Modified
                    </th>
                    <th
                      scope="col"
                      className="hidden md:table-cell px-4 py-3 font-medium"
                    >
                      Contents
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-medium text-right"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {folders.map((folder, index) => (
                    <DesktopTableRow
                      key={folder.id}
                      folder={folder}
                      index={index}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FoldersPage;
