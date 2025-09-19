
"use client";

import { motion } from "framer-motion";

const ContentTabs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-6"
    >
      <div className="flex border-b border-border">
        <a
          href="#"
          className="flex items-center justify-center border-b-2 border-primary text-primary py-3 px-4"
        >
          <p className="text-sm font-semibold">Blog Posts</p>
        </a>
        <a
          href="#"
          className="flex items-center justify-center border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-border py-3 px-4"
        >
          <p className="text-sm font-medium">Static Pages</p>
        </a>
        <a
          href="#"
          className="flex items-center justify-center border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-border py-3 px-4"
        >
          <p className="text-sm font-medium">Policy Pages</p>
        </a>
      </div>
    </motion.div>
  );
};

export default ContentTabs;
