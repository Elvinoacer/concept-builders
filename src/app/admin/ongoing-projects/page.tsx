'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PlusCircle, Edit, Trash2, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'sonner';
import FileUpload from '@/components/admin/designs/FileUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProjectStatus = ['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'NEARING_COMPLETION', 'COMPLETED'];
const ProjectCategory = ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'RENOVATION', 'INFRASTRUCTURE', 'INTERIOR_FIT_OUT'];

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

const getStatusColorClass = (status: string) => {
  switch (status) {
    case 'PLANNING':
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case 'IN_PROGRESS':
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case 'COMPLETED':
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case 'ON_HOLD':
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case 'NEARING_COMPLETION':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const OngoingProjectsPage = () => {
  const [projects, setProjects] = useState<OngoingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('PLANNING');
  const [category, setCategory] = useState('RESIDENTIAL');
  const [startDate, setStartDate] = useState('');
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState('');
  const [completedAt, setCompletedAt] = useState('');
  const [featuredImage, setFeaturedImage] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [size, setSize] = useState('');
  const [value, setValue] = useState('');
  const [highlights, setHighlights] = useState('');
  const [published, setPublished] = useState(false);

  const fetchOngoingProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/ongoing-projects');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: OngoingProject[] = await response.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOngoingProjects();
  }, [fetchOngoingProjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      title,
      description,
      clientName,
      location,
      status,
      category,
      startDate: startDate ? new Date(startDate) : null,
      estimatedCompletionDate: estimatedCompletionDate ? new Date(estimatedCompletionDate) : null,
      completedAt: completedAt ? new Date(completedAt) : null,
      featuredImage: featuredImage.length > 0 ? featuredImage[0].url : null,
      gallery: gallery.map(img => ({ url: img.url, caption: img.name })),
      size,
      value,
      highlights: highlights.split('\n'),
      published
    };

    try {
      const response = await fetch('/api/admin/ongoing-projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Ongoing project created successfully!');
        setShowForm(false);
        fetchOngoingProjects();
        // Reset form
        setTitle('');
        setDescription('');
        setClientName('');
        setLocation('');
        setStatus('PLANNING');
        setCategory('RESIDENTIAL');
        setStartDate('');
        setEstimatedCompletionDate('');
        setCompletedAt('');
        setFeaturedImage([]);
        setGallery([]);
        setSize('');
        setValue('');
        setHighlights('');
        setPublished(false);

      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
      console.error('Error creating ongoing project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await fetch(`/api/admin/ongoing-projects/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchOngoingProjects(); // Re-fetch projects after deletion
      toast.success('Ongoing project deleted successfully!');
    } catch (err: any) {
      console.error("Failed to delete project:", err);
      setError("Failed to delete project.");
      toast.error('Failed to delete project.');
    }
  };

  if (loading) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading ongoing projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
            Ongoing Projects
          </h2>
          <p className="text-gray-500 mt-1 dark:text-gray-400">
            Manage all ongoing client projects.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-500 transition-colors flex items-center space-x-2 shadow-lg"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{showForm ? 'Cancel' : 'New Ongoing Project'}</span>
        </motion.button>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl"
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-lg font-semibold">Project Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientName" className="text-lg font-semibold">Client Name</Label>
                    <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-lg font-semibold">Description</Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-lg font-semibold">Location</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-lg font-semibold">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                          <SelectContent>{ProjectStatus.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-lg font-semibold">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>{ProjectCategory.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-lg font-semibold">Start Date</Label>
                      <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimatedCompletionDate" className="text-lg font-semibold">Estimated Completion</Label>
                      <Input id="estimatedCompletionDate" type="date" value={estimatedCompletionDate} onChange={(e) => setEstimatedCompletionDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="completedAt" className="text-lg font-semibold">Completed At</Label>
                      <Input id="completedAt" type="date" value={completedAt} onChange={(e) => setCompletedAt(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size" className="text-lg font-semibold">Size</Label>
                      <Input id="size" value={size} onChange={(e) => setSize(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="value" className="text-lg font-semibold">Value</Label>
                      <Input id="value" value={value} onChange={(e) => setValue(e.target.value)} />
                    </div>
                    <div className="flex items-center space-x-3 pt-4">
                      <Input type="checkbox" id="published" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-5 w-5" />
                      <Label htmlFor="published" className="text-lg font-semibold">Published</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="highlights" className="text-lg font-semibold">Highlights (one per line)</Label>
                    <Textarea id="highlights" value={highlights} onChange={(e) => setHighlights(e.target.value)} rows={5} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">Featured Image</Label>
                    <FileUpload
                      onUploadSuccess={(files) => setFeaturedImage(files)}
                      onFileRemove={() => setFeaturedImage([])}
                      initialFiles={featuredImage}
                      fileTypeCategory="IMAGE"
                      multiple={false}
                      accept="image/jpeg, image/png, image/gif, image/webp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">Gallery</Label>
                    <FileUpload
                      onUploadSuccess={(files) => setGallery(prev => [...prev, ...files])}
                      onFileRemove={(fileUrl) => setGallery(prev => prev.filter(f => f.url !== fileUrl))}
                      initialFiles={gallery}
                      fileTypeCategory="IMAGE"
                      multiple
                      accept="image/jpeg, image/png, image/gif, image/webp"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={isSubmitting}>
                  <X className="mr-2" /> Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                  {isSubmitting ? <CgSpinner className="animate-spin mr-2" /> : <PlusCircle className="mr-2" />}
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No ongoing projects found.</h3>
          <p className="text-gray-600 dark:text-gray-400">Click the button above to create a new one.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Project Title</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Client</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Published</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {project.featuredImage && (
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-full object-cover shadow-md"
                            src={project.featuredImage}
                            alt={project.title}
                          />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-base font-semibold text-gray-900 dark:text-white">{project.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{project.category.replace('_', ' ')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{project.clientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${project.published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {project.published ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <Link href={`/ongoing-projects/${project.slug}`} target="_blank">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" title="View Details">
                          <Eye className="w-5 h-5" />
                        </motion.button>
                      </Link>
                      <Link href={`/admin/ongoing-projects/${project.id}/edit`}>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="Edit Project">
                          <Edit className="w-5 h-5" />
                        </motion.button>
                      </Link>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete Project">
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OngoingProjectsPage;