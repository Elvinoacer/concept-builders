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
import DesignInquiryModal from "./DesignInquiryModal";

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
          // Base price includes architectural PDF, so we don't add it again
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

  useEffect(() => {
    // Auto-select architecturalPdf if not already selected
    if (!selectedFileTypes.includes("architecturalPdf")) {
      setSelectedFileTypes((prev) => [...prev, "architecturalPdf"]);
    }
  }, []);

  const handleFileTypeToggle = (fileType: string) => {
    if (fileType === "architecturalPdf") return; // Prevent deselection
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
      className="space-y-6 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      id="purchase-options"
    >
      <motion.div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 ring-1 ring-black/5 dark:ring-white/5"
        variants={itemVariants}
      >
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight mb-2">
            Purchase Options
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Customize your package and get instant access
          </p>
        </motion.div>

        <motion.div
          className="space-y-8"
          variants={itemVariants}
        >
          <motion.fieldset variants={itemVariants} className="space-y-4">
            <legend className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              Architectural Plans
            </legend>
            <div className="space-y-3">
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

          <motion.fieldset variants={itemVariants} className="space-y-4">
            <legend className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              Structural Plans
            </legend>
            <div className="space-y-3">
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

          <motion.fieldset variants={itemVariants} className="space-y-4">
            <legend className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              Additional Documents
            </legend>
            <div className="space-y-3">
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
            className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
            variants={itemVariants}
          >
            <h3
              className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
              onClick={() => setIsCustomizationsExpanded(!isCustomizationsExpanded)}
            >
              <div className="p-1.5 rounded-lg bg-primary/10">
                <PlusCircle className="w-5 h-5 text-primary" />
              </div>
              Customizations
              {isCustomizationsExpanded ? (
                <FiChevronUp className="w-5 h-5 text-gray-500 ml-auto" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-gray-500 ml-auto" />
              )}
            </h3>
            <AnimatePresence>
              {isCustomizationsExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-3 overflow-hidden"
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
          className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
          variants={itemVariants}
        >
          <div className="flex justify-between items-end mb-6">
            <div className="min-w-0 flex-1 pr-4">
              <p className="text-lg font-semibold text-slate-900 dark:text-white leading-tight mb-1">
                Total Amount
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
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
                  className="text-4xl font-extrabold text-slate-900 dark:text-white leading-none tracking-tight"
                >
                  ${totalPrice.toLocaleString()}
                </motion.p>
              </AnimatePresence>
              <motion.p
                className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium"
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

          <div className="grid grid-cols-2 gap-3 mb-6">
            <CostCalculatorModal>
              <Button
                variant="outline"
                className="w-full h-11 text-sm font-medium border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculator
              </Button>
            </CostCalculatorModal>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={`/currency-converter?amount=${totalPrice}`}
                className="flex items-center justify-center w-full h-11 px-3 text-sm font-medium text-primary border border-primary/20 rounded-md hover:bg-primary/5 transition-colors duration-300"
              >
                <Zap className="w-4 h-4 mr-2" />
                Currencies
              </Link>
            </motion.div>
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-3 rounded-xl h-14 px-6 bg-gradient-to-r from-primary to-blue-600 text-white text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
            >
              <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Purchase Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!!cartItem}
              className="w-full flex items-center justify-center gap-3 rounded-xl h-14 px-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white text-lg font-bold hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white"
            >
              {cartItem ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </motion.button>

            <DesignInquiryModal designId={design.id} designName={design.name} />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-4"
        variants={containerVariants}
      >
        <motion.div
          className="bg-green-50/50 dark:bg-green-900/10 backdrop-blur-sm p-4 rounded-xl border border-green-200/50 dark:border-green-700/30"
          variants={itemVariants}
          whileHover={{ y: -2, scale: 1.01 }}
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div className="min-w-0">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">
                Secure Purchase
              </h4>
              <p className="text-green-700 dark:text-green-300 text-xs mt-0.5">
                256-bit SSL encryption
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-blue-50/50 dark:bg-blue-900/10 backdrop-blur-sm p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/30"
          variants={itemVariants}
          whileHover={{ y: -2, scale: 1.01 }}
        >
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div className="min-w-0">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">
                Instant Access
              </h4>
              <p className="text-blue-700 dark:text-blue-300 text-xs mt-0.5">
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
    className={`relative flex items-start gap-4 rounded-xl p-4 cursor-pointer transition-all duration-300 border group ${
      isChecked
        ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
        : "border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/50 hover:border-primary/50 hover:bg-white dark:hover:bg-gray-800"
    }`}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.99 }}
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
      className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-0.5 transition-all duration-300 ${
        isChecked
          ? "bg-primary border-primary"
          : "border-gray-300 dark:border-gray-600 group-hover:border-primary"
      }`}
    >
      {isChecked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <CheckCircle className="w-3.5 h-3.5 text-white" />
        </motion.div>
      )}
    </motion.div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <IconComponent className={`w-4 h-4 flex-shrink-0 ${isChecked ? 'text-primary' : 'text-gray-500'}`} />
        <span className="font-semibold text-slate-900 dark:text-white text-base truncate">
          {option.label}
        </span>
        {option.isAvailable && (
          <span className="ml-2 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700 rounded-full dark:bg-green-900/30 dark:text-green-400 flex-shrink-0">
            Available
          </span>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
        {option.description}
      </p>
      {!option.isAvailable && (
        <p className="text-blue-600 dark:text-blue-400 text-xs mt-1.5 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Available in 3 days
        </p>
      )}
    </div>

    <motion.div
      className="flex flex-col items-end justify-start ml-2"
    >
      <span className="font-bold text-slate-900 dark:text-white text-base">
        +${option.price.toLocaleString()}
      </span>
    </motion.div>
  </motion.label>
);

const ExtraOption: React.FC<{
  option: any;
  isChecked: boolean;
  onToggle: (extra: any) => void;
}> = ({ option, isChecked, onToggle }) => (
  <motion.div
    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300 group ${
      isChecked
        ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
        : "border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/50 hover:border-primary/50 hover:bg-white dark:hover:bg-gray-800"
    }`}
    onClick={() => onToggle(option)}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.99 }}
  >
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <motion.div
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
          isChecked
            ? "bg-primary border-primary"
            : "border-gray-300 dark:border-gray-600 group-hover:border-primary"
        }`}
      >
        {isChecked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <CheckCircle className="w-3.5 h-3.5 text-white" />
          </motion.div>
        )}
      </motion.div>
      <div className="flex flex-col">
        <span className="font-semibold text-slate-900 dark:text-white text-base truncate">
          {option.name}
        </span>
        {option.file && (
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
            Instant Download
          </span>
        )}
      </div>
    </div>
    <span className="font-bold text-slate-900 dark:text-white text-base ml-4">
      +${option.price.toLocaleString()}
    </span>
  </motion.div>
);

export default PurchaseSidebar;
