"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Hammer, ArrowRight, Sparkles } from "lucide-react";

const projects = [
  {
    title: "Modern Family Residence",
    status: "Design Phase",
    progress: 72,
    image:
      "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Modern_3-Bedroom_Flat-Roof_Three-Quarter_Exterior_Perspectives1.jpeg",
  },
  {
    title: "Luxury Villa Concept",
    status: "Planning",
    progress: 45,
    image:
      "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/Maisonette_Contemporary_Villa3.jpg",
  },
  {
    title: "Affordable Urban Home",
    status: "Drafting",
    progress: 60,
    image:
      "https://conceptbuilders.sfo3.digitaloceanspaces.com/designimages/modern_3-bedroombungalow1.jpg",
  },
];

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-ink text-white px-6 py-20">
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Hammer className="mx-auto mb-6 text-gold" size={48} />
            <h1 className="text-5xl font-bold">
              Something Beautiful Is Coming
            </h1>
            <p className="mt-5 text-gray-400 max-w-xl mx-auto">
              We are currently improving this experience and preparing new
              architectural ideas for you.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-cb-border rounded-3xl overflow-hidden"
            >
              <img
                src={project.image}
                alt={project.title}
                className="h-56 w-full object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 text-gold text-sm">
                  <Sparkles size={15} />
                  {project.status}
                </div>
                <h3 className="text-xl mt-3 font-semibold">{project.title}</h3>
                <div className="mt-5">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-black rounded-full mt-2">
                    <div
                      className="h-full bg-gold rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/designs"
            className="inline-flex items-center gap-3 bg-gold text-black px-7 py-4 rounded-full"
          >
            Browse Available Designs
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
