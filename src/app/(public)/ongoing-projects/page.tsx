'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface OngoingProject {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  clientName: string | null;
  location: string | null;
  status: string;
  category: string;
  startDate: string | null;
  estimatedCompletionDate: string | null;
  completedAt: string | null;
  featuredImage: string | null;
  gallery: any;
  size: string | null;
  value: string | null;
  highlights: string[];
  published: boolean;
  createdAt: string;
}

const OngoingProjectsPage = () => {
  const [projects, setProjects] = useState<OngoingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOngoingProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ongoing-projects');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: OngoingProject[] = await response.json();
      setProjects(data.filter(p => p.published));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOngoingProjects();
  }, [fetchOngoingProjects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading ongoing projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">Our Work in Progress</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
            Follow along as we bring our clients' visions to life. Here's a look at some of the exciting projects currently under construction.
          </p>
        </header>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No ongoing projects to display right now.</h3>
            <p className="text-gray-600 dark:text-gray-400">Check back soon to see our latest work!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {projects.map((project) => (
              <Link key={project.id} href={`/ongoing-projects/${project.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer h-full flex flex-col group"
                >
                  <div className="relative">
                    {project.featuredImage && (
                      <Image
                        className="h-56 w-full object-cover"
                        src={project.featuredImage}
                        alt={project.title}
                        fill
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                      />
                    )}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md">
                      {project.status.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{project.category.replace('_', ' ')}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">{project.description?.substring(0, 100)}...</p>
                    <div className="mt-auto flex items-center justify-between text-blue-600 dark:text-blue-400 font-semibold">
                      <span>View Project</span>
                      <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OngoingProjectsPage;
