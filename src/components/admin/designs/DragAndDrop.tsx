"use client";

import { useDropzone } from "react-dropzone";
import { FiFile, FiUploadCloud } from "react-icons/fi";

interface DragAndDropProps {
  onDrop: (acceptedFiles: File[]) => void;
  accept: string;
  disabled?: boolean;
  multiple?: boolean;
}

const DragAndDrop = ({
  onDrop,
  accept,
  disabled = false,
  multiple = false,
}: DragAndDropProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept
      ? accept
          .split(",")
          .reduce((acc, ext) => ({ ...acc, [ext.trim()]: [] }), {})
      : undefined,
    disabled,
    multiple,
    maxFiles: multiple ? undefined : 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative p-6 sm:p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300
        ${
          disabled
            ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-60"
            : isDragActive
              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600 shadow-lg scale-[1.02]"
              : "bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500"
        }
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center space-y-3">
        <div
          className={`p-3 rounded-full transition-colors ${
            disabled
              ? "bg-gray-200 dark:bg-gray-700"
              : isDragActive
                ? "bg-blue-100 dark:bg-blue-800"
                : "bg-gray-100 dark:bg-gray-700"
          }`}
        >
          {isDragActive ? (
            <FiUploadCloud
              className={`w-6 h-6 sm:w-8 sm:h-8 ${
                disabled ? "text-gray-400" : "text-blue-500"
              }`}
            />
          ) : (
            <FiFile
              className={`w-6 h-6 sm:w-8 sm:h-8 ${
                disabled ? "text-gray-400" : "text-gray-400"
              }`}
            />
          )}
        </div>

        <div className="space-y-2">
          {isDragActive ? (
            <p
              className={`text-base sm:text-lg font-medium ${
                disabled ? "text-gray-400" : "text-blue-600 dark:text-blue-400"
              }`}
            >
              Drop files here...
            </p>
          ) : (
            <>
              <p
                className={`text-base sm:text-lg font-medium ${
                  disabled
                    ? "text-gray-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Drag & drop files here
              </p>
              <p
                className={`text-sm ${
                  disabled
                    ? "text-gray-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                or{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  browse files
                </span>
              </p>
            </>
          )}
        </div>

        {!disabled && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {multiple ? "Multiple files supported" : "Single file only"} •{" "}
            {accept === "*" ? "All file types" : accept}
          </p>
        )}
      </div>
    </div>
  );
};

export default DragAndDrop;
