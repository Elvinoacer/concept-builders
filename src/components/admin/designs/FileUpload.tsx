"use client";

import { useCallback, useState, useEffect, useMemo } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import {
  FiFile,
  FiTrash,
  FiUpload,
  FiImage,
  FiFileText,
  FiRefreshCw,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import { useUpload } from "@/contexts/UploadContext";
import { ProgressBar } from "@/components/ui/progress";

const MAX_UPLOAD_SIZE = 2 * 1024 * 1024 * 1024;

interface FileUploadProps {
  onUploadSuccess: (file: {
    url: string;
    type: string;
    originalFileName: string;
    fileId?: string;
  }) => void;
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
  const { addUpload, uploadingFiles, retryUpload } = useUpload();
  const [uploadedFiles, setUploadedFiles] = useState(initialFiles);
  const [localUploadIds, setLocalUploadIds] = useState<string[]>([]);
  const [removingFiles, setRemovingFiles] = useState<Map<string, boolean>>(
    new Map(),
  );

  useEffect(() => {
    setUploadedFiles(initialFiles);
  }, [initialFiles]);

  const liveUploads = useMemo(
    () =>
      uploadingFiles.filter(
        (file) =>
          localUploadIds.includes(file.id) &&
          (file.status === "pending" ||
            file.status === "uploading" ||
            file.status === "error"),
      ),
    [uploadingFiles, localUploadIds],
  );

  useEffect(() => {
    if (localUploadIds.length === 0) return;

    const activeIds = new Set(liveUploads.map((file) => file.id));
    setLocalUploadIds((prev) => prev.filter((id) => activeIds.has(id)));
  }, [liveUploads, localUploadIds.length]);

  const buildAcceptObject = (acceptInput?: string) => {
    if (!acceptInput) return undefined;

    const values = acceptInput
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (values.length === 0) return undefined;

    return values.reduce<Record<string, string[]>>((acc, value) => {
      acc[value] = [];
      return acc;
    }, {});
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach(({ file, errors }) => {
          errors.forEach((error) => {
            toast.error(`${file.name}: ${error.message}`);
          });
        });
      }

      if (!multiple && acceptedFiles.length > 1) {
        toast.error("Only one file is allowed");
        return;
      }

      const queuedIds = acceptedFiles.map((file) =>
        addUpload(file, fileTypeCategory, (newFile) => {
          onUploadSuccess(newFile);
        }),
      );
      setLocalUploadIds((prev) => [...prev, ...queuedIds]);
    },
    [addUpload, fileTypeCategory, multiple, onUploadSuccess],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: buildAcceptObject(accept),
    maxSize: MAX_UPLOAD_SIZE, // 2GB max file size
  });

  const handleRemove = async (fileUrl: string) => {
    setRemovingFiles((prev) => new Map(prev.set(fileUrl, true)));
    try {
      await onFileRemove(fileUrl);
      setUploadedFiles((prev) => prev.filter((file) => file.url !== fileUrl));
      toast.success("File removed successfully");
    } catch {
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
            Drag & drop or{" "}
            <span className="font-semibold text-blue-600">browse</span>
          </p>
          <p className="text-xs text-gray-400">Max 2GB</p>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {uploadedFiles.map((file, index) => {
              const fileName =
                file.name ||
                (file.url
                  ? decodeURIComponent(
                      file.url.split("/").pop() || "Unknown File",
                    )
                  : "Unknown File");
              const previewKey =
                file.url || `${fileName}-${file.type || "file"}-${index}`;
              const isImage =
                file.type === "IMAGE" ||
                /\.(jpe?g|png|gif|bmp|webp)$/i.test(fileName);
              const isRemoving = removingFiles.get(file.url);

              return (
                <div
                  key={previewKey}
                  className="relative group bg-white rounded-lg border overflow-hidden"
                >
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
                      {isRemoving ? (
                        <CgSpinner className="animate-spin" size={14} />
                      ) : (
                        <FiTrash size={14} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {liveUploads.length > 0 && (
        <div className="mt-4 space-y-2">
          {liveUploads.map((file) => (
            <div key={file.id} className="rounded-lg border p-3 bg-muted/20">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium truncate">{file.file.name}</p>
                <div className="flex items-center gap-2">
                  {file.status === "error" && (
                    <button
                      type="button"
                      onClick={() => retryUpload(file.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Retry upload"
                    >
                      <FiRefreshCw size={14} />
                    </button>
                  )}
                  <span className="text-[11px] text-muted-foreground capitalize">
                    {file.status}
                  </span>
                </div>
              </div>
              <ProgressBar value={file.progress} className="h-1.5 mt-2" />
              {file.error && (
                <p className="text-[11px] text-red-500 mt-1">{file.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
