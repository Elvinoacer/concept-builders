import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Project {
  id: string;
  name: string;
  progress: number;
  status: string;
  statusColor: string;
  imageUrl: string;
}

interface ProjectsState {
  projects: Project[];
  project: Project | null;
  loading: boolean;
  error: string | null;
  fetchProjects: () => void;
  fetchProjectById: (id: string) => void;
}

import { projectsData } from "@/lib/dummydata/projects";

const useProjectsStore = create<ProjectsState>()(
  devtools(
    (set) => ({
      projects: [],
      project: null,
      loading: false,
      error: null,
      fetchProjects: () => {
        set({ loading: true, error: null });
        try {
          set({ projects: projectsData, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      fetchProjectById: (id: string) => {
        set({ loading: true, error: null });
        try {
          const project = projectsData.find((p) => p.id === id) || null;
          set({ project, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
    }),
    { name: 'ProjectsStore' }
  )
);

export default useProjectsStore;
