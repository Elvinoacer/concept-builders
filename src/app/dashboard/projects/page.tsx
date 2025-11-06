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
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "in progress":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 min-[375px]:px-5 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto py-6 sm:py-8">
          {/* Skeleton Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>
                <div className="p-4 sm:p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            No Projects Yet!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            It looks like you haven't started any projects. Explore our designs
            and kickstart your dream home today!
          </p>
          <Link href="/design-showcase">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-500 transition-all shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 min-[375px]:px-5 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8"
        >
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              My Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-base sm:text-lg">
              Here are the projects you are currently working on
            </p>
          </div>

          <Link href="/dashboard/projects/new" className="flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-500 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
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
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg"
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
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">
                        {project.name}
                      </h3>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
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
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                          {project.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                              {project.description}
                            </p>
                          )}
                          {project.location && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
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
