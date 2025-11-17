"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { CgSpinner } from "react-icons/cg";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
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
  FiTrash,
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

const DesignForm = ({ design }: DesignFormProps) => {
  const router = useRouter();
  const [name, setName] = useState(design?.name || "");
  const [description, setDescription] = useState(design?.description || "");
  const [basePrice, setBasePrice] = useState(
    design?.basePrice?.toString() || ""
  );
  const [priceRange, setPriceRange] = useState(design?.priceRange || "");
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
      setBasePrice(design.basePrice?.toString() || "");
      setPriceRange(design.priceRange || "");
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
      setArchitecturalPdfPrice(
        design.architecturalPdfPrice?.toString() || ""
      );
      setArchitecturalCadPrice(
        design.architecturalCadPrice?.toString() || ""
      );
      setStructuralPdfPrice(design.structuralPdfPrice?.toString() || "");
      setStructuralCadPrice(design.structuralCadPrice?.toString() || "");
      setBillOfQuantitiesPrice(
        design.billOfQuantitiesPrice?.toString() || ""
      );
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

    // Step 2: Pricing (Required)
    if (basePrice && parseFloat(basePrice) > 0) {
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

    setCompletedSteps(newCompleted);
  }, [
    name,
    description,
    categoryId, // Step 0
    bedrooms,
    bathrooms,
    area,
    floors, // Step 1
    basePrice, // Step 2
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
    field: "name" | "price",
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
    if (!basePrice || parseFloat(basePrice) <= 0)
      errors.push("Base Price must be a positive number.");
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
      } else if (!basePrice || parseFloat(basePrice) <= 0) {
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



    const commonData = {
      name,
      description,
      basePrice: parseFloat(basePrice),
      priceRange,
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
            pdfFiles: {
              create: fileListPayload(architecturalDesign.pdfFiles, "PDF"),
            },
            cadFiles: {
              create: fileListPayload(architecturalDesign.cadFiles, "CAD"),
            },
          },
        },
        ...(structuralDesign.pdfFiles.length > 0 ||
        structuralDesign.cadFiles.length > 0
          ? {
              structuralDesign: {
                create: {
                  type: "STRUCTURAL",
                  pdfFiles: {
                    create: fileListPayload(
                      structuralDesign.pdfFiles,
                      "PDF"
                    ),
                  },
                  cadFiles: {
                    create: fileListPayload(
                      structuralDesign.cadFiles,
                      "CAD"
                    ),
                  },
                },
              },
            }
          : {}),
        billOfQuantities: {
          create: {
            type: "BILL_OF_QUANTITIES",
            excelFiles: {
              create: fileListPayload(billOfQuantities.excelFiles, "EXCEL"),
            },
            pdfFiles: {
              create: fileListPayload(billOfQuantities.pdfFiles, "PDF"),
            },
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
        if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
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
                      basePrice={basePrice}
                      setBasePrice={setBasePrice}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
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

const BasicInfoStep = React.memo(
  ({
    name,
    setName,
    description,
    setDescription,
    categoryId,
    setCategoryId,
    categories,
    fieldErrors,
    setFieldErrors,
  }: any) => (
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
              setFieldErrors((prev: any) => ({ ...prev, name: "" }));
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
              setFieldErrors((prev: any) => ({ ...prev, categoryId: "" }));
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
            setFieldErrors((prev: any) => ({ ...prev, description: "" }));
          }}
          placeholder="Describe the design features, architectural style, key characteristics, and unique selling points..."
          className="rounded-xl min-h-[180px] text-base border-2 focus:border-blue-500 resize-vertical transition-colors"
          required
        />
      </FormField>


    </div>
  )
);

const SpecificationsStep = React.memo(
  ({
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    area,
    setArea,
    floors,
    setFloors,
  }: any) => (
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
  )
);

const PricingStep = React.memo(
  ({
    basePrice,
    setBasePrice,
    priceRange,
    setPriceRange,
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
    fieldErrors,
    setFieldErrors,
  }: any) => (
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
              setFieldErrors((prev: any) => ({ ...prev, basePrice: "" }));
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
  )
);

const FilesStep = React.memo(
  ({
    images,
    setImages,
    floorPlans,
    setFloorPlans,
    architecturalDesign,
    setArchitecturalDesign,
    structuralDesign,
    setStructuralDesign,
    billOfQuantities,
    setBillOfQuantities,
    fieldErrors,
    setFieldErrors,
  }: any) => {
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
                    Upload high-quality images of your design. At least one
                    image is required.
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onUploadSuccess={(files) => {
                  setImages((prev: any) => [...prev, ...files]);
                  setFieldErrors((prev: any) => ({ ...prev, images: "" }));
                }}
                onFileRemove={(fileUrl) =>
                  setImages((prev: any) =>
                    prev.filter((f) => f.url !== fileUrl)
                  )
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
                  setFloorPlans((prev: any) => [...prev, ...files])
                }
                onFileRemove={(fileUrl) =>
                  setFloorPlans((prev: any) =>
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
                onUploadSuccess={(uploadedFiles) =>
                  setFiles((prev: any) => [...prev, ...uploadedFiles])
                }
                onFileRemove={(fileUrl) =>
                  setFiles((prev: any) =>
                    prev.filter((f) => f.url !== fileUrl)
                  )
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
                }, // Adjust accept as needed
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
                      onUploadSuccess={(files) =>
                        doc.setState((prev: any) => ({
                          ...prev,
                          [field.id]: [...prev[field.id], ...files],
                        }))
                      }
                      onFileRemove={(fileUrl) =>
                        doc.setState((prev: any) => ({
                          ...prev,
                          [field.id]: prev[field.id].filter(
                            (f: any) => f.url !== fileUrl
                          ),
                        }))
                      }
                      initialFiles={doc.state[field.id]}
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
  }
);

const CostEstimatesStep = React.memo(
  ({
    minBuildingCost,
    setMinBuildingCost,
    maxBuildingCost,
    setMaxBuildingCost,
    buildingCostEstimates,
    setBuildingCostEstimates,
    handleCostBreakdownChange,
    addCostBreakdownItem,
    removeCostBreakdownItem,
  }: any) => (
    <div className="space-y-8">
      <SectionHeader
        icon={FiFileText}
        title="Building Cost Estimates"
        description="Provide optional cost breakdowns for different build tiers"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FormField
          label="Min Building Cost ($)"
          htmlFor="minBuildingCost"
          description="Estimated minimum cost to build this design"
        >
          <Input
            id="minBuildingCost"
            name="minBuildingCost"
            type="number"
            min="0"
            step="100"
            value={minBuildingCost}
            onChange={(e) => setMinBuildingCost(e.target.value)}
            placeholder="e.g., 50000"
            className="rounded-xl h-12 text-base border-2 focus:border-blue-500 transition-colors"
          />
        </FormField>
        <FormField
          label="Max Building Cost ($)"
          htmlFor="maxBuildingCost"
          description="Estimated maximum cost to build this design"
        >
          <Input
            id="maxBuildingCost"
            name="maxBuildingCost"
            type="number"
            min="0"
            step="100"
            value={maxBuildingCost}
            onChange={(e) => setMaxBuildingCost(e.target.value)}
            placeholder="e.g., 80000"
            className="rounded-xl h-12 text-base border-2 focus:border-blue-500 transition-colors"
          />
        </FormField>
      </div>

      {/* Cost Tiers */}
      {(["basic", "luxury"] as const).map((tier) => (
        <Card
          key={tier}
          className="border-2 border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-sm"
        >
          <CardHeader>
            <CardTitle className="capitalize text-xl font-bold text-gray-900 dark:text-white">
              {tier} Finish
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField label="Description" htmlFor={`${tier}-description`}>
              <Textarea
                id={`${tier}-description`}
                value={buildingCostEstimates[tier].description}
                onChange={(e) =>
                  setBuildingCostEstimates((prev: any) => ({
                    ...prev,
                    [tier]: {
                      ...prev[tier],
                      description: e.target.value,
                    },
                  }))
                }
                placeholder={`Describe the ${tier} finish...`}
                className="rounded-xl min-h-[100px] text-base border-2 focus:border-blue-500"
              />
            </FormField>

            <div>
              <Label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">
                Cost Breakdown
              </Label>
              <div className="space-y-4">
                {buildingCostEstimates[tier].costBreakdown.map(
                  (item: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={item.item}
                        onChange={(e) =>
                          handleCostBreakdownChange(
                            tier,
                            index,
                            "item",
                            e.target.value
                          )
                        }
                        placeholder="Item (e.g., Foundation)"
                        className="rounded-xl h-12 text-base border-2"
                      />
                      <Input
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
                        placeholder="Cost ($)"
                        className="rounded-xl h-12 text-base border-2 w-1/3"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCostBreakdownItem(tier, index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <FiTrash className="w-5 h-5" />
                      </Button>
                    </div>
                  )
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => addCostBreakdownItem(tier)}
                className="mt-4"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
);

const PackageOptionsStep = React.memo(
  ({
    packageOptions,
    addPackageOption,
    removePackageOption,
    handlePackageChange,
    handlePackageFile,
  }: any) => (
    <div className="space-y-8">
      <SectionHeader
        icon={FiPackage}
        title="Package Options"
        description="Define additional packages or services available with this design"
      />
      <div className="space-y-6">
        {packageOptions.map((option: any, index: number) => (
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
                  onUploadSuccess={(files) => handlePackageFile(index, files)}
                  onFileRemove={() => handlePackageFile(index, [])}
                  initialFiles={option.file}
                  fileTypeCategory="FILE"
                  multiple={false} // Only one file per package
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
  )
);

export default DesignForm;
