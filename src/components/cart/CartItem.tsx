
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

const CartItem = ({ item, onRemove, onUpdate }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [selectedFileType, setSelectedFileType] = useState(item.selectedFileType);
  const [selectedPackage, setSelectedPackage] = useState(item.selectedPackage);
  const [selectedExtras, setSelectedExtras] = useState(item.selectedExtras || []);

  const debouncedQuantity = useDebounce(quantity, 500);
  const debouncedFileType = useDebounce(selectedFileType, 500);
  const debouncedPackage = useDebounce(selectedPackage, 500);
  const debouncedExtras = useDebounce(selectedExtras, 500);

  useEffect(() => {
    onUpdate(item.cartItemId, {
      quantity: debouncedQuantity,
      selectedFileType: debouncedFileType,
      selectedPackage: debouncedPackage,
      selectedExtras: debouncedExtras,
    });
  }, [debouncedQuantity, debouncedFileType, debouncedPackage, debouncedExtras, item.cartItemId]);

  let fileTypePrice = 0;
  if (selectedFileType === 'pdf') {
    fileTypePrice = item.pdfPrice || 0;
  } else if (selectedFileType === 'cad') {
    fileTypePrice = item.cadPrice || 0;
  } else if (selectedFileType === 'pdf-and-cad') {
    fileTypePrice = item.pdfAndCadPrice || 0;
  }

  const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0) || 0;
  const itemTotalPrice = (item.basePrice + fileTypePrice + extrasPrice) * quantity;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleExtraChange = (extra, isChecked) => {
    if (isChecked) {
      setSelectedExtras([...selectedExtras, extra]);
    } else {
      setSelectedExtras(selectedExtras.filter(e => e.name !== extra.name));
    }
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row items-start py-6 gap-4"
    >
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-gray-700">
        <Image
          alt={item.name}
          className="h-full w-full object-cover object-center"
          src={item.images && item.images.length > 0 ? item.images[0].url : '/images/category-placeholder.png'}
          width={100}
          height={100}
        />
      </div>
      <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.name}</h3>
          
          <div className="mt-2 flex items-center gap-4">
            <label htmlFor={`fileType-${item.id}`} className="text-sm text-slate-500 dark:text-gray-400">File Type:</label>
            <select 
              id={`fileType-${item.id}`}
              value={selectedFileType}
              onChange={(e) => setSelectedFileType(e.target.value)}
              className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="pdf">PDF</option>
              <option value="cad">CAD</option>
              <option value="pdf-and-cad">PDF & CAD</option>
            </select>
          </div>

          {item.packageOptions && item.packageOptions.length > 0 && (
            <div className="mt-2 flex items-center gap-4">
              <label htmlFor={`package-${item.id}`} className="text-sm text-slate-500 dark:text-gray-400">Package:</label>
              <select 
                id={`package-${item.id}`}
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                {item.packageOptions.map(pkg => (
                  <option key={pkg.name} value={pkg.name}>{pkg.name}</option>
                ))}
              </select>
            </div>
          )}

          {item.packageOptions && item.packageOptions.options && item.packageOptions.options.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-slate-500 dark:text-gray-400">Extras:</p>
              <div className="flex flex-col gap-1 mt-1">
                {item.packageOptions.options.map(extra => (
                  <label key={extra.name} className="flex items-center gap-2 text-sm">
                    <input 
                      type="checkbox"
                      checked={selectedExtras.some(e => e.name === extra.name)}
                      onChange={(e) => handleExtraChange(extra, e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-600"
                    />
                    {extra.name} (+${extra.price.toFixed(2)})
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-2 flex items-center gap-4">
            <label htmlFor={`quantity-${item.id}`} className="text-sm text-slate-500 dark:text-gray-400">Quantity:</label>
            <div className="flex items-center rounded-md border border-gray-300 dark:border-gray-600">
              <button onClick={() => handleQuantityChange(quantity - 1)} className="px-2 py-1 text-slate-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-md"><Minus size={16}/></button>
              <input 
                id={`quantity-${item.id}`}
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
                className="w-12 text-center border-x border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none"
              />
              <button onClick={() => handleQuantityChange(quantity + 1)} className="px-2 py-1 text-slate-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-md"><Plus size={16}/></button>
            </div>
          </div>

        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <p className="text-lg font-medium text-slate-900 dark:text-white">${itemTotalPrice.toFixed(2)}</p>
          <button
            className="text-slate-500 hover:text-red-500 transition-colors"
            type="button"
            onClick={() => onRemove(item.cartItemId)}
          >
            <Trash2 size={20} />
            <span className="sr-only">Remove</span>
          </button>
        </div>
      </div>
    </motion.li>
  );
};

export default CartItem;

