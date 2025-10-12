"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import DesignsList from "@/components/admin/designs/DesignsList";
import DesignsHeader from "@/components/admin/designs/DesignsHeader";
import NewDesignForm from "@/components/admin/designs/NewDesignForm";

const FolderPage = () => {
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setFormOpen] = useState(false);
  const params = useParams();
  const { folderId } = params;

  const fetchFolder = useCallback(async () => {
    if (folderId) {
      setLoading(true);
      try {
        const response = await fetch(`/api/designs/folders/${folderId}`);
        const data = await response.json();
        setFolder(data);
      } catch (error) {
        console.error("Error fetching folder:", error);
      }
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    fetchFolder();
  }, [fetchFolder]);

  const handleDesignAdded = () => {
    setFormOpen(false);
    fetchFolder();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!folder) {
    return <div>Folder not found</div>;
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <DesignsHeader activeTab="all" onNewDesignClick={() => setFormOpen(true)} />
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{folder.name}</h2>
      <DesignsList designs={folder.designs} />
      {isFormOpen && (
        <NewDesignForm
          onClose={() => setFormOpen(false)}
          folderId={folderId}
          onDesignAdded={handleDesignAdded}
        />
      )}
    </div>
  );
};

export default FolderPage;