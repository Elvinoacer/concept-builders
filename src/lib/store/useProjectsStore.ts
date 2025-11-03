import axios from "axios";
import { create } from "zustand";

const useProjectsStore = create((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/projects?userId=${userId}`);
      set({ projects: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createProject: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/projects", data);
      set((state) => ({
        projects: [...state.projects, response.data],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateProject: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/projects/${id}`, data);
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? response.data : project
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useProjectsStore;
