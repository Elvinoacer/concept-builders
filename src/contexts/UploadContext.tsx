"use client";

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { toast } from 'sonner';

export interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  remoteUrl?: string;
  key?: string;
  fileId?: string;
  fileTypeCategory: string;
  onSuccess?: (file: { url: string; type: string; originalFileName: string; fileId: string }) => void;
}

interface UploadContextType {
  uploadingFiles: UploadingFile[];
  addUpload: (file: File, fileTypeCategory: string, onSuccess: (file: { url: string; type: string; originalFileName: string; fileId: string }) => void) => Promise<void>;
  clearCompleted: () => void;
  retryUpload: (fileId: string) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider = ({ children }: { children: ReactNode }) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const addUpload = async (file: File, fileTypeCategory: string, onSuccess: (file: { url: string; type: string; originalFileName: string; fileId: string }) => void) => {
    const id = uuidv4();
    
    const uploadingFile: UploadingFile = {
      id,
      file,
      progress: 0,
      status: 'pending',
      fileTypeCategory,
      onSuccess,
    };

    setUploadingFiles((prev) => [...prev, uploadingFile]);
  };

  const retryUpload = (fileId: string) => {
    setUploadingFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: 'pending', progress: 0, error: undefined }
        : f
    ));
  };

  const processUpload = async (uploadingFile: UploadingFile) => {
    const { file, id, fileTypeCategory, onSuccess } = uploadingFile;

    let fileId: string | null = null;

    try {
      setUploadingFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading', progress: 5 } : f));
      
      // Step 1: Get a pre-signed URL from our server
      const signedUrlResponse = await axios.post('/api/upload/generate-presigned-url', {
        fileName: file.name,
        fileType: file.type,
      });

      const { signedUrl, fileKey, publicUrl, originalFileName } = signedUrlResponse.data;
      setUploadingFiles(prev => prev.map(f => f.id === id ? { ...f, progress: 15, key: fileKey, remoteUrl: publicUrl } : f));

      // Step 2: Create file record in our database
      const createResponse = await axios.post('/api/files/create', {
        fileName: originalFileName,
        fileTypeCategory: fileTypeCategory,
        key: fileKey,
        url: publicUrl,
      });

      fileId = createResponse.data.fileId;
      setUploadingFiles(prev => prev.map(f => f.id === id ? { ...f, fileId, progress: 25 } : f));
      
      // Step 3: Upload the file directly to S3/DO Spaces
      await axios.put(signedUrl, file, {
        headers: { 
          'Content-Type': file.type,
          'x-amz-acl': 'public-read'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            25 + (progressEvent.loaded * 70) / (progressEvent.total || 1) // Start from 25%
          );
          setUploadingFiles(prev => prev.map(f => 
            f.id === id ? { ...f, progress: percentCompleted } : f
          ));
        },
      });

      // Step 4: Update status to completed in our database
      await axios.post('/api/files/update-status', { 
        fileId, 
        status: 'COMPLETED' 
      });

      setUploadingFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: 'completed', progress: 100 } : f
      ));

      // Step 5: Call success callback
      if (onSuccess) {
        onSuccess({ 
          url: publicUrl, 
          type: fileTypeCategory, 
          originalFileName: file.name, 
          fileId 
        });
      }

      toast.success(`Successfully uploaded ${file.name}`);

    } catch (error: any) {
      console.error("Upload error:", error);
      
      // Update file status to failed if we have a fileId
      if (fileId) {
        try {
          await axios.post('/api/files/update-status', { 
            fileId: fileId, 
            status: 'FAILED' 
          });
        } catch (updateError) {
          console.error("Failed to update file status:", updateError);
        }
      }

      setUploadingFiles(prev => prev.map(f => 
        f.id === id 
          ? { ...f, status: 'error', error: error.message || 'Upload failed' }
          : f
      ));

      toast.error(`Failed to upload ${file.name}`);
    }
  };

  useEffect(() => {
    const pendingUploads = uploadingFiles.filter(f => f.status === 'pending');
    
    pendingUploads.forEach(uploadingFile => {
      processUpload(uploadingFile);
    });
  }, [uploadingFiles]);

  const clearCompleted = () => {
    setUploadingFiles((prev) => 
      prev.filter((f) => f.status === 'uploading' || f.status === 'pending' || f.status === 'error')
    );
  };

  const value = useMemo(
    () => ({
      uploadingFiles,
      addUpload,
      clearCompleted,
      retryUpload,
    }),
    [uploadingFiles]
  );

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
};
