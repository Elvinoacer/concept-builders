
"use client";


import { motion } from "framer-motion";
import Pagination from "./Pagination";

const ContentTable = ({ blogPostsData }) => {
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
            {blogPostsData && blogPostsData.length > 0 ? (
              blogPostsData.map((post, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="hover:bg-muted/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          className="h-10 w-10 rounded-full object-cover"
                          src={post.image || "/images/default-post.png"}
                          alt={post.title}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">
                          {post.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary hover:text-primary-dark">
                      Edit
                    </button>
                    <button className="text-destructive hover:text-destructive-dark ml-4">
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-24 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-4">
                    <svg
                      className="w-16 h-16 text-muted-foreground/50"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <h3 className="text-xl font-semibold">No Blog Posts Yet</h3>
                    <p className="text-sm">
                      It looks like there are no blog posts. Get started by creating one.
                    </p>
                    <a href="/admin/content/import" className="mt-4 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-lg">
                      Create a New Post
                    </a>
                  </div>
                </td>
              </tr>
            )}
              
            
          </tbody>
        </table>
      </div>
      <Pagination />
    </motion.div>
  );
};

export default ContentTable;
