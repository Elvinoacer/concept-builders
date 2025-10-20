"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface PurchasedDesign {
  id: string;
  name: string;
  imageUrl?: string;
}

const InitializeProjectPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [purchasedDesigns, setPurchasedDesigns] = useState<PurchasedDesign[]>([]);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    const fetchPurchasedDesigns = async () => {
      if (!session) return;
      try {
        const response = await fetch("/api/purchases");
        if (!response.ok) {
          throw new Error("Failed to fetch purchased designs");
        }
        const data: PurchasedDesign[] = await response.json();
        setPurchasedDesigns(data);
      } catch (error) {
        console.error("Error fetching purchased designs:", error);
        toast.error("Failed to load your purchased designs.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedDesigns();
  }, [session]);

  const handleInitializeProject = async () => {
    if (!selectedDesignId) {
      toast.error("Please select a design to initialize your project.");
      return;
    }

    setInitializing(true);
    try {
      const response = await fetch("/api/projects/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ designId: selectedDesignId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to initialize project");
      }

      toast.success("Project initialized successfully!");
      router.push("/dashboard/projects");
    } catch (error: any) {
      console.error("Error initializing project:", error);
      toast.error(error.message || "Failed to initialize project.");
    } finally {
      setInitializing(false);
    }
  };

  if (loading) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-8 text-center text-gray-500 dark:text-gray-400">
        Loading purchased designs...
      </div>
    );
  }

  if (purchasedDesigns.length === 0) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Purchased Designs Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You need to purchase a design before you can initialize a project.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/designs")}
          className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-500 transition-colors"
        >
          Browse Designs
        </motion.button>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
          Initialize New Project
        </h2>
        <p className="text-gray-500 mt-1 dark:text-gray-400">
          Select one of your purchased designs to start a new project.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {purchasedDesigns.map((design) => (
          <motion.div
            key={design.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer border-2 ${selectedDesignId === design.id ? "border-blue-500" : "border-transparent"}`}
            onClick={() => setSelectedDesignId(design.id)}
          >
            {design.imageUrl && (
              <img
                src={design.imageUrl}
                alt={design.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {design.name}
              </h3>
            </div>
            {selectedDesignId === design.id && (
              <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleInitializeProject}
        disabled={!selectedDesignId || initializing}
        className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${!selectedDesignId || initializing ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-cyan-400 text-white hover:from-blue-700 hover:to-cyan-500"}`}
      >
        {initializing ? "Initializing..." : "Initialize Project from Selected Design"}
      </motion.button>
    </div>
  );
};

export default InitializeProjectPage;
