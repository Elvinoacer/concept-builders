'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileUpload from './FileUpload';

export const DesignForm = ({ initialData, initialCategoryId }: { initialData?: any, initialCategoryId?: string }) => {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [basePrice, setBasePrice] = useState(initialData?.basePrice || 0);
  const [priceRange, setPriceRange] = useState(initialData?.priceRange || '');
  const [bedrooms, setBedrooms] = useState(initialData?.bedrooms || 0);
  const [bathrooms, setBathrooms] = useState(initialData?.bathrooms || 0);
  const [area, setArea] = useState(initialData?.area || 0);
  const [floors, setFloors] = useState(initialData?.floors || 0);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || initialCategoryId || '');
  const [categories, setCategories] = useState([]);
  const [planDetails, setPlanDetails] = useState(initialData?.planDetails?.join('\n') || '');
  const [files, setFiles] = useState(initialData?.files || []);

  // New state for building cost estimates
  const [buildingCostEstimates, setBuildingCostEstimates] = useState(
    initialData?.buildingCostEstimates || {
      basic: { description: '', costBreakdown: [{ item: '', cost: '' }] },
      luxury: { description: '', costBreakdown: [{ item: '', cost: '' }] },
    }
  );

  // New state for building calculator options
  const [calculatorOptions, setCalculatorOptions] = useState(
    initialData?.calculatorOptions || [{ name: '', price: 0 }]
  );


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  const handleFileUpload = async (file: File, fileTypeCategory: string, onUploadProgress: (progress: number) => void) => {
    if (!file) return;

    const response = await fetch('/api/designs/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName: file.name, fileType: file.type, fileTypeCategory }),
    });

    if (response.ok) {
      const { signedUrl } = await response.json();
      await axios.put(signedUrl, file, {
        headers: {
          'Content-Type': file.type,
          'x-amz-acl': 'public-read',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          onUploadProgress(percentCompleted);
        },
      });
      setFiles([...files, { url: signedUrl.split('?')[0], type: fileTypeCategory }]);
    }
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
    try {
      const response = await fetch(initialData ? `/api/designs/${initialData.id}` : '/api/designs', {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          basePrice,
          priceRange,
          bedrooms,
          bathrooms,
          area,
          floors,
          categoryId,
          planDetails: planDetails.split('\n'),
          buildingCostEstimates,
          calculatorOptions,
          files,
        }),
      });

      if (response.ok) {
        router.push('/admin/designs');
      } else {
        // Handle error
        console.error('Failed to save design');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Design Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Design Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="planDetails">Plan Details (one per line)</Label>
                <Textarea id="planDetails" value={planDetails} onChange={(e) => setPlanDetails(e.target.value)} rows={5} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Design Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>PDF</Label>
                <FileUpload onFileUpload={handleFileUpload} fileTypeCategory="PDF" />
              </div>
              <div>
                <Label>CAD</Label>
                <FileUpload onFileUpload={handleFileUpload} fileTypeCategory="CAD" />
              </div>
              <div>
                <Label>Floor Plan</Label>
                <FileUpload onFileUpload={handleFileUpload} fileTypeCategory="FLOOR_PLAN" />
              </div>
              <div>
                <Label>3D Renders (Images)</Label>
                <FileUpload onFileUpload={handleFileUpload} fileTypeCategory="IMAGE" multiple />
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Building Cost Estimates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Building Calculator Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="basePrice">Base Price</Label>
                <Input id="basePrice" type="number" value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="priceRange">Price Range</Label>
                <Input id="priceRange" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white rounded-t-lg">
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input id="bedrooms" type="number" value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input id="bathrooms" type="number" value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="area">Area (sq ft)</Label>
                <Input id="area" type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="floors">Floors</Label>
                <Input id="floors" type="number" value={floors} onChange={(e) => setFloors(Number(e.target.value))} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};