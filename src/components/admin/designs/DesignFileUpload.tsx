"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FiUploadCloud, FiFile, FiTrash2, FiLoader } from "react-icons/fi";

import DragAndDrop from "./DragAndDrop";

export default function DesignFileUpload({ design, onUploadComplete }) {
  const [files, setFiles] = useState({}); // For new file uploads
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFileToUpdate, setSelectedFileToUpdate] = useState(null); // State to track which file is being updated
  const [fileToUpdateData, setFileToUpdateData] = useState(null); // Holds the actual file object for version upload

  const themes = {
    CAD: {
      gradient: "from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-900/20",
      iconBg: "bg-gradient-to-br from-blue-400 to-blue-600",
      iconColor: "text-white",
      button: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    },
    PDF: {
      gradient: "from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-900/20",
      iconBg: "bg-gradient-to-br from-red-400 to-red-600",
      iconColor: "text-white",
      button: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
    },
    IMAGE: {
      gradient: "from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-900/20",
      iconBg: "bg-gradient-to-br from-purple-400 to-purple-600",
      iconColor: "text-white",
      button: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    },
    FLOOR_PLAN: {
      gradient: "from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-900/20",
      iconBg: "bg-gradient-to-br from-green-400 to-green-600",
      iconColor: "text-white",
      button: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    },
  };

  const handleDrop = (fileType, acceptedFiles) => {
    setFiles({ ...files, [fileType]: acceptedFiles[0] });
  };

  const handleUpload = async (fileType) => {
    const file = files[fileType];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // 1. Get signed URL
      const signedUrlResponse = await fetch("/api/designs/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type, fileTypeCategory: fileType }),
      });

      if (!signedUrlResponse.ok) {
        throw new Error("Failed to get signed URL");
      }

      const { signedUrl } = await signedUrlResponse.json();
      const publicUrl = signedUrl.split("?")[0];


      // 2. Upload file to DO Spaces
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.setRequestHeader("x-amz-acl", "public-read");
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(percentComplete);
        }
      };
      xhr.onload = async () => {
        if (xhr.status === 200) {
          // 3. Save file URL to database
          await fetch(`/api/designs/${design.id}/files`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileUrl: publicUrl, fileType: fileType, originalFileName: file.name }),
          });
          onUploadComplete();
          setFiles({ ...files, [fileType]: null });
        } else {
          console.error("Upload failed.");
        }
        setUploading(false);
      };
      xhr.onerror = () => {
        console.error("Upload failed.");
        setUploading(false);
      };
      xhr.send(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  };

  const handleVersionUpload = async () => {
    const fileToUpdate = selectedFileToUpdate;
    const newFile = fileToUpdateData;

    if (!fileToUpdate || !newFile) return;

    setUploading(true);
    setProgress(0);

    try {
      // 1. Get signed URL for version upload
      const signedUrlResponse = await fetch(`/api/designs/${design.id}/files/version`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileIdentifier: fileToUpdate.fileIdentifier,
          fileName: newFile.name,
          fileType: newFile.type,
          fileTypeCategory: fileToUpdate.type,
          originalFileName: newFile.name,
        }),
      });

      if (!signedUrlResponse.ok) {
        throw new Error("Failed to get signed URL for version upload");
      }

      const { signedUrl } = await signedUrlResponse.json();

      // 2. Upload new file version to DO Spaces
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl, true);
      xhr.setRequestHeader("Content-Type", newFile.type);
      xhr.setRequestHeader("x-amz-acl", "public-read");
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(percentComplete);
        }
      };
      xhr.onload = async () => {
        if (xhr.status === 200) {
          onUploadComplete(); // Refresh parent component
          setSelectedFileToUpdate(null);
          setFileToUpdateData(null);
        } else {
          console.error("Version upload failed.");
        }
        setUploading(false);
      };
      xhr.onerror = () => {
        console.error("Version upload failed.");
        setUploading(false);
      };
      xhr.send(newFile);
    } catch (error) {
      console.error("Error uploading new file version:", error);
      setUploading(false);
    }
  };

  const renderFileUploadSection = (fileType, title, accept) => {
    const theme = themes[fileType];

    // Filter existing files for this fileType and only show the latest version
    const latestExistingFiles = design.files.filter(
      (file) => file.type === fileType && (file.isLatest === true || file.isLatest === null || file.isLatest === undefined) && file.fileIdentifier && file.originalFileName
    );

    return (
      <div className={`bg-gradient-to-br ${theme.gradient} rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg`}>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${theme.iconBg}`}>
              <FiFile className={`w-6 h-6 ${theme.iconColor}`} />
            </div>
            <h4 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h4>
          </div>

          {/* Section for uploading new files */}
          <div className="mt-6 border-b pb-4 mb-4 border-gray-200 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Upload New File</h5>
            <DragAndDrop onDrop={(acceptedFiles) => handleDrop(fileType, acceptedFiles)} accept={accept} />
            {files[fileType] && (
              <div className="mt-4 flex items-center justify-between bg-gray-50/50 dark:bg-gray-700/50 p-3 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-200">Selected file:</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{files[fileType].name}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setFiles({ ...files, [fileType]: null })}>
                  <FiTrash2 className="w-5 h-5 text-red-500" />
                </Button>
              </div>
            )}
            <div className="mt-6">
              <Button onClick={() => handleUpload(fileType)} disabled={!files[fileType] || uploading} className={`w-full ${theme.button} text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:scale-100`}>
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <FiLoader className="animate-spin mr-2" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FiUploadCloud className="mr-2" />
                    <span>Upload New {title}</span>
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Section for updating existing files */}
          {latestExistingFiles.length > 0 && (
            <div className="mt-6">
              <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Update Existing Files</h5>
              <div className="space-y-3">
                {latestExistingFiles.map((file) => (
                  <div key={file.id} className="bg-gray-100 dark:bg-gray-700/70 p-3 rounded-lg flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{file.originalFileName} (v{file.version})</p>
                    <Button size="sm" variant="outline" onClick={() => setSelectedFileToUpdate(file)} disabled={uploading}>
                      Upload New Version
                    </Button>
                  </div>
                ))}
              </div>

              {selectedFileToUpdate && selectedFileToUpdate.type === fileType && ( // Only show if selected file matches current section type
                <div className="mt-4 p-3 border border-dashed border-blue-400 rounded-lg">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Uploading new version for: {selectedFileToUpdate.originalFileName}</p>
                  <DragAndDrop onDrop={(acceptedFiles) => setFileToUpdateData(acceptedFiles[0])} accept={accept} />
                  {fileToUpdateData && (
                    <div className="mt-4 flex items-center justify-between bg-gray-50/50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-200">Selected new version:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{fileToUpdateData.name}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setFileToUpdateData(null)}>
                        <FiTrash2 className="w-5 h-5 text-red-500" />
                      </Button>
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button onClick={handleVersionUpload} disabled={!fileToUpdateData || uploading} className={`flex-grow ${theme.button} text-white font-bold py-2 px-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:scale-100`}>
                      {uploading ? (
                        <div className="flex items-center justify-center">
                          <FiLoader className="animate-spin mr-2" />
                          <span>Uploading Version...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <FiUploadCloud className="mr-2" />
                          <span>Confirm Version Upload</span>
                        </div>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => { setSelectedFileToUpdate(null); setFileToUpdateData(null); }} disabled={uploading} className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {uploading && (
            <div className="mt-4">
              <Progress value={progress} className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-3 rounded-full ${theme.button} transition-all duration-300`}
                  style={{ width: `${progress}%` }}
                ></div>
              </Progress>
              <p className="text-right text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{Math.round(progress)}%</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Manage Your Design Files</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderFileUploadSection("CAD", "CAD Files", ".dwg, .dxf, .step, .iges, .stl, .obj, .3mf")}
        {renderFileUploadSection("PDF", "PDF Files", ".pdf")}
        {renderFileUploadSection("IMAGE", "Images", "image/jpeg, image/png, image/gif, image/webp")}
        {renderFileUploadSection("FLOOR_PLAN", "Floor Plan Previews", ".pdf, image/jpeg, image/png, image/gif, image/webp")}
        </div>
    </div>
  );
}