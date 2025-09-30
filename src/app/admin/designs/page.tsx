"use client";

import { useState } from "react";
import DesignsHeader from "@/components/admin/designs/DesignsHeader";
import DesignsTable from "@/components/admin/designs/DesignsTable";
import DesignsTabs from "@/components/admin/designs/DesignsTabs";
import FoldersPage from "@/components/admin/designs/FoldersPage";
import NewDesignForm from "@/components/admin/designs/NewDesignForm";
import CreateFolderModal from "@/components/admin/designs/CreateFolderModal";

const DesignsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isFormOpen, setFormOpen] = useState(false);
  const [isFolderModalOpen, setFolderModalOpen] = useState(false);

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
        // You might want to refresh the folder list here
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
        onNewDesignClick={() => setFormOpen(true)} 
        onNewFolderClick={() => setFolderModalOpen(true)} 
      />
      <DesignsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "all" ? <DesignsTable /> : <FoldersPage />}
      {isFormOpen && <NewDesignForm onClose={() => setFormOpen(false)} />}
      <CreateFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
};

export default DesignsPage;