
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const ContentHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">Content Management</h1>
      <Link href="/admin/content/editor">
        <button className="flex items-center justify-center gap-2 h-10 px-5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-sm font-bold leading-normal tracking-wide rounded-md hover:to-primary/80 transition-colors">
          <svg
            className="bi bi-plus-lg"
            fill="currentColor"
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
              fillRule="evenodd"
            ></path>
          </svg>
          <span>New Blog Post</span>
        </button>
      </Link>
    </motion.header>
  );
};

export default ContentHeader;
