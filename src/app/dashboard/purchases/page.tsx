"use client";
import PurchaseListItem from "@/components/dashboard/PurchaseListItem";
import { AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const PurchasesPage = () => {
  const { data: session } = useSession();
  const [sortOrder, setSortOrder] = useState("date_desc");
  const [filterFileType, setFilterFileType] = useState("all");
  const [purchasedDesigns, setPurchasedDesigns] = useState([]);

  useEffect(() => {
    const fetchPurchasedDesigns = async () => {
      try {
        const params = new URLSearchParams({
          sortOrder,
          filterFileType,
        }).toString();
        const response = await fetch(`/api/purchases?${params}`);
        const data = await response.json();
        setPurchasedDesigns(data);
      } catch (error) {
        console.error("Error fetching purchased designs:", error);
      }
    };

    if (session) {
      fetchPurchasedDesigns();
    }
  }, [session, sortOrder, filterFileType]);

  return (
    <div className="dark:bg-gray-950 min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
          My Digital Library
        </h2>
        <p className="text-gray-500 mt-1 dark:text-gray-400 max-w-2xl">
          Access all your purchased design plans, download files, and manage
          your projects.
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Filter by:
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterFileType("all")}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${filterFileType === "all" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterFileType("PDF")}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${filterFileType === "PDF" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"}`}
            >
              PDF
            </button>
            <button
              onClick={() => setFilterFileType("PDF & CAD")}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${filterFileType === "PDF & CAD" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"}`}
            >
              PDF & CAD
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-order"
            className="text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Sort by:
          </label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option value="date_desc">Newest</option>
            <option value="date_asc">Oldest</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Design List */}
      <div className="flex flex-col gap-4">
        {purchasedDesigns.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No Purchases Yet</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">It looks like you haven't purchased any designs yet. Start exploring our collection!</p>
            <a href="/designs" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Browse Designs
            </a>
          </div>
        ) : (
          <AnimatePresence>
            {purchasedDesigns.map((design) => (
              <PurchaseListItem key={design.id} design={design} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default PurchasesPage;
