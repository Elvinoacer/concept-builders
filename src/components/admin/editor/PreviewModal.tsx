"use client";

import { useState, useEffect } from "react";
import {
  FiX,
  FiMaximize2,
  FiMinimize2,
  FiSmartphone,
  FiTablet,
  FiMonitor,
  FiRefreshCw,
  FiCopy,
} from "react-icons/fi";

interface PreviewModalProps {
  htmlContent: string;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  htmlContent,
  onClose,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFullscreen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const copyHTML = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy HTML:", err);
    }
  };

  const getIframeWidth = () => {
    switch (deviceView) {
      case "mobile":
        return "100%";
      case "tablet":
        return "768px";
      case "desktop":
        return "100%";
      default:
        return "100%";
    }
  };

  const getIframeHeight = () => {
    if (isFullscreen) return "100%";

    switch (deviceView) {
      case "mobile":
        return "600px";
      case "tablet":
        return "600px";
      case "desktop":
        return "calc(100vh - 200px)";
      default:
        return "600px";
    }
  };

  const DeviceFrame = ({ children }: { children: React.ReactNode }) => {
    if (deviceView === "desktop") return <>{children}</>;

    return (
      <div
        className={`relative mx-auto bg-gray-900 rounded-3xl border-8 border-gray-900 shadow-2xl ${
          deviceView === "mobile" ? "max-w-[375px]" : "max-w-[768px]"
        }`}
      >
        {/* Device notch for mobile */}
        {deviceView === "mobile" && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10"></div>
        )}

        {/* Device frame */}
        <div className="relative bg-white rounded-2xl overflow-hidden">
          {children}
        </div>

        {/* Home indicator for mobile */}
        {deviceView === "mobile" && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-full"></div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300 ${
        isFullscreen ? "p-0" : "p-3 xs:p-4 sm:p-6"
      }`}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
          isFullscreen
            ? "w-full h-full max-w-none max-h-none rounded-none"
            : "w-full h-full max-w-7xl max-h-[95vh]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 xs:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-xl xs:rounded-t-2xl">
          <div className="flex items-center gap-3 xs:gap-4">
            <h2 className="text-lg xs:text-xl font-bold text-gray-900 dark:text-gray-100">
              Preview
            </h2>

            {/* Device View Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setDeviceView("mobile")}
                className={`p-2 rounded-md transition-colors ${
                  deviceView === "mobile"
                    ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
                title="Mobile View"
              >
                <FiSmartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceView("tablet")}
                className={`p-2 rounded-md transition-colors ${
                  deviceView === "tablet"
                    ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
                title="Tablet View"
              >
                <FiTablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceView("desktop")}
                className={`p-2 rounded-md transition-colors ${
                  deviceView === "desktop"
                    ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
                title="Desktop View"
              >
                <FiMonitor className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Device View Selector */}
            <div className="sm:hidden">
              <select
                value={deviceView}
                onChange={(e) => setDeviceView(e.target.value as any)}
                className="text-xs bg-gray-100 dark:bg-gray-700 border-0 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
              >
                <option value="mobile">Mobile</option>
                <option value="tablet">Tablet</option>
                <option value="desktop">Desktop</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 xs:gap-3">
            {/* Copy HTML Button */}
            <button
              onClick={copyHTML}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
              title="Copy HTML"
            >
              <FiCopy className="w-4 h-4" />
              <span>{copied ? "Copied!" : "Copy HTML"}</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <FiMinimize2 className="w-4 h-4" />
              ) : (
                <FiMaximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
              title="Close Preview"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Action Bar */}
        <div className="sm:hidden flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <button
            onClick={copyHTML}
            className="flex items-center gap-2 px-3 py-2 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
          >
            <FiCopy className="w-3 h-3" />
            {copied ? "Copied!" : "Copy HTML"}
          </button>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            View: {deviceView}
          </div>
        </div>

        {/* Content Area */}
        <div
          className={`flex-1 relative bg-gray-100 dark:bg-gray-900 ${
            isFullscreen ? "" : "p-4 xs:p-6"
          } overflow-auto`}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 z-10">
              <div className="text-center">
                <FiRefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Loading preview...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 z-10">
              <div className="text-center max-w-sm mx-auto p-6">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Preview Failed to Load
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  There was an error loading the preview. This might be due to
                  invalid HTML content or security restrictions.
                </p>
                <button
                  onClick={copyHTML}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Copy HTML to Debug
                </button>
              </div>
            </div>
          )}

          {/* Preview Content */}
          <div
            className={`h-full flex justify-center ${isLoading || hasError ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
          >
            <DeviceFrame>
              <iframe
                srcDoc={htmlContent}
                className="w-full bg-white"
                style={{
                  width: getIframeWidth(),
                  height: getIframeHeight(),
                  minHeight: deviceView === "desktop" ? "400px" : "500px",
                }}
                title="Blog Post Preview"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                sandbox="allow-same-origin allow-scripts"
                loading="eager"
              />
            </DeviceFrame>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 xs:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-xl xs:rounded-b-2xl">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Device: {deviceView}</span>
            <span>View: {isFullscreen ? "Fullscreen" : "Windowed"}</span>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Press ESC to {isFullscreen ? "exit fullscreen" : "close"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
