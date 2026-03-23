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
    <div className="mb-4 md:mb-8">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-cream">
        {title}
      </h1>
      <p className="mt-0.5 md:mt-1 text-cream-dim">{description}</p>
    </div>
  );
};

export default ProjectsHeader;
