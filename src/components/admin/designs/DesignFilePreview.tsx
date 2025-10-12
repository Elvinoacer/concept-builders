"use client";

import { useState, useEffect } from "react";
import { FiFile, FiImage, FiDownload, FiEye, FiTrash } from "react-icons/fi"; // Added FiTrash
import { FaFilePdf, FaFileArchive } from "react-icons/fa";
import { toast } from "sonner"; // Added toast


interface File {
  id: string;
  url: string;
  type: string;
  originalFileName: string;
}

interface DesignFilePreviewProps {
  designId: string;
}

const getFileIcon = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  if (extension === "pdf") return <FaFilePdf className="w-8 h-8 text-red-500" />;
  if (["zip", "rar", "7z"].includes(extension)) return <FaFileArchive className="w-8 h-8 text-yellow-500" />;
  if (["png", "jpg", "jpeg", "gif", "svg"].includes(extension)) return <FiImage className="w-8 h-8 text-blue-500" />;
  return <FiFile className="w-8 h-8 text-gray-500" />;
};

const DesignFilePreview = ({ designId }: DesignFilePreviewProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => { // Moved fetchFiles inside to be accessible by handleDeleteFile
    try {
      const response = await fetch(`/api/designs/${designId}`);
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error("Error fetching design files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (designId) {
      fetchFiles();
    }
  }, [designId]);

  const groupedFiles = files.reduce((acc, file) => {
    const { type } = file;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(file);
    return acc;
  }, {} as Record<string, File[]>);

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    toast.warning(`Are you sure you want to delete "${fileName}"?`, {
      description: "This action cannot be undone and will permanently remove the file.",
      action: {
        label: "Yes, Delete",
        onClick: async () => {
          try {
            const response = await fetch("/api/designs/delete-file", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileId }),
            });

            if (response.ok) {
              toast.success(`"${fileName}" deleted successfully.`);
              fetchFiles(); // Refresh the file list
            } else {
              console.error("Error deleting file:", await response.text());
              toast.error(`Error deleting "${fileName}".`);
            }
          } catch (error) {
            console.error("Error deleting file:", error);
            toast.error(`Error deleting "${fileName}".`);
          }
        },
      },
      cancel: {
        label: "No, Cancel",
      },
    });
  };

  if (loading) {
    return <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center">Loading files...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Files</h3>
      {Object.keys(groupedFiles).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedFiles).map(([type, filesInCategory]) => (
            <div key={type}>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{type}</h4>
              <div className="space-y-3">
                {(filesInCategory as File[]).map((file) => {
                  const fileName = file.originalFileName || decodeURIComponent(file.url.split("/").pop() || "");
                  return (
                    <div key={file.id} className="flex items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg transition-all hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        {['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(file.url.split('.').pop()?.toLowerCase() || '') ?
                          <img src={file.url} alt={fileName} className="w-10 h-10 rounded-md object-cover" /> :
                          getFileIcon(file.url)
                        }
                      </div>
                      <div className="flex-grow w-0 ml-4">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate" title={fileName}>
                          {fileName}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-4 flex items-center gap-2">
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                          <FiEye className="w-5 h-5" />
                        </a>
                        <button onClick={() => handleDownload(file.url, fileName)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors">
                          <FiDownload className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteFile(file.id, fileName)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                          <FiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No files uploaded yet.</p>
      )}
      
    </div>
  );
};

export default DesignFilePreview;
