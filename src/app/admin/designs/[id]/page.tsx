"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import EditDesignForm from "@/components/admin/designs/EditDesignForm";
import ConfirmationModal from "@/components/admin/designs/ConfirmationModal";
import DesignFileUpload from "@/components/admin/designs/DesignFileUpload";
import DesignFilePreview from "@/components/admin/designs/DesignFilePreview";
import VersionControl from "@/components/admin/designs/VersionControl"; // Import VersionControl

import { FiEdit, FiTrash, FiLayers, FiDollarSign, FiMaximize } from "react-icons/fi";
import { FaBed, FaBath } from "react-icons/fa";

const DesignPage = () => {
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [filePreviewKey, setFilePreviewKey] = useState(0);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const fetchDesign = async () => {
    if (id) {
      try {
        const response = await fetch(`/api/designs/${id}`);
        const data = await response.json();
        setDesign(data);
        setFilePreviewKey(prevKey => prevKey + 1);
      } catch (error) {
        console.error("Error fetching design:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDesign();
  }, [id]);

  const handleDelete = async () => {
    try {
      await fetch(`/api/designs/${id}`, { method: "DELETE" });
      router.push("/admin/designs");
    } catch (error) {
      console.error("Error deleting design:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!design) {
    return <div className="flex items-center justify-center h-screen">Design not found</div>;
  }

  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900/95">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">{design.name}</h2>
        <div className="flex gap-3">
          <button onClick={() => setFormOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            <FiEdit />
            <span>Edit</span>
          </button>
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
            <FiTrash />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Design Details Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300">{design.description}</p>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center justify-center">
                <FaBed className="w-7 h-7 text-blue-500 mb-2" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bedrooms</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{design.bedrooms}</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <FaBath className="w-7 h-7 text-blue-500 mb-2" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bathrooms</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{design.bathrooms}</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <FiMaximize className="w-7 h-7 text-blue-500 mb-2" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Area (sq ft)</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{design.area}</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <FiLayers className="w-7 h-7 text-blue-500 mb-2" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Floors</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{design.floors}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                    <FiDollarSign className="w-7 h-7 text-green-500" />
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Base Price</p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{formatPrice(design.basePrice)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <FiDollarSign className="w-7 h-7 text-green-500" />
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Price Range</p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{design.priceRange}</p>
                    </div>
                </div>
            </div>

            {design.planDetails && design.planDetails.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Plan Details</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                  {design.planDetails.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* File Upload Component */}
          <DesignFileUpload design={design} onUploadComplete={fetchDesign} />

          {/* Version Control Component */}
          <VersionControl files={design.files} />

          
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <DesignFilePreview designId={id} key={filePreviewKey} />
        </div>
      </div>

      {isFormOpen && <EditDesignForm design={design} onClose={() => setFormOpen(false)} />}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Design"
        message="Are you sure you want to delete this design? This action cannot be undone."
      />
    </div>
  );
};

export default DesignPage;