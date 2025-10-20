
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FileUploadPreviewProps {
  files: File[];
  onRemove: (file: File) => void;
}

const FileUploadPreview: React.FC<FileUploadPreviewProps> = ({ files, onRemove }) => {
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
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {file.name.split(".").pop()}
          </p>
        </div>
      );
    }
  };

  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {files.map((file, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {getFilePreview(file)}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="destructive"
                className="w-8 h-8"
                onClick={() => onRemove(file)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
            {file.name}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default FileUploadPreview;
