"use client";
import React from "react";

const ProjectProgress = ({
  progress,
  estimatedCompletion,
}: {
  progress: number;
  estimatedCompletion: string;
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Construction Progress
        </h2>
        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">
          {progress}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        Estimated Completion:{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {estimatedCompletion}
        </span>
      </p>
    </div>
  );
};

export default ProjectProgress;
