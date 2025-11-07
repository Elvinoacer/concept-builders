"use client";

import DesignsList from "@/components/admin/designs/DesignsList";
import NewDesignForm from "@/components/admin/designs/NewDesignForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import {
  FiArrowLeft,
  FiEdit3,
  FiFolder,
  FiPlus,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "sonner";

interface Folder {
  id: string;
  name: string;
  description?: string;
  designs: any[];
  _count?: {
    designs: number;
  };
  createdAt: string;
  updatedAt: string;
}

const FolderPage = () => {
  const [folder, setFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { folderId } = params;

  const fetchFolder = useCallback(async () => {
    if (folderId) {
      try {
        const response = await fetch(`/api/designs/folders/${folderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch folder");
        }
        const data = await response.json();
        setFolder(data);
      } catch (error) {
        console.error("Error fetching folder:", error);
        toast.error("Failed to load folder");
      }
    }
  }, [folderId]);

  const refreshFolder = async () => {
    setRefreshing(true);
    await fetchFolder();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFolder().finally(() => setLoading(false));
  }, [fetchFolder]);

  const handleDesignAdded = () => {
    setFormOpen(false);
    refreshFolder();
    toast.success("Design added to folder successfully");
  };

  const handleDeleteFolder = async () => {
    if (!folder) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/designs/folders/${folderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete folder");
      }

      toast.success(`Folder "${folder.name}" deleted successfully`);
      router.push("/admin/designs");
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast.error("Failed to delete folder");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleEditFolder = () => {
    // Implement folder editing logic here
    toast.info("Folder editing feature coming soon");
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <CgSpinner
            className="animate-spin text-blue-500 mx-auto mb-4"
            size={32}
          />
          <p className="text-gray-600 dark:text-gray-400">Loading folder...</p>
        </div>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <FiFolder className="mx-auto w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Folder Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The folder you're looking for doesn't exist or you don't have access
            to it.
          </p>
          <Button onClick={() => router.push("/admin/designs")}>
            <FiArrowLeft className="mr-2" />
            Back to Designs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/admin/designs")}
                className="h-10 w-10 flex-shrink-0"
              >
                <FiArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                  <FiFolder className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
                    {folder.name}
                  </h1>
                  {folder.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1 truncate">
                      {folder.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="secondary" className="text-sm">
                {folder.designs?.length || 0} designs
              </Badge>
            </div>
          </div>

          {/* Folder Actions and Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FiFolder className="w-4 h-4" />
                <span>Folder</span>
              </div>
              <span>•</span>
              <div>
                Created {new Date(folder.createdAt).toLocaleDateString()}
              </div>
              {folder.updatedAt && (
                <>
                  <span>•</span>
                  <div>
                    Updated {new Date(folder.updatedAt).toLocaleDateString()}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshFolder}
                disabled={refreshing}
                className="h-9"
              >
                {refreshing ? (
                  <CgSpinner className="w-4 h-4 animate-spin" />
                ) : (
                  <FiRefreshCw className="w-4 h-4" />
                )}
                <span className="hidden xs:inline ml-2">Refresh</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleEditFolder}
                className="h-9"
              >
                <FiEdit3 className="w-4 h-4" />
                <span className="hidden xs:inline ml-2">Edit</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <FiTrash2 className="w-4 h-4" />
                <span className="hidden xs:inline ml-2">Delete</span>
              </Button>

              <Button onClick={() => setFormOpen(true)} className="h-9">
                <FiPlus className="w-4 h-4" />
                <span className="hidden xs:inline ml-2">New Design</span>
                <span className="xs:hidden">Add</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Designs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {folder.designs && folder.designs.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Designs in this Folder
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {folder.designs.length} design
                  {folder.designs.length !== 1 ? "s" : ""}
                </p>
              </div>
              <DesignsList
                designs={folder.designs}
                onDesignUpdate={refreshFolder}
              />
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
              <FiFolder className="mx-auto w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Designs Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                This folder is empty. Start by adding your first design to
                organize your projects.
              </p>
              <Button onClick={() => setFormOpen(true)} size="lg">
                <FiPlus className="mr-2 w-5 h-5" />
                Add First Design
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {/* New Design Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <NewDesignForm
            onClose={() => setFormOpen(false)}
            folderId={folderId as string}
            onSuccess={handleDesignAdded}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <FiTrash2 className="w-5 h-5 text-red-500" />
              Delete Folder?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Are you sure you want to delete the folder{" "}
                <strong>"{folder.name}"</strong>?
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Note:</strong> {folder.designs?.length || 0} design
                  {folder.designs?.length !== 1 ? "s" : ""} in this folder will
                  be moved to uncategorized.
                </p>
              </div>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFolder}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <CgSpinner className="animate-spin mr-2 w-4 h-4" />
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 className="mr-2 w-4 h-4" />
                  Delete Folder
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FolderPage;
