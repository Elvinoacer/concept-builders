"use client";

import DesignForm from "@/components/admin/designs/DesignForm";
import { CgSpinner } from "react-icons/cg";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface DesignResponse {
  id: string;
  name?: string;
}

const EditDesignPage = () => {
  const [design, setDesign] = useState<DesignResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const fetchDesign = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      setLoadError(null);
      const response = await fetch(`/api/designs/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch design (${response.status})`);
      }
      const data = (await response.json()) as DesignResponse;
      setDesign(data);
    } catch (error) {
      console.error("Error fetching design:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch design details.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDesign();
    } else {
      setLoading(false);
      setLoadError("Invalid design id");
    }
  }, [id, fetchDesign]);

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
            {loadError ? "Unable To Load Design" : "Design Not Found"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {loadError || "The design you're looking for doesn't exist."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/designs")}
            >
              <FiArrowLeft className="mr-2" />
              Back to Designs
            </Button>
            {loadError && <Button onClick={fetchDesign}>Retry</Button>}
          </div>
        </div>
      </div>
    );
  }

  return <DesignForm design={design} />;
};

export default EditDesignPage;
