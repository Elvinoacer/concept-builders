"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  FiFile,
  FiTrash,
  FiUpload,
  FiImage,
  FiFileText,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import { useUpload } from '@/contexts/UploadContext';


const MAX_UPLOAD_SIZE=2 * 1024 * 1024 * 1024;

interface FileUploadProps {
  onUploadSuccess: (
    file: { url: string; type: string; originalFileName: string; fileId: string }
  ) => void;
  onFileRemove: (fileUrl: string) => void;
  initialFiles: { url: string; type: string; name: string }[];
  fileTypeCategory: string;
  multiple?: boolean;
  accept?: string;
}

const FileUpload = ({
  onUploadSuccess,
  initialFiles = [],
  fileTypeCategory,
  multiple = false,
  accept,
  onFileRemove,
}: FileUploadProps) => {
  const { addUpload } = useUpload();
  const [uploadedFiles, setUploadedFiles] = useState(initialFiles);
  const [removingFiles, setRemovingFiles] = useState<Map<string, boolean>>(
    new Map()
  );

  useEffect(() => {
    setUploadedFiles(initialFiles);
  }, [initialFiles]);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach(({ file, errors }) => {
          errors.forEach((error: any) => {
            toast.error(`${file.name}: ${error.message}`);
          });
        });
      }

      if (!multiple && acceptedFiles.length > 1) {
        toast.error("Only one file is allowed");
        return;
      }

      for (const file of acceptedFiles) {
        await addUpload(file, fileTypeCategory, (newFile) => {
          onUploadSuccess(newFile);

        });
      }
    },
    [addUpload, fileTypeCategory, multiple, onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: accept ? { [accept]: [] } : undefined,
    maxSize: MAX_UPLOAD_SIZE, // 2GB max file size
  });

  const handleRemove = async (fileUrl: string) => {
    setRemovingFiles((prev) => new Map(prev.set(fileUrl, true)));
    try {
      await onFileRemove(fileUrl);
      setUploadedFiles((prev) => prev.filter((file) => file.url !== fileUrl));
      toast.success("File removed successfully");
    } catch (error) {
      toast.error("Failed to remove file");
    } finally {
      setRemovingFiles((prev) => {
        const newMap = new Map(prev);
        newMap.delete(fileUrl);
        return newMap;
      });
    }
  };

  const getFileIcon = (fileName: string) => {
    if (/\.(jpe?g|png|gif|bmp|webp)$/i.test(fileName)) {
      return <FiImage className="text-blue-500 flex-shrink-0" size={20} />;
    } else if (/\.pdf$/i.test(fileName)) {
      return <FiFileText className="text-red-500 flex-shrink-0" size={20} />;
    } else if (/\.(dwg|dxf)$/i.test(fileName)) {
      return <FiFileText className="text-orange-500 flex-shrink-0" size={20} />;
    } else if (/\.(xls|xlsx)$/i.test(fileName)) {
      return <FiFileText className="text-green-500 flex-shrink-0" size={20} />;
    } else {
      return <FiFile className="text-gray-500 flex-shrink-0" size={20} />;
    }
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer 
          transition-all duration-200 ease-in-out
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50/50"
              : "border-gray-300 bg-gray-50/50 hover:border-gray-400"
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <FiUpload className="text-gray-500" size={24} />
          <p className="text-gray-600 text-sm">
            Drag & drop or <span className="font-semibold text-blue-600">browse</span>
          </p>
          <p className="text-xs text-gray-400">Max 2GB</p>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {uploadedFiles.map((file, index) => {
              const fileName = file.name || (file.url ? decodeURIComponent(file.url.split("/").pop() || "Unknown File") : "Unknown File");
              const isImage = file.type === "IMAGE" || /\.(jpe?g|png|gif|bmp|webp)$/i.test(fileName);
              const isRemoving = removingFiles.get(file.url);

              return (
                <div key={index} className="relative group bg-white rounded-lg border overflow-hidden">
                  {isImage ? (
                    <img
                      src={file.url}
                      alt={fileName}
                      className="h-28 w-full object-cover"
                    />
                  ) : (
                    <div className="h-28 w-full flex flex-col items-center justify-center bg-gray-50 p-2">
                      {getFileIcon(fileName)}
                      <p className="text-xs text-gray-500 font-medium truncate w-full text-center mt-2">
                        {fileName}
                      </p>
                    </div>
                  )}
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleRemove(file.url)}
                      disabled={isRemoving}
                      className="p-1.5 bg-white/80 hover:bg-white text-red-500 rounded-full shadow"
                    >
                      {isRemoving ? <CgSpinner className="animate-spin" size={14} /> : <FiTrash size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;