"use client";
import React from "react";

const ProjectsHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default ProjectsHeader;
