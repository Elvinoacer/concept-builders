"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DesignsList from "@/components/admin/designs/DesignsList";

const FolderPage = () => {
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { folderId } = params;

  useEffect(() => {
    if (folderId) {
      const fetchFolder = async () => {
        try {
          const response = await fetch(`/api/designs/folders/${folderId}`);
          const data = await response.json();
          setFolder(data);
        } catch (error) {
          console.error("Error fetching folder:", error);
        }
        setLoading(false);
      };

      fetchFolder();
    }
  }, [folderId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!folder) {
    return <div>Folder not found</div>;
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{folder.name}</h2>
      <DesignsList designs={folder.designs} />
    </div>
  );
};

export default FolderPage;
