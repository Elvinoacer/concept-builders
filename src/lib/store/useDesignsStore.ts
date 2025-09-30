
import create from 'zustand';
import axios from 'axios';

const useDesignsStore = create((set) => ({
  designs: [],
  loading: false,
  error: null,

  fetchDesigns: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/designs?page=${page}&limit=${limit}`);
      set({ designs: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createDesign: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/designs', data);
      set((state) => ({ designs: [...state.designs, response.data], loading: false }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateDesign: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/designs/${id}`, data);
      set((state) => ({
        designs: state.designs.map((design) => (design.id === id ? response.data : design)),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteDesign: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/designs/${id}`);
      set((state) => ({
        designs: state.designs.filter((design) => design.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useDesignsStore;
