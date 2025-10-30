'use client';

import React from 'react';

const WhatsIncludedTab = ({ design }) => {
  const { architecturalDesign, structuralDesign, billOfQuantities } = design;

  const documentSections = [
    {
      title: 'Architectural Design',
      document: architecturalDesign,
      files: [
        { type: 'PDF', files: architecturalDesign?.pdfFiles },
        { type: 'CAD', files: architecturalDesign?.cadFiles },
      ],
    },
    {
      title: 'Structural Design',
      document: structuralDesign,
      files: [
        { type: 'PDF', files: structuralDesign?.pdfFiles },
        { type: 'CAD', files: structuralDesign?.cadFiles },
      ],
    },
    {
      title: 'Bill of Quantities',
      document: billOfQuantities,
      files: [{ type: 'Excel', files: billOfQuantities?.excelFiles }],
    },
  ];

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4 dark:text-white">What's Included in Your Purchase</h3>
      <div className="space-y-8">
        {documentSections.map((section, index) => (
          section.document && (
            <div key={index}>
              <h4 className="text-xl font-semibold mb-2 dark:text-white">{section.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{section.document.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {section.files.map((fileType, fileIndex) => (
                  fileType.files && fileType.files.length > 0 && (
                    <div key={fileIndex} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                      <i className="material-symbols-outlined text-4xl text-blue-500">
                        {fileType.type === 'PDF' ? 'picture_as_pdf' : fileType.type === 'CAD' ? 'engineering' : 'request_quote'}
                      </i>
                      <div>
                        <h5 className="font-bold text-lg text-gray-800 dark:text-white">{fileType.type} Files</h5>
                        <p className="text-gray-600 dark:text-gray-400">
                          {fileType.type === 'PDF' ? 'Detailed PDF blueprints.' : fileType.type === 'CAD' ? 'Editable CAD files.' : 'Bill of Quantities in Excel format.'}
                        </p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default WhatsIncludedTab;
