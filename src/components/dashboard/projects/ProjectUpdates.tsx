"use client";
import React from "react";
import Image from "next/image";

const ProjectUpdates = ({ projectManager }: { projectManager: any }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-4 dark:text-white">
        Project Updates
      </h2>
      <div className="flex items-center gap-4 mb-2 md:mb-4">
        <Image
          alt={projectManager.name}
          className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
          src={projectManager.avatar}
          width={48}
          height={48}
        />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {projectManager.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {projectManager.role}
          </p>
        </div>
      </div>
      <div className="prose prose-sm text-gray-600 dark:text-gray-300">
        <p className="font-semibold dark:text-white">Latest Update:</p>
        <p>{projectManager.latestUpdate}</p>
      </div>
      <button className="mt-2 md:mt-4 w-full flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-cyan-500 transition-colors">
        <span className="material-symbols-outlined text-base">
          {" "}
          chat_bubble{" "}
        </span>
        <span>Message {projectManager.name.split(" ")[0]}</span>
      </button>
    </div>
  );
};

export default ProjectUpdates;
