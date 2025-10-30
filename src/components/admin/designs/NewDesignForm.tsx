'use client';

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

const NewDesignForm = ({ onClose, folderId, designToEdit, onSuccess }: NewDesignFormProps) => {
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
  
  const [minBuildingCost, setMinBuildingCost] = useState('');
  const [maxBuildingCost, setMaxBuildingCost] = useState('');
  const [buildingCostEstimates, setBuildingCostEstimates] = useState({
    basic: { description: '', costBreakdown: [{ item: '', cost: '' }] },
    luxury: { description: '', costBreakdown: [{ item: '', cost: '' }] },
  });
  
  const [packageOptions, setPackageOptions] = useState<{ name: string; price: string }[]>([]);
  const [buildingCostFactors, setBuildingCostFactors] = useState<{ name: string; unit: string; price: string }[]>([]);
  const [architecturalDesign, setArchitecturalDesign] = useState({ description: '', overview: '', pdfFiles: [], cadFiles: [] });
  const [structuralDesign, setStructuralDesign] = useState({ description: '', overview: '', pdfFiles: [], cadFiles: [] });
  const [billOfQuantities, setBillOfQuantities] = useState({ description: '', overview: '', excelFiles: [] });
  const [architecturalPdfPrice, setArchitecturalPdfPrice] = useState("");
  const [architecturalCadPrice, setArchitecturalCadPrice] = useState("");
  const [structuralPdfPrice, setStructuralPdfPrice] = useState("");
  const [structuralCadPrice, setStructuralCadPrice] = useState("");
  const [billOfQuantitiesPrice, setBillOfQuantitiesPrice] = useState("");

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
      setPlanDetails(Array.isArray(designToEdit.planDetails) ? designToEdit.planDetails.join('\n') : "");
      setCategoryId(designToEdit.categoryId || "");
      setArchitecturalDesign(designToEdit.architecturalDesign || { description: '', overview: '', pdfFiles: [], cadFiles: [] });
      setStructuralDesign(designToEdit.structuralDesign || { description: '', overview: '', pdfFiles: [], cadFiles: [] });
      setBillOfQuantities(designToEdit.billOfQuantities || { description: '', overview: '', excelFiles: [] });
      setMinBuildingCost(designToEdit.minBuildingCost?.toString() || '');
      setMaxBuildingCost(designToEdit.maxBuildingCost?.toString() || '');

      if (designToEdit.buildingCostEstimates) {
        const estimates = {
          basic: { description: '', costBreakdown: [] },
          luxury: { description: '', costBreakdown: [] }
        };
        designToEdit.buildingCostEstimates.forEach(est => {
          estimates[est.tier] = {
            description: est.description,
            costBreakdown: est.costBreakdown.map(item => ({ item: item.item, cost: item.cost.toString() }))
          };
        });
        setBuildingCostEstimates(estimates);
      }
      
      setArchitecturalPdfPrice(designToEdit.architecturalPdfPrice?.toString() || "");
      setArchitecturalCadPrice(designToEdit.architecturalCadPrice?.toString() || "");
      setStructuralPdfPrice(designToEdit.structuralPdfPrice?.toString() || "");
      setStructuralCadPrice(designToEdit.structuralCadPrice?.toString() || "");
      setBillOfQuantitiesPrice(designToEdit.billOfQuantitiesPrice?.toString() || "");
      setPackageOptions(designToEdit.packageOptions?.options || []);
      setBuildingCostFactors(designToEdit.buildingCostFactors?.options || []);
    }
  }, [designToEdit, isEditMode]);

  

  const handleCostBreakdownChange = (tier: 'basic' | 'luxury', index: number, field: 'item' | 'cost', value: string) => {
    const newEstimates = { ...buildingCostEstimates };
    newEstimates[tier].costBreakdown[index][field] = value;
    setBuildingCostEstimates(newEstimates);
  };

  const addCostBreakdownItem = (tier: 'basic' | 'luxury') => {
    const newEstimates = { ...buildingCostEstimates };
    newEstimates[tier].costBreakdown.push({ item: '', cost: '' });
    setBuildingCostEstimates(newEstimates);
  };

  const removeCostBreakdownItem = (tier: 'basic' | 'luxury', index: number) => {
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
      planDetails: planDetails.split('\n'),
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
        options: packageOptions.map(option => ({
          name: option.name,
          price: parseFloat(option.price) || 0
        }))
      },
      buildingCostFactors: {
        options: buildingCostFactors.map(option => ({
          name: option.name,
          unit: option.unit,
          price: parseFloat(option.price) || 0
        }))
      },
      buildingCostEstimates: Object.entries(buildingCostEstimates).map(([tier, data]) => ({
        tier,
        description: data.description,
        costBreakdown: data.costBreakdown.map(item => ({
          ...item,
          cost: parseFloat(item.cost) || 0
        }))
      })),
      architecturalDesign: {
        create: {
          type: 'ARCHITECTURAL',
          description: architecturalDesign.description,
          overview: architecturalDesign.overview,
          pdfFiles: {
            create: architecturalDesign.pdfFiles.map((file: any) => ({
              name: file.name,
              url: file.url,
              type: 'PDF',
            })),
          },
          cadFiles: {
            create: architecturalDesign.cadFiles.map((file: any) => ({
              name: file.name,
              url: file.url,
              type: 'CAD',
            })),
          },
        },
      },
      structuralDesign: {
        create: {
          type: 'STRUCTURAL',
          description: structuralDesign.description,
          overview: structuralDesign.overview,
          pdfFiles: {
            create: structuralDesign.pdfFiles.map((file: any) => ({
              name: file.name,
              url: file.url,
              type: 'PDF',
            })),
          },
          cadFiles: {
            create: structuralDesign.cadFiles.map((file: any) => ({
              name: file.name,
              url: file.url,
              type: 'CAD',
            })),
          },
        },
      },
      billOfQuantities: {
        create: {
          type: 'BILL_OF_QUANTITIES',
          description: billOfQuantities.description,
          overview: billOfQuantities.overview,
          excelFiles: {
            create: billOfQuantities.excelFiles.map((file: any) => ({
              name: file.name,
              url: file.url,
              type: 'EXCEL',
            })),
          },
        },
      },
    };

    try {
      const url = isEditMode ? `/api/designs/${designToEdit.id}` : "/api/designs";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(`Design ${isEditMode ? 'updated' : 'created'} successfully!`);
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
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} design:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl mx-4 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 border-b border-border flex-shrink-0 flex justify-between items-center bg-gradient-to-r from-blue-600 to-cyan-400 text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              {isEditMode ? <FiEdit size={24} /> : <FiPlus size={24} />}
              <h3 className="text-xl font-semibold">
              {isEditMode ? 'Edit Design' : 'Create New Design'}
              {isEditMode ? (
                <Link href={`/admin/designs/new?id=${designToEdit.id}`} className="text-sm text-yellow-300 hover:text-yellow-100 ml-4">
                  (Edit in page)
                </Link>
              ) : (
                <Link href="/admin/designs/new" className="text-sm text-yellow-300 hover:text-yellow-100 ml-4">
                  (Add in page)
                </Link>
              )}
            </h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <FiX size={20} />
            </Button>
          </div>
          <ScrollArea className="h-[60vh]">
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Design Name</Label>
                  <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Modern Villa" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full p-2 border rounded-md bg-background">
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
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of the design..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="planDetails">Plan Details (one per line)</Label>
                <Textarea id="planDetails" name="planDetails" value={planDetails} onChange={(e) => setPlanDetails(e.target.value)} placeholder="e.g., 3 Bedrooms\n2 Bathrooms\nOpen-plan kitchen" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price</Label>
                  <Input id="basePrice" name="basePrice" type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="e.g., 50000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceRange">Price Range</Label>
                  <Input id="priceRange" name="priceRange" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} placeholder="e.g., $50k - $70k" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input id="bedrooms" name="bedrooms" type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} placeholder="e.g., 3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input id="bathrooms" name="bathrooms" type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} placeholder="e.g., 2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area (sq ft)</Label>
                  <Input id="area" name="area" type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g., 1200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floors">Floors</Label>
                  <Input id="floors" name="floors" type="number" value={floors} onChange={(e) => setFloors(e.target.value)} placeholder="e.g., 2" />
                </div>
              </div>

              {/* Building Cost Factors */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium leading-6">Building Cost Factors</h3>
                {buildingCostFactors.map((factor, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                    <Input
                      placeholder="Factor Name"
                      value={factor.name}
                      onChange={(e) => {
                        const newFactors = [...buildingCostFactors];
                        newFactors[index].name = e.target.value;
                        setBuildingCostFactors(newFactors);
                      }}
                      className="md:col-span-2"
                    />
                    <Input
                      placeholder="Unit (e.g., per sqft)"
                      value={factor.unit}
                      onChange={(e) => {
                        const newFactors = [...buildingCostFactors];
                        newFactors[index].unit = e.target.value;
                        setBuildingCostFactors(newFactors);
                      }}
                    />
                    <Input
                      placeholder="Price per Unit"
                      type="number"
                      value={factor.price}
                      onChange={(e) => {
                        const newFactors = [...buildingCostFactors];
                        newFactors[index].price = e.target.value;
                        setBuildingCostFactors(newFactors);
                      }}
                    />
                    <Button type="button" variant="destructive" size="sm" onClick={() => {
                      const newFactors = [...buildingCostFactors];
                      newFactors.splice(index, 1);
                      setBuildingCostFactors(newFactors);
                    }}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setBuildingCostFactors([...buildingCostFactors, { name: '', unit: '', price: '' }])}>
                  Add Building Cost Factor
                </Button>
              </div>

              {/* File Type Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium leading-6">Document Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="architecturalPdfPrice">Architectural PDF Price</Label>
                    <Input id="architecturalPdfPrice" name="architecturalPdfPrice" type="number" value={architecturalPdfPrice} onChange={(e) => setArchitecturalPdfPrice(e.target.value)} placeholder="e.g., 50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="architecturalCadPrice">Architectural CAD Price</Label>
                    <Input id="architecturalCadPrice" name="architecturalCadPrice" type="number" value={architecturalCadPrice} onChange={(e) => setArchitecturalCadPrice(e.target.value)} placeholder="e.g., 100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="structuralPdfPrice">Structural PDF Price</Label>
                    <Input id="structuralPdfPrice" name="structuralPdfPrice" type="number" value={structuralPdfPrice} onChange={(e) => setStructuralPdfPrice(e.target.value)} placeholder="e.g., 50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="structuralCadPrice">Structural CAD Price</Label>
                    <Input id="structuralCadPrice" name="structuralCadPrice" type="number" value={structuralCadPrice} onChange={(e) => setStructuralCadPrice(e.target.value)} placeholder="e.g., 100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billOfQuantitiesPrice">Bill of Quantities Price</Label>
                    <Input id="billOfQuantitiesPrice" name="billOfQuantitiesPrice" type="number" value={billOfQuantitiesPrice} onChange={(e) => setBillOfQuantitiesPrice(e.target.value)} placeholder="e.g., 80" />
                  </div>
                </div>
              </div>

              {/* Package Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium leading-6">Package Options (Fixed Price Add-ons)</h3>
                {packageOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="Option Name"
                      value={option.name}
                      onChange={(e) => {
                        const newOptions = [...packageOptions];
                        newOptions[index].name = e.target.value;
                        setPackageOptions(newOptions);
                      }}
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
                    />
                    <Button type="button" variant="destructive" size="sm" onClick={() => {
                      const newOptions = [...packageOptions];
                      newOptions.splice(index, 1);
                      setPackageOptions(newOptions);
                    }}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setPackageOptions([...packageOptions, { name: '', price: '' }])}>
                  Add Package Option
                </Button>
              </div>

              {/* File Uploads */}
              <div className="space-y-4">
                              <h3 className="text-lg font-medium leading-6">Architectural Design</h3>
                              <div className="space-y-2">
                                <Label htmlFor="architectural-description">Description</Label>
                                <Input id="architectural-description" value={architecturalDesign.description} onChange={(e) => setArchitecturalDesign(prev => ({ ...prev, description: e.target.value }))} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="architectural-overview">Overview</Label>
                                <Textarea id="architectural-overview" value={architecturalDesign.overview} onChange={(e) => setArchitecturalDesign(prev => ({ ...prev, overview: e.target.value }))} />
                              </div>
                              <div>
                                <Label>PDFs</Label>
                                <FileUpload
                                  onUploadSuccess={(files) => setArchitecturalDesign(prev => ({ ...prev, pdfFiles: [...prev.pdfFiles, ...files] }))}
                                  onFileRemove={(fileUrl) => setArchitecturalDesign(prev => ({ ...prev, pdfFiles: prev.pdfFiles.filter(f => f.url !== fileUrl) }))}
                                  initialFiles={architecturalDesign.pdfFiles}
                                  fileTypeCategory="PDF"
                                  multiple
                                  accept="application/pdf"
                                />
                              </div>
                              <div>
                                <Label>CADs</Label>
                                <FileUpload
                                  onUploadSuccess={(files) => setArchitecturalDesign(prev => ({ ...prev, cadFiles: [...prev.cadFiles, ...files] }))}
                                  onFileRemove={(fileUrl) => setArchitecturalDesign(prev => ({ ...prev, cadFiles: prev.cadFiles.filter(f => f.url !== fileUrl) }))}
                                  initialFiles={architecturalDesign.cadFiles}
                                  fileTypeCategory="CAD"
                                  multiple
                                  accept=".dwg, .dxf"
                                />
                              </div>
                            </div>

<div className="space-y-4">
                <h3 className="text-lg font-medium leading-6">Structural Design</h3>
                <div className="space-y-2">
                  <Label htmlFor="structural-description">Description</Label>
                  <Input id="structural-description" value={structuralDesign.description} onChange={(e) => setStructuralDesign(prev => ({ ...prev, description: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="structural-overview">Overview</Label>
                  <Textarea id="structural-overview" value={structuralDesign.overview} onChange={(e) => setStructuralDesign(prev => ({ ...prev, overview: e.target.value }))} />
                </div>
                <div>
                  <Label>PDFs</Label>
                  <FileUpload
                    onUploadSuccess={(files) => setStructuralDesign(prev => ({ ...prev, pdfFiles: [...prev.pdfFiles, ...files] }))}
                    onFileRemove={(fileUrl) => setStructuralDesign(prev => ({ ...prev, pdfFiles: prev.pdfFiles.filter(f => f.url !== fileUrl) }))}
                    initialFiles={structuralDesign.pdfFiles}
                    fileTypeCategory="PDF"
                    multiple
                    accept="application/pdf"
                  />
                </div>
                <div>
                  <Label>CADs</Label>
                  <FileUpload
                    onUploadSuccess={(files) => setStructuralDesign(prev => ({ ...prev, cadFiles: [...prev.cadFiles, ...files] }))}
                    onFileRemove={(fileUrl) => setStructuralDesign(prev => ({ ...prev, cadFiles: prev.cadFiles.filter(f => f.url !== fileUrl) }))}
                    initialFiles={structuralDesign.cadFiles}
                    fileTypeCategory="CAD"
                    multiple
                    accept=".dwg, .dxf"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium leading-6">Bill of Quantities</h3>
                <div className="space-y-2">
                  <Label htmlFor="boq-description">Description</Label>
                  <Input id="boq-description" value={billOfQuantities.description} onChange={(e) => setBillOfQuantities(prev => ({ ...prev, description: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="boq-overview">Overview</Label>
                  <Textarea id="boq-overview" value={billOfQuantities.overview} onChange={(e) => setBillOfQuantities(prev => ({ ...prev, overview: e.target.value }))} />
                </div>
                <div>
                  <Label>Excel Files</Label>
                  <FileUpload
                    onUploadSuccess={(files) => setBillOfQuantities(prev => ({ ...prev, excelFiles: [...prev.excelFiles, ...files] }))}
                    onFileRemove={(fileUrl) => setBillOfQuantities(prev => ({ ...prev, excelFiles: prev.excelFiles.filter(f => f.url !== fileUrl) }))}
                    initialFiles={billOfQuantities.excelFiles}
                    fileTypeCategory="EXCEL"
                    multiple
                    accept=".xls, .xlsx"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium leading-6">Building Cost Estimates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minBuildingCost">Min Building Cost</Label>
                    <Input id="minBuildingCost" name="minBuildingCost" type="number" value={minBuildingCost} onChange={(e) => setMinBuildingCost(e.target.value)} placeholder="e.g., 100000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxBuildingCost">Max Building Cost</Label>
                    <Input id="maxBuildingCost" name="maxBuildingCost" type="number" value={maxBuildingCost} onChange={(e) => setMaxBuildingCost(e.target.value)} placeholder="e.g., 150000" />
                  </div>
                </div>
                {['basic', 'luxury'].map((tier) => (
                  <div key={tier} className="rounded-md border p-4">
                    <h4 className="text-md font-medium capitalize">{tier}</h4>
                    <div className="mt-2">
                      <Label htmlFor={`${tier}-description`}>Description</Label>
                      <Textarea
                        id={`${tier}-description`}
                        value={buildingCostEstimates[tier]?.description || ''}
                        onChange={(e) => {
                          const newEstimates = { ...buildingCostEstimates };
                          newEstimates[tier].description = e.target.value;
                          setBuildingCostEstimates(newEstimates);
                        }}
                        rows={2}
                      />
                    </div>
                    <div className="mt-4">
                      <h5 className="text-sm font-medium">Cost Breakdown</h5>
                      {buildingCostEstimates[tier]?.costBreakdown.map((item, index) => (
                        <div key={index} className="mt-2 flex items-center space-x-2">
                          <Input
                            placeholder="Item"
                            value={item.item}
                            onChange={(e) => handleCostBreakdownChange(tier, index, 'item', e.target.value)}
                          />
                          <Input
                            placeholder="Cost"
                            value={item.cost}
                            onChange={(e) => handleCostBreakdownChange(tier, index, 'cost', e.target.value)}
                          />
                          <Button type="button" variant="destructive" size="sm" onClick={() => removeCostBreakdownItem(tier, index)}>
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => addCostBreakdownItem(tier)} className="mt-2">
                        Add Item
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              
            </div>
          </ScrollArea>
          <div className="p-6 bg-muted/50 flex justify-end gap-4 rounded-b-2xl flex-shrink-0 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              <FiX className="mr-2" /> Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <CgSpinner className="animate-spin mr-2" />
              ) : (
                <FiSave className="mr-2" />
              )}
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Design' : 'Save Design')}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NewDesignForm;