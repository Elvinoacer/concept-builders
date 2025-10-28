"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FiArrowLeft,
  FiPlus,
  FiSave,
  FiEdit,
  FiHome,
  FiDollarSign,
  FiLayers,
  FiFileText,
  FiPackage,
  FiUpload,
  FiImage,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import FileUpload from "@/components/admin/designs/FileUpload";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CreateDesignPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [floors, setFloors] = useState("");
  const [planDetails, setPlanDetails] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [minBuildingCost, setMinBuildingCost] = useState("");
  const [maxBuildingCost, setMaxBuildingCost] = useState("");
  const [buildingCostEstimates, setBuildingCostEstimates] = useState({
    basic: { description: "", costBreakdown: [{ item: "", cost: "" }] },
    luxury: { description: "", costBreakdown: [{ item: "", cost: "" }] },
  });
  const [pdfPrice, setPdfPrice] = useState("");
  const [cadPrice, setCadPrice] = useState("");
  const [pdfAndCadPrice, setPdfAndCadPrice] = useState("");
  const [packageOptions, setPackageOptions] = useState<
    { name: string; price: string }[]
  >([]);
  const [buildingCostFactors, setBuildingCostFactors] = useState<
    { name: string; unit: string; price: string }[]
  >([]);

  const [activeSection, setActiveSection] = useState("basic");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleUploadSuccess = (
    newFiles: { url: string; type: string; originalFileName: string }[]
  ) => {
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleFileRemove = async (fileUrl: string) => {
    try {
      const key = new URL(fileUrl).pathname.substring(1);

      await fetch("/api/designs/delete-uploaded-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      });

      setFiles(files.filter((file: any) => file.url !== fileUrl));
      toast.success("File deleted successfully.");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file.");
    }
  };

  const handleCostBreakdownChange = (
    tier: "basic" | "luxury",
    index: number,
    field: "item" | "cost",
    value: string
  ) => {
    const newEstimates = { ...buildingCostEstimates };
    newEstimates[tier].costBreakdown[index][field] = value;
    setBuildingCostEstimates(newEstimates);
  };

  const addCostBreakdownItem = (tier: "basic" | "luxury") => {
    const newEstimates = { ...buildingCostEstimates };
    newEstimates[tier].costBreakdown.push({ item: "", cost: "" });
    setBuildingCostEstimates(newEstimates);
  };

  const removeCostBreakdownItem = (tier: "basic" | "luxury", index: number) => {
    const newEstimates = { ...buildingCostEstimates };
    newEstimates[tier].costBreakdown.splice(index, 1);
    setBuildingCostEstimates(newEstimates);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name,
      description,
      basePrice: parseFloat(basePrice),
      priceRange,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      area: parseFloat(area),
      floors: parseInt(floors),
      planDetails: planDetails.split("\n"),
      categoryId,
      minBuildingCost: parseFloat(minBuildingCost) || null,
      maxBuildingCost: parseFloat(maxBuildingCost) || null,
      pdfPrice: parseFloat(pdfPrice) || null,
      cadPrice: parseFloat(cadPrice) || null,
      pdfAndCadPrice: parseFloat(pdfAndCadPrice) || null,
      packageOptions: {
        options: packageOptions.map((option) => ({
          name: option.name,
          price: parseFloat(option.price) || 0,
        })),
      },
      buildingCostFactors: {
        options: buildingCostFactors.map((option) => ({
          name: option.name,
          unit: option.unit,
          price: parseFloat(option.price) || 0,
        })),
      },
      buildingCostEstimates: Object.entries(buildingCostEstimates).map(
        ([tier, data]) => ({
          tier,
          description: data.description,
          costBreakdown: data.costBreakdown.map((item) => ({
            ...item,
            cost: parseFloat(item.cost) || 0,
          })),
        })
      ),
      files: files.map((file: any) => ({
        url: file.url,
        type: file.type,
        originalFileName: file.originalFileName,
      })),
    };

    try {
      const response = await fetch("/api/designs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Design created successfully!");
        router.push("/admin/designs");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Error creating design:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigationSections = [
    { id: "basic", label: "Basic Info", icon: FiHome },
    { id: "specifications", label: "Specifications", icon: FiLayers },
    { id: "pricing", label: "Pricing", icon: FiDollarSign },
    { id: "files", label: "Files", icon: FiUpload },
    { id: "costing", label: "Cost Estimates", icon: FiFileText },
    { id: "packages", label: "Packages", icon: FiPackage },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/10">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/designs"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                Back to Designs
              </Link>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                  Create New Design
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Add a new architectural design to your portfolio
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/designs")}
                disabled={isSubmitting}
              >
                <FiArrowLeft className="mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <CgSpinner className="animate-spin mr-2" />
                ) : (
                  <FiSave className="mr-2" />
                )}
                {isSubmitting ? "Creating..." : "Create Design"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiLayers className="w-4 h-4" />
                Design Sections
              </h3>
              <nav className="space-y-2">
                {navigationSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-200 ${
                        activeSection === section.id
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Form Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <ScrollArea className="h-[calc(100vh-200px)]">
                <form onSubmit={handleSubmit} className="p-8">
                  {/* Basic Information Section */}
                  {activeSection === "basic" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <FiHome className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Basic Information
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">
                            Design Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Modern Villa"
                            className="rounded-xl"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="category"
                            className="text-sm font-medium"
                          >
                            Category *
                          </Label>
                          <select
                            id="category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select a category</option>
                            {categories.map((category: any) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="A brief description of the design features, style, and unique characteristics..."
                          className="rounded-xl min-h-[120px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="planDetails"
                          className="text-sm font-medium"
                        >
                          Plan Details (one per line)
                        </Label>
                        <Textarea
                          id="planDetails"
                          name="planDetails"
                          value={planDetails}
                          onChange={(e) => setPlanDetails(e.target.value)}
                          placeholder="e.g., 3 Bedrooms\n2 Bathrooms\nOpen-plan kitchen\nSwimming pool\nGarden area"
                          className="rounded-xl min-h-[100px]"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Specifications Section */}
                  {activeSection === "specifications" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <FiLayers className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Specifications
                        </h2>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="bedrooms"
                            className="text-sm font-medium"
                          >
                            Bedrooms
                          </Label>
                          <Input
                            id="bedrooms"
                            name="bedrooms"
                            type="number"
                            value={bedrooms}
                            onChange={(e) => setBedrooms(e.target.value)}
                            placeholder="e.g., 3"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="bathrooms"
                            className="text-sm font-medium"
                          >
                            Bathrooms
                          </Label>
                          <Input
                            id="bathrooms"
                            name="bathrooms"
                            type="number"
                            value={bathrooms}
                            onChange={(e) => setBathrooms(e.target.value)}
                            placeholder="e.g., 2"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="area" className="text-sm font-medium">
                            Area (sq ft)
                          </Label>
                          <Input
                            id="area"
                            name="area"
                            type="number"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            placeholder="e.g., 1200"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="floors"
                            className="text-sm font-medium"
                          >
                            Floors
                          </Label>
                          <Input
                            id="floors"
                            name="floors"
                            type="number"
                            value={floors}
                            onChange={(e) => setFloors(e.target.value)}
                            placeholder="e.g., 2"
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Pricing Section */}
                  {activeSection === "pricing" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                          <FiDollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Pricing Information
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="basePrice"
                            className="text-sm font-medium"
                          >
                            Base Price ($)
                          </Label>
                          <Input
                            id="basePrice"
                            name="basePrice"
                            type="number"
                            value={basePrice}
                            onChange={(e) => setBasePrice(e.target.value)}
                            placeholder="e.g., 50000"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="priceRange"
                            className="text-sm font-medium"
                          >
                            Price Range
                          </Label>
                          <Input
                            id="priceRange"
                            name="priceRange"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            placeholder="e.g., $50k - $70k"
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="pdfPrice"
                            className="text-sm font-medium"
                          >
                            PDF Price ($)
                          </Label>
                          <Input
                            id="pdfPrice"
                            name="pdfPrice"
                            type="number"
                            value={pdfPrice}
                            onChange={(e) => setPdfPrice(e.target.value)}
                            placeholder="e.g., 0"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="cadPrice"
                            className="text-sm font-medium"
                          >
                            CAD Price ($)
                          </Label>
                          <Input
                            id="cadPrice"
                            name="cadPrice"
                            type="number"
                            value={cadPrice}
                            onChange={(e) => setCadPrice(e.target.value)}
                            placeholder="e.g., 100"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="pdfAndCadPrice"
                            className="text-sm font-medium"
                          >
                            PDF & CAD Price ($)
                          </Label>
                          <Input
                            id="pdfAndCadPrice"
                            name="pdfAndCadPrice"
                            type="number"
                            value={pdfAndCadPrice}
                            onChange={(e) => setPdfAndCadPrice(e.target.value)}
                            placeholder="e.g., 150"
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Files Section */}
                  {activeSection === "files" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <FiUpload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Design Files
                        </h2>
                      </div>

                      <div className="space-y-8">
                        <div>
                          <Label className="text-sm font-medium flex items-center gap-2 mb-4">
                            <FiFileText className="w-4 h-4" />
                            PDF Files
                          </Label>
                          <FileUpload
                            onUploadSuccess={handleUploadSuccess}
                            onFileRemove={handleFileRemove}
                            initialFiles={files.filter(
                              (f: any) => f.type === "PDF"
                            )}
                            fileTypeCategory="PDF"
                            multiple
                            accept="application/pdf"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium flex items-center gap-2 mb-4">
                            <FiLayers className="w-4 h-4" />
                            CAD Files
                          </Label>
                          <FileUpload
                            onUploadSuccess={handleUploadSuccess}
                            onFileRemove={handleFileRemove}
                            initialFiles={files.filter(
                              (f: any) => f.type === "CAD"
                            )}
                            fileTypeCategory="CAD"
                            multiple
                            accept=".dwg, .dxf"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium flex items-center gap-2 mb-4">
                            <FiImage className="w-4 h-4" />
                            3D Renders & Images
                          </Label>
                          <FileUpload
                            onUploadSuccess={handleUploadSuccess}
                            onFileRemove={handleFileRemove}
                            initialFiles={files.filter(
                              (f: any) => f.type === "IMAGE"
                            )}
                            fileTypeCategory="IMAGE"
                            multiple
                            accept="image/*"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium flex items-center gap-2 mb-4">
                            <FiHome className="w-4 h-4" />
                            Floor Plans
                          </Label>
                          <FileUpload
                            onUploadSuccess={handleUploadSuccess}
                            onFileRemove={handleFileRemove}
                            initialFiles={files.filter(
                              (f: any) => f.type === "FLOOR_PLAN"
                            )}
                            fileTypeCategory="FLOOR_PLAN"
                            multiple
                            accept="image/*, application/pdf"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Cost Estimates Section */}
                  {activeSection === "costing" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <FiFileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Building Cost Estimates
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="minBuildingCost"
                            className="text-sm font-medium"
                          >
                            Min Building Cost ($)
                          </Label>
                          <Input
                            id="minBuildingCost"
                            name="minBuildingCost"
                            type="number"
                            value={minBuildingCost}
                            onChange={(e) => setMinBuildingCost(e.target.value)}
                            placeholder="e.g., 100000"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="maxBuildingCost"
                            className="text-sm font-medium"
                          >
                            Max Building Cost ($)
                          </Label>
                          <Input
                            id="maxBuildingCost"
                            name="maxBuildingCost"
                            type="number"
                            value={maxBuildingCost}
                            onChange={(e) => setMaxBuildingCost(e.target.value)}
                            placeholder="e.g., 150000"
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Building Cost Factors */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Building Cost Factors
                        </h3>
                        {buildingCostFactors.map((factor, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                          >
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Factor Name
                              </Label>
                              <Input
                                placeholder="e.g., Foundation"
                                value={factor.name}
                                onChange={(e) => {
                                  const newFactors = [...buildingCostFactors];
                                  newFactors[index].name = e.target.value;
                                  setBuildingCostFactors(newFactors);
                                }}
                                className="rounded-lg"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Unit
                              </Label>
                              <Input
                                placeholder="e.g., per sqft"
                                value={factor.unit}
                                onChange={(e) => {
                                  const newFactors = [...buildingCostFactors];
                                  newFactors[index].unit = e.target.value;
                                  setBuildingCostFactors(newFactors);
                                }}
                                className="rounded-lg"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Price per Unit
                              </Label>
                              <Input
                                placeholder="e.g., 50"
                                type="number"
                                value={factor.price}
                                onChange={(e) => {
                                  const newFactors = [...buildingCostFactors];
                                  newFactors[index].price = e.target.value;
                                  setBuildingCostFactors(newFactors);
                                }}
                                className="rounded-lg"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const newFactors = [...buildingCostFactors];
                                newFactors.splice(index, 1);
                                setBuildingCostFactors(newFactors);
                              }}
                              className="h-10"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setBuildingCostFactors([
                              ...buildingCostFactors,
                              { name: "", unit: "", price: "" },
                            ])
                          }
                          className="rounded-lg"
                        >
                          <FiPlus className="mr-2" />
                          Add Building Cost Factor
                        </Button>
                      </div>

                      {/* Cost Breakdown */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Cost Breakdown by Tier
                        </h3>
                        {["basic", "luxury"].map((tier) => (
                          <div
                            key={tier}
                            className="rounded-xl border border-gray-200 dark:border-gray-600 p-6 bg-white dark:bg-gray-700/50"
                          >
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white capitalize mb-4">
                              {tier} Tier
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <Label
                                  htmlFor={`${tier}-description`}
                                  className="text-sm font-medium"
                                >
                                  Description
                                </Label>
                                <Textarea
                                  id={`${tier}-description`}
                                  value={
                                    buildingCostEstimates[tier]?.description ||
                                    ""
                                  }
                                  onChange={(e) => {
                                    const newEstimates = {
                                      ...buildingCostEstimates,
                                    };
                                    newEstimates[tier].description =
                                      e.target.value;
                                    setBuildingCostEstimates(newEstimates);
                                  }}
                                  rows={2}
                                  className="rounded-lg"
                                  placeholder={`Describe the ${tier} tier features and quality...`}
                                />
                              </div>
                              <div>
                                <h5 className="text-sm font-medium mb-3">
                                  Cost Breakdown
                                </h5>
                                {buildingCostEstimates[tier]?.costBreakdown.map(
                                  (item, index) => (
                                    <div
                                      key={index}
                                      className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 items-end"
                                    >
                                      <Input
                                        placeholder="Item description"
                                        value={item.item}
                                        onChange={(e) =>
                                          handleCostBreakdownChange(
                                            tier,
                                            index,
                                            "item",
                                            e.target.value
                                          )
                                        }
                                        className="rounded-lg"
                                      />
                                      <Input
                                        placeholder="Cost ($)"
                                        type="number"
                                        value={item.cost}
                                        onChange={(e) =>
                                          handleCostBreakdownChange(
                                            tier,
                                            index,
                                            "cost",
                                            e.target.value
                                          )
                                        }
                                        className="rounded-lg"
                                      />
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                          removeCostBreakdownItem(tier, index)
                                        }
                                        className="h-10"
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  )
                                )}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addCostBreakdownItem(tier)}
                                  className="rounded-lg"
                                >
                                  <FiPlus className="mr-2" />
                                  Add Cost Item
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Packages Section */}
                  {activeSection === "packages" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                          <FiPackage className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Package Options
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300">
                          Add fixed-price add-ons that customers can purchase
                          with this design.
                        </p>

                        {packageOptions.map((option, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                          >
                            <div className="space-y-2 md:col-span-2">
                              <Label className="text-sm font-medium">
                                Package Name
                              </Label>
                              <Input
                                placeholder="e.g., Premium Support, 3D Visualization, etc."
                                value={option.name}
                                onChange={(e) => {
                                  const newOptions = [...packageOptions];
                                  newOptions[index].name = e.target.value;
                                  setPackageOptions(newOptions);
                                }}
                                className="rounded-lg"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Price ($)
                              </Label>
                              <Input
                                placeholder="e.g., 500"
                                type="number"
                                value={option.price}
                                onChange={(e) => {
                                  const newOptions = [...packageOptions];
                                  newOptions[index].price = e.target.value;
                                  setPackageOptions(newOptions);
                                }}
                                className="rounded-lg"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const newOptions = [...packageOptions];
                                newOptions.splice(index, 1);
                                setPackageOptions(newOptions);
                              }}
                              className="h-10 md:col-span-3"
                            >
                              Remove Package
                            </Button>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPackageOptions([
                              ...packageOptions,
                              { name: "", price: "" },
                            ])
                          }
                          className="rounded-lg"
                        >
                          <FiPlus className="mr-2" />
                          Add Package Option
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </ScrollArea>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDesignPage;
