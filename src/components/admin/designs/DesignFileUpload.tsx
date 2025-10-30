'use client';

import DocumentFileUpload from './DocumentFileUpload';

export default function DesignFileUpload({ design, onUploadComplete }) {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Manage Your Design Files</h3>
      <div className="space-y-8">
        <div>
          <h4 className="text-xl font-semibold mb-2 dark:text-white">Architectural Design</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DocumentFileUpload
              design={design}
              documentType="ARCHITECTURAL"
              fileType="PDF"
              onUploadComplete={onUploadComplete}
            />
            <DocumentFileUpload
              design={design}
              documentType="ARCHITECTURAL"
              fileType="CAD"
              onUploadComplete={onUploadComplete}
            />
          </div>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-2 dark:text-white">Structural Design</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DocumentFileUpload
              design={design}
              documentType="STRUCTURAL"
              fileType="PDF"
              onUploadComplete={onUploadComplete}
            />
            <DocumentFileUpload
              design={design}
              documentType="STRUCTURAL"
              fileType="CAD"
              onUploadComplete={onUploadComplete}
            />
          </div>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-2 dark:text-white">Bill of Quantities</h4>
          <DocumentFileUpload
            design={design}
            documentType="BILL_OF_QUANTITIES"
            fileType="EXCEL"
            onUploadComplete={onUploadComplete}
          />
        </div>
      </div>
    </div>
  );
}
