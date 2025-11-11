"use client";

import DesignForm from "@/components/admin/designs/DesignForm";
import { CgSpinner } from "react-icons/cg";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const EditDesignPage = () => {
  const [design, setDesign] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetchDesign();
    }
  }, [id]);

  const fetchDesign = async () => {
    try {
      const response = await fetch(`/api/designs/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch design");
      }
      const data = await response.json();
      setDesign(data);
    } catch (error) {
      console.error("Error fetching design:", error);
      toast.error("Failed to fetch design details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <CgSpinner
            className="animate-spin text-blue-500 mx-auto mb-4"
            size={32}
          />
          <p className="text-gray-600 dark:text-gray-400">Loading design...</p>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FiHome className="mx-auto w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Design Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The design you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/admin/designs")}>
            <FiArrowLeft className="mr-2" />
            Back to Designs
          </Button>
        </div>
      </div>
    );
  }

  return <DesignForm design={design} />;
};

export default EditDesignPage;