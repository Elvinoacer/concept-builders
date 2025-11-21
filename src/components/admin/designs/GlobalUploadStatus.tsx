"use client";

import { useUpload } from '@/contexts/UploadContext';
import { FiUploadCloud, FiX, FiRefreshCw } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { ProgressBar } from '@/components/ui/progress';

const GlobalUploadStatus = () => {
  const { uploadingFiles, clearCompleted, retryUpload } = useUpload();
  const activeUploads = uploadingFiles.filter(f => 
    f.status === 'uploading' || f.status === 'pending' || f.status === 'error'
  );

  if (activeUploads.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50 border"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <FiUploadCloud size={16} />
            Uploads ({activeUploads.length})
          </h3>
          <button 
            onClick={clearCompleted} 
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <FiX size={18} />
          </button>
        </div>
        
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {activeUploads.map(file => (
            <div key={file.id} className="text-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="truncate flex-1 pr-2 text-xs font-medium">
                  {file.file.name}
                </p>
                <div className="flex items-center gap-1">
                  {file.status === 'error' && (
                    <button
                      onClick={() => retryUpload(file.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Retry upload"
                    >
                      <FiRefreshCw size={14} />
                    </button>
                  )}
                  <span className={`
                    text-xs px-1.5 py-0.5 rounded
                    ${file.status === 'uploading' ? 'bg-blue-100 text-blue-800' : ''}
                    ${file.status === 'pending' ? 'bg-gray-100 text-gray-800' : ''}
                    ${file.status === 'error' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {file.status}
                  </span>
                </div>
              </div>
              
              <ProgressBar 
                value={file.progress} 
                className={`h-1.5 ${
                  file.status === 'error' ? 'bg-red-200' : ''
                }`}
              />
              
              {file.error && (
                <p className="text-xs text-red-500 mt-1">{file.error}</p>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalUploadStatus;