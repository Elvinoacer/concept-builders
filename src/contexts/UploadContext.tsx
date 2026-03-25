"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { toast } from "sonner";

export interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  remoteUrl?: string;
  key?: string;
  fileId?: string;
  fileTypeCategory: string;
  onSuccess?: (file: {
    url: string;
    type: string;
    originalFileName: string;
    fileId?: string;
  }) => void;
}

interface UploadContextType {
  uploadingFiles: UploadingFile[];
  addUpload: (
    file: File,
    fileTypeCategory: string,
    onSuccess: (file: {
      url: string;
      type: string;
      originalFileName: string;
      fileId?: string;
    }) => void,
  ) => string;
  clearCompleted: () => void;
  retryUpload: (fileId: string) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);
const MAX_CONCURRENT_UPLOADS = 2;
const MAX_UPLOAD_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1500;

export const UploadProvider = ({ children }: { children: ReactNode }) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const processingIdsRef = useRef<Set<string>>(new Set());

  const wait = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  const addUpload = (
    file: File,
    fileTypeCategory: string,
    onSuccess: (file: {
      url: string;
      type: string;
      originalFileName: string;
      fileId?: string;
    }) => void,
  ) => {
    const id = uuidv4();

    const uploadingFile: UploadingFile = {
      id,
      file,
      progress: 0,
      status: "pending",
      fileTypeCategory,
      onSuccess,
    };

    setUploadingFiles((prev) => [...prev, uploadingFile]);
    return id;
  };

  const retryUpload = (fileId: string) => {
    setUploadingFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, status: "pending", progress: 0, error: undefined }
          : f,
      ),
    );
  };

  const processUpload = async (uploadingFile: UploadingFile) => {
    const { file, id, fileTypeCategory, onSuccess } = uploadingFile;

    if (processingIdsRef.current.has(id)) {
      return;
    }
    processingIdsRef.current.add(id);

    try {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: "uploading", progress: 5 } : f,
        ),
      );

      // Step 1: Get a pre-signed URL from our server
      const signedUrlResponse = await axios.post(
        "/api/upload/generate-presigned-url",
        {
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          fileTypeCategory,
        },
      );

      const { signedUrl, fileKey, publicUrl, originalFileName } =
        signedUrlResponse.data;
      const objectAcl = "public-read";
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, progress: 15, key: fileKey, remoteUrl: publicUrl }
            : f,
        ),
      );

      // Step 2: Upload the file directly to S3/DO Spaces
      let uploadSucceeded = false;
      let lastUploadError: unknown = null;

      for (let attempt = 1; attempt <= MAX_UPLOAD_RETRIES; attempt++) {
        try {
          await axios.put(signedUrl, file, {
            headers: {
              "Content-Type": file.type,
              "x-amz-acl": objectAcl,
            },
            timeout: 0,
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                15 + (progressEvent.loaded * 80) / (progressEvent.total || 1),
              );
              setUploadingFiles((prev) =>
                prev.map((f) =>
                  f.id === id ? { ...f, progress: percentCompleted } : f,
                ),
              );
            },
          });

          uploadSucceeded = true;
          break;
        } catch (uploadError) {
          lastUploadError = uploadError;

          if (attempt < MAX_UPLOAD_RETRIES) {
            const delayMs = RETRY_BASE_DELAY_MS * attempt;
            toast.info(
              `Upload retry ${attempt}/${MAX_UPLOAD_RETRIES - 1} for ${file.name}`,
            );
            await wait(delayMs);
          }
        }
      }

      if (!uploadSucceeded) {
        throw lastUploadError instanceof Error
          ? lastUploadError
          : new Error("Upload failed after retries");
      }

      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: "completed", progress: 100 } : f,
        ),
      );

      // Step 3: Call success callback
      if (onSuccess) {
        onSuccess({
          url: publicUrl,
          type: fileTypeCategory,
          originalFileName: file.name,
        });
      }

      toast.success(`Successfully uploaded ${file.name}`);
    } catch (error: any) {
      console.error("Upload error:", error);

      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: "error", error: error.message || "Upload failed" }
            : f,
        ),
      );

      toast.error(`Failed to upload ${file.name}`);
    } finally {
      processingIdsRef.current.delete(id);
    }
  };

  useEffect(() => {
    const pendingUploads = uploadingFiles.filter((f) => f.status === "pending");

    const activeUploadsCount = uploadingFiles.filter(
      (f) => f.status === "uploading",
    ).length;
    const availableSlots = Math.max(
      0,
      MAX_CONCURRENT_UPLOADS - activeUploadsCount,
    );

    if (availableSlots === 0 || pendingUploads.length === 0) {
      return;
    }

    pendingUploads.slice(0, availableSlots).forEach((uploadingFile) => {
      processUpload(uploadingFile);
    });
  }, [uploadingFiles]);

  const clearCompleted = () => {
    setUploadingFiles((prev) =>
      prev.filter(
        (f) =>
          f.status === "uploading" ||
          f.status === "pending" ||
          f.status === "error",
      ),
    );
  };

  const value = useMemo(
    () => ({
      uploadingFiles,
      addUpload,
      clearCompleted,
      retryUpload,
    }),
    [uploadingFiles],
  );

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
};
