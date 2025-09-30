"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DesignsList from "./DesignsList";

const DesignsTable = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await fetch("/api/designs");
        const data = await response.json();
        setDesigns(data);
      } catch (error) {
        console.error("Error fetching designs:", error);
      }
      setLoading(false);
    };

    fetchDesigns();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-md border border-border overflow-hidden"
    >
      <div className="mb-4 p-3 md:mb-6 md:p-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            search
          </span>
          <input
            className="form-input w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-ring focus:border-ring bg-card"
            placeholder="Search designs"
            type="text"
          />
        </div>
      </div>
      <DesignsList designs={designs} />
    </motion.div>
  );
};

export default DesignsTable;