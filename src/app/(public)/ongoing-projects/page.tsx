"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Ruler,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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
  featuredImage: string | null;
  size: string | null;
}

interface ResponseData {
  projects: OngoingProject[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProjects: number;
    limit: number;
    hasMore: boolean;
  };
  filters: {
    categories: string[];
    statuses: string[];
  };
}

export default function OngoingProjectsPage() {
  const [projects, setProjects] = useState<OngoingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [mobileFilters, setMobileFilters] = useState(false);

  const loadProjects = useCallback(
    async (pageNumber: number, append = false) => {
      append ? setLoadingMore(true) : setLoading(true);

      try {
        const params = new URLSearchParams();

        params.set("page", String(pageNumber));
        params.set("limit", "9");

        if (debounced) params.set("search", debounced);
        if (category !== "all") params.set("category", category);
        if (status !== "all") params.set("status", status);

        const res = await fetch(`/api/ongoing-projects?${params}`);

        if (!res.ok) throw new Error("Failed loading projects");

        const data: ResponseData = await res.json();

        setProjects((prev) =>
          append ? [...prev, ...data.projects] : data.projects,
        );

        setCategories(data.filters.categories);
        setStatuses(data.filters.statuses);

        setPage(data.pagination.currentPage);
        setHasMore(data.pagination.hasMore);
        setTotal(data.pagination.totalProjects);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debounced, category, status],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    loadProjects(1, false);
  }, [loadProjects]);

  if (loading) {
    return (
      <main className="min-h-screen bg-ink text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-gold mb-5"
            size={45}
          />

          <p className="text-gray-400">Loading projects...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-ink text-white flex items-center justify-center">
        <div
          className="
bg-surface
border
border-cb-border
rounded-3xl
p-10
text-center
"
        >
          <AlertCircle className="mx-auto text-red-400 mb-4" size={45} />

          <h2 className="text-2xl font-bold">Unable to load projects</h2>

          <p className="text-gray-400 mt-3">{error}</p>

          <button
            onClick={() => loadProjects(1, false)}
            className="
mt-6
bg-gold
text-black
px-6
py-3
rounded-full
"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink text-white px-6 py-20">
      <section className="max-w-7xl mx-auto">
        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <Building2 size={48} className="mx-auto mb-5 text-gold" />

          <h1 className="text-5xl font-bold">Ongoing Projects</h1>

          <p
            className="
mt-5
text-gray-400
max-w-2xl
mx-auto
"
          >
            Follow our latest architectural developments and projects currently
            in progress.
          </p>
        </motion.div>

        {/* SEARCH */}

        <div
          className="
bg-surface
border
border-cb-border
rounded-3xl
p-5
mb-10
"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="
absolute
left-4
top-1/2
-translate-y-1/2
text-gray-500
"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="
w-full
bg-black/20
border
border-cb-border
rounded-full
py-3
pl-12
pr-5
outline-none
"
              />
            </div>

            <button
              onClick={() => setMobileFilters(!mobileFilters)}
              className="
md:hidden
flex
items-center
gap-2
border
border-cb-border
rounded-full
px-5
"
            >
              <Filter size={16} />
              Filters
            </button>

            <div
              className="
hidden
md:flex
gap-3
"
            >
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="
bg-black/20
border
border-cb-border
rounded-full
px-5
"
              >
                <option value="all">All Categories</option>

                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="
bg-black/20
border
border-cb-border
rounded-full
px-5
"
              >
                <option value="all">All Status</option>

                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <AnimatePresence>
            {mobileFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-5 md:hidden"
              >
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mb-3 bg-black/20 p-3 rounded-xl"
                >
                  <option value="all">All Categories</option>

                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>

                <select
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-black/20 p-3 rounded-xl"
                >
                  <option value="all">All Status</option>

                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-gray-400 mb-8 text-sm">{total} projects available</p>

        {/* GRID */}

        <div
          className="
grid
md:grid-cols-3
gap-8
"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{
                y: -8,
              }}
              className="
bg-surface
border
border-cb-border
rounded-3xl
overflow-hidden
group
"
            >
              <div
                className="
relative
h-64
"
              >
                {project.featuredImage && (
                  <Image
                    src={project.featuredImage}
                    alt={project.title}
                    fill
                    className="
object-cover
group-hover:scale-105
transition
duration-700
"
                  />
                )}

                <div
                  className="
absolute
top-4
left-4
bg-gold
text-black
px-4
py-1
rounded-full
text-xs
font-bold
"
                >
                  {project.status.replaceAll("_", " ")}
                </div>
              </div>

              <div className="p-6">
                <div
                  className="
flex
gap-2
items-center
text-gold
text-sm
"
                >
                  <Sparkles size={15} />

                  {project.category}
                </div>

                <h2
                  className="
text-xl
font-bold
mt-3
"
                >
                  {project.title}
                </h2>

                <p
                  className="
text-gray-400
mt-3
line-clamp-3
"
                >
                  {project.description}
                </p>

                <div
                  className="
mt-5
space-y-2
text-sm
text-gray-300
"
                >
                  {project.location && (
                    <div className="flex gap-2">
                      <MapPin size={15} />

                      {project.location}
                    </div>
                  )}

                  {project.size && (
                    <div className="flex gap-2">
                      <Ruler size={15} />

                      {project.size}
                    </div>
                  )}

                  {project.startDate && (
                    <div className="flex gap-2">
                      <Calendar size={15} />

                      {new Date(project.startDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <Link
                  href={`/ongoing-projects/${project.slug}`}
                  className="
mt-6
inline-flex
items-center
gap-3
text-gold
"
                >
                  View Project
                  <ArrowRight size={17} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={() => loadProjects(page + 1, true)}
              className="
bg-gold
text-black
px-8
py-4
rounded-full
inline-flex
gap-3
items-center
"
            >
              {loadingMore ? "Loading..." : "Load More"}

              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
