
'use client';

import { useState } from 'react';
import { ProgressBar } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { FiUploadCloud, FiFile, FiTrash2, FiLoader } from 'react-icons/fi';

import DragAndDrop from './DragAndDrop';

export default function GenericFileUpload({ designId, fileRelation, onUploadComplete, accept }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // 1. Get signed URL
      const signedUrlResponse = await fetch('/api/designs/upload-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designId: designId,
          fileRelation: fileRelation,
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!signedUrlResponse.ok) {
        throw new Error('Failed to get signed URL');
      }

      const { signedUrl } = await signedUrlResponse.json();

      // 2. Upload file to DO Spaces
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.setRequestHeader('x-amz-acl', 'public-read');
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(percentComplete);
        }
      };
      xhr.onload = async () => {
        if (xhr.status === 200) {
          // 3. Save file URL to database is handled by the API route
          onUploadComplete();
          setFile(null);
        } else {
          console.error('Upload failed.');
        }
        setUploading(false);
      };
      xhr.onerror = () => {
        console.error('Upload failed.');
        setUploading(false);
      };
      xhr.send(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(`Error uploading file: ${error.message}`);
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <DragAndDrop onDrop={handleDrop} accept={accept} />
      {file && (
        <div className="mt-4 flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-200">Selected file:</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{file.name}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
            <FiTrash2 className="w-5 h-5 text-red-500" />
          </Button>
        </div>
      )}
      <div className="mt-4">
        <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
          {uploading ? (
            <div className="flex items-center justify-center">
              <FiLoader className="animate-spin mr-2" />
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <FiUploadCloud className="mr-2" />
              <span>Upload File</span>
            </div>
          )}
        </Button>
      </div>
      {uploading && (
        <div className="mt-4">
          <ProgressBar value={progress} className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
          <p className="text-right text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{Math.round(progress)}%</p>
        </div>
      )}
    </div>
  );
}
