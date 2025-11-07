"use client";

import BuildingCostEstimatesModal from "@/components/admin/designs/BuildingCostEstimatesModal";
import ConfirmationModal from "@/components/admin/designs/ConfirmationModal";
import DesignFilePreview from "@/components/admin/designs/DesignFilePreview";
import DesignFileUpload from "@/components/admin/designs/DesignFileUpload";
import NewDesignForm from "@/components/admin/designs/NewDesignForm";
import PackageOptionsManager from "@/components/admin/designs/PackageOptionsManager";
import VersionControl from "@/components/admin/designs/VersionControl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FaBath, FaBed } from "react-icons/fa";
import {
  FiDollarSign,
  FiEdit,
  FiFolder,
  FiHome,
  FiInfo,
  FiLayers,
  FiMaximize,
  FiStar,
  FiTrash,
} from "react-icons/fi";

interface Folder {
  id: string;
  name: string;
}

const DesignPage = () => {
  const [design, setDesign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEstimatesModalOpen, setIsEstimatesModalOpen] = useState(false);
  const [filePreviewKey, setFilePreviewKey] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const fetchDesign = async () => {
    if (id) {
      try {
        setLoading(true);
        const response = await fetch(`/api/designs/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch design");
        }
        const data = await response.json();
        setDesign(data);
        setFilePreviewKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error("Error fetching design:", error);
        toast.error("Failed to load design");
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await fetch("/api/admin/folders");
      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      } else {
        console.error("Failed to fetch folders");
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  useEffect(() => {
    fetchDesign();
    fetchFolders();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/designs/${id}`, { method: "DELETE" });
      if (response.ok) {
        const data = await response.json();
        toast.success(`Design "${data.designName}" deleted successfully.`);
        router.push("/admin/designs");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to delete design.");
      }
    } catch (error) {
      console.error("Error deleting design:", error);
      toast.error("Failed to delete design.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateSuccess = () => {
    setFormOpen(false);
    fetchDesign();
  };

  const handleLinkToFolder = async (newFolderId: string | null) => {
    const originalFolderId = design.folderId;
    const originalFolderName = design.folder?.name;

    // Optimistic update
    setDesign((prevDesign: any) => ({
      ...prevDesign,
      folderId: newFolderId,
      folder: newFolderId ? folders.find((f) => f.id === newFolderId) : null,
    }));
    toast.info(
      newFolderId
        ? `Linking design to folder ${folders.find((f) => f.id === newFolderId)?.name}...`
        : "Unlinking design from folder..."
    );

    try {
      const response = await fetch(`/api/designs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderId: newFolderId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update folder link");
      }

      toast.success(
        newFolderId
          ? `Design successfully linked to folder ${folders.find((f) => f.id === newFolderId)?.name}.`
          : "Design successfully unlinked from folder."
      );
      fetchDesign(); // Re-fetch to ensure data consistency
    } catch (error: any) {
      console.error("Error linking design to folder:", error);
      toast.error(`Failed to update folder link: ${error.message}`);
      // Revert optimistic update
      setDesign((prevDesign: any) => ({
        ...prevDesign,
        folderId: originalFolderId,
        folder: originalFolderId
          ? folders.find((f) => f.id === originalFolderId)
          : null,
      }));
    }
  };

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    if (typeof numericPrice !== "number" || isNaN(numericPrice)) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  const toggleAccordion = (accordion: number | null) => {
    setOpenAccordion(openAccordion === accordion ? null : accordion);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FiStar
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
          fill={i < rating ? "currentColor" : "none"}
          size={16}
        />
      );
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900/95 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 sm:h-10 sm:w-80" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>

            {/* Right Column Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-80 rounded-xl" />
              <Skeleton className="h-40 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900/95 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <FiHome className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Design Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The design you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <button
            onClick={() => router.push("/admin/designs")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Designs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900/95 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white leading-tight">
              {design.name}
            </h1>
            {design.category && (
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {design.category.name}
              </Badge>
            )}
          </div>
          <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFormOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex-1 sm:flex-none order-2 xs:order-1"
            >
              <FiEdit size={16} />
              <span>Edit Design</span>
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm flex-1 sm:flex-none order-1 xs:order-2"
            >
              <FiTrash size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Design Details Card */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3 mb-4">
                <FiInfo className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  {design.description}
                </p>
              </div>

              {/* Folder Link Section */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <FiFolder className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Folder:
                    </span>
                  </div>
                  <Select
                    onValueChange={(value) =>
                      handleLinkToFolder(value === "none" ? null : value)
                    }
                    value={design.folderId || "none"}
                  >
                    <SelectTrigger className="min-w-[160px] flex-1">
                      <SelectValue placeholder="Select Folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Folder</SelectItem>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="mt-6 grid grid-cols-2 xs:grid-cols-4 gap-3 sm:gap-4">
                <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                  <FaBed className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500 mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
                    Bedrooms
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                    {design.bedrooms}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                  <FaBath className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500 mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
                    Bathrooms
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                    {design.bathrooms}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                  <FiMaximize className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500 mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
                    Area (sq ft)
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                    {design.area?.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                  <FiLayers className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500 mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
                    Floors
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                    {design.floors}
                  </p>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                    <FiDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Base Price
                    </p>
                    <p className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                      {formatPrice(design.basePrice)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                    <FiDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Price Range
                    </p>
                    <p className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                      {design.priceRange || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan Details */}
              {design.planDetails && design.planDetails.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-3">
                    Plan Details
                  </h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    {design.planDetails.map((detail: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-sm sm:text-base">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Building Cost Estimates */}
            {design.buildingCostEstimates &&
              design.buildingCostEstimates.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
                    Building Cost Estimates
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {design.buildingCostEstimates.map(
                      (estimate: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                        >
                          <h4 className="text-lg font-semibold capitalize text-gray-800 dark:text-white mb-2">
                            {estimate.tier} Finish
                          </h4>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                            {estimate.description}
                          </p>
                          <div className="space-y-3">
                            {estimate.costBreakdown
                              .slice(0, 3)
                              .map((item: any, i: number) => (
                                <div
                                  key={i}
                                  className="flex justify-between items-center text-sm border-t border-gray-200 dark:border-gray-600 pt-3"
                                >
                                  <span className="text-gray-600 dark:text-gray-300 flex-1 truncate pr-2">
                                    {item.item}
                                  </span>
                                  <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base flex-shrink-0">
                                    {formatPrice(item.cost)}
                                  </span>
                                </div>
                              ))}
                            {estimate.costBreakdown.length > 3 && (
                              <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
                                ...and {estimate.costBreakdown.length - 3} more
                                items
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="mt-4 sm:mt-6 text-center">
                    <button
                      onClick={() => setIsEstimatesModalOpen(true)}
                      className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      View Full Estimates
                    </button>
                  </div>
                </div>
              )}

            {/* Package Options Manager */}
            <PackageOptionsManager
              designId={design.id}
              initialOptions={design.packageOptions || []}
            />

            {/* File Upload Component */}
            <DesignFileUpload design={design} onUploadComplete={fetchDesign} />

            {/* Version Control Component */}
            <VersionControl designId={id} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <DesignFilePreview designId={id} key={filePreviewKey} />

            {/* Additional sidebar content can go here */}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <NewDesignForm
          designToEdit={design}
          onClose={() => setFormOpen(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Design"
        message="Are you sure you want to delete this design? This action cannot be undone."
        isLoading={isDeleting}
      />
      {isEstimatesModalOpen && (
        <BuildingCostEstimatesModal
          estimates={design.buildingCostEstimates}
          onClose={() => setIsEstimatesModalOpen(false)}
          formatPrice={formatPrice}
        />
      )}
    </div>
  );
};

export default DesignPage;
