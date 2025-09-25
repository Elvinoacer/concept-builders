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

const projectsData: Project[] = [
  {
    id: "1",
    name: "Modern Residence",
    progress: 65,
    status: "In Progress",
    statusColor: "blue",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL-7fQD68DyrwHs8gWgu5H2MI3bVnmXSZJ89j1v3JPRUMu2addHM65nQxW4G7DRhr7hpqxy1fed4M0xNiyq6t_yncrG55oYQKxcv-ne1sVOQLAw8e-JtyHcjjq49tr2Dw9kp1UaIzzGI4OC64Hp8CgrKcGP2kDMgCiwwjj2sbl4KTK3-eFaJPJY8zk4b3H1iadaGK5mYnFSWUchIvKeRbCcMfCfNg3wq_q4v6FZlXYgUQG5D_4IUMKyhrLrHsqGexhEjlylNObhhVb",
  },
  {
    id: "2",
    name: "Lakeside Retreat",
    progress: 100,
    status: "Completed",
    statusColor: "green",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJHHv7bC_VqgBTice09JLElRWiL22lXmBe2Tf4D9vvbDfIFlucdeo4WwgDviGFcaNKW1M0nCMJJAUvDPr6_eEcYP2nhl5vLtiqt7BtotNqqdJMkX2yyOR6Gh67trqNHGkt7oq7VsTPSO-rxiTl6bKDRI--L3ZFL3NTpAuFke0od4NU6L94LT4jtpVEFaQaMB8NlHxIgyLl7Hw--hZkeLvhMP2IdgFXcT4V8h9Mo2gQpciteKp79s7bOso9ZDamm7RNfRL094pN70GM",
  },
  {
    id: "3",
    name: "Urban Loft",
    progress: 20,
    status: "Planning",
    statusColor: "yellow",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD00lPQXMC2AavxwY0ur6WMZK-YObkrHMXfXkpE7MrYRG-5UzyPFaIzf3Rh3mDR6SOmCeiQztj-smMNQAOamwav_ZFI6Wq-OyofDA8KNB1Mgivk9iThGzjRppHTzDQVYOefPIxydrscoLfVyB8gKSsFMj_Vyu09mz0umGwShP29ee2Zu2gKxMvXq5XjWcvrusFD1tC42RsID3r5jQRFmlSnGeu0dA95dxSYnEiVJHqAMR2Dd99icavHeuOn4jsbgNAil3Lmqyjnqnap",
  },
];

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
