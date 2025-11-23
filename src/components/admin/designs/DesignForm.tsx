"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiFileText,
  FiHome,
  FiImage,
  FiInfo,
  FiLayers,
  FiPackage,
  FiPlus,
  FiSave,
  FiTrash,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { toast } from "sonner";
import FileUpload from "./FileUpload";

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

interface DesignFormProps {
  design?: any;
}

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
    id: "packages",
    label: "Package Options",
    icon: FiPackage,
    description: "Additional services and packages",
    required: false,
  },
  {
    id: "review",
    label: "Review & Submit",
    icon: FiCheck,
    description: "Final check before creating the design",
    required: true,
  },
];

const DesignForm = ({ design }: DesignFormProps) => {
  const router = useRouter();
  const [name, setName] = useState(design?.name || "");
  const [description, setDescription] = useState(design?.description || "");
  // basePrice and priceRange removed from state
  const [bedrooms, setBedrooms] = useState(design?.bedrooms?.toString() || "");
  const [bathrooms, setBathrooms] = useState(
    design?.bathrooms?.toString() || ""
  );
  const [area, setArea] = useState(design?.area?.toString() || "");
  const [floors, setFloors] = useState(design?.floors?.toString() || "");

  const [categoryId, setCategoryId] = useState(design?.categoryId || "");
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (design) {
      setName(design.name || "");
      setDescription(design.description || "");
      // basePrice and priceRange removed from init
      setBedrooms(design.bedrooms?.toString() || "");
      setBathrooms(design.bathrooms?.toString() || "");
      setArea(design.area?.toString() || "");
      setFloors(design.floors?.toString() || "");
      setCategoryId(design.categoryId || "");
      setArchitecturalDesign(
        design.architecturalDesign || {
          pdfFiles: [],
          cadFiles: [],
        }
      );
      setStructuralDesign(
        design.structuralDesign || {
          pdfFiles: [],
          cadFiles: [],
        }
      );
      setBillOfQuantities(
        design.billOfQuantities || {
          excelFiles: [],
          pdfFiles: [],
        }
      );
      setArchitecturalPdfPrice(design.architecturalPdfPrice?.toString() || "");
      setArchitecturalCadPrice(design.architecturalCadPrice?.toString() || "");
      setStructuralPdfPrice(design.structuralPdfPrice?.toString() || "");
      setStructuralCadPrice(design.structuralCadPrice?.toString() || "");
      setBillOfQuantitiesPrice(design.billOfQuantitiesPrice?.toString() || "");
      setBillOfQuantitiesPdfPrice(
        design.billOfQuantitiesPdfPrice?.toString() || ""
      );
      setImages(design.images || []);
      setFloorPlans(design.floorPlans || []);
      setFiles(design.files || []);
      if (design.packageOptions) {
        setPackageOptions(
          design.packageOptions.map((opt: any) => ({
            ...opt,
            price: opt.price.toString(),
            file: opt.file ? [opt.file] : [],
          }))
        );
      } else {
        setPackageOptions([{ name: "", price: "", file: [] }]);
      }
    }
  }, [design]);

  const [packageOptions, setPackageOptions] = useState<any[]>([]);

  // Correctly initialize packageOptions from design, converting price to string
  useEffect(() => {
    if (design?.packageOptions) {
      setPackageOptions(
        design.packageOptions.map((opt: any) => ({
          ...opt,
          price: opt.price.toString(),
          file: opt.file ? [opt.file] : [], // FileUpload expects an array
        }))
      );
    } else {
      setPackageOptions([
        { name: "", price: "", file: [] }, // Start with one empty package
      ]);
    }
  }, [design]);

  const [architecturalDesign, setArchitecturalDesign] = useState(
    design?.architecturalDesign || {
      pdfFiles: [],
      cadFiles: [],
    }
  );
  const [structuralDesign, setStructuralDesign] = useState(
    design?.structuralDesign || {
      pdfFiles: [],
      cadFiles: [],
    }
  );
  const [billOfQuantities, setBillOfQuantities] = useState(
    design?.billOfQuantities || {
      excelFiles: [],
      pdfFiles: [],
    }
  );

  const [architecturalPdfPrice, setArchitecturalPdfPrice] = useState(
    design?.architecturalPdfPrice?.toString() || ""
  );
  const [architecturalCadPrice, setArchitecturalCadPrice] = useState(
    design?.architecturalCadPrice?.toString() || ""
  );
  const [structuralPdfPrice, setStructuralPdfPrice] = useState(
    design?.structuralPdfPrice?.toString() || ""
  );
  const [structuralCadPrice, setStructuralCadPrice] = useState(
    design?.structuralCadPrice?.toString() || ""
  );
  const [billOfQuantitiesPrice, setBillOfQuantitiesPrice] = useState(
    design?.billOfQuantitiesPrice?.toString() || ""
  );
  const [billOfQuantitiesPdfPrice, setBillOfQuantitiesPdfPrice] = useState(
    design?.billOfQuantitiesPdfPrice?.toString() || ""
  );
  const [images, setImages] = useState<any[]>(design?.images || []);
  const [floorPlans, setFloorPlans] = useState<any[]>(design?.floorPlans || []);
  const [files, setFiles] = useState<any[]>(design?.files || []);

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
      id: "packages",
      label: "Package Options",
      icon: FiPackage,
      description: "Additional services and packages",
      required: false,
    },
    {
      id: "review",
      label: "Review & Submit",
      icon: FiCheck,
      description: "Final check before creating the design",
      required: true,
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

  // FIX: 2. Robust check for section completion
  useEffect(() => {
    const newCompleted = new Set<number>();

    // Step 0: Basic Info (Required)
    if (name.trim() && description.trim() && categoryId) {
      newCompleted.add(0);
    }

    // Step 1: Specifications (Optional)
    if (bedrooms || bathrooms || area || floors) {
      newCompleted.add(1);
    }

    // Step 2: Pricing (Required) - Check if at least one document price is set (optional but good practice) or just mark as complete since fields are optional/default 0
    // For now, we'll assume pricing step is complete if we are on it, or just check if any doc price is set if we want strictness.
    // Given the request, let's make it always valid or check for at least one price if needed.
    // Let's check if at least one document price is provided/valid number, or just consider it done.
    // Actually, since all prices default to 0/null, maybe we don't enforce a specific price > 0 unless required.
    // Let's assume step 2 is valid if the user has visited it or just always valid since defaults exist.
    // But to be consistent with "Required" label, maybe check if at least one price is > 0?
    // The previous logic checked `basePrice > 0`. Now basePrice is derived.
    // Let's check if derived basePrice > 0.
    const currentArchPdfPrice = parseFloat(architecturalPdfPrice) || 0;
    if (currentArchPdfPrice > 0) {
       newCompleted.add(2);
    }

    // Step 3: Files (Required)
    if (images.length > 0) {
      newCompleted.add(3);
    }

    // Step 4: Packages (Optional)
    if (
      packageOptions.length > 0 &&
      (packageOptions[0]?.name.trim() || packageOptions[0]?.price.trim())
    ) {
      newCompleted.add(4);
    }

    const requiredStepIndices = steps
      .map((step, index) => ({ ...step, index }))
      .filter((step) => step.required && step.id !== "review")
      .map((step) => step.index);

    if (requiredStepIndices.every((stepIndex) => newCompleted.has(stepIndex))) {
      newCompleted.add(5);
    }

    setCompletedSteps(newCompleted);
  }, [
    name,
    description,
    categoryId, // Step 0
    bedrooms,
    bathrooms,
    area,
    floors, // Step 1
    floors, // Step 1
    architecturalPdfPrice, // Step 2 (proxy for basePrice check)
    images, // Step 3
    packageOptions, // Step 4
  ]);

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Basic Info
        if (!name.trim()) errors.name = "Design name is required";
        if (!description.trim()) errors.description = "Description is required";
        if (!categoryId) errors.categoryId = "Category is required";
        break;
      case 2: // Pricing
        // Validation removed or changed to check derived base price if strictness is needed.
        // For now, we can relax it or check architecturalPdfPrice if that's the base.
        if (!architecturalPdfPrice || parseFloat(architecturalPdfPrice) <= 0) {
             errors.architecturalPdfPrice = "Architectural PDF Price (Base Price) is required";
        }
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

  // FIX: 2. Correct logic for canSubmit
  const canSubmit = () => {
    const requiredStepIndices = steps
      .map((step, index) => ({ ...step, index }))
      .filter((step) => step.required)
      .map((step) => step.index); // Gets [0, 2, 3]

    return requiredStepIndices.every((stepIndex) =>
      completedSteps.has(stepIndex)
    );
  };

  // --- Package Option Handlers ---
  const addPackageOption = () => {
    setPackageOptions([...packageOptions, { name: "", price: "", file: [] }]);
  };

  const removePackageOption = (index: number) => {
    const newOptions = packageOptions.filter((_, i) => i !== index);
    // If it's the last one, add a new empty one
    if (newOptions.length === 0) {
      setPackageOptions([{ name: "", price: "", file: [] }]);
    } else {
      setPackageOptions(newOptions);
    }
  };

  const handlePackageChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newOptions = [...packageOptions];
    newOptions[index][field] = value;
    setPackageOptions(newOptions);
  };

  const handlePackageFile = (index: number, files: any[]) => {
    const newOptions = [...packageOptions];
    newOptions[index].file = files;
    setPackageOptions(newOptions);
  };

  const validateForm = () => {
    const errors = [];
    if (!name.trim()) errors.push("Design Name is required.");
    if (!description.trim()) errors.push("Description is required.");
    if (!categoryId) errors.push("Category is required.");
    if (!categoryId) errors.push("Category is required.");
    // Check derived base price
    if (!architecturalPdfPrice || parseFloat(architecturalPdfPrice) <= 0)
      errors.push("Architectural PDF Price (Base Price) is required.");
    if (images.length === 0) errors.push("At least one image is required.");
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (formErrors.length > 0) {
      // Find the first step with an error and navigate to it
      if (!name.trim() || !description.trim() || !categoryId) {
        setCurrentStep(0);
      } else if (!architecturalPdfPrice || parseFloat(architecturalPdfPrice) <= 0) {
        setCurrentStep(2);
      } else if (images.length === 0) {
        setCurrentStep(3);
      }
      toast.error(formErrors.join("\n"));
      return;
    }

    setIsSubmitting(true);

    const fileListPayload = (files: any[], type: string) =>
      files.map((file: any) => ({
        name: file.originalFileName || file.name || file.url.split("/").pop(),
        url: file.url,
        type,
      }));

    const packageOptionsPayload = packageOptions
      .filter((opt) => opt.name.trim() && opt.price.trim())
      .map((option) => {
        const file = option.file?.[0];
        let fileCreate = undefined;
        if (file) {
          fileCreate = {
            create: {
              name:
                file.originalFileName || file.name || file.url.split("/").pop(),
              url: file.url,
              type: "FILE",
            },
          };
        }
        return {
          name: option.name,
          price: parseFloat(option.price) || 0,
          file: fileCreate,
        };
      });

    const archPdfPrice = parseFloat(architecturalPdfPrice) || 0;
    const archCadPrice = parseFloat(architecturalCadPrice) || 0;
    const structPdfPrice = parseFloat(structuralPdfPrice) || 0;
    const structCadPrice = parseFloat(structuralCadPrice) || 0;
    const boqExcelPrice = parseFloat(billOfQuantitiesPrice) || 0;
    const boqPdfPrice = parseFloat(billOfQuantitiesPdfPrice) || 0;

    const calculatedBasePrice = archPdfPrice;
    const totalPrice = archPdfPrice + archCadPrice + structPdfPrice + structCadPrice + boqExcelPrice + boqPdfPrice;
    const calculatedPriceRange = `${calculatedBasePrice.toLocaleString()} - ${totalPrice.toLocaleString()}`;

    const commonData = {
      name,
      description,
      basePrice: calculatedBasePrice,
      priceRange: calculatedPriceRange,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      area: area ? parseFloat(area) : null,
      floors: floors ? parseInt(floors) : null,
      planDetails: [],
      categoryId,

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
      billOfQuantitiesPdfPrice: billOfQuantitiesPdfPrice
        ? parseFloat(billOfQuantitiesPdfPrice)
        : null,
    };

    let payload;
    const url = design ? `/api/designs/${design.id}` : "/api/designs";
    const method = design ? "PUT" : "POST";

    if (design) {
      // UPDATE PAYLOAD - Definitive structure based on schema analysis
      payload = {
        ...commonData,
        // --- Fields with custom backend logic (expect flat object) ---
        architecturalDesign: {
          pdfFiles: fileListPayload(architecturalDesign.pdfFiles, "PDF"),
          cadFiles: fileListPayload(architecturalDesign.cadFiles, "CAD"),
        },
        ...(structuralDesign.pdfFiles.length > 0 ||
        structuralDesign.cadFiles.length > 0
          ? {
              structuralDesign: {
                pdfFiles: fileListPayload(structuralDesign.pdfFiles, "PDF"),
                cadFiles: fileListPayload(structuralDesign.cadFiles, "CAD"),
              },
            }
          : {}),
        billOfQuantities: {
          excelFiles: fileListPayload(billOfQuantities.excelFiles, "EXCEL"),
          pdfFiles: fileListPayload(billOfQuantities.pdfFiles, "PDF"),
        },

        // --- True relational fields (expect Prisma update object) ---
        images: {
          deleteMany: {},
          create: fileListPayload(images, "IMAGE"),
        },
        floorPlans: {
          deleteMany: {},
          create: fileListPayload(floorPlans, "FLOOR_PLAN"),
        },
        files: {
          deleteMany: {},
          create: fileListPayload(files, "FILE"),
        },
        packageOptions: {
          deleteMany: {},
          create: packageOptionsPayload,
        },
      };
    } else {
      // CREATE PAYLOAD
      payload = {
        ...commonData,
        images: { create: fileListPayload(images, "IMAGE") },
        floorPlans: { create: fileListPayload(floorPlans, "FLOOR_PLAN") },
        files: { create: fileListPayload(files, "FILE") },
        packageOptions: { create: packageOptionsPayload },

        architecturalDesign: {
          create: {
            type: "ARCHITECTURAL",
            pdfFiles: fileListPayload(architecturalDesign.pdfFiles, "PDF"),
            cadFiles: fileListPayload(architecturalDesign.cadFiles, "CAD"),
          },
        },
        ...(structuralDesign.pdfFiles.length > 0 ||
        structuralDesign.cadFiles.length > 0
          ? {
              structuralDesign: {
                create: {
                  type: "STRUCTURAL",
                  pdfFiles: fileListPayload(structuralDesign.pdfFiles, "PDF"),
                  cadFiles: fileListPayload(structuralDesign.cadFiles, "CAD"),
                },
              },
            }
          : {}),
        billOfQuantities: {
          create: {
            type: "BILL_OF_QUANTITIES",
            excelFiles: fileListPayload(billOfQuantities.excelFiles, "EXCEL"),
            pdfFiles: fileListPayload(billOfQuantities.pdfFiles, "PDF"),
          },
        },
      };
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(`Design ${design ? "updated" : "created"} successfully!`);
        router.push("/admin/designs");
        router.refresh();
      } else {
        const errorData = await response.json();
        toast.error(
          `Error: ${
            errorData.error ||
            `Failed to ${design ? "update" : "create"} design`
          }`
        );
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred.");
      console.error(`Error ${design ? "updating" : "creating"} design:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- MAIN RETURN ---
  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (
          e.key === "Enter" &&
          (e.target as HTMLElement).tagName === "INPUT"
        ) {
          e.preventDefault();
        }
      }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <FiArrowLeft className="w-5 h-5 mr-2" />
          Back to Designs
        </Button>
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={!canSubmit() || isSubmitting}
            className="rounded-full font-bold shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <CgSpinner className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <FiSave className="w-5 h-5 mr-2" />
            )}
            {design ? "Save Changes" : "Create Design"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Stepper */}
        <div className="lg:sticky lg:top-24">
          <Card className="rounded-2xl shadow-lg border-2">
            <CardHeader>
              <CardTitle>Form Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                {steps.map((step, index) => (
                  <button
                    type="button"
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      currentStep === index
                        ? "bg-blue-100 dark:bg-blue-900/40"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          currentStep === index
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        } ${
                          completedSteps.has(index) &&
                          currentStep !== index &&
                          "bg-green-500 text-white"
                        }`}
                      >
                        {completedSteps.has(index) && currentStep !== index ? (
                          <FiCheck className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${
                            currentStep === index
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {step.label}
                          {step.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3">
          <Card className="rounded-2xl shadow-lg border-2">
            <CardContent className="p-6 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 0 && (
                    <BasicInfoStep
                      name={name}
                      setName={setName}
                      description={description}
                      setDescription={setDescription}
                      categoryId={categoryId}
                      setCategoryId={setCategoryId}
                      categories={categories}
                      fieldErrors={fieldErrors}
                      setFieldErrors={setFieldErrors}
                    />
                  )}
                  {currentStep === 1 && (
                    <SpecificationsStep
                      bedrooms={bedrooms}
                      setBedrooms={setBedrooms}
                      bathrooms={bathrooms}
                      setBathrooms={setBathrooms}
                      area={area}
                      setArea={setArea}
                      floors={floors}
                      setFloors={setFloors}
                    />
                  )}
                  {currentStep === 2 && (
                    <PricingStep
                      architecturalPdfPrice={architecturalPdfPrice}
                      setArchitecturalPdfPrice={setArchitecturalPdfPrice}
                      architecturalCadPrice={architecturalCadPrice}
                      setArchitecturalCadPrice={setArchitecturalCadPrice}
                      structuralPdfPrice={structuralPdfPrice}
                      setStructuralPdfPrice={setStructuralPdfPrice}
                      structuralCadPrice={structuralCadPrice}
                      setStructuralCadPrice={setStructuralCadPrice}
                      billOfQuantitiesPrice={billOfQuantitiesPrice}
                      setBillOfQuantitiesPrice={setBillOfQuantitiesPrice}
                      billOfQuantitiesPdfPrice={billOfQuantitiesPdfPrice}
                      setBillOfQuantitiesPdfPrice={setBillOfQuantitiesPdfPrice}
                      fieldErrors={fieldErrors}
                      setFieldErrors={setFieldErrors}
                    />
                  )}
                  {currentStep === 3 && (
                    <FilesStep
                      images={images}
                      setImages={setImages}
                      floorPlans={floorPlans}
                      setFloorPlans={setFloorPlans}
                      files={files}
                      setFiles={setFiles}
                      architecturalDesign={architecturalDesign}
                      setArchitecturalDesign={setArchitecturalDesign}
                      structuralDesign={structuralDesign}
                      setStructuralDesign={setStructuralDesign}
                      billOfQuantities={billOfQuantities}
                      setBillOfQuantities={setBillOfQuantities}
                      fieldErrors={fieldErrors}
                      setFieldErrors={setFieldErrors}
                    />
                  )}

                  {currentStep === 4 && (
                    <PackageOptionsStep
                      packageOptions={packageOptions}
                      addPackageOption={addPackageOption}
                      removePackageOption={removePackageOption}
                      handlePackageChange={handlePackageChange}
                      handlePackageFile={handlePackageFile}
                    />
                  )}

                  {currentStep === 5 && (
                    <ReviewStep
                      designData={{
                        name,
                        description,
                        basePrice: parseFloat(architecturalPdfPrice) || 0,
                        images,
                        floorPlans,
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isSubmitting}
              className="rounded-full"
            >
              <FiChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                variant="default"
                onClick={handleNext}
                disabled={isSubmitting}
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
                <FiChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!canSubmit() || isSubmitting}
                className="rounded-full font-bold shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <CgSpinner className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <FiSave className="w-5 h-5 mr-2" />
                )}
                {design ? "Save Changes" : "Create Design"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

interface Category {
  id: string;
  name: string;
}

interface BasicInfoStepProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  categories: Category[];
  fieldErrors: Record<string, string>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const BasicInfoStepComponent: React.FC<BasicInfoStepProps> = ({
  name,
  setName,
  description,
  setDescription,
  categoryId,
  setCategoryId,
  categories,
  fieldErrors,
  setFieldErrors,
}) => (
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
          {categories.map((category) => (
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
  </div>
);

const BasicInfoStep = React.memo(BasicInfoStepComponent);
BasicInfoStep.displayName = "BasicInfoStep";

interface SpecificationsStepProps {
  bedrooms: string;
  setBedrooms: (value: string) => void;
  bathrooms: string;
  setBathrooms: (value: string) => void;
  area: string;
  setArea: (value: string) => void;
  floors: string;
  setFloors: (value: string) => void;
}

const SpecificationsStepComponent: React.FC<SpecificationsStepProps> = ({
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  area,
  setArea,
  floors,
  setFloors,
}) => (
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
        <FormField key={field.id} label={field.label} htmlFor={field.id}>
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

const SpecificationsStep = React.memo(SpecificationsStepComponent);
SpecificationsStep.displayName = "SpecificationsStep";

interface PricingStepProps {
  architecturalPdfPrice: string;
  setArchitecturalPdfPrice: (value: string) => void;
  architecturalCadPrice: string;
  setArchitecturalCadPrice: (value: string) => void;
  structuralPdfPrice: string;
  setStructuralPdfPrice: (value: string) => void;
  structuralCadPrice: string;
  setStructuralCadPrice: (value: string) => void;
  billOfQuantitiesPrice: string;
  setBillOfQuantitiesPrice: (value: string) => void;
  billOfQuantitiesPdfPrice: string;
  setBillOfQuantitiesPdfPrice: (value: string) => void;
  fieldErrors: Record<string, string>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

// Define the component separately with a named function
const PricingStepComponent: React.FC<PricingStepProps> = ({
  architecturalPdfPrice,
  setArchitecturalPdfPrice,
  architecturalCadPrice,
  setArchitecturalCadPrice,
  structuralPdfPrice,
  setStructuralPdfPrice,
  structuralCadPrice,
  setStructuralCadPrice,
  billOfQuantitiesPrice,
  setBillOfQuantitiesPrice,
  billOfQuantitiesPdfPrice,
  setBillOfQuantitiesPdfPrice,
  fieldErrors,
  setFieldErrors,
}) => (
  <div className="space-y-8">
    <SectionHeader
      icon={FiDollarSign}
      title="Pricing Information"
      description="Set pricing for the design and associated documents"
      required
    />

    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
        <FiFileText className="w-6 h-6 text-blue-500" />
        Document Pricing
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Note: Base Price will be set to the Architectural PDF Price.
      </p>
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
            label: "Bill of Quantities (Excel)",
            value: billOfQuantitiesPrice,
            setter: setBillOfQuantitiesPrice,
          },
          {
            id: "billOfQuantitiesPdfPrice",
            label: "Bill of Quantities (PDF)",
            value: billOfQuantitiesPdfPrice,
            setter: setBillOfQuantitiesPdfPrice,
          },
        ].map((field) => (
          <FormField key={field.id} label={field.label} htmlFor={field.id}>
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

// Apply React.memo to the named component
const PricingStep = React.memo(PricingStepComponent);
PricingStep.displayName = "PricingStep";

interface FileType {
  url: string;
  name: string;
  type: string;
  size: number;
}

interface DocumentState {
  pdfFiles: FileType[];
  cadFiles: FileType[];
  excelFiles: FileType[];
}

interface FilesStepProps {
  images: FileType[];
  setImages: (files: FileType[]) => void;
  floorPlans: FileType[];
  setFloorPlans: (files: FileType[]) => void;
  files: FileType[];
  setFiles: (files: FileType[]) => void;
  architecturalDesign: DocumentState;
  setArchitecturalDesign: (doc: DocumentState) => void;
  structuralDesign: DocumentState;
  setStructuralDesign: (doc: DocumentState) => void;
  billOfQuantities: DocumentState;
  setBillOfQuantities: (doc: DocumentState) => void;
  fieldErrors: Record<string, string>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const FilesStepComponent: React.FC<FilesStepProps> = ({
  images,
  setImages,
  floorPlans,
  setFloorPlans,
  files,
  setFiles,
  architecturalDesign,
  setArchitecturalDesign,
  structuralDesign,
  setStructuralDesign,
  billOfQuantities,
  setBillOfQuantities,
  fieldErrors,
  setFieldErrors,
}) => {
  const categoryMap: { [key: string]: string } = {
    pdfFiles: "PDF",
    cadFiles: "CAD",
    excelFiles: "EXCEL",
  };

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
                  Upload high-quality images of your design. At least one image
                  is required.
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              onUploadSuccess={(file) => {
                const mappedFile = { ...file, name: file.originalFileName || "Unknown", size: 0 };
                setImages([...images, mappedFile]);
                setFieldErrors((prev) => ({ ...prev, images: "" }));
              }}
              onFileRemove={(fileUrl) =>
                setImages(images.filter((f) => f.url !== fileUrl))
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
              onUploadSuccess={(file) => {
                const mappedFile = { ...file, name: file.originalFileName || "Unknown", size: 0 };
                setFloorPlans([...floorPlans, mappedFile]);
              }}
              onFileRemove={(fileUrl) =>
                setFloorPlans(floorPlans.filter((f) => f.url !== fileUrl))
              }
              initialFiles={floorPlans}
              fileTypeCategory="FLOOR_PLAN"
              multiple
              accept="image/jpeg, image/png, image/gif, image/webp, application/pdf"
            />
          </CardContent>
        </Card>

        {/* Other Files */}
        <Card className="border-2 border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <FiFileText className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-white">
                  Other Files
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Upload any other supporting documents
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              onUploadSuccess={(file) => {
                const mappedFile = { ...file, name: file.originalFileName || "Unknown", size: 0 };
                setFiles([...files, mappedFile]);
              }}
              onFileRemove={(fileUrl) =>
                setFiles(files.filter((f) => f.url !== fileUrl))
              }
              initialFiles={files}
              fileTypeCategory="FILE"
              multiple
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
            fields: [
              {
                id: "pdfFiles",
                label: "PDF Files",
                accept: "application/pdf",
              },
              {
                id: "cadFiles",
                label: "CAD Files",
                accept: ".dwg, .dxf",
              },
            ],
          },
          {
            title: "Structural Design",
            icon: FiLayers,
            iconColor: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-100 dark:bg-orange-900/30",
            state: structuralDesign,
            setState: setStructuralDesign,
            fields: [
              {
                id: "pdfFiles",
                label: "PDF Files",
                accept: "application/pdf",
              },
              {
                id: "cadFiles",
                label: "CAD Files",
                accept: ".dwg, .dxf",
              },
            ],
          },
          {
            title: "Bill of Quantities",
            icon: FiFileText,
            iconColor: "text-red-600 dark:text-red-400",
            bgColor: "bg-red-100 dark:bg-red-900/30",
            state: billOfQuantities,
            setState: setBillOfQuantities,
            fields: [
              {
                id: "excelFiles",
                label: "Excel/CSV Files",
                accept:
                  ".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              },
              {
                id: "pdfFiles",
                label: "PDF Files",
                accept: "application/pdf",
              },
            ],
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
              {doc.fields.map((field) => (
                <div key={field.id}>
                  <Label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">
                    {field.label}
                  </Label>
                  <FileUpload
                    onUploadSuccess={(file) => {
                      const mappedFile = { ...file, name: file.originalFileName || "Unknown", size: 0 };
                      doc.setState({
                        ...doc.state,
                        [field.id]: [...doc.state[field.id as keyof DocumentState], mappedFile],
                      });
                    }}
                    onFileRemove={(fileUrl) =>
                      doc.setState({
                        ...doc.state,
                        [field.id]: doc.state[field.id as keyof DocumentState].filter(
                          (f: FileType) => f.url !== fileUrl
                        ),
                      })
                    }
                    initialFiles={doc.state[field.id as keyof DocumentState]}
                    fileTypeCategory={categoryMap[field.id] || "OTHER"}
                    multiple
                    accept={field.accept}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const FilesStep = React.memo(FilesStepComponent);
FilesStep.displayName = "FilesStep";

interface PackageOption {
  name: string;
  price: string;
  file: FileType[];
}

interface PackageOptionsStepProps {
  packageOptions: PackageOption[];
  addPackageOption: () => void;
  removePackageOption: (index: number) => void;
  handlePackageChange: (index: number, field: string, value: string) => void;
  handlePackageFile: (index: number, files: FileType[]) => void;
}

const PackageOptionsStepComponent: React.FC<PackageOptionsStepProps> = ({
  packageOptions,
  addPackageOption,
  removePackageOption,
  handlePackageChange,
  handlePackageFile,
}) => (
  <div className="space-y-8">
    <SectionHeader
      icon={FiPackage}
      title="Package Options"
      description="Define additional packages or services available with this design"
    />
    <div className="space-y-6">
      {packageOptions.map((option, index) => (
        <Card
          key={index}
          className="border-2 border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-sm relative"
        >
          <CardContent className="pt-6 space-y-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removePackageOption(index)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <FiX className="w-5 h-5" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Package Name" htmlFor={`pkg-name-${index}`}>
                <Input
                  id={`pkg-name-${index}`}
                  value={option.name}
                  onChange={(e) =>
                    handlePackageChange(index, "name", e.target.value)
                  }
                  placeholder="e.g., 3D Visualization Package"
                  className="rounded-xl h-12 text-base border-2"
                />
              </FormField>
              <FormField label="Price ($)" htmlFor={`pkg-price-${index}`}>
                <Input
                  id={`pkg-price-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={option.price}
                  onChange={(e) =>
                    handlePackageChange(index, "price", e.target.value)
                  }
                  placeholder="0.00"
                  className="rounded-xl h-12 text-base border-2"
                />
              </FormField>
            </div>
            <FormField label="File (Optional)" htmlFor={`pkg-file-${index}`}>
              <FileUpload
                onUploadSuccess={(file) => {
                  const mappedFile = { ...file, name: file.originalFileName || "Unknown", size: 0 };
                  handlePackageFile(index, [mappedFile]);
                }}
                onFileRemove={(fileUrl) =>
                  handlePackageFile(
                    index,
                    option.file.filter((f) => f.url !== fileUrl)
                  )
                }
                initialFiles={option.file}
                fileTypeCategory="FILE"
                multiple={false}
              />
            </FormField>
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addPackageOption}
        className="w-full"
      >
        <FiPlus className="w-4 h-4 mr-2" />
        Add New Package
      </Button>
    </div>
  </div>
);

const PackageOptionsStep = React.memo(PackageOptionsStepComponent);
PackageOptionsStep.displayName = "PackageOptionsStep";

const ReviewStep = ({ designData }: { designData: any }) => {
  return (
    <div className="space-y-8">
      <SectionHeader
        icon={FiCheck}
        title="Review Your Design"
        description="Please review the details below before submitting."
      />
      <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border-2">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {designData.name || "Untitled Design"}
        </h3>
        <p className="text-base text-gray-600 dark:text-gray-400">
          {designData.description || "No description provided."}
        </p>
        <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-lg font-semibold">
            Base Price:{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              ${parseFloat(designData.basePrice || 0).toFixed(2)}
            </span>
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-2">Uploaded Images:</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {designData.images.length > 0 ? (
              designData.images.map((img: any, index: number) => (
                <img
                  key={index}
                  src={img.url}
                  alt={`preview ${index}`}
                  className="w-full h-24 object-cover rounded-lg shadow-md"
                />
              ))
            ) : (
              <p className="text-sm text-gray-500">No images uploaded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignForm;
