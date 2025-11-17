"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // Import the icons
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Design } from "@/generated/prisma";
import { useCart } from "@/hooks/useCart";
import {
  Building2,
  Calculator,
  CheckCircle,
  Download,
  FileText,
  PlusCircle,
  Shield,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CostCalculatorModal from "@/components/cost-calculator/CostCalculatorModal";
import { Button } from "../ui/button";

const PurchaseSidebar: React.FC<{ design: Design }> = ({ design }) => {
  const { cart, addToCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<any[]>([]);
  const [isCustomizationsExpanded, setIsCustomizationsExpanded] = useState(false); // New state for customizations

  const cartItem = useMemo(() => {
    return cart.find(
      (item) =>
        item.design.id === design.id &&
        JSON.stringify(item.selectedFileTypes.sort()) ===
          JSON.stringify(selectedFileTypes.sort()) &&
        JSON.stringify(item.selectedExtras?.map((e) => e.id).sort() || []) ===
          JSON.stringify(selectedExtras.map((e) => e.id).sort())
    );
  }, [cart, design.id, selectedFileTypes, selectedExtras]);

  useEffect(() => {
    if (cartItem) {
      setSelectedFileTypes(cartItem.selectedFileTypes || []);
      setSelectedExtras(cartItem.selectedExtras || []);
    }
  }, [cartItem]);

  const totalPrice = useMemo(() => {
    let price = design.basePrice || 0;
    selectedFileTypes.forEach((fileType) => {
      switch (fileType) {
        case "architecturalPdf":
          price += design.architecturalPdfPrice || 0;
          break;
        case "architecturalCad":
          price += design.architecturalCadPrice || 0;
          break;
        case "structuralPdf":
          price += design.structuralPdfPrice || 0;
          break;
        case "structuralCad":
          price += design.structuralCadPrice || 0;
          break;
        case "billOfQuantitiesExcel":
          price += design.billOfQuantitiesPrice || 0;
          break;
        case "billOfQuantitiesPdf":
          price += design.billOfQuantitiesPdfPrice || 0;
          break;
        default:
          break;
      }
    });
    selectedExtras.forEach((extra) => {
      price += extra.price || 0;
    });
    return price;
  }, [design, selectedFileTypes, selectedExtras]);

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

  const handleFileTypeToggle = (fileType: string) => {
    setSelectedFileTypes((prev) =>
      prev.includes(fileType)
        ? prev.filter((type) => type !== fileType)
        : [...prev, fileType]
    );
  };

  const handleExtraToggle = (extra: any) => {
    setSelectedExtras((prev) =>
      prev.some((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const handleAddToCart = () => {
    if (cartItem) {
      alert(
        "This configuration is already in your cart. You can adjust the quantity in the cart page."
      );
    } else {
      addToCart(design, selectedFileTypes, selectedExtras);
    }
  };

  const handleBuyNow = async () => {
    const success = await addToCart(design, selectedFileTypes, selectedExtras);
    if (success) {
      if (status === "authenticated") {
        router.push("/checkout");
      } else {
        signIn("google", { callbackUrl: "/checkout" });
      }
    }
  };

  const documentOptions = [
    {
      key: "architecturalPdf",
      label: "Architectural PDF",
      price: design.architecturalPdfPrice || 0,
      icon: FileText,
      description: "Detailed PDF blueprints and plans",
      category: "architectural",
      isAvailable: (design.architecturalDesign?.pdfFiles?.length || 0) > 0,
    },
    {
      key: "architecturalCad",
      label: "Architectural CAD",
      price: design.architecturalCadPrice || 0,
      icon: Building2,
      description: "Editable CAD files for modifications",
      category: "architectural",
      isAvailable: (design.architecturalDesign?.cadFiles?.length || 0) > 0,
    },
    {
      key: "structuralPdf",
      label: "Structural PDF",
      price: design.structuralPdfPrice || 0,
      icon: FileText,
      description: "Structural engineering drawings",
      category: "structural",
      isAvailable: (design.structuralDesign?.pdfFiles?.length || 0) > 0,
    },
    {
      key: "structuralCad",
      label: "Structural CAD",
      price: design.structuralCadPrice || 0,
      icon: Building2,
      description: "Structural CAD files for engineers",
      category: "structural",
      isAvailable: (design.structuralDesign?.cadFiles?.length || 0) > 0,
    },
    {
      key: "billOfQuantitiesExcel",
      label: "Bill of Quantities (Excel)",
      price: design.billOfQuantitiesPrice || 0,
      icon: Calculator,
      description: "Material and cost breakdown in Excel format",
      category: "additional",
      isAvailable: (design.billOfQuantities?.excelFiles?.length || 0) > 0,
    },
    {
      key: "billOfQuantitiesPdf",
      label: "Bill of Quantities (PDF)",
      price: design.billOfQuantitiesPdfPrice || 0,
      icon: FileText,
      description: "Material and cost breakdown in PDF format",
      category: "additional",
      isAvailable: (design.billOfQuantities?.pdfFiles?.length || 0) > 0,
    },
  ];

  const groupedDocuments = useMemo(() => {
    const groups = {
      architectural: documentOptions.filter(
        (doc) => doc.category === "architectural"
      ),
      structural: documentOptions.filter(
        (doc) => doc.category === "structural"
      ),
      additional: documentOptions.filter(
        (doc) => doc.category === "additional"
      ),
    };
    return groups;
  }, [documentOptions]);

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
      className="sticky top-2 xs:top-4 sm:top-6 lg:top-8 xl:top-24 space-y-3 xs:space-y-4 sm:space-y-6 w-full max-w-full xs:max-w-sm mx-auto lg:mx-0 px-2 xs:px-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 rounded-lg xs:rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl border border-gray-200/60 dark:border-gray-700/60"
        variants={itemVariants}
      >
        <motion.div
          className="text-center mb-3 xs:mb-4 sm:mb-6"
          variants={itemVariants}
        >
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight">
            Purchase Options
          </h2>
          <p className="text-xs xs:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 xs:mt-2 leading-relaxed">
            Customize your package and get instant access
          </p>
        </motion.div>

        <motion.div
          className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6"
          variants={itemVariants}
        >
          <motion.fieldset variants={itemVariants}>
            <legend className="text-sm xs:text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 xs:mb-3 sm:mb-4 flex items-center gap-1 xs:gap-2 sm:gap-3">
              <Building2 className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span className="text-xs xs:text-sm sm:text-base md:text-lg truncate">
                Architectural Plans
              </span>
            </legend>
            <div className="space-y-1 xs:space-y-2 sm:space-y-3">
              {groupedDocuments.architectural.map((option) => {
                const IconComponent = option.icon;
                const isChecked = selectedFileTypes.includes(option.key);
                return (
                  <DocumentOption
                    key={option.key}
                    option={option}
                    isChecked={isChecked}
                    onToggle={handleFileTypeToggle}
                    IconComponent={IconComponent}
                  />
                );
              })}
            </div>
          </motion.fieldset>

          <motion.fieldset variants={itemVariants}>
            <legend className="text-sm xs:text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 xs:mb-3 sm:mb-4 flex items-center gap-1 xs:gap-2 sm:gap-3">
              <Shield className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span className="text-xs xs:text-sm sm:text-base md:text-lg truncate">
                Structural Plans
              </span>
            </legend>
            <div className="space-y-1 xs:space-y-2 sm:space-y-3">
              {groupedDocuments.structural.map((option) => {
                const IconComponent = option.icon;
                const isChecked = selectedFileTypes.includes(option.key);
                return (
                  <DocumentOption
                    key={option.key}
                    option={option}
                    isChecked={isChecked}
                    onToggle={handleFileTypeToggle}
                    IconComponent={IconComponent}
                  />
                );
              })}
            </div>
          </motion.fieldset>

          <motion.fieldset variants={itemVariants}>
            <legend className="text-sm xs:text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2 xs:mb-3 sm:mb-4 flex items-center gap-1 xs:gap-2 sm:gap-3">
              <FileText className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span className="text-xs xs:text-sm sm:text-base md:text-lg truncate">
                Additional Documents
              </span>
            </legend>
            <div className="space-y-1 xs:space-y-2 sm:space-y-3">
              {groupedDocuments.additional.map((option) => {
                const IconComponent = option.icon;
                const isChecked = selectedFileTypes.includes(option.key);
                return (
                  <DocumentOption
                    key={option.key}
                    option={option}
                    isChecked={isChecked}
                    onToggle={handleFileTypeToggle}
                    IconComponent={IconComponent}
                  />
                );
              })}
            </div>
          </motion.fieldset>
        </motion.div>

        {design.packageOptions && design.packageOptions.length > 0 && (
          <motion.div
            className="mt-4 xs:mt-5 sm:mt-6 lg:mt-8 space-y-2 xs:space-y-3 sm:space-y-4"
            variants={itemVariants}
          >
            <h3
              className="text-sm xs:text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1 xs:mb-2 flex items-center gap-1 xs:gap-2 sm:gap-3 cursor-pointer"
              onClick={() => setIsCustomizationsExpanded(!isCustomizationsExpanded)}
            >
              <PlusCircle className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span className="text-xs xs:text-sm sm:text-base md:text-lg truncate">
                Customizations
              </span>
              {isCustomizationsExpanded ? (
                <FiChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <FiChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </h3>
            <AnimatePresence>
              {isCustomizationsExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-1 xs:space-y-2 sm:space-y-3 overflow-hidden"
                >
                  {design.packageOptions.map((option: any) => {
                    const isChecked = selectedExtras.some(
                      (e) => e.id === option.id
                    );
                    return (
                      <ExtraOption
                        key={option.id}
                        option={option}
                        isChecked={isChecked}
                        onToggle={handleExtraToggle}
                      />
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.div
          className="mt-4 xs:mt-5 sm:mt-6 lg:mt-8 pt-3 xs:pt-4 sm:pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
          variants={itemVariants}
        >
          <div className="flex justify-between items-start mb-2 xs:mb-3 sm:mb-4">
            <div className="min-w-0 flex-1 pr-2">
              <p className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 leading-tight">
                Total Amount
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 xs:mt-1 leading-tight">
                Including all selected items
              </p>
            </div>
            <div className="text-right min-w-0 flex-shrink-0">
              <AnimatePresence mode="wait">
                <motion.p
                  key={totalPrice}
                  variants={priceVariants}
                  initial="initial"
                  animate="updated"
                  className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-none"
                >
                  ${totalPrice.toLocaleString()}
                </motion.p>
              </AnimatePresence>
              <motion.p
                className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 xs:mt-1 leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {kesPrice
                  ? `KES ${kesPrice.toLocaleString()}`
                  : "Converting..."}
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1 xs:gap-2 sm:gap-3 mt-2 xs:mt-3 sm:mt-4">
            <CostCalculatorModal>
              <Button
                variant="outline"
                className="w-full h-9 xs:h-10 sm:h-12 text-xs xs:text-sm px-2 xs:px-3"
              >
                <Calculator className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2 flex-shrink-0" />
                <span className="truncate">Cost Calculator</span>
              </Button>
            </CostCalculatorModal>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={`/currency-converter?amount=${totalPrice}`}
                className="flex items-center justify-center w-full h-9 xs:h-10 sm:h-12 px-2 xs:px-3 text-xs xs:text-sm font-medium text-primary border border-primary/20 rounded-lg xs:rounded-xl hover:border-primary/40 transition-colors duration-300"
              >
                <Zap className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2 flex-shrink-0" />
                <span className="truncate hidden xs:inline">
                  More Currencies
                </span>
                <span className="truncate xs:hidden">Currencies</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mt-3 xs:mt-4 sm:mt-6 grid grid-cols-1 gap-1 xs:gap-2 sm:gap-3"
          variants={itemVariants}
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBuyNow}
            className="w-full flex items-center justify-center gap-1 xs:gap-2 sm:gap-3 rounded-lg xs:rounded-xl md:rounded-2xl h-10 xs:h-12 sm:h-14 md:h-16 px-3 xs:px-4 sm:px-6 bg-gradient-to-r from-primary to-blue-600 text-white text-xs xs:text-sm sm:text-base md:text-lg font-bold shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 group"
          >
            <Zap className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
            <span className="text-xs xs:text-sm md:text-base truncate">
              Buy Now
            </span>
            <Shield className="w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 opacity-80 flex-shrink-0" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={!!cartItem}
            className="w-full flex items-center justify-center gap-1 xs:gap-2 sm:gap-3 rounded-lg xs:rounded-xl md:rounded-2xl h-10 xs:h-12 sm:h-14 md:h-16 px-3 xs:px-4 sm:px-6 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 text-slate-800 dark:text-gray-200 text-xs xs:text-sm sm:text-base md:text-lg font-bold shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl hover:border-primary/50 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cartItem ? (
              <>
                <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500 flex-shrink-0" />
                <span className="text-xs xs:text-sm md:text-base truncate">
                  Added to Cart
                </span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                <span className="text-xs xs:text-sm md:text-base truncate">
                  Add to Cart
                </span>
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 xs:grid-cols-2 gap-2 xs:gap-3 sm:gap-4"
        variants={containerVariants}
      >
        <motion.div
          className="bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm p-2 xs:p-3 sm:p-4 md:p-6 rounded-lg xs:rounded-xl md:rounded-2xl border border-green-200/50 dark:border-green-700/30"
          variants={itemVariants}
          whileHover={{ y: -2, scale: 1.01 }}
        >
          <div className="flex items-center gap-1 xs:gap-2 sm:gap-3">
            <Shield className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-slate-800 dark:text-white text-xs xs:text-sm md:text-base leading-tight truncate">
                Secure Purchase
              </h4>
              <p className="text-green-700 dark:text-green-300 text-xs leading-tight">
                256-bit SSL encryption
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm p-2 xs:p-3 sm:p-4 md:p-6 rounded-lg xs:rounded-xl md:rounded-2xl border border-blue-200/50 dark:border-blue-700/30"
          variants={itemVariants}
          whileHover={{ y: -2, scale: 1.01 }}
        >
          <div className="flex items-center gap-1 xs:gap-2 sm:gap-3">
            <Download className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-slate-800 dark:text-white text-xs xs:text-sm md:text-base leading-tight truncate">
                Instant Access
              </h4>
              <p className="text-blue-700 dark:text-blue-300 text-xs leading-tight">
                Download immediately
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const DocumentOption: React.FC<{
  option: any;
  isChecked: boolean;
  onToggle: (key: string) => void;
  IconComponent: any;
}> = ({ option, isChecked, onToggle, IconComponent }) => (
  <motion.label
    htmlFor={option.key}
    className={`relative flex items-start gap-1 xs:gap-2 sm:gap-3 rounded-lg xs:rounded-xl p-1.5 xs:p-2 sm:p-3 cursor-pointer transition-all duration-300 border group ${
      isChecked
        ? "border-primary bg-primary/5 shadow-md sm:shadow-lg shadow-primary/10"
        : "border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 hover:border-primary/50 hover:shadow-sm sm:hover:shadow-md"
    }`}
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.98 }}
  >
    <input
      type="checkbox"
      id={option.key}
      name="documentType"
      value={option.key}
      checked={isChecked}
      onChange={() => onToggle(option.key)}
      className="sr-only"
    />

    <motion.div
      className={`flex-shrink-0 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 rounded-md border flex items-center justify-center mt-0.5 transition-all duration-300 ${
        isChecked
          ? "bg-primary border-primary"
          : "border-gray-400 group-hover:border-primary"
      }`}
    >
      {isChecked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <CheckCircle className="w-2 h-2 xs:w-3 xs:h-3 text-white" />
        </motion.div>
      )}
    </motion.div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1 xs:gap-2 mb-0.5 xs:mb-1">
        <IconComponent className="w-3 h-3 xs:w-4 xs:h-4 text-primary flex-shrink-0" />
        <span className="font-semibold text-slate-800 dark:text-white text-xs xs:text-sm md:text-base truncate">
          {option.label}
        </span>
        {option.isAvailable && (
          <span className="ml-1 xs:ml-2 px-1.5 xs:px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-300 flex-shrink-0">
            Available
          </span>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-xs leading-tight line-clamp-2">
        {option.description}
      </p>
      {!option.isAvailable && (
        <p className="text-blue-600 dark:text-blue-400 text-xs mt-0.5 xs:mt-1 leading-tight">
          Will be delivered within 3 days
        </p>
      )}
    </div>

    <motion.span
      className="font-bold text-primary text-xs xs:text-sm md:text-base flex-shrink-0 ml-1 xs:ml-2"
      whileHover={{ scale: 1.1 }}
    >
      +${option.price.toLocaleString()}
    </motion.span>
  </motion.label>
);

const ExtraOption: React.FC<{
  option: any;
  isChecked: boolean;
  onToggle: (extra: any) => void;
}> = ({ option, isChecked, onToggle }) => (
  <motion.div
    className={`flex items-center justify-between p-1.5 xs:p-2 sm:p-3 rounded-lg xs:rounded-xl border cursor-pointer transition-all duration-300 group ${
      isChecked
        ? "border-primary bg-primary/5 shadow-md sm:shadow-lg shadow-primary/10"
        : "border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 hover:border-primary/50 hover:shadow-sm sm:hover:shadow-md"
    }`}
    onClick={() => onToggle(option)}
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3 min-w-0 flex-1">
      <motion.div
        className={`w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 rounded-md border flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
          isChecked
            ? "bg-primary border-primary"
            : "border-gray-400 group-hover:border-primary"
        }`}
      >
        {isChecked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <CheckCircle className="w-2 h-2 xs:w-3 xs:h-3 text-white" />
          </motion.div>
        )}
      </motion.div>
      <span className="font-medium text-slate-800 dark:text-gray-100 text-xs xs:text-sm md:text-base truncate flex-1">
        {option.name}
      </span>
      {option.file && (
        <span className="ml-1 xs:ml-2 px-1.5 xs:px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-300 flex-shrink-0">
          Available
        </span>
      )}
    </div>
    <motion.span
      className="font-bold text-primary text-xs xs:text-sm md:text-base flex-shrink-0 ml-1 xs:ml-2"
      whileHover={{ scale: 1.1 }}
    >
      +${option.price.toLocaleString()}
    </motion.span>
  </motion.div>
);

export default PurchaseSidebar;
