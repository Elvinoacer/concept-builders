"use client";

import { useState, useEffect } from "react";
import DesignsHeader from "@/components/admin/designs/DesignsHeader";
import DesignsTable from "@/components/admin/designs/DesignsTable";
import DesignsTabs from "@/components/admin/designs/DesignsTabs";
import FoldersPage from "@/components/admin/designs/FoldersPage";
import NewDesignForm from "@/components/admin/designs/NewDesignForm";
import CreateFolderModal from "@/components/admin/designs/CreateFolderModal";
import CategoriesModal from "@/components/admin/designs/CategoriesModal";

const DesignsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isFormOpen, setFormOpen] = useState(false);
  const [isFolderModalOpen, setFolderModalOpen] = useState(false);
  const [isCategoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [loadingFolders, setLoadingFolders] = useState(true);

  const fetchFolders = async () => {
    try {
      setLoadingFolders(true);
      const response = await fetch("/api/designs/folders");
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error("Error fetching folders:", error);
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
      const response = await fetch("/api/designs/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: folderName }),
      });

      if (response.ok) {
        console.log("Folder created successfully");
        fetchFolders(); // Refresh the folder list
      } else {
        console.error("Error creating folder:", await response.text());
      }
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      <DesignsHeader
        activeTab={activeTab}
        newfolder={activeTab === "folders"}
        onNewDesignClick={() => setFormOpen(true)}
        onNewFolderClick={() => setFolderModalOpen(true)}
        onManageCategoriesClick={() => setCategoriesModalOpen(true)}
      />
      <DesignsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "all" ? (
        <DesignsTable />
      ) : (
        <FoldersPage folders={folders} loading={loadingFolders} />
      )}
      {isFormOpen && <NewDesignForm onClose={() => setFormOpen(false)} />}
      <CreateFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />
      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setCategoriesModalOpen(false)}
      />
    </div>
  );
};

export default DesignsPage;
