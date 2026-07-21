"use client";

import CloudFileUpload from "@/components/admin/designs/CloudFileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import {
  FiArrowLeft,
  FiCheck,
  FiChevronRight,
  FiDollarSign,
  FiFileText,
  FiHome,
  FiImage,
  FiLayers,
  FiPackage,
  FiPlus,
  FiSave,
  FiUpload,
} from "react-icons/fi";
import { toast } from "sonner";

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

  const [minBuildingCost, setMinBuildingCost] = useState("");
  const [maxBuildingCost, setMaxBuildingCost] = useState("");
  const [buildingCostEstimates, setBuildingCostEstimates] = useState({
    basic: { description: "", costBreakdown: [{ item: "", cost: "" }] },
    luxury: { description: "", costBreakdown: [{ item: "", cost: "" }] },
  });

  const [packageOptions, setPackageOptions] = useState<
    {
      name: string;
      price: string;
      file: any[];
    }[]
  >([]);

  const [architecturalDesign, setArchitecturalDesign] = useState({
    description: "",
    overview: "",
    pdfFiles: [],
    cadFiles: [],
  });
  const [structuralDesign, setStructuralDesign] = useState({
    description: "",
    overview: "",
    pdfFiles: [],
    cadFiles: [],
  });
  const [billOfQuantities, setBillOfQuantities] = useState({
    description: "",
    overview: "",
    excelFiles: [],
  });

  const [architecturalPdfPrice, setArchitecturalPdfPrice] = useState("");
  const [architecturalCadPrice, setArchitecturalCadPrice] = useState("");
  const [structuralPdfPrice, setStructuralPdfPrice] = useState("");
  const [structuralCadPrice, setStructuralCadPrice] = useState("");
  const [billOfQuantitiesPrice, setBillOfQuantitiesPrice] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [floorPlans, setFloorPlans] = useState<any[]>([]);

  const [activeSection, setActiveSection] = useState("basic");
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set()
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Validate sections for completion
  useEffect(() => {
    const newCompletedSections = new Set(completedSections);

    // Basic Info validation
    if (name.trim() && description.trim() && categoryId) {
      newCompletedSections.add("basic");
    } else {
      newCompletedSections.delete("basic");
    }

    // Files validation (at least one image required)
    if (images.length > 0) {
      newCompletedSections.add("files");
    } else {
      newCompletedSections.delete("files");
    }

    setCompletedSections(newCompletedSections);
  }, [name, description, categoryId, images]);

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

  const validateForm = () => {
    const errors = [];
    if (!name.trim()) errors.push("Design Name is required.");
    if (!description.trim()) errors.push("Description is required.");
    if (!categoryId) errors.push("Category is required.");
    if (!basePrice || parseFloat(basePrice) <= 0)
      errors.push("Base Price must be a positive number.");
    if (images.length === 0) errors.push("At least one image is required.");
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (formErrors.length > 0) {
      toast.error(formErrors.join("\n"));
      // Scroll to the first error section
      if (!name.trim() || !description.trim() || !categoryId) {
        setActiveSection("basic");
      } else if (images.length === 0) {
        setActiveSection("files");
      }
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name,
      description,
      basePrice: parseFloat(basePrice),
      priceRange,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      area: area ? parseFloat(area) : null,
      floors: floors ? parseInt(floors) : null,
      planDetails: planDetails
        ? planDetails.split("\n").filter((line) => line.trim())
        : [],
      categoryId,
      minBuildingCost: minBuildingCost ? parseFloat(minBuildingCost) : null,
      maxBuildingCost: maxBuildingCost ? parseFloat(maxBuildingCost) : null,
      architecturalPdfPrice: architecturalPdfPrice
        ? parseFloat(architecturalPdfPrice)
        : null,
      architecturalCadPrice: architecturalCadPrice
        ? parseFloat(architecturalCadPrice)
        : null,
      structuralPdfPrice: structuralPdfPrice
        ? parseFloat(structuralPdfPrice)
        : null,
      structuralCadPrice: structuralCadPrice
        ? parseFloat(structuralCadPrice)
        : null,
      billOfQuantitiesPrice: billOfQuantitiesPrice
        ? parseFloat(billOfQuantitiesPrice)
        : null,
      packageOptions: {
        create: packageOptions.map((option) => ({
          name: option.name,
          price: parseFloat(option.price) || 0,
          file: option.file?.[0]
            ? {
                create: {
                  name: option.file[0].originalFileName,
                  url: option.file[0].url,
                  type: "FILE",
                },
              }
            : undefined,
        })),
      },
      buildingCostEstimates: Object.entries(buildingCostEstimates)
        .map(([tier, data]) => ({
          tier,
          description: data.description,
          costBreakdown: data.costBreakdown
            .filter((item) => item.item.trim() && item.cost)
            .map((item) => ({
              ...item,
              cost: parseFloat(item.cost) || 0,
            })),
        }))
        .filter(
          (estimate) =>
            estimate.description || estimate.costBreakdown.length > 0
        ),
      architecturalDesign: {
        create: {
          type: "ARCHITECTURAL",
          description: architecturalDesign.description,
          overview: architecturalDesign.overview,
          pdfFiles: {
            create: architecturalDesign.pdfFiles.map((file: any) => ({
              name: file.originalFileName,
              url: file.url,
              type: "PDF",
            })),
          },
          cadFiles: {
            create: architecturalDesign.cadFiles.map((file: any) => ({
              name: file.originalFileName,
              url: file.url,
              type: "CAD",
            })),
          },
        },
      },
      structuralDesign: {
        create: {
          type: "STRUCTURAL",
          description: structuralDesign.description,
          overview: structuralDesign.overview,
          pdfFiles: {
            create: structuralDesign.pdfFiles.map((file: any) => ({
              name: file.originalFileName,
              url: file.url,
              type: "PDF",
            })),
          },
          cadFiles: {
            create: structuralDesign.cadFiles.map((file: any) => ({
              name: file.originalFileName,
              url: file.url,
              type: "CAD",
            })),
          },
        },
      },
      billOfQuantities: {
        create: {
          type: "BILL_OF_QUANTITIES",
          description: billOfQuantities.description,
          overview: billOfQuantities.overview,
          excelFiles: {
            create: billOfQuantities.excelFiles.map((file: any) => ({
              name: file.originalFileName,
              url: file.url,
              type: "EXCEL",
            })),
          },
        },
      },
      images: {
        create: images.map((file: any) => ({
          name: file.originalFileName,
          url: file.url,
          type: "IMAGE",
        })),
      },
      floorPlans: {
        create: floorPlans.map((file: any) => ({
          name: file.originalFileName,
          url: file.url,
          type: "FLOOR_PLAN",
        })),
      },
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
        toast.error(`Error: ${errorData.error || "Failed to create design"}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Error creating design:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigationSections = [
    { id: "basic", label: "Basic Info", icon: FiHome, required: true },
    { id: "specifications", label: "Specifications", icon: FiLayers },
    { id: "pricing", label: "Pricing", icon: FiDollarSign },
    { id: "files", label: "Files", icon: FiUpload, required: true },
    { id: "costing", label: "Cost Estimates", icon: FiFileText },
    { id: "packages", label: "Packages", icon: FiPackage },
  ];

  const getProgressPercentage = () => {
    const requiredSections = navigationSections.filter(
      (section) => section.required
    );
    const completedRequired = requiredSections.filter((section) =>
      completedSections.has(section.id)
    ).length;
    return Math.round((completedRequired / requiredSections.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/10">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-10 w-10 flex-shrink-0"
              >
                <Link href="/admin/designs">
                  <FiArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                  Create New Design
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mt-1 truncate">
                  Add a new architectural design to your portfolio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Progress Indicator */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Progress:</span>
                <span className="font-semibold">
                  {getProgressPercentage()}%
                </span>
              </div>

              <Button
                variant="outline"
                onClick={() => router.push("/admin/designs")}
                disabled={isSubmitting}
                className="h-10 flex-1 sm:flex-none"
              >
                <FiArrowLeft className="mr-2 w-4 h-4" />
                <span className="hidden xs:inline">Cancel</span>
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-1 sm:flex-none"
              >
                {isSubmitting ? (
                  <CgSpinner className="animate-spin mr-2 w-4 h-4" />
                ) : (
                  <FiSave className="mr-2 w-4 h-4" />
                )}
                <span className="hidden xs:inline">
                  {isSubmitting ? "Creating..." : "Create Design"}
                </span>
                <span className="xs:hidden">Create</span>
              </Button>
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="mt-3 sm:hidden">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Completion</span>
              <span>{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Navigation Header */}
          <div className="lg:hidden">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Design Sections</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="h-8"
                  >
                    {isMobileMenuOpen ? "Hide" : "Show"} Sections
                  </Button>
                </CardTitle>
              </CardHeader>
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <CardContent className="pt-0">
                      <nav className="space-y-2">
                        {navigationSections.map((section) => {
                          const Icon = section.icon;
                          const isCompleted = completedSections.has(section.id);
                          return (
                            <button
                              key={section.id}
                              onClick={() => {
                                setActiveSection(section.id);
                                setIsMobileMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                                activeSection === section.id
                                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4" />
                                <span className="font-medium text-sm">
                                  {section.label}
                                </span>
                                {section.required && (
                                  <span className="text-red-500 text-xs">
                                    *
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {isCompleted && (
                                  <FiCheck className="w-3 h-3 text-green-500" />
                                )}
                                <FiChevronRight className="w-4 h-4 opacity-50" />
                              </div>
                            </button>
                          );
                        })}
                      </nav>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          {/* Desktop Navigation Sidebar */}
          <div className="hidden lg:block lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiLayers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Design Sections
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Complete all required sections (*)
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                {navigationSections.map((section) => {
                  const Icon = section.icon;
                  const isCompleted = completedSections.has(section.id);
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                        activeSection === section.id
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          activeSection === section.id
                            ? "bg-white/20"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            activeSection === section.id
                              ? "text-white"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">
                            {section.label}
                          </span>
                          {section.required && (
                            <span className="text-red-500 text-xs flex-shrink-0">
                              *
                            </span>
                          )}
                        </div>
                      </div>
                      {isCompleted && (
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Progress Summary */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Overall Progress
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getProgressPercentage()}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {completedSections.size} of{" "}
                  {navigationSections.filter((s) => s.required).length} required
                  sections complete
                </p>
              </div>
            </div>
          </div>

          {/* Main Form Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <ScrollArea className="h-[calc(100vh-200px)]">
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
                  {/* Basic Information Section */}
                  {activeSection === "basic" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <FiHome className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Basic Information
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            Required fields are marked with *
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">
                            Design Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Modern Villa, Contemporary Apartment..."
                            className="rounded-xl h-11 text-sm sm:text-base"
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
                            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent h-11 text-sm sm:text-base"
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
                          Description *
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe the design features, architectural style, key characteristics, and unique selling points..."
                          className="rounded-xl min-h-[120px] text-sm sm:text-base resize-vertical"
                          required
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
                          placeholder="3 Bedrooms&#10;2 Bathrooms&#10;Open-plan kitchen&#10;Swimming pool&#10;Garden area"
                          className="rounded-xl min-h-[100px] text-sm sm:text-base resize-vertical"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Enter each feature on a new line. These will be
                          displayed as bullet points.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Specifications Section */}
                  {activeSection === "specifications" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <FiLayers className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Specifications
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            Design dimensions and layout details
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                            min="0"
                            value={bedrooms}
                            onChange={(e) => setBedrooms(e.target.value)}
                            placeholder="0"
                            className="rounded-xl h-11 text-sm sm:text-base"
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
                            min="0"
                            value={bathrooms}
                            onChange={(e) => setBathrooms(e.target.value)}
                            placeholder="0"
                            className="rounded-xl h-11 text-sm sm:text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="area" className="text-sm font-medium">
                            Area (sq mt)
                          </Label>
                          <Input
                            id="area"
                            name="area"
                            type="number"
                            min="0"
                            step="0.1"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            placeholder="0"
                            className="rounded-xl h-11 text-sm sm:text-base"
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
                            min="0"
                            value={floors}
                            onChange={(e) => setFloors(e.target.value)}
                            placeholder="0"
                            className="rounded-xl h-11 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pricing Section */}
                  {activeSection === "pricing" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                          <FiDollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Pricing Information
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            Set pricing for the design and documents
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="basePrice"
                            className="text-sm font-medium"
                          >
                            Base Price ($) *
                          </Label>
                          <Input
                            id="basePrice"
                            name="basePrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={basePrice}
                            onChange={(e) => setBasePrice(e.target.value)}
                            placeholder="0.00"
                            className="rounded-xl h-11 text-sm sm:text-base"
                            required
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
                            className="rounded-xl h-11 text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Document Pricing
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="architecturalPdfPrice"
                              className="text-sm font-medium"
                            >
                              Architectural PDF
                            </Label>
                            <Input
                              id="architecturalPdfPrice"
                              name="architecturalPdfPrice"
                              type="number"
                              min="0"
                              step="0.01"
                              value={architecturalPdfPrice}
                              onChange={(e) =>
                                setArchitecturalPdfPrice(e.target.value)
                              }
                              placeholder="0.00"
                              className="rounded-xl h-11 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="architecturalCadPrice"
                              className="text-sm font-medium"
                            >
                              Architectural CAD
                            </Label>
                            <Input
                              id="architecturalCadPrice"
                              name="architecturalCadPrice"
                              type="number"
                              min="0"
                              step="0.01"
                              value={architecturalCadPrice}
                              onChange={(e) =>
                                setArchitecturalCadPrice(e.target.value)
                              }
                              placeholder="0.00"
                              className="rounded-xl h-11 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="structuralPdfPrice"
                              className="text-sm font-medium"
                            >
                              Structural PDF
                            </Label>
                            <Input
                              id="structuralPdfPrice"
                              name="structuralPdfPrice"
                              type="number"
                              min="0"
                              step="0.01"
                              value={structuralPdfPrice}
                              onChange={(e) =>
                                setStructuralPdfPrice(e.target.value)
                              }
                              placeholder="0.00"
                              className="rounded-xl h-11 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="structuralCadPrice"
                              className="text-sm font-medium"
                            >
                              Structural CAD
                            </Label>
                            <Input
                              id="structuralCadPrice"
                              name="structuralCadPrice"
                              type="number"
                              min="0"
                              step="0.01"
                              value={structuralCadPrice}
                              onChange={(e) =>
                                setStructuralCadPrice(e.target.value)
                              }
                              placeholder="0.00"
                              className="rounded-xl h-11 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="billOfQuantitiesPrice"
                              className="text-sm font-medium"
                            >
                              Bill of Quantities
                            </Label>
                            <Input
                              id="billOfQuantitiesPrice"
                              name="billOfQuantitiesPrice"
                              type="number"
                              min="0"
                              step="0.01"
                              value={billOfQuantitiesPrice}
                              onChange={(e) =>
                                setBillOfQuantitiesPrice(e.target.value)
                              }
                              placeholder="0.00"
                              className="rounded-xl h-11 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Files Section */}
                  {activeSection === "files" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <FiUpload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Design Files
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            Upload design documents and images *
                          </p>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {/* General Images */}
                        <Card>
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <FiImage className="w-5 h-5 text-blue-500" />
                              General Images *
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Upload high-quality images of your design. At
                              least one image is required.
                            </p>
                          </CardHeader>
                          <CardContent>
                            <CloudFileUpload
                              onUploadSuccess={(files) =>
                                setImages((prev) => [...prev, ...files])
                              }
                              onFileRemove={(fileUrl) =>
                                setImages((prev) =>
                                  prev.filter((f) => f.url !== fileUrl)
                                )
                              }
                              initialFiles={images}
                              fileTypeCategory="IMAGE"
                              multiple
                              accept="image/jpeg, image/png, image/gif, image/webp"
                            />
                          </CardContent>
                        </Card>

                        {/* Floor Plans */}
                        <Card>
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <FiLayers className="w-5 h-5 text-green-500" />
                              Floor Plans
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Upload floor plans as images or PDF documents
                            </p>
                          </CardHeader>
                          <CardContent>
                            <CloudFileUpload
                              onUploadSuccess={(files) =>
                                setFloorPlans((prev) => [...prev, ...files])
                              }
                              onFileRemove={(fileUrl) =>
                                setFloorPlans((prev) =>
                                  prev.filter((f) => f.url !== fileUrl)
                                )
                              }
                              initialFiles={floorPlans}
                              fileTypeCategory="FLOOR_PLAN"
                              multiple
                              accept="image/jpeg, image/png, image/gif, image/webp, application/pdf"
                            />
                          </CardContent>
                        </Card>

                        {/* Architectural Design */}
                        <Card>
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <FiHome className="w-5 h-5 text-purple-500" />
                              Architectural Design
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Upload architectural drawings and documents
                            </p>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="architectural-description"
                                className="text-sm font-medium"
                              >
                                Description
                              </Label>
                              <Input
                                id="architectural-description"
                                value={architecturalDesign.description}
                                onChange={(e) =>
                                  setArchitecturalDesign((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                  }))
                                }
                                placeholder="Brief description of architectural design..."
                                className="text-sm h-10"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="architectural-overview"
                                className="text-sm font-medium"
                              >
                                Overview
                              </Label>
                              <Textarea
                                id="architectural-overview"
                                value={architecturalDesign.overview}
                                onChange={(e) =>
                                  setArchitecturalDesign((prev) => ({
                                    ...prev,
                                    overview: e.target.value,
                                  }))
                                }
                                placeholder="Detailed overview of architectural features..."
                                className="text-sm min-h-[80px] resize-vertical"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                PDF Documents
                              </Label>
                              <CloudFileUpload
                                onUploadSuccess={(files) =>
                                  setArchitecturalDesign((prev) => ({
                                    ...prev,
                                    pdfFiles: [...prev.pdfFiles, ...files],
                                  }))
                                }
                                onFileRemove={(fileUrl) =>
                                  setArchitecturalDesign((prev) => ({
                                    ...prev,
                                    pdfFiles: prev.pdfFiles.filter(
                                      (f) => f.url !== fileUrl
                                    ),
                                  }))
                                }
                                initialFiles={architecturalDesign.pdfFiles}
                                fileTypeCategory="PDF"
                                multiple
                                accept="application/pdf"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                CAD Files
                              </Label>
                              <CloudFileUpload
                                onUploadSuccess={(files) =>
                                  setArchitecturalDesign((prev) => ({
                                    ...prev,
                                    cadFiles: [...prev.cadFiles, ...files],
                                  }))
                                }
                                onFileRemove={(fileUrl) =>
                                  setArchitecturalDesign((prev) => ({
                                    ...prev,
                                    cadFiles: prev.cadFiles.filter(
                                      (f) => f.url !== fileUrl
                                    ),
                                  }))
                                }
                                initialFiles={architecturalDesign.cadFiles}
                                fileTypeCategory="CAD"
                                multiple
                                accept=".dwg, .dxf, .pln"
                              />
                            </div>
                          </CardContent>
                        </Card>

                        {/* Structural Design */}
                        <Card>
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <FiLayers className="w-5 h-5 text-orange-500" />
                              Structural Design
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Upload structural engineering documents
                            </p>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="structural-description"
                                className="text-sm font-medium"
                              >
                                Description
                              </Label>
                              <Input
                                id="structural-description"
                                value={structuralDesign.description}
                                onChange={(e) =>
                                  setStructuralDesign((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                  }))
                                }
                                placeholder="Brief description of structural design..."
                                className="text-sm h-10"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="structural-overview"
                                className="text-sm font-medium"
                              >
                                Overview
                              </Label>
                              <Textarea
                                id="structural-overview"
                                value={structuralDesign.overview}
                                onChange={(e) =>
                                  setStructuralDesign((prev) => ({
                                    ...prev,
                                    overview: e.target.value,
                                  }))
                                }
                                placeholder="Detailed overview of structural features..."
                                className="text-sm min-h-[80px] resize-vertical"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                PDF Documents
                              </Label>
                              <CloudFileUpload
                                onUploadSuccess={(files) =>
                                  setStructuralDesign((prev) => ({
                                    ...prev,
                                    pdfFiles: [...prev.pdfFiles, ...files],
                                  }))
                                }
                                onFileRemove={(fileUrl) =>
                                  setStructuralDesign((prev) => ({
                                    ...prev,
                                    pdfFiles: prev.pdfFiles.filter(
                                      (f) => f.url !== fileUrl
                                    ),
                                  }))
                                }
                                initialFiles={structuralDesign.pdfFiles}
                                fileTypeCategory="PDF"
                                multiple
                                accept="application/pdf"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                CAD Files
                              </Label>
                              <CloudFileUpload
                                onUploadSuccess={(files) =>
                                  setStructuralDesign((prev) => ({
                                    ...prev,
                                    cadFiles: [...prev.cadFiles, ...files],
                                  }))
                                }
                                onFileRemove={(fileUrl) =>
                                  setStructuralDesign((prev) => ({
                                    ...prev,
                                    cadFiles: prev.cadFiles.filter(
                                      (f) => f.url !== fileUrl
                                    ),
                                  }))
                                }
                                initialFiles={structuralDesign.cadFiles}
                                fileTypeCategory="CAD"
                                multiple
                                accept=".dwg, .dxf, .pln"
                              />
                            </div>
                          </CardContent>
                        </Card>

                        {/* Bill of Quantities */}
                        <Card>
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <FiFileText className="w-5 h-5 text-red-500" />
                              Bill of Quantities
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Upload cost estimation spreadsheets
                            </p>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="boq-description"
                                className="text-sm font-medium"
                              >
                                Description
                              </Label>
                              <Input
                                id="boq-description"
                                value={billOfQuantities.description}
                                onChange={(e) =>
                                  setBillOfQuantities((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                  }))
                                }
                                placeholder="Brief description of bill of quantities..."
                                className="text-sm h-10"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Overview
                              </Label>
                              <Textarea
                                id="boq-overview"
                                value={billOfQuantities.overview}
                                onChange={(e) =>
                                  setBillOfQuantities((prev) => ({
                                    ...prev,
                                    overview: e.target.value,
                                  }))
                                }
                                placeholder="Detailed overview of cost breakdown..."
                                className="text-sm min-h-[80px] resize-vertical"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Excel Files
                              </Label>
                              <CloudFileUpload
                                onUploadSuccess={(files) => {
                                  const newBoQ = { ...billOfQuantities };
                                  newBoQ.excelFiles = [
                                    ...newBoQ.excelFiles,
                                    ...files,
                                  ];
                                  setBillOfQuantities(newBoQ);
                                }}
                                onFileRemove={(fileUrl) => {
                                  const newBoQ = { ...billOfQuantities };
                                  newBoQ.excelFiles = newBoQ.excelFiles.filter(
                                    (f) => f.url !== fileUrl
                                  );
                                  setBillOfQuantities(newBoQ);
                                }}
                                initialFiles={billOfQuantities.excelFiles}
                                fileTypeCategory="EXCEL"
                                multiple
                                accept=".xls, .xlsx"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* Cost Estimates Section */}
                  {activeSection === "costing" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <FiFileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Building Cost Estimates
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            Provide cost estimates for different finish levels
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                            min="0"
                            step="0.01"
                            value={minBuildingCost}
                            onChange={(e) => setMinBuildingCost(e.target.value)}
                            placeholder="0.00"
                            className="rounded-xl h-11 text-sm sm:text-base"
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
                            min="0"
                            step="0.01"
                            value={maxBuildingCost}
                            onChange={(e) => setMaxBuildingCost(e.target.value)}
                            placeholder="0.00"
                            className="rounded-xl h-11 text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      {/* Cost Breakdown */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Cost Breakdown by Tier
                        </h3>
                        {["basic", "luxury"].map((tier) => (
                          <Card
                            key={tier}
                            className="border-gray-200 dark:border-gray-600"
                          >
                            <CardHeader className="pb-4">
                              <CardTitle className="flex items-center gap-2 text-lg capitalize">
                                {tier} Tier
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
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
                                  className="rounded-lg text-sm resize-vertical"
                                  placeholder={`Describe the ${tier} tier features and quality...`}
                                />
                              </div>
                              <div className="space-y-3">
                                <Label className="text-sm font-medium">
                                  Cost Breakdown
                                </Label>
                                {buildingCostEstimates[tier]?.costBreakdown.map(
                                  (item, index) => (
                                    <div
                                      key={index}
                                      className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
                                    >
                                      <div className="space-y-1">
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
                                          className="rounded-lg text-sm h-10"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Input
                                          placeholder="Cost ($)"
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          value={item.cost}
                                          onChange={(e) =>
                                            handleCostBreakdownChange(
                                              tier,
                                              index,
                                              "cost",
                                              e.target.value
                                            )
                                          }
                                          className="rounded-lg text-sm h-10"
                                        />
                                      </div>
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                          removeCostBreakdownItem(tier, index)
                                        }
                                        className="h-10 text-sm"
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
                                  className="rounded-lg h-10 text-sm"
                                >
                                  <FiPlus className="mr-2 w-4 h-4" />
                                  Add Cost Item
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Packages Section */}
                  {activeSection === "packages" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                          <FiPackage className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Package Options
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            Add fixed-price add-ons for customers
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Add fixed-price add-ons that customers can purchase
                          with this design.
                        </p>

                        {packageOptions.map((option, index) => (
                          <Card
                            key={index}
                            className="border-gray-200 dark:border-gray-600"
                          >
                            <CardContent className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">
                                    Package Name
                                  </Label>
                                  <Input
                                    placeholder="e.g., Premium Support, 3D Rendering..."
                                    value={option.name}
                                    onChange={(e) => {
                                      const newOptions = [...packageOptions];
                                      newOptions[index].name = e.target.value;
                                      setPackageOptions(newOptions);
                                    }}
                                    className="rounded-lg text-sm h-10"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">
                                    Price ($)
                                  </Label>
                                  <Input
                                    placeholder="0.00"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={option.price}
                                    onChange={(e) => {
                                      const newOptions = [...packageOptions];
                                      newOptions[index].price = e.target.value;
                                      setPackageOptions(newOptions);
                                    }}
                                    className="rounded-lg text-sm h-10"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                  Package File (Optional)
                                </Label>
                                <CloudFileUpload
                                  onUploadSuccess={(files) => {
                                    const newOptions = [...packageOptions];
                                    newOptions[index].file = files;
                                    setPackageOptions(newOptions);
                                  }}
                                  onFileRemove={() => {
                                    const newOptions = [...packageOptions];
                                    newOptions[index].file = [];
                                    setPackageOptions(newOptions);
                                  }}
                                  initialFiles={option.file}
                                  fileTypeCategory="FILE"
                                  multiple={false}
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
                                className="w-full h-10 mt-2 text-sm"
                              >
                                Remove Package
                              </Button>
                            </CardContent>
                          </Card>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPackageOptions([
                              ...packageOptions,
                              { name: "", price: "", file: [] },
                            ])
                          }
                          className="rounded-lg h-10 text-sm"
                        >
                          <FiPlus className="mr-2 w-4 h-4" />
                          Add Package Option
                        </Button>
                      </div>
                    </div>
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