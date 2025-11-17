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
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [packageOptions, setPackageOptions] = useState<
    { name: string; price: string; file: any[] }[]
  >([]);
  const [architecturalDesign, setArchitecturalDesign] = useState({
    pdfFiles: [],
    cadFiles: [],
  });
  const [structuralDesign, setStructuralDesign] = useState({
    pdfFiles: [],
    cadFiles: [],
  });
  const [billOfQuantities, setBillOfQuantities] = useState({
    excelFiles: [],
    pdfFiles: [],
  });
  const [architecturalPdfPrice, setArchitecturalPdfPrice] = useState("");
  const [architecturalCadPrice, setArchitecturalCadPrice] = useState("");
  const [structuralPdfPrice, setStructuralPdfPrice] = useState("");
  const [structuralCadPrice, setStructuralCadPrice] = useState("");
  const [billOfQuantitiesPrice, setBillOfQuantitiesPrice] = useState("");
  const [billOfQuantitiesPdfPrice, setBillOfQuantitiesPdfPrice] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [floorPlans, setFloorPlans] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);

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
      setCategoryId(designToEdit.categoryId || "");
      setArchitecturalDesign(
        designToEdit.architecturalDesign || {
          pdfFiles: [],
          cadFiles: [],
        }
      );
      setStructuralDesign(
        designToEdit.structuralDesign || {
          pdfFiles: [],
          cadFiles: [],
        }
      );
      setBillOfQuantities(
        designToEdit.billOfQuantities || {
          excelFiles: [],
          pdfFiles: [],
        }
      );

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
      setBillOfQuantitiesPdfPrice(
        designToEdit.billOfQuantitiesPdfPrice?.toString() || ""
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
      setFiles(designToEdit.files || []);
    }
  }, [designToEdit, isEditMode]);

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

    // Common payload processing helpers
    const fileListPayload = (files: any[], type: string) =>
      files.map((file: any) => ({
        name: file.originalFileName || file.name || file.url.split("/").pop(),
        url: file.url,
        type,
      }));

    const architecturalDesignData = {
      pdfFiles: fileListPayload(architecturalDesign.pdfFiles, "PDF"),
      cadFiles: fileListPayload(architecturalDesign.cadFiles, "CAD"),
    };

    const structuralDesignData = {
      pdfFiles: fileListPayload(structuralDesign.pdfFiles, "PDF"),
      cadFiles: fileListPayload(structuralDesign.cadFiles, "CAD"),
    };

    const billOfQuantitiesData = {
      excelFiles: fileListPayload(billOfQuantities.excelFiles, "EXCEL"),
      pdfFiles: fileListPayload(billOfQuantities.pdfFiles, "PDF"),
    };

    const commonData = {
      name,
      description,
      basePrice: parseFloat(basePrice),
      priceRange,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      area: area ? parseFloat(area) : null,
      floors: floors ? parseInt(floors) : null,
      categoryId,
      architecturalPdfPrice: parseFloat(architecturalPdfPrice) || null,
      architecturalCadPrice: parseFloat(architecturalCadPrice) || null,
      structuralPdfPrice: parseFloat(structuralPdfPrice) || null,
      structuralCadPrice: parseFloat(structuralCadPrice) || null,
      billOfQuantitiesPrice: parseFloat(billOfQuantitiesPrice) || null,
      billOfQuantitiesPdfPrice: parseFloat(billOfQuantitiesPdfPrice) || null,
    };

    let payload;
    const url = isEditMode ? `/api/designs/${designToEdit.id}` : "/api/designs";
    const method = isEditMode ? "PUT" : "POST";

    const packageOptionsCreatePayload = packageOptions
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

    if (isEditMode) {
      // UPDATE PAYLOAD
      payload = {
        ...commonData,
        // --- Fields with custom backend logic (expect flat object) ---
        architecturalDesign: architecturalDesignData,
        ...(structuralDesignData.pdfFiles.length > 0 ||
        structuralDesignData.cadFiles.length > 0
          ? { structuralDesign: structuralDesignData }
          : designToEdit.structuralDesign
            ? { structuralDesign: { delete: true } }
            : {}),
        billOfQuantities: billOfQuantitiesData,
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
          create: packageOptionsCreatePayload,
        },
      };
    } else {
      // CREATE PAYLOAD
      payload = {
        ...commonData,
        images: { create: fileListPayload(images, "IMAGE") },
        floorPlans: { create: fileListPayload(floorPlans, "FLOOR_PLAN") },
        files: { create: fileListPayload(files, "FILE") },
        packageOptions: {
          create: packageOptionsCreatePayload,
        },
        architecturalDesign: {
          create: { type: "ARCHITECTURAL", ...architecturalDesignData },
        },
        ...(structuralDesignData.pdfFiles.length > 0 ||
        structuralDesignData.cadFiles.length > 0
          ? {
              structuralDesign: {
                create: { type: "STRUCTURAL", ...structuralDesignData },
              },
            }
          : {}),
        billOfQuantities: {
          create: { type: "BILL_OF_QUANTITIES", ...billOfQuantitiesData },
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
        toast.success(
          `Design ${isEditMode ? "updated" : "created"} successfully!`
        );
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error || "Failed to save design"}`);
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
        className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl mx-auto flex flex-col h-[90vh]"
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
                      Area (sq mt)
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
                      Bill of Quantities (Excel)
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
                  <div className="space-y-1.5 sm:space-y-2 sm:col-span-2 lg:col-span-1">
                    <Label
                      htmlFor="billOfQuantitiesPdfPrice"
                      className="text-sm sm:text-base"
                    >
                      Bill of Quantities (PDF)
                    </Label>
                    <Input
                      id="billOfQuantitiesPdfPrice"
                      name="billOfQuantitiesPdfPrice"
                      type="number"
                      value={billOfQuantitiesPdfPrice}
                      onChange={(e) => setBillOfQuantitiesPdfPrice(e.target.value)}
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
                      accept: ".dwg, .dxf, .pln",
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
                      accept: ".dwg, .dxf, .pln",
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
                    {
                      label: "PDFs",
                      key: "pdfFiles",
                      accept: "application/pdf",
                      category: "PDF",
                    },
                  ],
                },
              ].map((section, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-base sm:text-lg font-medium text-foreground/90">
                    {section.title}
                  </h3>

                  <div className="space-y-3">
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

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm sm:text-base">Other Files</Label>
                    <FileUpload
                      onUploadSuccess={(uploadedFiles) =>
                        setFiles((prev) => [...prev, ...uploadedFiles])
                      }
                      onFileRemove={(fileUrl) =>
                        setFiles((prev) =>
                          prev.filter((f) => f.url !== fileUrl)
                        )
                      }
                      initialFiles={files}
                      fileTypeCategory="FILE"
                      multiple
                    />
                  </div>
                </div>
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
