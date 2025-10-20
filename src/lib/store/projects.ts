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



const useProjectsStore = create<ProjectsState>()(
  devtools(
    (set) => ({
      projects: [],
      project: null,
      loading: false,
      error: null,
      fetchProjects: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("/api/projects");
          if (!response.ok) {
            throw new Error("Failed to fetch projects");
          }
          const data: Project[] = await response.json();
          set({ projects: data, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      fetchProjectById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/projects/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch project");
          }
          const data: Project = await response.json();
          set({ project: data, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
    }),
    { name: 'ProjectsStore' }
  )
);

export default useProjectsStore;
