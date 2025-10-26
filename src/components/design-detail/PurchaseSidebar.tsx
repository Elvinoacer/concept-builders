"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { Design } from "@/lib/dummydata";
import { useCart } from "@/hooks/useCart";
import { useSession, signIn } from "next-auth/react"; // Import useSession and signIn
import { useRouter } from "next/navigation"; // Import useRouter
import { Input } from "@/components/ui/input"; // Import Input component
import { CheckCircle, PlusCircle } from "lucide-react"; // Import icons

const PurchaseSidebar: React.FC<{ design: Design }> = ({ design }) => {
  const { addToCart } = useCart();
  const { data: session, status } = useSession(); // Get session data
  const router = useRouter(); // Initialize useRouter
  const [selectedFileType, setSelectedFileType] = useState("pdf");
  const [selectedOptions, setSelectedOptions] = useState<
    {
      name: string;
      price: number;
    }[]
  >([]);

  // Initialize selectedOptions from design.calculatorOptions if needed, or keep empty
  // For now, keeping it empty as per previous logic for additional options

  const totalPrice = useMemo(() => {
    const basePrice = design.basePrice;
    let fileTypePrice = 0;
    if (selectedFileType === "pdf") {
      fileTypePrice = design.pdfPrice || 0;
    } else if (selectedFileType === "cad") {
      fileTypePrice = design.cadPrice || 0;
    } else if (selectedFileType === "pdf-and-cad") {
      fileTypePrice = design.pdfAndCadPrice || 0;
    }

    const selectedAdditionalOptionsCost = selectedOptions.reduce(
      (sum, option) => sum + option.price,
      0
    );

    return basePrice + fileTypePrice + selectedAdditionalOptionsCost;
  }, [design, selectedFileType, selectedOptions]);

  const [kesPrice, setKesPrice] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates");
        }
        const data = await response.json();
        const rate = data.rates.KES;
        if (rate) {
          setExchangeRate(rate);
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, []);

  

  useEffect(() => {
    if (exchangeRate) {
      setKesPrice(totalPrice * exchangeRate);
    }
  }, [totalPrice, exchangeRate]);

  const handleOptionToggle = (option: { name: string; price: number }) => {
    setSelectedOptions(prev =>
      prev.some(item => item.name === option.name)
        ? prev.filter(item => item.name !== option.name)
        : [...prev, option]
    );
  };

  const handleAddToCart = () => {
    addToCart(design, selectedFileType, selectedOptions);
  };

  const handleBuyNow = async () => {
    await addToCart(design, selectedFileType, selectedOptions);

    if (status === "authenticated") {
      router.push("/checkout");
    } else {
      await signIn('google', { callbackUrl: "/checkout" });
    }
  };

  const fileTypeOptions = [
    { key: "pdf", label: "PDF", price: design.pdfPrice || 0 },
    { key: "cad", label: "CAD", price: design.cadPrice || 0 },
    { key: "pdf-and-cad", label: "PDF & CAD", price: design.pdfAndCadPrice || 0 },
  ];

  return (
    <div className="sticky top-24 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          {design.tags?.map((tag, index) => (
            <span
              key={index}
              className={`bg-${tag.color}-100 text-${tag.color}-800 text-xs font-semibold px-3 py-1 rounded-full dark:bg-opacity-20 dark:text-${tag.color}-300`}
            >
              {tag.name}
            </span>
          ))}
        </div>

        <fieldset className="mt-4">
          <legend className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Select File Type
          </legend>
          <div className="space-y-3">
            {fileTypeOptions.map((option) => (
              <label
                key={option.key}
                htmlFor={option.key}
                className={`relative flex items-center justify-between rounded-lg p-4 cursor-pointer transition-all border-2 ${selectedFileType === option.key ? "border-blue-500 bg-blue-50 dark:bg-blue-900/50" : "border-gray-300 dark:border-gray-600 hover:border-blue-400"}`}
              >
                <input
                  type="radio"
                  id={option.key}
                  name="fileType"
                  value={option.key}
                  checked={selectedFileType === option.key}
                  onChange={() => setSelectedFileType(option.key)}
                  className="sr-only"
                />
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {option.label}
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  +${option.price}
                </span>
                {selectedFileType === option.key && (
                  <motion.div
                    layoutId="radio-selector"
                    className="absolute -right-3 -top-3 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </label>
            ))}
          </div>
        </fieldset>

        

        {/* Additional Options (Package Options) */}
        {design.packageOptions?.options && design.packageOptions.options.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Package Customizations</h3>
            <div className="space-y-3">
              {design.packageOptions.options.map((option: any) => (
                <div
                  key={option.name}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedOptions.some(item => item.name === option.name)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  onClick={() => handleOptionToggle(option)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOptions.some(item => item.name === option.name)
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedOptions.some(item => item.name === option.name) && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {option.name}
                    </span>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    +${option.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            Total Price:
          </p>
          <div>
            <AnimatePresence mode="wait">
              <motion.p
                key={totalPrice}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-4xl font-extrabold text-gray-900 dark:text-white text-right"
              >
                ${totalPrice.toLocaleString()}
              </motion.p>
            </AnimatePresence>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-right">
              {kesPrice ? `KES ${kesPrice.toLocaleString()}` : "Converting..."}
            </p>
            <Link
              href={`/currency-converter?amount=${totalPrice}`}
              className="text-sm text-blue-500 hover:underline text-right block mt-1"
            >
              View more conversions
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBuyNow}
            className="w-full flex items-center justify-center gap-2 rounded-xl h-14 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-lg font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Buy Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 rounded-xl h-14 px-6 bg-gray-200 text-gray-800 text-lg font-bold tracking-wide hover:bg-gray-300 transition-all dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 whitespace-nowrap"
          >
            <i className="material-symbols-outlined"> shopping_cart </i>
            Add to Cart
          </motion.button>
        </div>
      </div>
      
    </div>
  );
};

export default PurchaseSidebar;

