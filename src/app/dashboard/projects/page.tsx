"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import useProjectsStore from "@/lib/store/projects";
import Image from "next/image";

const ProjectsPage = () => {
  const { projects, fetchProjects, loading } = useProjectsStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No projects yet!
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          It looks like you haven't started any projects. Explore our designs and
          kickstart your dream home today!
        </p>
        <Link href="/design-showcase">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-500 transition-colors"
          >
            Explore Designs
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
            My Projects
          </h2>
          <p className="text-gray-500 mt-1 dark:text-gray-400">
            Here are the projects you are currently working on.
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-500 transition-colors"
          >
            Initialize New Project
          </motion.button>
        </Link>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden group"
            >
              <div className="relative h-48">
                <Image
                  src={project.imageUrl}
                  alt={project.name}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                />
                <div
                  className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded-full bg-${project.statusColor}-500`}
                >
                  {project.status}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {project.name}
                </h3>
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className={`bg-${project.statusColor}-500 h-2.5 rounded-full`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
