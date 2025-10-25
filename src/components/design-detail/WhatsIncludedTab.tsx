'use client';

import React from 'react';

const WhatsIncludedTab = ({ design }) => {
  const includedFiles = {
    PDF: {
      icon: "picture_as_pdf",
      description: "Detailed PDF blueprints of the design.",
    },
    CAD: {
      icon: "engineering",
      description: "Editable CAD files for further customization.",
    },
    IMAGE: {
      icon: "image",
      description: "High-resolution renderings of the exterior and interior.",
    },
    FLOOR_PLAN: {
      icon: "map",
      description: "Detailed floor plans with dimensions.",
    },
  };

  const availableFileTypes = design.files ? [...new Set(design.files.map(file => file.type))] : [];

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4 dark:text-white">What's Included in Your Purchase</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {availableFileTypes.map((fileType) => (
          <div key={fileType} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg dark:border-gray-700">
            <i className="material-symbols-outlined text-4xl text-blue-500">{includedFiles[fileType]?.icon || 'help'}</i>
            <div>
              <h4 className="font-bold text-lg text-gray-800 dark:text-white">{fileType.replace('_', ' ')}</h4>
              <p className="text-gray-600 dark:text-gray-400">{includedFiles[fileType]?.description}</p>
            </div>
          </div>
        ))}
      </div>

      {design.calculatorOptions && design.calculatorOptions.options && design.calculatorOptions.options.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 dark:text-white">Available Package Add-ons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {design.calculatorOptions.options.map((option: any, index: number) => (
              <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                <i className="material-symbols-outlined text-4xl text-green-500">add_circle</i>
                <div>
                  <h4 className="font-bold text-lg text-gray-800 dark:text-white">{option.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400">Additional cost: ${option.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsIncludedTab;
