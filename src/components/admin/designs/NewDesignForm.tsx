"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FiX, FiPlus, FiSave, FiEdit } from "react-icons/fi";
import Link from "next/link";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import FileUpload from "./FileUpload";

interface NewDesignFormProps {
  onClose: () => void;
  folderId?: string;
  designToEdit?: any;
  onSuccess?: () => void;
}

const NewDesignForm = ({
  onClose,
  folderId,
  designToEdit,
  onSuccess,
}: NewDesignFormProps) => {
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
    { name: string; price: string; file: any[] }[]
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

  const isEditMode = Boolean(designToEdit);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data.categories);
    };

    fetchCategories();

    if (isEditMode) {
      setName(designToEdit.name || "");
      setDescription(designToEdit.description || "");
      setBasePrice(designToEdit.basePrice?.toString() || "");
      setPriceRange(designToEdit.priceRange || "");
      setBedrooms(designToEdit.bedrooms?.toString() || "");
      setBathrooms(designToEdit.bathrooms?.toString() || "");
      setArea(designToEdit.area?.toString() || "");
      setFloors(designToEdit.floors?.toString() || "");
      setPlanDetails(
        Array.isArray(designToEdit.planDetails)
          ? designToEdit.planDetails.join("\n")
          : ""
      );
      setCategoryId(designToEdit.categoryId || "");
      setArchitecturalDesign(
        designToEdit.architecturalDesign || {
          description: "",
          overview: "",
          pdfFiles: [],
          cadFiles: [],
        }
      );
      setStructuralDesign(
        designToEdit.structuralDesign || {
          description: "",
          overview: "",
          pdfFiles: [],
          cadFiles: [],
        }
      );
      setBillOfQuantities(
        designToEdit.billOfQuantities || {
          description: "",
          overview: "",
          excelFiles: [],
        }
      );
      setMinBuildingCost(designToEdit.minBuildingCost?.toString() || "");
      setMaxBuildingCost(designToEdit.maxBuildingCost?.toString() || "");

      if (designToEdit.buildingCostEstimates) {
        const estimates = {
          basic: { description: "", costBreakdown: [] },
          luxury: { description: "", costBreakdown: [] },
        };
        designToEdit.buildingCostEstimates.forEach((est) => {
          estimates[est.tier] = {
            description: est.description,
            costBreakdown: est.costBreakdown.map((item) => ({
              item: item.item,
              cost: item.cost.toString(),
            })),
          };
        });
        setBuildingCostEstimates(estimates);
      }

      setArchitecturalPdfPrice(
        designToEdit.architecturalPdfPrice?.toString() || ""
      );
      setArchitecturalCadPrice(
        designToEdit.architecturalCadPrice?.toString() || ""
      );
      setStructuralPdfPrice(designToEdit.structuralPdfPrice?.toString() || "");
      setStructuralCadPrice(designToEdit.structuralCadPrice?.toString() || "");
      setBillOfQuantitiesPrice(
        designToEdit.billOfQuantitiesPrice?.toString() || ""
      );
      setPackageOptions(
        designToEdit.packageOptions.map((opt) => ({
          ...opt,
          price: opt.price.toString(),
          file: opt.file ? [opt.file] : [],
        })) || []
      );

      setImages(designToEdit.images || []);
      setFloorPlans(designToEdit.floorPlans || []);
    }
  }, [designToEdit, isEditMode]);

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
      return;
    }

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
      folderId: isEditMode ? designToEdit.folderId : folderId,
      categoryId,
      minBuildingCost: parseFloat(minBuildingCost) || null,
      maxBuildingCost: parseFloat(maxBuildingCost) || null,
      architecturalPdfPrice: parseFloat(architecturalPdfPrice) || null,
      architecturalCadPrice: parseFloat(architecturalCadPrice) || null,
      structuralPdfPrice: parseFloat(structuralPdfPrice) || null,
      structuralCadPrice: parseFloat(structuralCadPrice) || null,
      billOfQuantitiesPrice: parseFloat(billOfQuantitiesPrice) || null,
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
      const url = isEditMode
        ? `/api/designs/${designToEdit.id}`
        : "/api/designs";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(
          `Design ${isEditMode ? "updated" : "created"} successfully!`
        );
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      toast.error(`An unexpected error occurred.`);
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} design:`,
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl mx-auto flex flex-col max-h-[95dvh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-4 sm:p-6 border-b border-border flex-shrink-0 flex justify-between items-center bg-gradient-to-r from-blue-600 to-cyan-400 text-white rounded-t-2xl">
            <div className="flex items-center gap-2 sm:gap-3">
              {isEditMode ? (
                <FiEdit size={20} className="sm:w-6 sm:h-6" />
              ) : (
                <FiPlus size={20} className="sm:w-6 sm:h-6" />
              )}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                  {isEditMode ? "Edit Design" : "Create New Design"}
                </h3>
                {isEditMode ? (
                  <Link
                    href={`/admin/designs/new?id=${designToEdit.id}`}
                    className="text-xs sm:text-sm text-yellow-300 hover:text-yellow-100 transition-colors"
                  >
                    (Edit in page)
                  </Link>
                ) : (
                  <Link
                    href="/admin/designs/new"
                    className="text-xs sm:text-sm text-yellow-300 hover:text-yellow-100 transition-colors"
                  >
                    (Add in page)
                  </Link>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/20 transition-colors"
            >
              <FiX size={16} className="sm:w-5 sm:h-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-medium text-foreground/90">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="name" className="text-sm sm:text-base">
                      Design Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Modern Villa"
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="category" className="text-sm sm:text-base">
                      Category
                    </Label>
                    <select
                      id="category"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full p-2 border rounded-md bg-background text-sm sm:text-base h-10 sm:h-11"
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

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="description" className="text-sm sm:text-base">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A brief description of the design..."
                    className="text-sm sm:text-base min-h-[80px] sm:min-h-[100px] resize-vertical"
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="planDetails" className="text-sm sm:text-base">
                    Plan Details (one per line)
                  </Label>
                  <Textarea
                    id="planDetails"
                    name="planDetails"
                    value={planDetails}
                    onChange={(e) => setPlanDetails(e.target.value)}
                    placeholder="e.g., 3 Bedrooms\n2 Bathrooms\nOpen-plan kitchen"
                    className="text-sm sm:text-base min-h-[80px] sm:min-h-[100px] resize-vertical"
                  />
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-medium text-foreground/90">
                  Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="basePrice" className="text-sm sm:text-base">
                      Base Price
                    </Label>
                    <Input
                      id="basePrice"
                      name="basePrice"
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      placeholder="e.g., 50000"
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label
                      htmlFor="priceRange"
                      className="text-sm sm:text-base"
                    >
                      Price Range
                    </Label>
                    <Input
                      id="priceRange"
                      name="priceRange"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      placeholder="e.g., $50k - $70k"
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="bedrooms" className="text-sm sm:text-base">
                      Bedrooms
                    </Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      placeholder="e.g., 3"
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="bathrooms" className="text-sm sm:text-base">
                      Bathrooms
                    </Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      placeholder="e.g., 2"
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="area" className="text-sm sm:text-base">
                      Area (sq ft)
                    </Label>
                    <Input
                      id="area"
                      name="area"
                      type="number"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g., 1200"
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="floors" className="text-sm sm:text-base">
                      Floors
                    </Label>
                    <Input
                      id="floors"
                      name="floors"
                      type="number"
                      value={floors}
                      onChange={(e) => setFloors(e.target.value)}
                      placeholder="e.g., 2"
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Document Pricing */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-medium text-foreground/90">
                  Document Pricing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label
                      htmlFor="architecturalPdfPrice"
                      className="text-sm sm:text-base"
                    >
                      Architectural PDF
                    </Label>
                    <Input
                      id="architecturalPdfPrice"
                      name="architecturalPdfPrice"
                      type="number"
                      value={architecturalPdfPrice}
                      onChange={(e) => setArchitecturalPdfPrice(e.target.value)}
                      placeholder="e.g., 50"
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label
                      htmlFor="architecturalCadPrice"
                      className="text-sm sm:text-base"
                    >
                      Architectural CAD
                    </Label>
                    <Input
                      id="architecturalCadPrice"
                      name="architecturalCadPrice"
                      type="number"
                      value={architecturalCadPrice}
                      onChange={(e) => setArchitecturalCadPrice(e.target.value)}
                      placeholder="e.g., 100"
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label
                      htmlFor="structuralPdfPrice"
                      className="text-sm sm:text-base"
                    >
                      Structural PDF
                    </Label>
                    <Input
                      id="structuralPdfPrice"
                      name="structuralPdfPrice"
                      type="number"
                      value={structuralPdfPrice}
                      onChange={(e) => setStructuralPdfPrice(e.target.value)}
                      placeholder="e.g., 50"
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label
                      htmlFor="structuralCadPrice"
                      className="text-sm sm:text-base"
                    >
                      Structural CAD
                    </Label>
                    <Input
                      id="structuralCadPrice"
                      name="structuralCadPrice"
                      type="number"
                      value={structuralCadPrice}
                      onChange={(e) => setStructuralCadPrice(e.target.value)}
                      placeholder="e.g., 100"
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 sm:col-span-2 lg:col-span-1">
                    <Label
                      htmlFor="billOfQuantitiesPrice"
                      className="text-sm sm:text-base"
                    >
                      Bill of Quantities
                    </Label>
                    <Input
                      id="billOfQuantitiesPrice"
                      name="billOfQuantitiesPrice"
                      type="number"
                      value={billOfQuantitiesPrice}
                      onChange={(e) => setBillOfQuantitiesPrice(e.target.value)}
                      placeholder="e.g., 80"
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Package Options */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-medium text-foreground/90">
                  Package Options
                </h3>
                {packageOptions.map((option, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 border rounded-lg space-y-2 bg-muted/30"
                  >
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                      <Input
                        placeholder="Option Name"
                        value={option.name}
                        onChange={(e) => {
                          const newOptions = [...packageOptions];
                          newOptions[index].name = e.target.value;
                          setPackageOptions(newOptions);
                        }}
                        className="text-sm sm:text-base flex-1"
                      />
                      <Input
                        placeholder="Price"
                        type="number"
                        value={option.price}
                        onChange={(e) => {
                          const newOptions = [...packageOptions];
                          newOptions[index].price = e.target.value;
                          setPackageOptions(newOptions);
                        }}
                        className="text-sm sm:text-base w-full sm:w-32"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newOptions = [...packageOptions];
                          newOptions.splice(index, 1);
                          setPackageOptions(newOptions);
                        }}
                        className="h-10 sm:h-9 mt-2 sm:mt-0"
                      >
                        Remove
                      </Button>
                    </div>
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
                  </div>
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
                  className="w-full sm:w-auto"
                >
                  Add Package Option
                </Button>
              </div>

              {/* File Upload Sections */}
              {[
                {
                  title: "Architectural Design",
                  state: architecturalDesign,
                  setState: setArchitecturalDesign,
                  fileTypes: [
                    {
                      label: "PDFs",
                      key: "pdfFiles",
                      accept: "application/pdf",
                      category: "PDF",
                    },
                    {
                      label: "CADs",
                      key: "cadFiles",
                      accept: ".dwg, .dxf",
                      category: "CAD",
                    },
                  ],
                },
                {
                  title: "Structural Design",
                  state: structuralDesign,
                  setState: setStructuralDesign,
                  fileTypes: [
                    {
                      label: "PDFs",
                      key: "pdfFiles",
                      accept: "application/pdf",
                      category: "PDF",
                    },
                    {
                      label: "CADs",
                      key: "cadFiles",
                      accept: ".dwg, .dxf",
                      category: "CAD",
                    },
                  ],
                },
                {
                  title: "Bill of Quantities",
                  state: billOfQuantities,
                  setState: setBillOfQuantities,
                  fileTypes: [
                    {
                      label: "Excel Files",
                      key: "excelFiles",
                      accept: ".xls, .xlsx",
                      category: "EXCEL",
                    },
                  ],
                },
              ].map((section, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-base sm:text-lg font-medium text-foreground/90">
                    {section.title}
                  </h3>

                  <div className="space-y-3">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm sm:text-base">
                        Description
                      </Label>
                      <Input
                        value={section.state.description}
                        onChange={(e) =>
                          section.setState((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="text-sm sm:text-base h-10 sm:h-11"
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label className="text-sm sm:text-base">Overview</Label>
                      <Textarea
                        value={section.state.overview}
                        onChange={(e) =>
                          section.setState((prev) => ({
                            ...prev,
                            overview: e.target.value,
                          }))
                        }
                        className="text-sm sm:text-base min-h-[80px] resize-vertical"
                      />
                    </div>

                    {section.fileTypes.map((fileType, fileIndex) => (
                      <div key={fileIndex} className="space-y-1.5 sm:space-y-2">
                        <Label className="text-sm sm:text-base">
                          {fileType.label}
                        </Label>
                        <FileUpload
                          onUploadSuccess={(files) =>
                            section.setState((prev) => ({
                              ...prev,
                              [fileType.key]: [...prev[fileType.key], ...files],
                            }))
                          }
                          onFileRemove={(fileUrl) =>
                            section.setState((prev) => ({
                              ...prev,
                              [fileType.key]: prev[fileType.key].filter(
                                (f) => f.url !== fileUrl
                              ),
                            }))
                          }
                          initialFiles={section.state[fileType.key]}
                          fileTypeCategory={fileType.category}
                          multiple
                          accept={fileType.accept}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Media Uploads */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-medium text-foreground/90">
                  Media
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm sm:text-base">
                      General Images
                    </Label>
                    <FileUpload
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
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm sm:text-base">Floor Plans</Label>
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
                  </div>
                </div>
              </div>

              {/* Building Cost Estimates */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-medium text-foreground/90">
                  Building Cost Estimates
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label
                      htmlFor="minBuildingCost"
                      className="text-sm sm:text-base"
                    >
                      Min Building Cost
                    </Label>
                    <Input
                      id="minBuildingCost"
                      name="minBuildingCost"
                      type="number"
                      value={minBuildingCost}
                      onChange={(e) => setMinBuildingCost(e.target.value)}
                      placeholder="e.g., 100000"
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label
                      htmlFor="maxBuildingCost"
                      className="text-sm sm:text-base"
                    >
                      Max Building Cost
                    </Label>
                    <Input
                      id="maxBuildingCost"
                      name="maxBuildingCost"
                      type="number"
                      value={maxBuildingCost}
                      onChange={(e) => setMaxBuildingCost(e.target.value)}
                      placeholder="e.g., 150000"
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                </div>

                {["basic", "luxury"].map((tier) => (
                  <div
                    key={tier}
                    className="rounded-lg border p-3 sm:p-4 bg-muted/30"
                  >
                    <h4 className="text-sm sm:text-md font-medium capitalize mb-3">
                      {tier} Tier
                    </h4>

                    <div className="space-y-3">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label
                          htmlFor={`${tier}-description`}
                          className="text-sm sm:text-base"
                        >
                          Description
                        </Label>
                        <Textarea
                          id={`${tier}-description`}
                          value={buildingCostEstimates[tier]?.description || ""}
                          onChange={(e) => {
                            const newEstimates = { ...buildingCostEstimates };
                            newEstimates[tier].description = e.target.value;
                            setBuildingCostEstimates(newEstimates);
                          }}
                          rows={2}
                          className="text-sm sm:text-base resize-vertical"
                        />
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Cost Breakdown</h5>
                        {buildingCostEstimates[tier]?.costBreakdown.map(
                          (item, index) => (
                            <div
                              key={index}
                              className="flex flex-col sm:flex-row gap-2 items-start sm:items-center"
                            >
                              <Input
                                placeholder="Item"
                                value={item.item}
                                onChange={(e) =>
                                  handleCostBreakdownChange(
                                    tier,
                                    index,
                                    "item",
                                    e.target.value
                                  )
                                }
                                className="text-sm sm:text-base flex-1"
                              />
                              <Input
                                placeholder="Cost"
                                value={item.cost}
                                onChange={(e) =>
                                  handleCostBreakdownChange(
                                    tier,
                                    index,
                                    "cost",
                                    e.target.value
                                  )
                                }
                                className="text-sm sm:text-base w-full sm:w-32"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  removeCostBreakdownItem(tier, index)
                                }
                                className="h-10 sm:h-9 w-full sm:w-auto mt-1 sm:mt-0"
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
                          className="w-full sm:w-auto mt-2"
                        >
                          Add Item
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 sm:p-6 bg-muted/50 flex flex-col sm:flex-row gap-3 sm:gap-4 rounded-b-2xl flex-shrink-0 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none order-2 sm:order-1 h-11 sm:h-10"
            >
              <FiX className="mr-2 w-4 h-4" /> Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none order-1 sm:order-2 h-11 sm:h-10"
            >
              {isSubmitting ? (
                <CgSpinner className="animate-spin mr-2 w-4 h-4" />
              ) : (
                <FiSave className="mr-2 w-4 h-4" />
              )}
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Saving..."
                : isEditMode
                  ? "Update Design"
                  : "Save Design"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NewDesignForm;
