"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // Import the icons
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Design } from "@/generated/prisma/browser";
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

const PurchaseSidebar: React.FC<{ design: any }> = ({ design }) => {
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
        className="bg-card/80 backdrop-blur-xl p-6 lg:p-8 rounded-2xl shadow-xl border border-cb-border"
        variants={itemVariants}
      >
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-cream leading-tight mb-2" style={{ fontFamily: 'var(--font-cormorant-garamond), "Cormorant Garamond", serif' }}>
            Purchase Options
          </h2>
          <p className="text-cream-dim leading-relaxed">
            Customize your package and get instant access
          </p>
        </motion.div>

        <motion.div
          className="space-y-8"
          variants={itemVariants}
        >
          <motion.fieldset variants={itemVariants} className="space-y-4">
            <legend className="text-lg font-bold text-cream mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gold/10">
                <Building2 className="w-5 h-5 text-gold" />
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
            <legend className="text-lg font-bold text-cream mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gold/10">
                <Shield className="w-5 h-5 text-gold" />
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
            <legend className="text-lg font-bold text-cream mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gold/10">
                <FileText className="w-5 h-5 text-gold" />
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
            className="mt-8 pt-6 border-t border-cb-border"
            variants={itemVariants}
          >
            <h3
              className="text-lg font-bold text-cream mb-4 flex items-center gap-2 cursor-pointer hover:text-gold transition-colors"
              onClick={() => setIsCustomizationsExpanded(!isCustomizationsExpanded)}
            >
              <div className="p-1.5 rounded-lg bg-gold/10">
                <PlusCircle className="w-5 h-5 text-gold" />
              </div>
              Customizations
              {isCustomizationsExpanded ? (
                <FiChevronUp className="w-5 h-5 text-cream-dim ml-auto" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-cream-dim ml-auto" />
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
          className="mt-8 pt-6 border-t border-cb-border"
          variants={itemVariants}
        >
          <div className="flex justify-between items-end mb-6">
            <div className="min-w-0 flex-1 pr-4">
              <p className="text-lg font-semibold text-cream leading-tight mb-1 font-bold">
                Total Amount
              </p>
              <p className="text-sm text-cream-dim font-medium">
                Including all selected items
              </p>
            </div>
            <div className="text-right min-w-0 flex-shrink-0">
              {design.basePrice === 0 ? (
                <p className="text-4xl font-extrabold text-gold leading-none tracking-tight">
                  Custom Quote
                </p>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.p
                    key={totalPrice}
                    variants={priceVariants}
                    initial="initial"
                    animate="updated"
                    className="text-4xl font-extrabold text-gold leading-none tracking-tight"
                  >
                    ${totalPrice.toLocaleString()}
                  </motion.p>
                </AnimatePresence>
              )}
              {design.basePrice > 0 && (
                <motion.p
                  className="text-sm text-cream-dim mt-2 font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {kesPrice
                    ? `KES ${kesPrice.toLocaleString()}`
                    : "Converting..."}
                </motion.p>
              )}
            </div>
          </div>

          {design.basePrice > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <CostCalculatorModal>
                <Button
                  variant="ghost"
                  className="w-full h-11 text-sm font-bold border border-cb-border bg-surface text-cream hover:bg-gold hover:text-ink transition-all duration-300"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculator
                </Button>
              </CostCalculatorModal>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={`/currency-converter?amount=${totalPrice}`}
                  className="flex items-center justify-center w-full h-11 px-3 text-sm font-bold text-gold border border-gold/20 rounded-md bg-gold/5 hover:bg-gold/10 transition-colors duration-300"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Currencies
                </Link>
              </motion.div>
            </div>
          )}

          <div className="space-y-3">
            {design.basePrice === 0 ? (
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/custom-design?designId=${design.id}&imageUrl=${encodeURIComponent(design.images?.[0]?.url || "")}`)}
                className="w-full flex items-center justify-center gap-3 rounded-xl h-14 px-6 bg-gold text-ink text-lg font-bold shadow-lg shadow-gold/20 hover:bg-gold-light transition-all duration-300 group"
              >
                <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Request Custom Design
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="w-full flex items-center justify-center gap-3 rounded-xl h-14 px-6 bg-gold text-ink text-lg font-bold shadow-lg shadow-gold/20 hover:bg-gold-light transition-all duration-300 group"
                >
                  <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Purchase Now
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={!!cartItem}
                  className="w-full flex items-center justify-center gap-3 rounded-xl h-14 px-6 bg-surface border-2 border-cb-border text-cream text-lg font-bold hover:border-gold/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
              </>
            )}

            <DesignInquiryModal designId={design.id} designName={design.name} />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-4"
        variants={containerVariants}
      >
        <motion.div
          className="bg-surface backdrop-blur-sm p-4 rounded-xl border border-cb-border"
          variants={itemVariants}
          whileHover={{ y: -2, scale: 1.01 }}
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div className="min-w-0">
              <h4 className="font-semibold text-cream text-sm leading-tight">
                Secure Purchase
              </h4>
              <p className="text-emerald-400/80 text-xs mt-0.5">
                256-bit SSL encryption
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-surface backdrop-blur-sm p-4 rounded-xl border border-cb-border"
          variants={itemVariants}
          whileHover={{ y: -2, scale: 1.01 }}
        >
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-gold flex-shrink-0" />
            <div className="min-w-0">
              <h4 className="font-semibold text-cream text-sm leading-tight">
                Instant Access
              </h4>
              <p className="text-gold/80 text-xs mt-0.5">
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
        ? "border-gold bg-gold/5 shadow-md shadow-gold/5"
        : "border-cb-border bg-surface hover:border-gold/50 hover:bg-gold/5"
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
          ? "bg-gold border-gold"
          : "border-cb-border group-hover:border-gold"
      }`}
    >
      {isChecked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <CheckCircle className="w-3.5 h-3.5 text-ink" />
        </motion.div>
      )}
    </motion.div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <IconComponent className={`w-4 h-4 flex-shrink-0 ${isChecked ? 'text-gold' : 'text-cream-dim'}`} />
        <span className="font-semibold text-cream text-base truncate">
          {option.label}
        </span>
        {option.isAvailable && (
          <span className="ml-2 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700 rounded-full dark:bg-green-900/30 dark:text-green-400 flex-shrink-0">
            Available
          </span>
        )}
      </div>
      <p className="text-cream-dim text-sm leading-relaxed line-clamp-2">
        {option.description}
      </p>
      {!option.isAvailable && (
        <p className="text-gold text-xs mt-1.5 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          Available in 3 days
        </p>
      )}
    </div>

    <motion.div
      className="flex flex-col items-end justify-start ml-2"
    >
      <span className="font-bold text-cream text-base">
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
        ? "border-gold bg-gold/5 shadow-md shadow-gold/5"
        : "border-cb-border bg-surface hover:border-gold/50 hover:bg-gold/5"
    }`}
    onClick={() => onToggle(option)}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.99 }}
  >
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <motion.div
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
          isChecked
            ? "bg-gold border-gold"
            : "border-cb-border group-hover:border-gold"
        }`}
      >
        {isChecked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <CheckCircle className="w-3.5 h-3.5 text-ink" />
          </motion.div>
        )}
      </motion.div>
      <div className="flex flex-col">
        <span className="font-semibold text-cream text-base truncate">
          {option.name}
        </span>
        {option.file && (
          <span className="text-xs text-emerald-400 font-medium">
            Instant Download
          </span>
        )}
      </div>
    </div>
    <span className="font-bold text-cream text-base ml-4">
      +${option.price.toLocaleString()}
    </span>
  </motion.div>
);

export default PurchaseSidebar;
