
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiLoader } from "react-icons/fi";

const RenameFolderModal = ({
  isOpen,
  onClose,
  onRenameFolder,
  folder,
  loading,
}) => {
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    if (folder) {
      setFolderName(folder.name);
    }
  }, [folder]);

  const handleRename = () => {
    if (folderName.trim()) {
      onRenameFolder(folder.id, folderName.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
          <DialogDescription>
            Enter a new name for the folder "{folder?.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Folder name"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleRename} disabled={loading}>
            {loading ? (
              <FiLoader className="animate-spin mr-2" />
            ) : null}
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RenameFolderModal;
