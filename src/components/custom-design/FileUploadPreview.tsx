"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FileUploadPreviewProps {
  files: File[];
  onRemove: (file: File) => void;
}

const FileUploadPreview: React.FC<FileUploadPreviewProps> = ({
  files,
  onRemove,
}) => {
  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="w-full h-full object-cover"
        />
      );
    } else {
      return (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {file.name.split(".").pop()?.toUpperCase()}
          </p>
        </div>
      );
    }
  };

  return (
    <div className="mt-4 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
      {files.map((file, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {getFilePreview(file)}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="icon"
                variant="destructive"
                className="w-7 h-7 sm:w-8 sm:h-8"
                onClick={() => onRemove(file)}
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 truncate px-1">
            {file.name.length > 20
              ? `${file.name.substring(0, 15)}...${file.name.split(".").pop()}`
              : file.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 px-1">
            {(file.size / (1024 * 1024)).toFixed(1)}MB
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default FileUploadPreview;
