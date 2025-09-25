import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface LandingPageState {
  featuredCategories: any[];
  bestSellingPlans: any[];
  newPlans: any[];
  testimonials: any[];
  recentPosts: any[];
  loading: boolean;
  error: string | null;
  fetchLandingPageData: () => Promise<void>;
}

const useLandingPageStore = create<LandingPageState>()(
  devtools(
    (set) => ({
      featuredCategories: [],
      bestSellingPlans: [],
      newPlans: [],
      testimonials: [],
      recentPosts: [],
      loading: false,
      error: null,
      fetchLandingPageData: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/landing-page');
          if (!response.ok) {
            throw new Error('Failed to fetch landing page data');
          }
          const data = await response.json();
          set({
            featuredCategories: data.featuredCategories,
            bestSellingPlans: data.bestSellingPlans,
            newPlans: data.newPlans,
            testimonials: data.testimonials,
            recentPosts: data.recentPosts,
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
    }),
    { name: 'LandingPageStore' }
  )
);

export default useLandingPageStore;
