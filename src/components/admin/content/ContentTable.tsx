
"use client";

import { blogPostsData } from "@/lib/dummydata";
import { motion } from "framer-motion";
import Pagination from "./Pagination";

const ContentTable = () => {
  const getStatusChip = (status: string) => {
    switch (status) {
      case "Published":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            {status}
          </span>
        );
      case "Draft":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="mb-4 md:mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <svg
              fill="currentColor"
              height="20"
              viewBox="0 0 256 256"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
            </svg>
          </div>
          <input
            className="form-input w-full pl-10 pr-4 py-2.5 rounded-md border-input focus:ring-primary focus:border-primary bg-background placeholder:text-muted-foreground text-sm"
            placeholder="Search blog posts..."
            type="text"
          />
        </div>
      </div>
      <div className="bg-card rounded-lg shadow-sm border border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left text-muted-foreground">
              <th className="px-3 py-2 md:px-6 md:py-3 font-medium">Title</th>
              <th className="px-3 py-2 md:px-6 md:py-3 font-medium">Author</th>
              <th className="px-3 py-2 md:px-6 md:py-3 font-medium">Status</th>
              <th className="px-3 py-2 md:px-6 md:py-3 font-medium">Published Date</th>
              <th className="px-3 py-2 md:px-6 md:py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {blogPostsData.map((post, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="hover:bg-muted"
              >
                <td className="px-3 py-2 md:px-6 md:py-4 text-foreground font-medium">
                  {post.title}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4 text-muted-foreground">{post.author}</td>
                <td className="px-3 py-2 md:px-6 md:py-4">{getStatusChip(post.status)}</td>
                <td className="px-3 py-2 md:px-6 md:py-4 text-muted-foreground">
                  {post.publishedDate}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4 text-right">
                  <a
                    href="#"
                    className="font-medium text-primary hover:text-primary-dark"
                  >
                    Edit
                  </a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination />
    </motion.div>
  );
};

export default ContentTable;
