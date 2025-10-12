"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import FileUpload from "./FileUpload";

interface File {
  id: string;
  url: string;
  type: string;
}

interface EditDesignFormProps {
  design: any;
  onClose: () => void;
}

const EditDesignForm = ({ design, onClose }: EditDesignFormProps) => {
  const [name, setName] = useState(design.name ?? "");
  const [description, setDescription] = useState(design.description ?? "");
  const [basePrice, setBasePrice] = useState(design.basePrice ?? "");
  const [priceRange, setPriceRange] = useState(design.priceRange ?? "");
  const [bedrooms, setBedrooms] = useState(design.bedrooms ?? "");
  const [bathrooms, setBathrooms] = useState(design.bathrooms ?? "");
  const [area, setArea] = useState(design.area ?? "");
  const [floors, setFloors] = useState(design.floors ?? "");
  const [planDetails, setPlanDetails] = useState(design.planDetails?.join("\n") ?? "");
  const [categoryId, setCategoryId] = useState(design.categoryId ?? "");
  const [categories, setCategories] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(design.files || []);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleUploadSuccess = (files: { url: string; type: string }[]) => {
    setUploadedFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`/api/designs/${design.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        basePrice: parseFloat(basePrice),
        priceRange,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        area: parseInt(area),
        floors: parseInt(floors),
        planDetails: planDetails.split("\n"),
        categoryId,
        files: uploadedFiles.map(file => ({ url: file.url, type: file.type, originalFileName: file.name })),
      }),
    });

    if (response.ok) {
      onClose();
    } else {
      console.error("Error updating design:", await response.text());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-card rounded-lg shadow-xl w-full max-w-2xl mx-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-border flex-shrink-0">
            <h3 className="text-lg font-medium text-foreground">Edit Design</h3>
          </div>
          <div className="p-6 space-y-4 flex-grow overflow-y-auto">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-muted-foreground"
              >
                Design Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-muted-foreground"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="planDetails"
                className="block text-sm font-medium text-muted-foreground"
              >
                Plan Details
              </label>
              <textarea
                id="planDetails"
                value={planDetails}
                onChange={(e) => setPlanDetails(e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card"
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Base Price
                </label>
                <input
                  type="number"
                  id="price"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="mt-1 block w-full border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card"
                />
              </div>
              <div>
                <label
                  htmlFor="priceRange"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Price Range
                </label>
                <input
                  type="text"
                  id="priceRange"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="mt-1 block w-full border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="bedrooms"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Bedrooms
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="mt-1 block w-full border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card"
                />
              </div>
              <div>
                <label
                  htmlFor="bathrooms"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Bathrooms
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="mt-1 block w-full border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card"
                />
              </div>
              <div>
                <label
                  htmlFor="area"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  id="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="mt-1 block w-full border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card"
                />
              </div>
              <div>
                <label
                  htmlFor="floors"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Floors
                </label>
                <input
                  type="number"
                  id="floors"
                  value={floors}
                  onChange={(e) => setFloors(e.target.value)}
                  className="mt-1 block w-full border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-muted-foreground"
              >
                Category
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 block w-full border border-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-card"
              >
                <option value="">Select a category</option>
                {Array.isArray(categories) && categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <FileUpload onUploadSuccess={handleUploadSuccess} initialFiles={uploadedFiles} fileTypeCategory="IMAGE" />
          </div>
          <div className="p-6 bg-muted flex justify-end gap-4 rounded-b-lg flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditDesignForm;

