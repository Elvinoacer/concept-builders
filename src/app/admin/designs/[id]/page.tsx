"use client";

import BuildingCostEstimatesModal from "@/components/admin/designs/BuildingCostEstimatesModal";
import ConfirmationModal from "@/components/admin/designs/ConfirmationModal";
import DesignFilePreview from "@/components/admin/designs/DesignFilePreview";
import DesignFileUpload from "@/components/admin/designs/DesignFileUpload";
import NewDesignForm from "@/components/admin/designs/NewDesignForm";
import VersionControl from "@/components/admin/designs/VersionControl";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { FaBath, FaBed } from "react-icons/fa";
import {
  FiChevronDown,
  FiDollarSign,
  FiEdit,
  FiLayers,
  FiMaximize,
  FiStar,
  FiTrash,
  FiFolder,
} from "react-icons/fi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        const response = await fetch(`/api/designs/${id}`);
        const data = await response.json();
        setDesign(data);
        setFilePreviewKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error("Error fetching design:", error);
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
      await fetch(`/api/designs/${id}`, { method: "DELETE" });
      router.push("/admin/designs");
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
      folder: newFolderId
        ? folders.find((f) => f.id === newFolderId)
        : null,
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
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        Loading...
      </div>
    );
  }

  if (!design) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        Design not found
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900/95">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          {design.name}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FiEdit />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            <FiTrash />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Design Details Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {design.description}
            </p>

            {/* Folder Link Section */}
            <div className="mt-6 flex items-center gap-4">
              <FiFolder className="w-6 h-6 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                Folder:
              </span>
              <Select
                onValueChange={(value) =>
                  handleLinkToFolder(value === "none" ? null : value)
                }
                value={design.folderId || "none"}
              >
                <SelectTrigger className="w-[180px]">
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

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <FaBed className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bedrooms
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {design.bedrooms}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <FaBath className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bathrooms
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {design.bathrooms}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <FiMaximize className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Area (sq ft)
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {design.area}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <FiLayers className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Floors
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {design.floors}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
                <FiDollarSign className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Base Price
                  </p>
                  <p className="text-xl font-semibold text-gray-800 dark:text-white">
                    {formatPrice(design.basePrice)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
                <FiDollarSign className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Price Range
                  </p>
                  <p className="text-xl font-semibold text-gray-800 dark:text-white">
                    {design.priceRange}
                  </p>
                </div>
              </div>
            </div>

            {design.planDetails && design.planDetails.length > 0 && (
              <div className="mt-8">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                  Plan Details
                </h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  {design.planDetails.map((detail: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {design.buildingCostEstimates &&
            design.buildingCostEstimates.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Building Cost Estimates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {design.buildingCostEstimates.map((estimate: any, index: number) => (
                    <div
                      key={index}
                      className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border dark:border-gray-600"
                    >
                      <h4 className="text-xl font-semibold capitalize text-gray-800 dark:text-white">
                        {estimate.tier} Finish
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400 mt-2 mb-4 h-20 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                        {estimate.description}
                      </p>
                      <div className="space-y-3">
                        {estimate.costBreakdown.slice(0, 3).map((item: any, i: number) => (
                          <div
                            key={i}
                            className="flex justify-between items-center text-sm border-t border-gray-200 dark:border-gray-600 pt-3"
                          >
                            <span className="text-gray-600 dark:text-gray-300 w-2/3 truncate">
                              {item.item}
                            </span>
                            <span className="font-bold text-gray-900 dark:text-white text-base">
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
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsEstimatesModalOpen(true)}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    View Full Estimates
                  </button>
                </div>
              </div>
            )}

          {/* Calculator Options */}
          {design.calculatorOptions && design.calculatorOptions.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Optional Add-ons
              </h3>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {design.calculatorOptions.map((option: any, index: number) => (
                  <li
                    key={index}
                    className="flex justify-between items-center py-3"
                  >
                    <span className="text-gray-600 dark:text-gray-300">
                      {option.name}
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {formatPrice(option.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQ */}
          {design.faq && design.faq.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {design.faq.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-3"
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="flex justify-between items-center w-full py-2 text-left"
                    >
                      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {item.question}
                      </h4>
                      <span
                        className={`transform transition-transform ${openAccordion === index ? "rotate-180" : ""}`}
                      >
                        <FiChevronDown />
                      </span>
                    </button>
                    {openAccordion === index && (
                      <p className="text-gray-600 dark:text-gray-300 mt-2 pr-4">
                        {item.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {design.reviews && design.reviews.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Customer Reviews
              </h3>
              <div className="space-y-6">
                {design.reviews.map((review: any, index: number) => (
                  <div key={index} className="flex items-start space-x-4">
                    <Image
                      src={review.author.image || "/images/default-avatar.png"}
                      alt={review.author.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {review.author.name}
                        </p>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Upload Component */}
          <DesignFileUpload design={design} onUploadComplete={fetchDesign} />

          {/* Version Control Component */}
          <VersionControl designId={id} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <DesignFilePreview designId={id} key={filePreviewKey} />
        </div>
      </div>

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
