'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const DesignForm = ({ design }: { design?: any }) => {
  const router = useRouter();
  const [name, setName] = useState(design?.name || '');
  const [description, setDescription] = useState(design?.description || '');
  const [basePrice, setBasePrice] = useState(design?.basePrice || 0);
  const [priceRange, setPriceRange] = useState(design?.priceRange || '');
  const [bedrooms, setBedrooms] = useState(design?.bedrooms || 0);
  const [bathrooms, setBathrooms] = useState(design?.bathrooms || 0);
  const [area, setArea] = useState(design?.area || 0);
  const [floors, setFloors] = useState(design?.floors || 0);
  const [categoryId, setCategoryId] = useState(design?.categoryId || '');
  const [categories, setCategories] = useState([]);
  const [planDetails, setPlanDetails] = useState(design?.planDetails?.join('\n') || '');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(design ? `/api/designs/${design.id}` : '/api/designs', {
        method: design ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, basePrice, priceRange, bedrooms, bathrooms, area, floors, categoryId, planDetails }),
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
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Design Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="planDetails" className="block text-sm font-medium text-gray-700">
          Plan Details (one per line)
        </label>
        <textarea
          name="planDetails"
          id="planDetails"
          value={planDetails}
          onChange={(e) => setPlanDetails(e.target.value)}
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="basePrice"
          className="block text-sm font-medium text-gray-700"
        >
          Base Price
        </label>
        <input
          type="number"
          name="basePrice"
          id="basePrice"
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700">
          Price Range
        </label>
        <input
          type="text"
          name="priceRange"
          id="priceRange"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a category</option>
          {categories.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-4">
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
            Bedrooms
          </label>
          <input
            type="number"
            name="bedrooms"
            id="bedrooms"
            value={bedrooms}
            onChange={(e) => setBedrooms(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
            Bathrooms
          </label>
          <input
            type="number"
            name="bathrooms"
            id="bathrooms"
            value={bathrooms}
            onChange={(e) => setBathrooms(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700">
            Area (sq ft)
          </label>
          <input
            type="number"
            name="area"
            id="area"
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="floors" className="block text-sm font-medium text-gray-700">
            Floors
          </label>
          <input
            type="number"
            name="floors"
            id="floors"
            value={floors}
            onChange={(e) => setFloors(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {design ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};
