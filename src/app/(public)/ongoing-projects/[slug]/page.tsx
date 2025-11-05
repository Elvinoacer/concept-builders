'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

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
  gallery: { url: string, caption: string }[];
  size: string | null;
  value: string | null;
  highlights: string[];
  published: boolean;
  createdAt: string;
}

const OngoingProjectDetailsPage = ({ params }: { params: { slug: string } }) => {
  const [project, setProject] = useState<OngoingProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchOngoingProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ongoing-projects/${params.slug}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: OngoingProject = await response.json();
      setProject(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  useEffect(() => {
    fetchOngoingProject();
  }, [fetchOngoingProject]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">Error: {error || 'Project not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">{project.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">{project.description}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            {project.featuredImage && (
              <motion.div 
                className="mb-8 rounded-lg overflow-hidden shadow-2xl cursor-pointer"
                onClick={() => setSelectedImage(project.featuredImage)}
                whileHover={{ scale: 1.02 }}
              >
                <Image
                  className="w-full h-auto object-cover"
                  src={project.featuredImage}
                  alt={project.title}
                  fill
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                />
              </motion.div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.gallery && project.gallery.map((image, index) => (
                <motion.div 
                  key={index} 
                  whileHover={{ scale: 1.05 }}
                  className="rounded-lg overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => setSelectedImage(image.url)}
                >
                  <Image
                    className="w-full h-48 object-cover"
                    src={image.url}
                    alt={image.caption}
                    fill
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                  />
                </motion.div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Project Details</h3>
              <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-500">person</span><strong>Client:</strong> {project.clientName}</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-500">location_on</span><strong>Location:</strong> {project.location}</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-500">work</span><strong>Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`}>{project.status}</span></li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-500">category</span><strong>Category:</strong> {project.category}</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-500">event</span><strong>Start Date:</strong> {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-500">event_available</span><strong>Estimated Completion:</strong> {project.estimatedCompletionDate ? new Date(project.estimatedCompletionDate).toLocaleDateString() : 'N/A'}</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-500">square_foot</span><strong>Size:</strong> {project.size}</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-500">monetization_on</span><strong>Value:</strong> {project.value}</li>
              </ul>
              <h4 className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">Highlights</h4>
              <ul className="space-y-2">
                {project.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-500 mt-1">check_circle</span>
                    <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-full max-h-full rounded-lg shadow-2xl"
            >
              <Image
                src={selectedImage}
                alt="Full screen view"
                fill
                className="object-contain"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
              />
            </motion.div>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2"
            >
              <X size={24} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OngoingProjectDetailsPage;