"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { Design } from "@/generated/prisma";
import { useCart } from "@/hooks/useCart";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  PlusCircle,
  ShoppingCart,
  Zap,
  Shield,
  Download,
  FileText,
  Building2,
  Calculator,
} from "lucide-react";

const PurchaseSidebar: React.FC<{ design: Design }> = ({ design }) => {
  const { addToCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedDocuments, setSelectedDocuments] = useState({
    architecturalPdf: false,
    architecturalCad: false,
    structuralPdf: false,
    structuralCad: false,
    billOfQuantities: false,
  });
  const [selectedOptions, setSelectedOptions] = useState<
    {
      name: string;
      price: number;
    }[]
  >([]);

  const totalPrice = useMemo(() => {
    let price = design.basePrice || 0;
    if (selectedDocuments.architecturalPdf) {
      price += design.architecturalPdfPrice || 0;
    }
    if (selectedDocuments.architecturalCad) {
      price += design.architecturalCadPrice || 0;
    }
    if (selectedDocuments.structuralPdf) {
      price += design.structuralPdfPrice || 0;
    }
    if (selectedDocuments.structuralCad) {
      price += design.structuralCadPrice || 0;
    }
    if (selectedDocuments.billOfQuantities) {
      price += design.billOfQuantitiesPrice || 0;
    }
    const selectedAdditionalOptionsCost = selectedOptions.reduce(
      (sum, option) => sum + (option.price || 0),
      0
    );

    return price + selectedAdditionalOptionsCost;
  }, [design, selectedDocuments, selectedOptions]);

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
    setSelectedOptions((prev) =>
      prev.some((item) => item.name === option.name)
        ? prev.filter((item) => item.name !== option.name)
        : [...prev, option]
    );
  };

  const handleAddToCart = () => {
    addToCart(design, selectedDocuments, "", selectedOptions);
  };

  const handleBuyNow = async () => {
    await addToCart(design, selectedDocuments, "", selectedOptions);

    if (status === "authenticated") {
      router.push("/checkout");
    } else {
      await signIn("google", { callbackUrl: "/checkout" });
    }
  };

  const documentOptions = [
    {
      key: "architecturalPdf",
      label: "Architectural PDF",
      price: design.architecturalPdfPrice || 0,
      icon: FileText,
      description: "Detailed PDF blueprints and plans",
    },
    {
      key: "architecturalCad",
      label: "Architectural CAD",
      price: design.architecturalCadPrice || 0,
      icon: Building2,
      description: "Editable CAD files for modifications",
    },
    {
      key: "structuralPdf",
      label: "Structural PDF",
      price: design.structuralPdfPrice || 0,
      icon: FileText,
      description: "Structural engineering drawings",
    },
    {
      key: "structuralCad",
      label: "Structural CAD",
      price: design.structuralCadPrice || 0,
      icon: Building2,
      description: "Structural CAD files for engineers",
    },
    {
      key: "billOfQuantities",
      label: "Bill of Quantities",
      price: design.billOfQuantitiesPrice || 0,
      icon: Calculator,
      description: "Material and cost breakdown",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const priceVariants = {
    initial: { scale: 1 },
    updated: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className="sticky top-24 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Purchase Card */}
      <motion.div
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-2 border-gray-200/50 dark:border-gray-700/50"
        variants={itemVariants}
      >
        {/* Design Tags */}
        <motion.div
          className="flex items-center gap-2 mb-6"
          variants={itemVariants}
        >
          {design.tags?.map((tag, index) => (
            <motion.span
              key={index}
              className={`px-4 py-2 rounded-2xl text-sm font-semibold backdrop-blur-sm border ${
                tag.color === "blue"
                  ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20"
                  : tag.color === "green"
                    ? "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20"
                    : "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tag.name}
            </motion.span>
          ))}
        </motion.div>

        {/* Document Selection */}
        <motion.fieldset className="mt-6" variants={itemVariants}>
          <legend className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4 flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            Select Documents
          </legend>
          <div className="space-y-4">
            {documentOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <motion.label
                  key={option.key}
                  htmlFor={option.key}
                  className={`relative flex items-start gap-4 rounded-2xl p-4 cursor-pointer transition-all duration-300 border-2 group ${
                    selectedDocuments[
                      option.key as keyof typeof selectedDocuments
                    ]
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 hover:border-primary/50 hover:shadow-md"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="checkbox"
                    id={option.key}
                    name="documentType"
                    value={option.key}
                    checked={
                      selectedDocuments[
                        option.key as keyof typeof selectedDocuments
                      ]
                    }
                    onChange={() =>
                      setSelectedDocuments((prev) => ({
                        ...prev,
                        [option.key]:
                          !prev[option.key as keyof typeof selectedDocuments],
                      }))
                    }
                    className="sr-only"
                  />

                  {/* Checkbox Indicator */}
                  <motion.div
                    className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-1 transition-all duration-300 ${
                      selectedDocuments[
                        option.key as keyof typeof selectedDocuments
                      ]
                        ? "bg-primary border-primary"
                        : "border-gray-400 group-hover:border-primary"
                    }`}
                  >
                    {selectedDocuments[
                      option.key as keyof typeof selectedDocuments
                    ] && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-slate-800 dark:text-white text-lg">
                        {option.label}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {option.description}
                    </p>
                  </div>

                  {/* Price */}
                  <motion.span
                    className="font-bold text-primary text-lg flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                  >
                    +${option.price.toLocaleString()}
                  </motion.span>
                </motion.label>
              );
            })}
          </div>
        </motion.fieldset>

        {/* Package Options */}
        {design.packageOptions?.options &&
          design.packageOptions.options.length > 0 && (
            <motion.div className="mt-8 space-y-4" variants={itemVariants}>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <PlusCircle className="w-6 h-6 text-primary" />
                Package Customizations
              </h3>
              <div className="space-y-3">
                {design.packageOptions.options.map((option: any) => (
                  <motion.div
                    key={option.name}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
                      selectedOptions.some((item) => item.name === option.name)
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 hover:border-primary/50 hover:shadow-md"
                    }`}
                    onClick={() => handleOptionToggle(option)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                          selectedOptions.some(
                            (item) => item.name === option.name
                          )
                            ? "bg-primary border-primary"
                            : "border-gray-400 group-hover:border-primary"
                        }`}
                      >
                        {selectedOptions.some(
                          (item) => item.name === option.name
                        ) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <CheckCircle className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                      <span className="font-medium text-slate-800 dark:text-gray-100 text-lg">
                        {option.name}
                      </span>
                    </div>
                    <motion.span
                      className="font-bold text-primary text-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      +${option.price.toLocaleString()}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        {/* Total Price Section */}
        <motion.div
          className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
              Total Price:
            </p>
            <div className="text-right">
              <AnimatePresence mode="wait">
                <motion.p
                  key={totalPrice}
                  variants={priceVariants}
                  initial="initial"
                  animate="updated"
                  className="text-4xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                >
                  ${totalPrice.toLocaleString()}
                </motion.p>
              </AnimatePresence>
              <motion.p
                className="text-lg text-gray-500 dark:text-gray-400 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {kesPrice
                  ? `KES ${kesPrice.toLocaleString()}`
                  : "Converting..."}
              </motion.p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/currency-converter?amount=${totalPrice}`}
                  className="text-primary hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 text-sm font-medium inline-flex items-center gap-1 mt-1"
                >
                  View more conversions
                  <Zap className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="mt-8 grid grid-cols-1 gap-4"
          variants={itemVariants}
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBuyNow}
            className="w-full flex items-center justify-center gap-3 rounded-2xl h-16 px-8 bg-gradient-to-r from-primary to-blue-600 text-white text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 group"
          >
            <Zap className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            Buy Now
            <Shield className="w-5 h-5 opacity-80" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-3 rounded-2xl h-16 px-8 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-600 text-slate-800 dark:text-gray-200 text-xl font-bold shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300 group"
          >
            <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            Add to Cart
            <Download className="w-5 h-5 opacity-80" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Additional Info Cards */}
      <motion.div className="space-y-4" variants={containerVariants}>
        {/* Security Badge */}
        <motion.div
          className="bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-green-200/50 dark:border-green-700/30"
          variants={itemVariants}
          whileHover={{ y: -2, scale: 1.01 }}
        >
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white">
                Secure Purchase
              </h4>
              <p className="text-green-700 dark:text-green-300 text-sm">
                256-bit SSL encryption
              </p>
            </div>
          </div>
        </motion.div>

        {/* Instant Download */}
        <motion.div
          className="bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm p-6 rounded-2xl border-2 border-blue-200/50 dark:border-blue-700/30"
          variants={itemVariants}
          whileHover={{ y: -2, scale: 1.01 }}
        >
          <div className="flex items-center gap-3">
            <Download className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white">
                Instant Access
              </h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Download immediately after purchase
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PurchaseSidebar;
