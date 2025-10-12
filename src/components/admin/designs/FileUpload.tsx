'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiTrash } from 'react-icons/fi'; // Import FiTrash icon

interface FileUploadProps {
  onUploadSuccess: (files: { url: string; type: string; name: string }[]) => void;
  initialFiles: { url: string; type: string; name: string }[];
  fileTypeCategory: string;
}

const FileUpload = ({ onUploadSuccess, initialFiles = [], fileTypeCategory }: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; type: string; name: string }[]>(initialFiles);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFilesData = await Promise.all(
      acceptedFiles.map(async (file) => {
        const signedUrlResponse = await fetch('/api/designs/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, fileType: file.type, fileTypeCategory: fileTypeCategory }),
        });
        const { signedUrl } = await signedUrlResponse.json();
        const publicUrl = signedUrl.split('?')[0];

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.setRequestHeader('x-amz-acl', 'public-read');
        await new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve({ url: publicUrl, type: fileTypeCategory, name: file.name }); // Return object with url and type
            } else {
              reject(new Error('Upload failed'));
            }
          };
          xhr.onerror = () => reject(new Error('Upload failed'));
          xhr.send(file);
        });

        return { url: publicUrl, type: fileTypeCategory, name: file.name };
      })
    );

    const updatedFiles = [...uploadedFiles, ...newFilesData];
    setUploadedFiles(updatedFiles);
    onUploadSuccess(updatedFiles);
  }, [uploadedFiles, onUploadSuccess, fileTypeCategory]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRemove = (indexToRemove: number) => {
    const updatedFiles = uploadedFiles.filter((_, index) => index !== indexToRemove);
    setUploadedFiles(updatedFiles);
    onUploadSuccess(updatedFiles); // Notify parent about the change
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </div>
      <div className="mt-4">
        <p className="font-semibold">Uploaded Files:</p>
        <ul>
          {uploadedFiles.map((file, index) => {
            const fileName = decodeURIComponent(file.url.split('/').pop() || '');
            return (
              <li key={index} className="flex items-center justify-between p-2 bg-background rounded-lg">
                <span className="text-sm truncate" title={fileName}>{fileName}</span>
                <button onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-700">
                  <FiTrash />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;