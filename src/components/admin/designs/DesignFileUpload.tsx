"use client";

import DocumentFileUpload from "./DocumentFileUpload";
import GenericFileUpload from "./GenericFileUpload";
import {
  FiImage,
  FiLayers,
  FiFile,
  FiHome,
  FiGrid,
  FiBarChart2,
} from "react-icons/fi";

interface DesignFileUploadProps {
  design: any;
  onUploadComplete: () => void;
}

export default function DesignFileUpload({
  design,
  onUploadComplete,
}: DesignFileUploadProps) {
  const uploadSections = [
    {
      title: "General Images",
      description: "Upload high-quality images of your design",
      icon: FiImage,
      component: (
        <GenericFileUpload
          designId={design.id}
          fileRelation="images"
          onUploadComplete={onUploadComplete}
          accept="image/*"
          maxFiles={10}
        />
      ),
    },
    {
      title: "Floor Plans",
      description: "Upload floor plans as images or PDFs",
      icon: FiLayers,
      component: (
        <GenericFileUpload
          designId={design.id}
          fileRelation="floorPlans"
          onUploadComplete={onUploadComplete}
          accept="image/*,.pdf"
          maxFiles={5}
        />
      ),
    },
    {
      title: "Other Files",
      description: "Upload additional documents and files",
      icon: FiFile,
      component: (
        <GenericFileUpload
          designId={design.id}
          fileRelation="files"
          onUploadComplete={onUploadComplete}
          accept="*"
          maxFiles={5}
        />
      ),
    },
    {
      title: "Architectural Design",
      description: "Upload architectural drawings and documents",
      icon: FiHome,
      component: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <DocumentFileUpload
            design={design}
            documentType="ARCHITECTURAL"
            fileType="PDF"
            onUploadComplete={onUploadComplete}
            title="PDF Documents"
          />
          <DocumentFileUpload
            design={design}
            documentType="ARCHITECTURAL"
            fileType="CAD"
            onUploadComplete={onUploadComplete}
            title="CAD Files"
          />
        </div>
      ),
    },
    {
      title: "Structural Design",
      description: "Upload structural engineering documents",
      icon: FiGrid,
      component: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <DocumentFileUpload
            design={design}
            documentType="STRUCTURAL"
            fileType="PDF"
            onUploadComplete={onUploadComplete}
            title="PDF Documents"
          />
          <DocumentFileUpload
            design={design}
            documentType="STRUCTURAL"
            fileType="CAD"
            onUploadComplete={onUploadComplete}
            title="CAD Files"
          />
        </div>
      ),
    },
    {
      title: "Bill of Quantities",
      description: "Upload cost estimation spreadsheets",
      icon: FiBarChart2,
      component: (
        <DocumentFileUpload
          design={design}
          documentType="BILL_OF_QUANTITIES"
          fileType="EXCEL"
          onUploadComplete={onUploadComplete}
          title="Excel Spreadsheets"
        />
      ),
    },
  ];

  return (
    <div className="mt-6 sm:mt-8">
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Manage Design Files
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Upload and organize all files related to your design project
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {uploadSections.map((section, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <section.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-1">
                  {section.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {section.description}
                </p>
              </div>
            </div>
            {section.component}
          </div>
        ))}
      </div>
    </div>
  );
}
