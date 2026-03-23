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
    <div className="rounded-lg border border-cb-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <h2 className="text-base md:text-lg font-semibold text-cream">
          Construction Progress
        </h2>
        <span className="text-xl md:text-2xl font-bold text-gold">
          {progress}%
        </span>
      </div>
      <div className="w-full bg-surface rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full bg-gold"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-3 text-sm text-cream-dim">
        Estimated Completion:{" "}
        <span className="font-medium text-cream">
          {estimatedCompletion}
        </span>
      </p>
    </div>
  );
};

export default ProjectProgress;
