"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  MoreHorizontal,
  FileText,
  HelpCircle,
  Check,
  ExternalLink,
} from "lucide-react";

const PurchaseListItem = ({ design }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleDownload = () => {
    // Download logic here
    console.log("Downloading design:", design.name);
  };

  const handleViewInvoice = () => {
    window.location.href = `/dashboard/invoice/${design.orderId}`;
    setIsMenuOpen(false);
  };

  const handleRequestSupport = () => {
    // Support logic here
    console.log("Requesting support for:", design.name);
    setIsMenuOpen(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl shadow-sm border border-cb-border p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6 hover:shadow-md transition-all duration-300"
    >
      {/* Image Section */}
      <div className="w-full lg:w-48 xl:w-56 flex-shrink-0 h-48 sm:h-56 lg:h-40 relative rounded-xl overflow-hidden bg-surface">
        <Image
          src={design.images[0]?.url || "/images/design-placeholder.jpg"}
          alt={design.name}
          fill
          className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
          sizes="(max-width: 1024px) 100vw, 224px"
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-surface animate-pulse" />
        )}

        {/* File Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/70 text-white text-xs font-medium rounded-full backdrop-blur-sm">
            <FileText className="w-3 h-3" />
            {design.fileType}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        {/* Header Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <h3 className="text-lg sm:text-xl font-bold text-cream line-clamp-2 leading-tight flex-1 min-w-0">
              {design.name}
            </h3>
            <p className="text-sm text-muted whitespace-nowrap flex-shrink-0">
              Purchased: {new Date(design.purchaseDate).toLocaleDateString()}
            </p>
          </div>

          {/* Package and Add-ons */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 border-t border-cb-border pt-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                Package
              </p>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold" />
                <p className="font-medium text-cream-dim text-sm">
                  {design.fileType}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                Add-ons
              </p>
              <div className="flex flex-wrap gap-1.5">
                {design.addOns && design.addOns.length > 0 ? (
                  design.addOns.map((addon, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 text-xs bg-emerald-900/30 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-800"
                    >
                      <Check className="w-3 h-3" />
                      {addon}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted italic">
                    No add-ons
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info - Price, Size, etc. */}
          {(design.price || design.size) && (
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-cb-border">
              {design.price && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                    Price
                  </p>
                  <p className="font-bold text-lg text-cream">
                    $
                    {typeof design.price === "number"
                      ? design.price.toFixed(2)
                      : design.price}
                  </p>
                </div>
              )}
              {design.size && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                    File Size
                  </p>
                  <p className="font-medium text-cream-dim text-sm">
                    {design.size}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 mt-4 pt-4 border-t border-cb-border">
          {/* Download Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-gold text-ink font-semibold hover:bg-gold-light transition-all shadow-sm hover:shadow-md flex-1 xs:flex-none min-w-0"
          >
            <Download className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Download Files</span>
          </motion.button>

          {/* More Actions Menu */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center rounded-xl h-12 w-12 bg-surface text-cream-dim hover:bg-card transition-colors border border-cb-border"
            >
              <MoreHorizontal className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-xl z-20 border border-cb-border overflow-hidden"
                >
                  <button
                    onClick={handleViewInvoice}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-cream-dim hover:bg-surface transition-colors border-b border-cb-border"
                  >
                    <FileText className="w-4 h-4 text-gold" />
                    <span>View Invoice</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-muted" />
                  </button>
                  <button
                    onClick={handleRequestSupport}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-cream-dim hover:bg-surface transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-emerald-400" />
                    <span>Request Support</span>
                  </button>

                  {/* Additional actions can be added here */}
                  {design.projectId && (
                    <button
                      onClick={() => {
                        console.log("Navigate to project:", design.projectId);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-cream-dim hover:bg-surface transition-colors border-t border-cb-border"
                    >
                      <span className="material-symbols-outlined text-base text-purple-500">
                        dashboard
                      </span>
                      <span>View Project</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PurchaseListItem;
