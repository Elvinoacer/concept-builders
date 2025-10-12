"use client";

import { motion } from "framer-motion";

interface DesignsHeaderProps {
  activeTab: string;
  newfolder?: boolean;
  onNewDesignClick: () => void;
  onNewFolderClick: () => void;
  onManageCategoriesClick: () => void;
}

const DesignsHeader = ({
  activeTab,
  newfolder,
  onNewDesignClick,
  onNewFolderClick,
  onManageCategoriesClick,
}: DesignsHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-8 gap-4"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
        Designs
      </h2>
      <div className="flex gap-2">
        <button
          onClick={onManageCategoriesClick}
          className="flex items-center justify-center gap-2 rounded-md h-10 px-4 bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground text-sm font-medium shadow-sm hover:to-secondary/80 transition-colors"
        >
          <span className="material-symbols-outlined">category</span>
          <span>Manage Categories</span>
        </button>
        {newfolder && (
          <button
            onClick={onNewFolderClick}
            className="flex items-center justify-center gap-2 rounded-md h-10 px-4 bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground text-sm font-medium shadow-sm hover:to-secondary/80 transition-colors"
          >
            <span className="material-symbols-outlined">create_new_folder</span>
            <span>Create Folder</span>
          </button>
        )}
        <button
          onClick={onNewDesignClick}
          className="flex items-center justify-center gap-2 rounded-md h-10 px-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-sm font-medium shadow-sm hover:to-primary/80 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          <span>New Design</span>
        </button>
      </div>
    </motion.div>
  );
};

export default DesignsHeader;
