"use client";
import React, { useEffect, use } from "react";
import ProjectsHeader from "@/components/dashboard/projects/ProjectsHeader";
import ProjectProgress from "@/components/dashboard/projects/ProjectProgress";
import Milestones from "@/components/dashboard/projects/Milestones";
import Payments from "@/components/dashboard/projects/Payments";
import ProjectUpdates from "@/components/dashboard/projects/ProjectUpdates";
import ProjectImages from "@/components/dashboard/projects/ProjectImages";
import useProjectsStore from "@/lib/store/projects";
import Loading from "@/components/loading";
import { milestones, payments, projectManager, images, estimatedCompletion } from "@/lib/dummydata/projectDetails";

const ProjectDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: projectId } = use(params);
  const { project, fetchProjectById, loading } = useProjectsStore();

  useEffect(() => {
    fetchProjectById(projectId);
  }, [fetchProjectById, projectId]);

  if (loading || !project) {
    return <Loading />;
  }



  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <ProjectsHeader
        title={project.name}
        description={project.description || ""}
      />
      <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 md:space-y-8">
          <ProjectProgress
            progress={project.progress}
            estimatedCompletion={estimatedCompletion}
          />
          <Milestones milestones={milestones} />
          <Payments payments={payments} />
        </div>
        <div className="lg:col-span-1 space-y-4 md:space-y-8">
          <ProjectUpdates projectManager={projectManager} />
          <ProjectImages images={images} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
