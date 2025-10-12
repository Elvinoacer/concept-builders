"use client";

interface PreviewModalProps {
  htmlContent: string;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ htmlContent, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full h-full max-w-full max-h-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Preview
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border-0"
          title="Preview"
        />
      </div>
    </div>
  );
};

export default PreviewModal;
