'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DragAndDropProps {
  onDrop: (acceptedFiles: File[]) => void;
  accept: string;
}

const DragAndDrop = ({ onDrop, accept }: DragAndDropProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300
        ${isDragActive ? 'bg-blue-50 border-blue-400 dark:bg-blue-900/20 dark:border-blue-600' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-600 dark:text-blue-400 font-semibold">Drop the files here ...</p>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Drag & drop files here, or click to select</p>
      )}
    </div>
  );
};

export default DragAndDrop;