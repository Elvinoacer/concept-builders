'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiFile, FiTrash, FiX } from 'react-icons/fi';
import { CgSpinner } from "react-icons/cg";
import { ProgressBar } from '@/components/ui/progress';

interface FileUploadProps {
  onUploadSuccess: (files: { url: string; type: string; name: string }[]) => void;
  onFileRemove: (fileUrl: string) => void;
  initialFiles: { url: string; type: string; name: string }[];
  fileTypeCategory: string;
  multiple?: boolean;
  accept?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  error?: string;
}

const FileUpload = ({
  onUploadSuccess,
  initialFiles = [],
  fileTypeCategory,
  multiple = false,
  accept,
  onFileRemove,
}: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState(initialFiles);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [removingFiles, setRemovingFiles] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    setUploadedFiles(initialFiles);
  }, [initialFiles]);

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: any[]) => {
      const newUploadingFiles: UploadingFile[] = acceptedFiles.map((file) => ({
        file,
        progress: 0,
      }));
      setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

      const validationErrors: UploadingFile[] = fileRejections.map(({ file, errors }: any) => ({
        file,
        progress: 0,
        error: errors.map((e: any) => e.message).join(', '),
      }));
      setUploadingFiles((prev) => [...prev, ...validationErrors]);

      const newFilesData = await Promise.all(
        acceptedFiles.map(async (file, index) => {
          try {
            const signedUrlResponse = await fetch('/api/designs/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileName: file.name,
                fileType: file.type,
                fileTypeCategory,
              }),
            });
            const { signedUrl } = await signedUrlResponse.json();
            const publicUrl = signedUrl.split('?')[0];

            const xhr = new XMLHttpRequest();
            xhr.open('PUT', signedUrl, true);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.setRequestHeader('x-amz-acl', 'public-read');

            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const progress = (event.loaded / event.total) * 100;
                setUploadingFiles((prev) =>
                  prev.map((f) =>
                    f.file.name === file.name ? { ...f, progress } : f
                  )
                );
              }
            };

            await new Promise((resolve, reject) => {
              xhr.onload = () => {
                if (xhr.status === 200) {
                  resolve({ url: publicUrl, type: fileTypeCategory, name: file.name });
                } else {
                  reject(new Error('Upload failed'));
                }
              };
              xhr.onerror = () => reject(new Error('Upload failed'));
              xhr.send(file);
            });

            setUploadingFiles((prev) => prev.filter((f) => f.file.name !== file.name));
            return { url: publicUrl, type: fileTypeCategory, name: file.name };
          } catch (error) {
            setUploadingFiles((prev) =>
              prev.map((f) =>
                f.file.name === file.name
                  ? { ...f, error: 'Upload failed' }
                  : f
              )
            );
            return null;
          }
        })
      );

      const successfulUploads = newFilesData.filter((f) => f) as { url: string; type: string; name: string }[];
      const updatedFiles = [...uploadedFiles, ...successfulUploads];
      setUploadedFiles(updatedFiles);
      onUploadSuccess(updatedFiles);
    },
    [uploadedFiles, onUploadSuccess, fileTypeCategory]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: accept ? { [accept]: [] } : undefined,
  });

  const handleRemove = async (fileUrl: string) => {
    setRemovingFiles((prev) => new Map(prev.set(fileUrl, true)));
    try {
      await onFileRemove(fileUrl);
      setUploadedFiles((prev) => prev.filter((file) => file.url !== fileUrl));
    } finally {
      setRemovingFiles((prev) => {
        const newMap = new Map(prev);
        newMap.delete(fileUrl);
        return newMap;
      });
    }
  };

  const handleRemoveUploading = (fileName: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.file.name !== fileName));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <div className="mt-4 space-y-2">
        {uploadingFiles.map((uploadingFile, index) => (
          <div key={index} className="p-2 bg-background rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiFile className="text-gray-500" />
                <span className="text-sm truncate">{uploadingFile.file.name}</span>
              </div>
              <button
                onClick={() => handleRemoveUploading(uploadingFile.file.name)}
                className="text-red-500 hover:text-red-700"
              >
                <FiX />
              </button>
            </div>
            {uploadingFile.error ? (
              <p className="text-red-500 text-xs mt-1">{uploadingFile.error}</p>
            ) : (
              <ProgressBar value={uploadingFile.progress} className="mt-1 h-2" />
            )}
          </div>
        ))}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {uploadedFiles.map((file, index) => {
            const fileName = file.name || decodeURIComponent(file.url.split('/').pop() || '');
            const isImage = file.type.startsWith('IMAGE');

            return (
              <div key={index} className="relative group bg-background rounded-lg border overflow-hidden">
                {isImage ? (
                  <img src={file.url} alt={fileName} className="h-32 w-full object-cover" />
                ) : (
                  <div className="h-32 w-full flex items-center justify-center bg-gray-100">
                    <FiFile className="text-gray-400" size={40} />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs">
                  <p className="truncate" title={fileName}>{fileName}</p>
                </div>
                <div className="absolute top-2 right-2">
                  <button type="button" onClick={() => handleRemove(file.url)} className="text-red-500 bg-white rounded-full p-1 hover:bg-red-100" disabled={removingFiles.get(file.url)}>
                    {removingFiles.get(file.url) ? <CgSpinner className="animate-spin" /> : <FiTrash size={14} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;