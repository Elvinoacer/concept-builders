"use client";

import { motion } from "framer-motion";
import React from "react";

interface DocumentSection {
  title: string;
  document: any;
  files: Array<{
    type: string;
    files: any[];
  }>;
}

interface Design {
  architecturalDesign?: any;
  structuralDesign?: any;
  billOfQuantities?: any;
}

interface WhatsIncludedTabProps {
  design: Design;
}

const WhatsIncludedTab: React.FC<WhatsIncludedTabProps> = ({ design }) => {
  const { architecturalDesign, structuralDesign, billOfQuantities } = design;

  const documentSections: DocumentSection[] = [
    {
      title: "Architectural Design",
      document: architecturalDesign,
      files: [
        { type: "PDF", files: architecturalDesign?.pdfFiles },
        { type: "CAD", files: architecturalDesign?.cadFiles },
      ],
    },
    {
      title: "Bill of Quantities",
      document: billOfQuantities,
      files: [
        { type: "Excel", files: billOfQuantities?.excelFiles },
        { type: "PDF", files: billOfQuantities?.pdfFiles },
      ],
    },
  ];

  if (structuralDesign) {
    documentSections.splice(1, 0, {
      title: "Structural Design",
      document: structuralDesign,
      files: [
        { type: "PDF", files: structuralDesign?.pdfFiles },
        { type: "CAD", files: structuralDesign?.cadFiles },
      ],
    });
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "PDF":
        return "picture_as_pdf";
      case "CAD":
        return "architecture";
      case "Excel":
        return "table_chart";
      default:
        return "description";
    }
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case "PDF":
        return "from-red-500 to-red-600";
      case "CAD":
        return "from-blue-500 to-blue-600";
      case "Excel":
        return "from-green-500 to-green-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getFileTypeDescription = (fileType: string) => {
    switch (fileType) {
      case "PDF":
        return "High-resolution PDF blueprints with detailed annotations and measurements. Perfect for printing and sharing with contractors.";
      case "CAD":
        return "Editable CAD files for professional modifications and customizations. Compatible with major CAD software.";
      case "Excel":
        return "Comprehensive Bill of Quantities in Excel format with material lists, quantities, and cost estimations.";
      default:
        return "Professional documentation files.";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3 sm:mb-4">
            What's Included in Your Purchase
          </h3>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Complete professional documentation package with everything you need
            to bring your architectural vision to life
          </p>
        </motion.div>

        <div className="space-y-6 sm:space-y-8 md:space-y-12">
          {documentSections.map((section, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg sm:shadow-xl md:shadow-2xl hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-500"
              whileHover={{ y: -2 }}
            >
              <motion.div
                className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200/50 dark:border-gray-700/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="material-symbols-outlined text-white text-lg sm:text-xl md:text-2xl">
                    {index === 0
                      ? "architecture"
                      : index === 1
                        ? "engineering"
                        : "inventory_2"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-tight">
                    {section.title}
                  </h4>
                </div>
              </motion.div>

              {section.document ? (
                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6"
                  variants={containerVariants}
                >
                  {section.files.map(
                    (fileType, fileIndex) =>
                      fileType.files &&
                      fileType.files.length > 0 && (
                        <motion.div
                          key={fileIndex}
                          variants={cardVariants}
                          whileHover="hover"
                          className="group cursor-pointer"
                        >
                          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-primary/30 transition-all duration-500 h-full">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <motion.div
                                className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br ${getFileTypeColor(fileType.type)} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                              >
                                <span className="material-symbols-outlined text-white text-lg sm:text-xl md:text-2xl">
                                  {getFileTypeIcon(fileType.type)}
                                </span>
                              </motion.div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-2">
                                  <h5 className="font-bold text-base sm:text-lg md:text-xl text-slate-800 dark:text-white group-hover:text-primary transition-colors duration-300 truncate">
                                    {fileType.type} Files
                                  </h5>
                                  <motion.span
                                    className="px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium w-fit"
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    {fileType.files.length} file
                                    {fileType.files.length !== 1 ? "s" : ""}
                                  </motion.span>
                                </div>

                                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                                  {getFileTypeDescription(fileType.type)}
                                </p>

                                <motion.div
                                  className="space-y-1 sm:space-y-2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{
                                    delay: 0.4 + fileIndex * 0.1,
                                  }}
                                >
                                  {fileType.files
                                    .slice(0, 3)
                                    .map(
                                      (file: any, fileItemIndex: number) => (
                                        <motion.div
                                          key={fileItemIndex}
                                          className="flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-white/50 dark:bg-gray-700/30 border border-gray-200/30 dark:border-gray-600/30 hover:bg-white dark:hover:bg-gray-700/50 transition-all duration-300 group/file"
                                          whileHover={{ x: 2 }}
                                        >
                                          <span className="material-symbols-outlined text-gray-400 text-sm sm:text-base group-hover/file:text-primary transition-colors duration-300 flex-shrink-0">
                                            description
                                          </span>
                                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium truncate group-hover/file:text-slate-800 dark:group-hover/file:text-white transition-colors duration-300">
                                            {file.name ||
                                              `File ${fileItemIndex + 1}`}
                                          </span>
                                          <span className="ml-auto text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                                            {file.size || "N/A"}
                                          </span>
                                        </motion.div>
                                      )
                                    )}
                                  {fileType.files.length > 3 && (
                                    <motion.div
                                      className="text-center py-1.5 sm:py-2 text-primary hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 font-medium text-xs sm:text-sm"
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      +{fileType.files.length - 3} more files
                                    </motion.div>
                                  )}
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                  )}

                  {/* Show message if no files in any file type */}
                  {section.files.every(ft => !ft.files || ft.files.length === 0) && (
                    <motion.div
                      className="col-span-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-amber-200/50 dark:border-amber-700/50">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-md flex-shrink-0">
                            <span className="material-symbols-outlined text-white text-lg sm:text-xl">
                              schedule
                            </span>
                          </div>
                          <div>
                            <h5 className="font-bold text-sm sm:text-base md:text-lg text-amber-900 dark:text-amber-200 mb-1">
                              Files Coming Soon
                            </h5>
                            <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300">
                              {section.title} files will be available in the next three days.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  className="text-center py-6 sm:py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border-2 border-amber-200/50 dark:border-amber-700/50">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="material-symbols-outlined text-white text-lg sm:text-xl">
                          schedule
                        </span>
                      </div>
                      <div className="text-left">
                        <h5 className="font-bold text-sm sm:text-base md:text-lg text-amber-900 dark:text-amber-200 mb-1">
                          Files Coming Soon
                        </h5>
                        <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300">
                          {section.title} files will be available in the next three days.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {section.document?.features &&
                section.document.features.length > 0 && (
                  <motion.div
                    className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h5 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base sm:text-lg">
                        featured_seasonal_and_gifts
                      </span>
                      Additional Features
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                      {section.document.features.map(
                        (feature: string, featureIndex: number) => (
                          <motion.div
                            key={featureIndex}
                            className="flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg sm:rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all duration-300"
                            whileHover={{ x: 2 }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + featureIndex * 0.1 }}
                          >
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full flex-shrink-0"></div>
                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
                              {feature}
                            </span>
                          </motion.div>
                        )
                      )}
                    </div>
                  </motion.div>
                )}
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-8 sm:mt-10 md:mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-primary/20">
            <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-2 sm:mb-3">
              Ready to Get Started?
            </h4>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-2xl mx-auto">
              Purchase this complete design package and receive immediate access
              to all professional documentation files.
            </p>
            <motion.button
              className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white rounded-lg sm:rounded-xl md:rounded-2xl font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-symbols-outlined mr-1 sm:mr-2 text-base sm:text-lg">
                shopping_cart
              </span>
              Purchase Design Package
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WhatsIncludedTab;
