"use client";

import { useState, useEffect } from "react";
import DesignsHeader from "@/components/admin/designs/DesignsHeader";
import DesignsTable from "@/components/admin/designs/DesignsTable";
import DesignsTabs from "@/components/admin/designs/DesignsTabs";
import FoldersPage from "@/components/admin/designs/FoldersPage";
import NewDesignForm from "@/components/admin/designs/NewDesignForm";
import CreateFolderModal from "@/components/admin/designs/CreateFolderModal";
import CategoriesModal from "@/components/admin/designs/CategoriesModal";
import RenameFolderModal from "@/components/admin/designs/RenameFolderModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const DesignsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isFormOpen, setFormOpen] = useState(false);
  const [isFolderModalOpen, setFolderModalOpen] = useState(false);
  const [isCategoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renamingFolder, setRenamingFolder] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [editingDesign, setEditingDesign] = useState<unknown>(null);
  const [designsRefreshKey, setDesignsRefreshKey] = useState(0);

  const handleOpenRenameModal = (folder: { id: string; name: string }) => {
    setRenamingFolder(folder);
    setIsRenameModalOpen(true);
  };

  const fetchFolders = async () => {
    try {
      setError(null);
      setLoadingFolders(true);
      const response = await fetch("/api/designs/folders");

      if (!response.ok) {
        throw new Error(`Failed to fetch folders: ${response.status}`);
      }

      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error("Error fetching folders:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setLoadingFolders(false);
    }
  };

  useEffect(() => {
    if (activeTab === "folders") {
      fetchFolders();
    }
  }, [activeTab]);

  const handleCreateFolder = async (folderName: string) => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/designs/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: folderName }),
      });

      if (response.ok) {
        toast.success("Folder created successfully");
        await fetchFolders(); // Refresh the folder list
        setFolderModalOpen(false);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create folder");
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create folder",
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleRenameFolder = async (folderId: string, newName: string) => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/designs/folders/${folderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        toast.success("Folder renamed successfully");
        await fetchFolders(); // Refresh the folder list
        setIsRenameModalOpen(false);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to rename folder");
      }
    } catch (error) {
      console.error("Error renaming folder:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to rename folder",
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleEditClick = async (designId: string) => {
    try {
      const response = await fetch(`/api/designs/${designId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch design");
      }

      const design = await response.json();
      setEditingDesign(design);
      setFormOpen(true);
    } catch (error) {
      console.error("Error fetching design:", error);
      toast.error("Failed to load design for editing");
    }
  };

  const handleRefresh = async () => {
    if (activeTab === "folders") {
      await fetchFolders();
      toast.success("Folders refreshed");
    }
  };

  // Loading skeleton for folders
  const renderFoldersSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );

  // Error state for folders
  const renderFoldersError = () => (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-5 w-5" />
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="flex-1">{error}</span>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>

      <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="text-4xl mb-4">📁</div>
        <h3 className="text-lg font-semibold mb-2">Unable to Load Folders</h3>
        <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
          We are having trouble loading your design folders. Please check your
          connection and try again.
        </p>
        <Button
          onClick={handleRefresh}
          className="flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Folders
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Header Section */}
        <DesignsHeader
          activeTab={activeTab}
          newfolder={activeTab === "folders"}
          onTabChange={setActiveTab}
          onNewDesignClick={() => setFormOpen(true)}
          onNewFolderClick={() => setFolderModalOpen(true)}
          onManageCategoriesClick={() => setCategoriesModalOpen(true)}
        />

        {/* Tabs Section */}
        <DesignsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Section */}
        <div className="min-h-[400px]">
          {activeTab === "all" && (
            <DesignsTable
              onEditClick={handleEditClick}
              refreshKey={designsRefreshKey}
            />
          )}
          {activeTab === "folders" && (
            <div className="space-y-4">
              {/* Folders Header with Refresh */}
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Design Folders
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Organize your designs into folders for better management
                  </p>
                </div>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  disabled={refreshing}
                  className="flex items-center gap-2 w-full xs:w-auto"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </Button>
              </div>

              {/* Folders Content */}
              {loadingFolders ? (
                renderFoldersSkeleton()
              ) : error ? (
                renderFoldersError()
              ) : (
                <FoldersPage
                  folders={folders}
                  loading={loadingFolders}
                  onRefresh={handleRefresh}
                  onRename={handleOpenRenameModal}
                />
              )}

              {/* Empty State for Folders */}
              {!loadingFolders && !error && folders.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="text-4xl mb-4">📁</div>
                  <h3 className="text-lg font-semibold mb-2">No Folders Yet</h3>
                  <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
                    Get started by creating your first folder to organize your
                    designs.
                  </p>
                  <Button
                    onClick={() => setFolderModalOpen(true)}
                    className="flex items-center gap-2 mx-auto"
                  >
                    Create First Folder
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Floating Action Button */}
        <div className="fixed bottom-6 right-6 z-40 sm:hidden">
          <Button
            onClick={() => {
              if (activeTab === "all") {
                setFormOpen(true);
              } else {
                setFolderModalOpen(true);
              }
            }}
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span className="text-xl font-bold">+</span>
          </Button>
        </div>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <NewDesignForm
          onClose={() => {
            setFormOpen(false);
            setEditingDesign(null);
          }}
          designToEdit={editingDesign}
          onSuccess={() => {
            setFormOpen(false);
            setEditingDesign(null);
            setDesignsRefreshKey((prev) => prev + 1);
          }}
        />
      )}

      {isFolderModalOpen && (
        <CreateFolderModal
          isOpen={isFolderModalOpen}
          onClose={() => setFolderModalOpen(false)}
          onCreateFolder={handleCreateFolder}
          loading={refreshing}
        />
      )}

      {isCategoriesModalOpen && (
        <CategoriesModal
          isOpen={isCategoriesModalOpen}
          onClose={() => setCategoriesModalOpen(false)}
        />
      )}

      {isRenameModalOpen && (
        <RenameFolderModal
          isOpen={isRenameModalOpen}
          onClose={() => setIsRenameModalOpen(false)}
          onRenameFolder={handleRenameFolder}
          folder={renamingFolder}
          loading={refreshing}
        />
      )}
    </div>
  );
};

export default DesignsPage;
