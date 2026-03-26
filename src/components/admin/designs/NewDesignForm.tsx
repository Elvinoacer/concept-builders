"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FiX, FiSave } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import FileUpload from "./FileUpload";
import { useUpload } from "@/contexts/UploadContext";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { buildDesignUpsertPayload } from "@/lib/admin/design-payload";

interface UploadedFile {
  url: string;
  name?: string;
  originalFileName?: string;
  type?: string;
}

interface Category {
  id: string;
  name: string;
}

type DocumentCollection = Record<string, UploadedFile[]>;

interface PackageOptionState {
  id?: string;
  name: string;
  price: string;
  file: UploadedFile[];
}

export interface DesignToEdit {
  id: string;
  name?: string;
  description?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  floors?: number | null;
  categoryId?: string;
  architecturalDesign?: DocumentCollection;
  structuralDesign?: DocumentCollection;
  billOfQuantities?: DocumentCollection;
  architecturalPdfPrice?: number | null;
  architecturalCadPrice?: number | null;
  structuralPdfPrice?: number | null;
  structuralCadPrice?: number | null;
  billOfQuantitiesPrice?: number | null;
  billOfQuantitiesPdfPrice?: number | null;
  packageOptions?: Array<{
    id?: string;
    name: string;
    price: number | string;
    file?: UploadedFile | null;
  }>;
  images?: UploadedFile[];
  floorPlans?: UploadedFile[];
  files?: UploadedFile[];
}

interface NewDesignFormProps {
  onClose: () => void;
  folderId?: string;
  designToEdit?: DesignToEdit;
  onSuccess?: () => void;
}

const NewDesignForm = ({
  onClose,
  folderId,
  designToEdit,
  onSuccess,
}: NewDesignFormProps) => {
  const toFileUploadItem = (file: UploadedFile, fallbackType: string) => ({
    url: file.url,
    name:
      file.name ||
      file.originalFileName ||
      decodeURIComponent(file.url.split("/").pop() || "file"),
    type: file.type || fallbackType,
  });

  const toUploadFile = (
    file: Partial<UploadedFile> & { url: string },
    fallbackType: string,
  ): UploadedFile => ({
    url: file.url,
    name:
      file.name ||
      file.originalFileName ||
      decodeURIComponent(file.url.split("/").pop() || "file"),
    originalFileName: file.originalFileName,
    type: file.type || fallbackType,
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // basePrice and priceRange removed from state, will be sent as defaults
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [floors, setFloors] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { uploadingFiles } = useUpload();
  const activeUploads = uploadingFiles.filter(
    (f) => f.status === "uploading" || f.status === "pending",
  );

  const [packageOptions, setPackageOptions] = useState<PackageOptionState[]>(
    [],
  );
  const [architecturalDesign, setArchitecturalDesign] =
    useState<DocumentCollection>({
      pdfFiles: [],
      cadFiles: [],
    });
  const [structuralDesign, setStructuralDesign] = useState<DocumentCollection>({
    pdfFiles: [],
    cadFiles: [],
  });
  const [billOfQuantities, setBillOfQuantities] = useState<DocumentCollection>({
    excelFiles: [],
    pdfFiles: [],
  });
  const [architecturalPdfPrice, setArchitecturalPdfPrice] = useState("");
  const [architecturalCadPrice, setArchitecturalCadPrice] = useState("");
  const [structuralPdfPrice, setStructuralPdfPrice] = useState("");
  const [structuralCadPrice, setStructuralCadPrice] = useState("");
  const [billOfQuantitiesPrice, setBillOfQuantitiesPrice] = useState("");
  const [billOfQuantitiesPdfPrice, setBillOfQuantitiesPdfPrice] = useState("");
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [floorPlans, setFloorPlans] = useState<UploadedFile[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [draftRestored, setDraftRestored] = useState(false);
  const [isPersistenceEnabled, setIsPersistenceEnabled] = useState(true);

  const isEditMode = Boolean(designToEdit);

  // Local storage persistence for form data
  const formData = {
    name,
    description,
    categoryId,
    bedrooms,
    bathrooms,
    area,
    floors,
    architecturalPdfPrice,
    architecturalCadPrice,
    structuralPdfPrice,
    structuralCadPrice,
    billOfQuantitiesPrice,
    billOfQuantitiesPdfPrice,
    images,
    floorPlans,
    files,
    architecturalDesign,
    structuralDesign,
    billOfQuantities,
    packageOptions,
  };

  const { loadFromStorage, clearStorage } = useFormPersistence(
    "design-form-draft", // Same key as DesignForm
    formData,
    1000, // 1 second debounce
    isPersistenceEnabled,
  );

  // Restore from local storage on mount (only for new designs, not edits)
  useEffect(() => {
    if (!isEditMode && !draftRestored) {
      const savedData = loadFromStorage();
      if (savedData) {
        const confirmRestore = window.confirm(
          "Found a saved draft of your design form. Would you like to restore it?",
        );

        if (confirmRestore) {
          setName(savedData.name || "");
          setDescription(savedData.description || "");
          setCategoryId(savedData.categoryId || "");
          setBedrooms(savedData.bedrooms || "");
          setBathrooms(savedData.bathrooms || "");
          setArea(savedData.area || "");
          setFloors(savedData.floors || "");
          setArchitecturalPdfPrice(savedData.architecturalPdfPrice || "");
          setArchitecturalCadPrice(savedData.architecturalCadPrice || "");
          setStructuralPdfPrice(savedData.structuralPdfPrice || "");
          setStructuralCadPrice(savedData.structuralCadPrice || "");
          setBillOfQuantitiesPrice(savedData.billOfQuantitiesPrice || "");
          setBillOfQuantitiesPdfPrice(savedData.billOfQuantitiesPdfPrice || "");
          setImages(savedData.images || []);
          setFloorPlans(savedData.floorPlans || []);
          setFiles(savedData.files || []);
          setArchitecturalDesign(
            savedData.architecturalDesign || { pdfFiles: [], cadFiles: [] },
          );
          setStructuralDesign(
            savedData.structuralDesign || { pdfFiles: [], cadFiles: [] },
          );
          setBillOfQuantities(
            savedData.billOfQuantities || { excelFiles: [], pdfFiles: [] },
          );
          setPackageOptions(
            savedData.packageOptions || [{ name: "", price: "", file: [] }],
          );
          toast.success("Draft restored successfully!");
        } else {
          clearStorage();
        }
      }
      setDraftRestored(true);
    }
  }, [isEditMode, draftRestored, loadFromStorage, clearStorage]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data.categories);
    };

    fetchCategories();

    if (designToEdit) {
      setName(designToEdit.name || "");
      setDescription(designToEdit.description || "");
      // basePrice and priceRange handled via defaults or ignored in edit if not needed for display
      setBedrooms(designToEdit.bedrooms?.toString() || "");
      setBathrooms(designToEdit.bathrooms?.toString() || "");
      setArea(designToEdit.area?.toString() || "");
      setFloors(designToEdit.floors?.toString() || "");
      setCategoryId(designToEdit.categoryId || "");
      setArchitecturalDesign(
        designToEdit.architecturalDesign || { pdfFiles: [], cadFiles: [] },
      );
      setStructuralDesign(
        designToEdit.structuralDesign || { pdfFiles: [], cadFiles: [] },
      );
      setBillOfQuantities(
        designToEdit.billOfQuantities || { excelFiles: [], pdfFiles: [] },
      );
      setArchitecturalPdfPrice(
        designToEdit.architecturalPdfPrice?.toString() || "",
      );
      setArchitecturalCadPrice(
        designToEdit.architecturalCadPrice?.toString() || "",
      );
      setStructuralPdfPrice(designToEdit.structuralPdfPrice?.toString() || "");
      setStructuralCadPrice(designToEdit.structuralCadPrice?.toString() || "");
      setBillOfQuantitiesPrice(
        designToEdit.billOfQuantitiesPrice?.toString() || "",
      );
      setBillOfQuantitiesPdfPrice(
        designToEdit.billOfQuantitiesPdfPrice?.toString() || "",
      );
      setPackageOptions(
        designToEdit.packageOptions?.map((opt) => ({
          id: opt.id,
          name: opt.name,
          price: opt.price.toString(),
          file: opt.file ? [toUploadFile(opt.file, "FILE")] : [],
        })) || [],
      );
      setImages(
        (designToEdit.images || []).map((file) => toUploadFile(file, "IMAGE")),
      );
      setFloorPlans(
        (designToEdit.floorPlans || []).map((file) =>
          toUploadFile(file, "FLOOR_PLAN"),
        ),
      );
      setFiles(
        (designToEdit.files || []).map((file) => toUploadFile(file, "FILE")),
      );

      setArchitecturalDesign({
        pdfFiles: (designToEdit.architecturalDesign?.pdfFiles || []).map((f) =>
          toUploadFile(f, "PDF"),
        ),
        cadFiles: (designToEdit.architecturalDesign?.cadFiles || []).map((f) =>
          toUploadFile(f, "CAD"),
        ),
      });

      setStructuralDesign({
        pdfFiles: (designToEdit.structuralDesign?.pdfFiles || []).map((f) =>
          toUploadFile(f, "PDF"),
        ),
        cadFiles: (designToEdit.structuralDesign?.cadFiles || []).map((f) =>
          toUploadFile(f, "CAD"),
        ),
      });

      setBillOfQuantities({
        excelFiles: (designToEdit.billOfQuantities?.excelFiles || []).map((f) =>
          toUploadFile(f, "EXCEL"),
        ),
        pdfFiles: (designToEdit.billOfQuantities?.pdfFiles || []).map((f) =>
          toUploadFile(f, "PDF"),
        ),
      });
    }
  }, [designToEdit, isEditMode]);

  const validateForm = () => {
    if (!name.trim()) return "Design Name is required.";
    if (!description.trim()) return "Description is required.";
    if (!categoryId) return "Category is required.";
    if (!architecturalPdfPrice || parseFloat(architecturalPdfPrice) <= 0) {
      return "Architectural PDF Price (Base Price) is required.";
    }
    if (images.length === 0 && !isEditMode)
      return "At least one image is required.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    if (activeUploads.length > 0) {
      toast.error("Please wait for all uploads to complete before saving.");
      return;
    }

    setIsSubmitting(true);

    const url =
      isEditMode && designToEdit
        ? `/api/designs/${designToEdit.id}`
        : "/api/designs";
    const method = isEditMode ? "PUT" : "POST";

    const payload = buildDesignUpsertPayload({
      name,
      description,
      bedrooms,
      bathrooms,
      area,
      floors,
      categoryId,
      folderId,
      architecturalPdfPrice,
      architecturalCadPrice,
      structuralPdfPrice,
      structuralCadPrice,
      billOfQuantitiesPrice,
      billOfQuantitiesPdfPrice,
      images,
      floorPlans,
      files,
      architecturalDesign,
      structuralDesign,
      billOfQuantities,
      packageOptions,
    });

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Clear local storage on successful submission (only for new designs)
        if (!isEditMode) {
          setIsPersistenceEnabled(false);
          clearStorage();
        }
        toast.success(
          `Design ${isEditMode ? "updated" : "created"} successfully!`,
        );
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error || "Failed to save design"}`);
      }
    } catch {
      toast.error(`An unexpected error occurred.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-card rounded-lg shadow-xl w-full max-w-3xl flex flex-col h-[95vh]"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full"
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              (e.target as HTMLElement).tagName !== "TEXTAREA"
            ) {
              e.preventDefault();
            }
          }}
        >
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold">
              {isEditMode ? "Edit Design" : "Create New Design"}
            </h3>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
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
                      {categories.map((category) => (
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
                      onChange={(e) =>
                        setBillOfQuantitiesPdfPrice(e.target.value)
                      }
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
                      onUploadSuccess={(file) => {
                        const newOptions = [...packageOptions];
                        newOptions[index].file = [file];
                        setPackageOptions(newOptions);
                      }}
                      onFileRemove={(fileUrl) => {
                        const newOptions = [...packageOptions];
                        newOptions[index].file = newOptions[index].file.filter(
                          (f) => f.url !== fileUrl,
                        );
                        setPackageOptions(newOptions);
                      }}
                      initialFiles={option.file.map((f) =>
                        toFileUploadItem(f, "FILE"),
                      )}
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
                          onUploadSuccess={(file) =>
                            section.setState((prev) => ({
                              ...prev,
                              [fileType.key]: [
                                ...(prev[fileType.key] || []),
                                file,
                              ],
                            }))
                          }
                          onFileRemove={(fileUrl) =>
                            section.setState((prev) => ({
                              ...prev,
                              [fileType.key]: (prev[fileType.key] || []).filter(
                                (f) => f.url !== fileUrl,
                              ),
                            }))
                          }
                          initialFiles={(section.state[fileType.key] || []).map(
                            (f) => toFileUploadItem(f, fileType.category),
                          )}
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
                      onUploadSuccess={(file) =>
                        setImages((prev) => [...prev, file])
                      }
                      onFileRemove={(fileUrl) =>
                        setImages((prev) =>
                          prev.filter((f) => f.url !== fileUrl),
                        )
                      }
                      initialFiles={images.map((f) =>
                        toFileUploadItem(f, "IMAGE"),
                      )}
                      fileTypeCategory="IMAGE"
                      multiple
                      accept="image/jpeg, image/png, image/gif, image/webp"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm sm:text-base">Floor Plans</Label>
                    <FileUpload
                      onUploadSuccess={(file) =>
                        setFloorPlans((prev) => [...prev, file])
                      }
                      onFileRemove={(fileUrl) =>
                        setFloorPlans((prev) =>
                          prev.filter((f) => f.url !== fileUrl),
                        )
                      }
                      initialFiles={floorPlans.map((f) =>
                        toFileUploadItem(f, "FLOOR_PLAN"),
                      )}
                      fileTypeCategory="FLOOR_PLAN"
                      multiple
                      accept="image/jpeg, image/png, image/gif, image/webp, application/pdf"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm sm:text-base">Other Files</Label>
                    <FileUpload
                      onUploadSuccess={(file) =>
                        setFiles((prev) => [...prev, file])
                      }
                      onFileRemove={(fileUrl) =>
                        setFiles((prev) =>
                          prev.filter((f) => f.url !== fileUrl),
                        )
                      }
                      initialFiles={files.map((f) =>
                        toFileUploadItem(f, "FILE"),
                      )}
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
              disabled={isSubmitting || activeUploads.length > 0}
              className="flex-1 sm:flex-none order-1 sm:order-2 h-11 sm:h-10"
            >
              {isSubmitting ? (
                <CgSpinner className="animate-spin mr-2 w-4 h-4" />
              ) : (
                <FiSave className="mr-2 w-4 h-4" />
              )}
              {isSubmitting
                ? "Saving..."
                : activeUploads.length > 0
                  ? `Uploading (${activeUploads.length})...`
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
