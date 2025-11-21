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

    try {
      // Step 1: Create file record
      setUploadingFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading' } : f));
      
      const createResponse = await axios.post('/api/files/create', {
        fileName: file.name,
        fileTypeCategory: fileTypeCategory,
      });

      const { fileId, publicUrl, key } = createResponse.data;

      // Update with file record details
      setUploadingFiles(prev => prev.map(f => 
        f.id === id 
          ? { ...f, fileId, remoteUrl: publicUrl, key, progress: 10 }
          : f
      ));

      // Step 2: Upload to S3
      await axios.post('/api/upload', file, {
                  headers: {
                    'x-file-key': key,
                    'Content-Type': file.type,
                    'x-file-name': file.name,
                  },        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            10 + (progressEvent.loaded * 90) / (progressEvent.total || 1) // Start from 10%
          );
          setUploadingFiles(prev => prev.map(f => 
            f.id === id ? { ...f, progress: percentCompleted } : f
          ));
        },
      });

      // Step 3: Update status to completed
      await axios.post('/api/files/update-status', { 
        fileId, 
        status: 'COMPLETED' 
      });

      setUploadingFiles(prev => prev.map(f => 
        f.id === id ? { ...f, status: 'completed', progress: 100 } : f
      ));

      // Step 4: Call success callback
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
      const failedFile = uploadingFiles.find(f => f.id === id);
      if (failedFile?.fileId) {
        try {
          await axios.post('/api/files/update-status', { 
            fileId: failedFile.fileId, 
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
