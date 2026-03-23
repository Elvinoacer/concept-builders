"use client";
import React from "react";
import Image from "next/image";

interface ProjectManager {
  name: string;
  role: string;
  avatar: string;
  latestUpdate: string;
}

const ProjectUpdates = ({ projectManager }: { projectManager: ProjectManager }) => {
  return (
    <div className="rounded-lg border border-cb-border bg-card p-6 shadow-sm">
      <h2 className="text-base md:text-lg font-semibold text-cream mb-2 md:mb-4">
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
          <p className="font-semibold text-cream">
            {projectManager.name}
          </p>
          <p className="text-sm text-cream-dim">
            {projectManager.role}
          </p>
        </div>
      </div>
      <div className="prose prose-sm text-cream-dim">
        <p className="font-semibold text-cream">Latest Update:</p>
        <p>{projectManager.latestUpdate}</p>
      </div>
      <button className="mt-2 md:mt-4 w-full flex items-center justify-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-gold-light transition-colors">
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
