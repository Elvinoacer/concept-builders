"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FileText, Package, Zap } from "lucide-react";

const ItemsPurchased = ({ items }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <h3 className="text-gray-900 dark:text-white text-lg sm:text-xl font-bold leading-tight tracking-tight mb-4 sm:mb-6">
        Purchased Designs
      </h3>

      <div className="space-y-3 sm:space-y-4">
        {items.map((item, index) => {
          const imageUrl = item.design.purchasedFiles.find(file => file.type === 'IMAGE')?.url || "/images/category-placeholder.webp";
          const selectedExtras = item.selectedExtras
            ? JSON.parse(item.selectedExtras)
            : [];

          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300/50 dark:hover:border-blue-600/30 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Image */}
                <div className="flex-shrink-0">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-600">
                    <Image
                      src={imageUrl}
                      alt={item.design.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 64px, 80px"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Title and ID */}
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white leading-tight truncate">
                      {item.design.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium mt-1">
                      Plan ID: {item.design.id}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                    {/* File Type */}
                    {item.selectedFileTypes && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                        <span className="font-medium">Format:</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.selectedFileTypes.join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Extras */}
                    {selectedExtras.length > 0 && (
                      <div className="xs:col-span-2 flex items-start gap-2 text-gray-600 dark:text-gray-400">
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">Extras: </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {selectedExtras.map((extra, idx) => (
                              <span key={idx}>
                                {extra.name}
                                {idx < selectedExtras.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Purchased Files */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Purchased Files
                      </span>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-700/50 p-3 rounded-xl space-y-2">
                      {item.design.purchasedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between">
                          <p className="text-sm text-gray-900 dark:text-white">{file.name}</p>
                          <button onClick={() => window.open(file.url, '_blank')} className="text-sm text-blue-600 hover:underline">Download</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      {items.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/30"
        >
          <p className="text-blue-800 dark:text-blue-200 text-xs sm:text-sm text-center font-medium">
            You purchased {items.length} design{items.length > 1 ? "s" : ""}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ItemsPurchased;
