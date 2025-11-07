"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFolder, FiX, FiPlus } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

interface CreateFolderModalProps {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onCreateFolder: (folderName: string) => void;
}

const CreateFolderModal = ({
  loading,
  isOpen,
  onClose,
  onCreateFolder,
}: CreateFolderModalProps) => {
  const [folderName, setFolderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFolderName("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!folderName.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreateFolder(folderName.trim());
      setFolderName("");
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md"
          >
            <div
              className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden"
              onKeyDown={handleKeyDown}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <FiFolder size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold leading-tight">
                        Create New Folder
                      </h2>
                      <p className="text-blue-100 text-sm mt-1">
                        Organize your designs with folders
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                    disabled={isSubmitting || loading}
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="folderName"
                      className="block text-sm font-medium text-foreground"
                    >
                      Folder Name
                    </label>
                    <div className="relative">
                      <input
                        id="folderName"
                        type="text"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        placeholder="e.g., Residential Projects, Modern Designs..."
                        className="w-full px-4 py-3 pl-11 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200 text-base"
                        required
                        minLength={1}
                        maxLength={100}
                        disabled={isSubmitting || loading}
                        autoFocus
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiFolder className="text-muted-foreground" size={18} />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {folderName.length}/100 characters
                    </p>
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-900 mb-1 flex items-center gap-1">
                      <FiPlus size={14} />
                      Naming Tips
                    </h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Use descriptive names for easy organization</li>
                      <li>• Include project types or categories</li>
                      <li>• Keep it under 50 characters for best display</li>
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting || loading}
                    className="flex-1 px-4 py-3 text-base font-medium rounded-lg border border-border bg-background text-foreground hover:bg-muted/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-border disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!folderName.trim() || isSubmitting || loading}
                    className="flex-1 px-4 py-3 text-base font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting || loading ? (
                      <>
                        <CgSpinner className="animate-spin" size={18} />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FiPlus size={18} />
                        Create Folder
                      </>
                    )}
                  </button>
                </div>

                {/* Keyboard Shortcut Hint */}
                <div className="text-center mt-4">
                  <p className="text-xs text-muted-foreground">
                    Press{" "}
                    <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded">
                      Ctrl/Cmd + Enter
                    </kbd>{" "}
                    to save quickly
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateFolderModal;
