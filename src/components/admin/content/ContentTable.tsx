"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiCalendar,
  FiUser,
  FiFileText,
} from "react-icons/fi";
import { useState } from "react";

const ContentTable = ({ blogPostsData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const getStatusChip = (status: string) => {
    switch (status) {
      case "Published":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
            {status}
          </span>
        );
      case "Draft":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
            {status}
          </span>
        );
      case "Scheduled":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  // Filter posts based on search
  const filteredPosts =
    blogPostsData?.filter(
      (post) =>
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
        <input
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border border-input bg-background placeholder:text-muted-foreground text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
          placeholder="Search blog posts by title or author..."
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Mobile Cards View */}
      <div className="lg:hidden space-y-3">
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map((post, index) => (
            <motion.div
              key={post.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                {/* Post Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={post.image || "/images/default-post.png"}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-tight">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {getStatusChip(post.status)}
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <FiUser className="w-3 h-3" />
                      <span className="truncate">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                        <FiEdit className="w-3 h-3" />
                        Edit
                      </button>
                      <button className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors">
                        <FiTrash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                    <button className="p-1 hover:bg-muted rounded transition-colors">
                      <FiMoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <EmptyState searchQuery={searchQuery} />
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Post
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Author
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 py-3 font-medium text-right whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedPosts.length > 0 ? (
                paginatedPosts.map((post, index) => (
                  <motion.tr
                    key={post.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={post.image || "/images/default-post.png"}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground truncate max-w-[200px]">
                            {post.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {post.author}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusChip(post.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8">
                    <EmptyState searchQuery={searchQuery} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredPosts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPosts.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </motion.div>
  );
};

// Empty State Component
const EmptyState = ({ searchQuery }) => (
  <div className="text-center py-8 sm:py-12">
    <div className="flex justify-center mb-4">
      <div className="p-4 bg-muted rounded-full">
        <FiFileText className="w-8 h-8 text-muted-foreground" />
      </div>
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">
      {searchQuery ? "No matching posts found" : "No blog posts yet"}
    </h3>
    <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
      {searchQuery
        ? "Try adjusting your search terms to find what you're looking for."
        : "Get started by creating your first blog post to engage your audience."}
    </p>
    {!searchQuery && (
      <a
        href="/admin/content/editor"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <FiEdit className="w-4 h-4" />
        Create Your First Post
      </a>
    )}
  </div>
);

// Enhanced Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages =
      typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6"
    >
      {/* Items Count */}
      <p className="text-sm text-muted-foreground order-2 sm:order-1">
        Showing {startItem} to {endItem} of {totalItems} results
      </p>

      {/* Page Navigation */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
            <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
          </svg>
        </button>

        {/* Page Numbers */}
        {getVisiblePages().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default ContentTable;
