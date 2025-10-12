'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FiX, FiUpload, FiPlus, FiSave } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import FileUpload from "./FileUpload";

interface NewDesignFormProps {
  onClose: () => void;
  folderId?: string;
  onDesignAdded?: () => void;
}

const NewDesignForm = ({ onClose, folderId, onDesignAdded }: NewDesignFormProps) => {
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
  const [buildingCostEstimates, setBuildingCostEstimates] = useState({
    basic: { description: '', costBreakdown: [{ item: '', cost: '' }] },
    luxury: { description: '', costBreakdown: [{ item: '', cost: '' }] },
  });
  const [calculatorOptions, setCalculatorOptions] = useState([{ name: '', price: 0 }]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data.categories);
    };

    fetchCategories();
  }, []);

  const handleUploadSuccess = (newFiles: { url: string; type: string; name: string }[], fileTypeCategory: string) => {
    const otherFiles = files.filter((f: any) => f.type !== fileTypeCategory);
    const updatedFiles = newFiles.map(f => ({...f, type: fileTypeCategory, originalFileName: f.name}));
    setFiles([...otherFiles, ...updatedFiles]);
  };

  const handleFileRemove = async (fileUrl: string) => {
    const key = fileUrl.split('/').pop();
    if (!key) return;

    await fetch('/api/designs/delete-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key }),
    });

    setFiles(files.filter((file: any) => file.url !== fileUrl));
  };

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

  const handleCalculatorOptionChange = (index: number, field: 'name' | 'price', value: string | number) => {
    const newOptions = [...calculatorOptions];
    newOptions[index][field] = value;
    setCalculatorOptions(newOptions);
  };

  const addCalculatorOption = () => {
    setCalculatorOptions([...calculatorOptions, { name: '', price: 0 }]);
  };

  const removeCalculatorOption = (index: number) => {
    const newOptions = [...calculatorOptions];
    newOptions.splice(index, 1);
    setCalculatorOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/designs", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
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
          planDetails: planDetails.split('\n'),
          folderId,
          categoryId,
          buildingCostEstimates,
          calculatorOptions,
          files: files.map((file: any) => ({
            url: file.url,
            type: file.type,
            originalFileName: file.originalFileName,
          })),
        }),
      });

      if (response.ok) {
        if (onDesignAdded) {
          onDesignAdded();
        } else {
          onClose();
        }
      } else {
        console.error("Error creating design:", await response.text());
      }
    } catch (error) {
      console.error("Error creating design:", error);
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
              <FiPlus className="text-primary" size={24} />
              <h3 className="text-xl font-semibold text-foreground">Create New Design</h3>
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
                <Label htmlFor="planDetails">Plan Details (comma-separated)</Label>
                <Textarea id="planDetails" name="planDetails" value={planDetails} onChange={(e) => setPlanDetails(e.target.value)} placeholder="e.g., 3 Bedrooms, 2 Bathrooms, Open-plan kitchen" />
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

              {/* File Uploads */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium leading-6">Design Files</h3>
                <div>
                  <Label>PDF</Label>
                  <FileUpload
                    onUploadSuccess={(newFiles) => handleUploadSuccess(newFiles, 'PDF')}
                    initialFiles={files.filter((f: any) => f.type === 'PDF')}
                    fileTypeCategory="PDF"
                  />
                </div>
                <div>
                  <Label>CAD</Label>
                  <FileUpload
                    onUploadSuccess={(newFiles) => handleUploadSuccess(newFiles, 'CAD')}
                    initialFiles={files.filter((f: any) => f.type === 'CAD')}
                    fileTypeCategory="CAD"
                  />
                </div>
                <div>
                  <Label>Floor Plan</Label>
                  <FileUpload
                    onUploadSuccess={(newFiles) => handleUploadSuccess(newFiles, 'FLOOR_PLAN')}
                    initialFiles={files.filter((f: any) => f.type === 'FLOOR_PLAN')}
                    fileTypeCategory="FLOOR_PLAN"
                  />
                </div>
                <div>
                  <Label>3D Renders (Images)</Label>
                  <FileUpload
                    onUploadSuccess={(newFiles) => handleUploadSuccess(newFiles, 'IMAGE')}
                    initialFiles={files.filter((f: any) => f.type === 'IMAGE')}
                    fileTypeCategory="IMAGE"
                    multiple
                  />
                </div>
                <div className="space-y-2">
                  <Label>Uploaded Files</Label>
                  {files.map((file: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {file.url.split('/').pop()}
                      </a>
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleFileRemove(file.url)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Building Cost Estimates */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium leading-6">Building Cost Estimates</h3>
                {['basic', 'luxury'].map((tier) => (
                  <div key={tier} className="rounded-md border p-4">
                    <h4 className="text-md font-medium capitalize">{tier}</h4>
                    <div className="mt-2">
                      <Label htmlFor={`${tier}-description`}>Description</Label>
                      <Textarea
                        id={`${tier}-description`}
                        value={buildingCostEstimates[tier].description}
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
                      {buildingCostEstimates[tier].costBreakdown.map((item, index) => (
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

              {/* Building Calculator Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium leading-6">Building Calculator Options</h3>
                {calculatorOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="Option Name"
                      value={option.name}
                      onChange={(e) => handleCalculatorOptionChange(index, 'name', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={option.price}
                      onChange={(e) => handleCalculatorOptionChange(index, 'price', Number(e.target.value))}
                    />
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeCalculatorOption(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addCalculatorOption} className="mt-2">
                  Add Option
                </Button>
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
              {isSubmitting ? "Saving..." : "Save Design"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NewDesignForm;