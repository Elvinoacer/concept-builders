"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import useProjectsStore from "@/lib/store/projects";
import Image from "next/image";
import {
  Plus,
  FolderOpen,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ProjectsPage = () => {
  const { projects, fetchProjects, loading } = useProjectsStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "in progress":
        return <Clock className="w-4 h-4 text-gold" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-cream-dim" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-900/30 text-emerald-300 border-emerald-800";
      case "in progress":
        return "bg-gold/10 text-gold border-border-gold";
      case "pending":
        return "bg-amber-900/30 text-amber-300 border-amber-800";
      default:
        return "bg-surface text-cream-dim border-cb-border";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-500";
      case "in progress":
        return "bg-gold";
      case "pending":
        return "bg-amber-500";
      default:
        return "bg-cb-muted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink px-4 min-[375px]:px-5 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto py-6 sm:py-8">
          {/* Skeleton Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="h-8 bg-surface rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-surface rounded w-64 animate-pulse"></div>
            </div>
            <div className="h-12 bg-surface rounded w-48 animate-pulse"></div>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border border-cb-border animate-pulse"
              >
                <div className="h-48 bg-surface rounded-t-2xl"></div>
                <div className="p-4 sm:p-6">
                  <div className="h-6 bg-surface rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 bg-surface rounded w-16"></div>
                      <div className="h-4 bg-surface rounded w-12"></div>
                    </div>
                    <div className="h-2 bg-surface rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-6 border border-cb-border">
            <FolderOpen className="w-10 h-10 text-cream-dim" />
          </div>
          <h3
            className="text-2xl font-bold text-cream mb-3"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            No Projects Yet!
          </h3>
          <p className="text-cream-dim mb-8 leading-relaxed">
            It looks like you haven&apos;t started any projects. Explore our designs
            and kickstart your dream home today!
          </p>
          <Link href="/design-showcase">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gold text-ink px-8 py-4 rounded-xl font-semibold hover:bg-gold-light transition-all shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Explore Designs
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink px-4 min-[375px]:px-5 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8"
        >
          <div className="flex-1 min-w-0">
            <h1
              className="text-3xl xs:text-4xl sm:text-5xl font-bold text-cream leading-tight"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              My Projects
            </h1>
            <p className="text-cream-dim mt-2 text-base sm:text-lg">
              Here are the projects you are currently working on
            </p>
          </div>

          <Link href="/dashboard/projects/new" className="flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto bg-gold text-ink px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold hover:bg-gold-light transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Project
            </motion.button>
          </Link>
        </motion.header>

        {/* Projects Grid */}
        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                layout
              >
                <Link href={`/dashboard/projects/${project.id}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-card rounded-2xl border border-cb-border overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-border-gold"
                  >
                    {/* Project Image */}
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <Image
                        src={
                          project.imageUrl || "/images/project-placeholder.jpg"
                        }
                        alt={project.name}
                        fill
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />

                      {/* Status Badge */}
                      <div
                        className={`absolute top-3 right-3 px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusColor(project.status)} flex items-center gap-1.5`}
                      >
                        {getStatusIcon(project.status)}
                        {project.status}
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-4 sm:p-6">
                      {/* Project Name */}
                      <h3 className="text-lg sm:text-xl font-bold text-cream mb-3 line-clamp-2 leading-tight">
                        {project.name}
                      </h3>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-cream-dim">
                            Progress
                          </span>
                          <span className="text-sm font-bold text-cream">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-surface rounded-full h-2.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`h-2.5 rounded-full ${getProgressColor(project.status)}`}
                          />
                        </div>
                      </div>

                      {/* Additional Info - Optional */}
                      {(project.description || project.location) && (
                        <div className="mt-4 pt-4 border-t border-cb-border">
                          {project.description && (
                            <p className="text-sm text-cream-dim line-clamp-2 mb-2">
                              {project.description}
                            </p>
                          )}
                          {project.location && (
                            <p className="text-xs text-cb-muted flex items-center gap-1">
                              📍 {project.location}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectsPage;
