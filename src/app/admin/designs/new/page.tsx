"use client";

import FileUpload from "@/components/admin/designs/FileUpload";
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
  FiArrowRight,
  FiCheck,
  FiChevronLeft,
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
  FiAlertCircle,
  FiInfo,
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

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const steps = [
    {
      id: "basic",
      label: "Basic Information",
      icon: FiHome,
      description: "Design name, description, and category",
      required: true,
    },
    {
      id: "specifications",
      label: "Specifications",
      icon: FiLayers,
      description: "Dimensions and layout details",
      required: false,
    },
    {
      id: "pricing",
      label: "Pricing",
      icon: FiDollarSign,
      description: "Pricing and document costs",
      required: true,
    },
    {
      id: "files",
      label: "Files & Documents",
      icon: FiUpload,
      description: "Images, plans, and design files",
      required: true,
    },
    {
      id: "costing",
      label: "Cost Estimates",
      icon: FiFileText,
      description: "Building cost breakdowns",
      required: false,
    },
    {
      id: "packages",
      label: "Package Options",
      icon: FiPackage,
      description: "Additional services and packages",
      required: false,
    },
  ];

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

  // Validate steps for completion
  useEffect(() => {
    const newCompletedSteps = new Set(completedSteps);

    // Step 0: Basic Info
    if (name.trim() && description.trim() && categoryId) {
      newCompletedSteps.add(0);
    } else {
      newCompletedSteps.delete(0);
    }

    // Step 2: Pricing
    if (basePrice && parseFloat(basePrice) > 0) {
      newCompletedSteps.add(2);
    } else {
      newCompletedSteps.delete(2);
    }

    // Step 3: Files (at least one image required)
    if (images.length > 0) {
      newCompletedSteps.add(3);
    } else {
      newCompletedSteps.delete(3);
    }

    setCompletedSteps(newCompletedSteps);
  }, [name, description, categoryId, basePrice, images]);

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Basic Info
        if (!name.trim()) errors.name = "Design name is required";
        if (!description.trim()) errors.description = "Description is required";
        if (!categoryId) errors.categoryId = "Category is required";
        break;
      case 2: // Pricing
        if (!basePrice) errors.basePrice = "Base price is required";
        else if (parseFloat(basePrice) <= 0)
          errors.basePrice = "Base price must be greater than 0";
        break;
      case 3: // Files
        if (images.length === 0)
          errors.images = "At least one image is required";
        break;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const canSubmit = () => {
    const requiredSteps = steps
      .filter((step) => step.required)
      .map((_, index) => index);
    return requiredSteps.every((step) => completedSteps.has(step));
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

    if (!canSubmit()) {
      toast.error("Please complete all required sections before submitting");
      return;
    }

    const formErrors = validateForm();
    if (formErrors.length > 0) {
      toast.error(formErrors.join("\n"));
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

  const SectionHeader = ({
    icon: Icon,
    title,
    description,
    required,
  }: {
    icon: any;
    title: string;
    description: string;
    required?: boolean;
  }) => (
    <div className="flex items-start gap-4 mb-8">
      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          {required && (
            <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full">
              Required
            </span>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-base">
          {description}
        </p>
      </div>
    </div>
  );

  const FormField = ({
    label,
    htmlFor,
    required,
    error,
    children,
    description,
  }: {
    label: string;
    htmlFor?: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
    description?: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label
          htmlFor={htmlFor}
          className="text-sm font-semibold text-gray-900 dark:text-white"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {error && (
          <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
            <FiAlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
      {children}
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
          <FiInfo className="w-3 h-3 mt-0.5 flex-shrink-0" />
          {description}
        </p>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-8">
            <SectionHeader
              icon={FiHome}
              title="Basic Information"
              description="Provide essential details about your design. All fields marked with * are required."
              required
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FormField
                label="Design Name"
                htmlFor="name"
                required
                error={fieldErrors.name}
                description="Choose a descriptive name that represents your design"
              >
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="e.g., Modern Villa, Contemporary Apartment..."
                  className="rounded-xl h-12 text-base border-2 focus:border-blue-500 transition-colors"
                  required
                />
              </FormField>

              <FormField
                label="Category"
                htmlFor="category"
                required
                error={fieldErrors.categoryId}
                description="Select the most appropriate category for your design"
              >
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, categoryId: "" }));
                  }}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 text-base transition-colors"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField
              label="Description"
              htmlFor="description"
              required
              error={fieldErrors.description}
              description="Describe the design features, architectural style, and key characteristics"
            >
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, description: "" }));
                }}
                placeholder="Describe the design features, architectural style, key characteristics, and unique selling points..."
                className="rounded-xl min-h-[180px] text-base border-2 focus:border-blue-500 resize-vertical transition-colors"
                required
              />
            </FormField>

            <FormField
              label="Plan Details"
              htmlFor="planDetails"
              description="Enter each feature on a new line. These will be displayed as bullet points"
            >
              <Textarea
                id="planDetails"
                name="planDetails"
                value={planDetails}
                onChange={(e) => setPlanDetails(e.target.value)}
                placeholder="3 Bedrooms&#10;2 Bathrooms&#10;Open-plan kitchen&#10;Swimming pool&#10;Garden area"
                className="rounded-xl min-h-[140px] text-base border-2 focus:border-blue-500 resize-vertical transition-colors"
              />
            </FormField>
          </div>
        );

      case 1: // Specifications
        return (
          <div className="space-y-8">
            <SectionHeader
              icon={FiLayers}
              title="Specifications"
              description="Provide detailed dimensions and layout information for your design"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: "bedrooms",
                  label: "Bedrooms",
                  value: bedrooms,
                  setter: setBedrooms,
                  placeholder: "0",
                },
                {
                  id: "bathrooms",
                  label: "Bathrooms",
                  value: bathrooms,
                  setter: setBathrooms,
                  placeholder: "0",
                },
                {
                  id: "area",
                  label: "Area (sq mt)",
                  value: area,
                  setter: setArea,
                  placeholder: "0",
                },
                {
                  id: "floors",
                  label: "Floors",
                  value: floors,
                  setter: setFloors,
                  placeholder: "0",
                },
              ].map((field) => (
                <FormField
                  key={field.id}
                  label={field.label}
                  htmlFor={field.id}
                >
                  <Input
                    id={field.id}
                    name={field.id}
                    type="number"
                    min="0"
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    className="rounded-xl h-12 text-base border-2 focus:border-blue-500 transition-colors"
                  />
                </FormField>
              ))}
            </div>
          </div>
        );

      case 2: // Pricing
        return (
          <div className="space-y-8">
            <SectionHeader
              icon={FiDollarSign}
              title="Pricing Information"
              description="Set pricing for the design and associated documents"
              required
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FormField
                label="Base Price ($)"
                htmlFor="basePrice"
                required
                error={fieldErrors.basePrice}
                description="The starting price for this design"
              >
                <Input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={basePrice}
                  onChange={(e) => {
                    setBasePrice(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, basePrice: "" }));
                  }}
                  placeholder="0.00"
                  className="rounded-xl h-12 text-base border-2 focus:border-blue-500 transition-colors"
                  required
                />
              </FormField>

              <FormField
                label="Price Range"
                htmlFor="priceRange"
                description="Displayed price range for customers (e.g., $50k - $70k)"
              >
                <Input
                  id="priceRange"
                  name="priceRange"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  placeholder="e.g., $50k - $70k"
                  className="rounded-xl h-12 text-base border-2 focus:border-blue-500 transition-colors"
                />
              </FormField>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                <FiFileText className="w-6 h-6 text-blue-500" />
                Document Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[
                  {
                    id: "architecturalPdfPrice",
                    label: "Architectural PDF",
                    value: architecturalPdfPrice,
                    setter: setArchitecturalPdfPrice,
                  },
                  {
                    id: "architecturalCadPrice",
                    label: "Architectural CAD",
                    value: architecturalCadPrice,
                    setter: setArchitecturalCadPrice,
                  },
                  {
                    id: "structuralPdfPrice",
                    label: "Structural PDF",
                    value: structuralPdfPrice,
                    setter: setStructuralPdfPrice,
                  },
                  {
                    id: "structuralCadPrice",
                    label: "Structural CAD",
                    value: structuralCadPrice,
                    setter: setStructuralCadPrice,
                  },
                  {
                    id: "billOfQuantitiesPrice",
                    label: "Bill of Quantities",
                    value: billOfQuantitiesPrice,
                    setter: setBillOfQuantitiesPrice,
                  },
                ].map((field) => (
                  <FormField
                    key={field.id}
                    label={field.label}
                    htmlFor={field.id}
                  >
                    <Input
                      id={field.id}
                      name={field.id}
                      type="number"
                      min="0"
                      step="0.01"
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      placeholder="0.00"
                      className="rounded-xl h-12 text-base border-2 focus:border-blue-500 transition-colors"
                    />
                  </FormField>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Files
        return (
          <div className="space-y-8">
            <SectionHeader
              icon={FiUpload}
              title="Files & Documents"
              description="Upload design documents, images, and supporting files"
              required
            />

            <div className="space-y-8">
              {/* General Images */}
              <Card className="border-2 border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FiImage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        General Images *
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Upload high-quality images of your design. At least one
                        image is required.
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onUploadSuccess={(files) => {
                      setImages((prev) => [...prev, ...files]);
                      setFieldErrors((prev) => ({ ...prev, images: "" }));
                    }}
                    onFileRemove={(fileUrl) =>
                      setImages((prev) => prev.filter((f) => f.url !== fileUrl))
                    }
                    initialFiles={images}
                    fileTypeCategory="IMAGE"
                    multiple
                    accept="image/jpeg, image/png, image/gif, image/webp"
                  />
                  {fieldErrors.images && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm mt-2">
                      <FiAlertCircle className="w-4 h-4" />
                      <span>{fieldErrors.images}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Floor Plans */}
              <Card className="border-2 border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <FiLayers className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        Floor Plans
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Upload floor plans as images or PDF documents
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
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

              {/* Document Sections */}
              {[
                {
                  title: "Architectural Design",
                  icon: FiHome,
                  iconColor: "text-purple-600 dark:text-purple-400",
                  bgColor: "bg-purple-100 dark:bg-purple-900/30",
                  state: architecturalDesign,
                  setState: setArchitecturalDesign,
                  fields: ["pdfFiles", "cadFiles"],
                },
                {
                  title: "Structural Design",
                  icon: FiLayers,
                  iconColor: "text-orange-600 dark:text-orange-400",
                  bgColor: "bg-orange-100 dark:bg-orange-900/30",
                  state: structuralDesign,
                  setState: setStructuralDesign,
                  fields: ["pdfFiles", "cadFiles"],
                },
                {
                  title: "Bill of Quantities",
                  icon: FiFileText,
                  iconColor: "text-red-600 dark:text-red-400",
                  bgColor: "bg-red-100 dark:bg-red-900/30",
                  state: billOfQuantities,
                  setState: setBillOfQuantities,
                  fields: ["excelFiles"],
                },
              ].map((doc) => (
                <Card
                  key={doc.title}
                  className="border-2 border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-sm"
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className={`p-2 ${doc.bgColor} rounded-lg`}>
                        <doc.icon className={`w-5 h-5 ${doc.iconColor}`} />
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {doc.title}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        label="Description"
                        htmlFor={`${doc.title.toLowerCase().replace(" ", "-")}-description`}
                      >
                        <Input
                          value={doc.state.description}
                          onChange={(e) =>
                            doc.setState((prev: any) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder={`Brief description of ${doc.title.toLowerCase()}...`}
                          className="rounded-xl h-11 text-sm border-2 focus:border-blue-500 transition-colors"
                        />
                      </FormField>
                      <FormField
                        label="Overview"
                        htmlFor={`${doc.title.toLowerCase().replace(" ", "-")}-overview`}
                      >
                        <Textarea
                          value={doc.state.overview}
                          onChange={(e) =>
                            doc.setState((prev: any) => ({
                              ...prev,
                              overview: e.target.value,
                            }))
                          }
                          placeholder={`Detailed overview of ${doc.title.toLowerCase()} features...`}
                          className="rounded-xl min-h-[100px] text-sm border-2 focus:border-blue-500 resize-vertical transition-colors"
                        />
                      </FormField>
                    </div>

                    {doc.fields.map((fieldType) => (
                      <FormField
                        key={fieldType}
                        label={
                          fieldType === "pdfFiles"
                            ? "PDF Documents"
                            : fieldType === "cadFiles"
                              ? "CAD Files"
                              : "Excel Files"
                        }
                      >
                        <FileUpload
                          onUploadSuccess={(files) =>
                            doc.setState((prev: any) => ({
                              ...prev,
                              [fieldType]: [...prev[fieldType], ...files],
                            }))
                          }
                          onFileRemove={(fileUrl) =>
                            doc.setState((prev: any) => ({
                              ...prev,
                              [fieldType]: prev[fieldType].filter(
                                (f: any) => f.url !== fileUrl
                              ),
                            }))
                          }
                          initialFiles={doc.state[fieldType]}
                          fileTypeCategory={
                            fieldType === "excelFiles"
                              ? "EXCEL"
                              : fieldType.toUpperCase().replace("FILES", "")
                          }
                          multiple
                          accept={
                            fieldType === "pdfFiles"
                              ? "application/pdf"
                              : fieldType === "cadFiles"
                                ? ".dwg, .dxf"
                                : ".xls, .xlsx"
                          }
                        />
                      </FormField>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4: // Cost Estimates
        return (
          <div className="space-y-8">
            <SectionHeader
              icon={FiFileText}
              title="Building Cost Estimates"
              description="Provide detailed cost estimates for different finish levels and building tiers"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FormField
                label="Minimum Building Cost ($)"
                htmlFor="minBuildingCost"
                description="Lowest estimated construction cost"
              >
                <Input
                  id="minBuildingCost"
                  name="minBuildingCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={minBuildingCost}
                  onChange={(e) => setMinBuildingCost(e.target.value)}
                  placeholder="0.00"
                  className="rounded-xl h-12 text-base border-2 focus:border-blue-500 transition-colors"
                />
              </FormField>

              <FormField
                label="Maximum Building Cost ($)"
                htmlFor="maxBuildingCost"
                description="Highest estimated construction cost"
              >
                <Input
                  id="maxBuildingCost"
                  name="maxBuildingCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={maxBuildingCost}
                  onChange={(e) => setMaxBuildingCost(e.target.value)}
                  placeholder="0.00"
                  className="rounded-xl h-12 text-base border-2 focus:border-blue-500 transition-colors"
                />
              </FormField>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Cost Breakdown by Tier
              </h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {["basic", "luxury"].map((tier) => (
                  <Card
                    key={tier}
                    className="border-2 border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-sm"
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg capitalize">
                        <div
                          className={`p-2 rounded-lg ${
                            tier === "basic"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                          }`}
                        >
                          <FiDollarSign className="w-4 h-4" />
                        </div>
                        {tier} Tier
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        label="Description"
                        htmlFor={`${tier}-description`}
                      >
                        <Textarea
                          id={`${tier}-description`}
                          value={buildingCostEstimates[tier]?.description || ""}
                          onChange={(e) => {
                            const newEstimates = {
                              ...buildingCostEstimates,
                            };
                            newEstimates[tier].description = e.target.value;
                            setBuildingCostEstimates(newEstimates);
                          }}
                          rows={3}
                          className="rounded-lg text-sm border-2 focus:border-blue-500 resize-vertical transition-colors"
                          placeholder={`Describe the ${tier} tier features and quality...`}
                        />
                      </FormField>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                          Cost Breakdown
                        </Label>
                        {buildingCostEstimates[tier]?.costBreakdown.map(
                          (item, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-end"
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
                                className="rounded-lg text-sm h-10 border-2 focus:border-blue-500 transition-colors"
                              />
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
                                className="rounded-lg text-sm h-10 border-2 focus:border-blue-500 transition-colors"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  removeCostBreakdownItem(tier, index)
                                }
                                className="h-10 text-sm rounded-lg"
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
                          className="rounded-lg h-10 text-sm w-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
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
          </div>
        );

      case 5: // Packages
        return (
          <div className="space-y-8">
            <SectionHeader
              icon={FiPackage}
              title="Package Options"
              description="Add fixed-price add-ons and additional services for customers"
            />

            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                Create fixed-price add-ons that customers can purchase with this
                design. Each package can include additional files, services, or
                premium features.
              </p>

              {packageOptions.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50/50 dark:bg-gray-700/20">
                  <FiPackage className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Packages Added
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-base max-w-sm mx-auto">
                    Add your first package option to provide additional value to
                    customers
                  </p>
                </div>
              )}

              {packageOptions.map((option, index) => (
                <Card
                  key={index}
                  className="border-2 border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-sm"
                >
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
                      <FormField
                        label="Package Name"
                        htmlFor={`package-name-${index}`}
                        description="Descriptive name for this package"
                      >
                        <Input
                          id={`package-name-${index}`}
                          placeholder="e.g., Premium Support, 3D Rendering, Extended Warranty..."
                          value={option.name}
                          onChange={(e) => {
                            const newOptions = [...packageOptions];
                            newOptions[index].name = e.target.value;
                            setPackageOptions(newOptions);
                          }}
                          className="rounded-lg text-sm h-11 border-2 focus:border-blue-500 transition-colors"
                        />
                      </FormField>
                      <FormField
                        label="Price ($)"
                        htmlFor={`package-price-${index}`}
                        description="Additional cost for this package"
                      >
                        <Input
                          id={`package-price-${index}`}
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
                          className="rounded-lg text-sm h-11 border-2 focus:border-blue-500 transition-colors"
                        />
                      </FormField>
                    </div>

                    <FormField
                      label="Package File (Optional)"
                      htmlFor={`package-file-${index}`}
                      description="Attach any additional files included in this package"
                    >
                      <FileUpload
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
                    </FormField>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newOptions = [...packageOptions];
                        newOptions.splice(index, 1);
                        setPackageOptions(newOptions);
                      }}
                      className="w-full h-11 text-sm rounded-lg"
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
                className="rounded-xl h-12 text-sm w-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                <FiPlus className="mr-2 w-4 h-4" />
                Add Package Option
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/5 dark:to-purple-900/5">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-10 w-10 flex-shrink-0 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Link href="/admin/designs" aria-label="Back to designs">
                  <FiArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  Create New Design
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Step {currentStep + 1} of {steps.length} •{" "}
                  {steps[currentStep].label}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/designs")}
                disabled={isSubmitting}
                className="h-11 px-4 rounded-xl border-2 border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !canSubmit()}
                className="h-11 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <CgSpinner className="animate-spin mr-2 w-4 h-4" />
                ) : (
                  <FiSave className="mr-2 w-4 h-4" />
                )}
                {isSubmitting ? "Creating..." : "Create Design"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto py-4 gap-2">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(index);
              const isCurrent = currentStep === index;
              const StepIcon = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 flex-shrink-0 min-w-0 ${
                    isCurrent
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : isCompleted
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-800"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full ${
                      isCurrent
                        ? "bg-white/20"
                        : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    {isCompleted ? (
                      <FiCheck className="w-3 h-3" />
                    ) : (
                      <StepIcon className="w-3 h-3" />
                    )}
                  </div>
                  <div className="text-left min-w-0">
                    <div className="text-sm font-medium truncate">
                      {step.label}
                    </div>
                    <div
                      className={`text-xs truncate ${
                        isCurrent
                          ? "text-white/80"
                          : isCompleted
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step.description}
                    </div>
                  </div>
                  {step.required && (
                    <span
                      className={`text-xs ${
                        isCurrent ? "text-white/90" : "text-red-500"
                      }`}
                    >
                      *
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-gray-200/60 dark:border-gray-700/60 overflow-hidden"
          >
            <ScrollArea className="h-[calc(100vh-280px)]">
              <form onSubmit={handleSubmit} className="p-8">
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200 dark:border-gray-600">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="h-12 px-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft className="mr-2 w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-4">
                    {!steps[currentStep].required && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Optional section
                      </span>
                    )}
                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold"
                      >
                        Next
                        <FiChevronRight className="ml-2 w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={!canSubmit() || isSubmitting}
                        className="h-12 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <CgSpinner className="animate-spin mr-2 w-4 h-4" />
                        ) : (
                          <FiSave className="mr-2 w-4 h-4" />
                        )}
                        {isSubmitting ? "Creating..." : "Create Design"}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </ScrollArea>
          </motion.div>

          {/* Completion Status */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Completion Status:
              </span>
              <div className="flex items-center gap-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      completedSteps.has(index)
                        ? "bg-green-500"
                        : step.required
                          ? "bg-red-400"
                          : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    title={`${step.label}: ${
                      completedSteps.has(index)
                        ? "Complete"
                        : step.required
                          ? "Required"
                          : "Optional"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Array.from(completedSteps).length} of{" "}
                {steps.filter((s) => s.required).length} required steps complete
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateDesignPage;
