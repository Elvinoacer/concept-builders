"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { InvoiceStatus, InvoiceType } from "@/generated/prisma";
import {
  Edit,
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Hash,
  AlertCircle,
  Sparkles,
  Receipt,
  XCircle,
  PlusCircle,
} from "lucide-react";
import { format } from "date-fns";

interface InvoiceItemState {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  status: InvoiceStatus;
  type: InvoiceType;
  documentUrl: string | null;
  invoiceItems: InvoiceItemState[];
}

const EditInvoicePage = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const invoiceId = params.invoiceId as string;

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [status, setStatus] = useState<InvoiceStatus>(InvoiceStatus.PENDING);
  const [type, setType] = useState<InvoiceType>(InvoiceType.CUSTOM);
  const [documentUrl, setDocumentUrl] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemState[]>([
    {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !invoiceId) return;

    const fetchInvoice = async () => {
      try {
        const response = await fetch(
          `/api/admin/projects/${projectId}/invoices/${invoiceId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Invoice = await response.json();
        setInvoiceNumber(data.invoiceNumber);
        setIssueDate(format(new Date(data.issueDate), "yyyy-MM-dd"));
        setDueDate(format(new Date(data.dueDate), "yyyy-MM-dd"));
        setTotalAmount(data.totalAmount);
        setStatus(data.status);
        setType(data.type);
        setDocumentUrl(data.documentUrl || "");
        setInvoiceItems(
          data.invoiceItems.map((item) => ({
            ...item,
            id: item.id || Date.now().toString(),
          }))
        );
      } catch (err: any) {
        console.error("Error fetching invoice:", err);
        setError("Failed to load invoice data.");
      } finally {
        setInvoiceLoading(false);
      }
    };
    fetchInvoice();
  }, [projectId, invoiceId]);

  const handleItemChange = (id: string, field: string, value: any) => {
    setInvoiceItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleAddItem = () => {
    setInvoiceItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems((prevItems) =>
        prevItems.filter((item) => item.id !== id)
      );
    }
  };

  useEffect(() => {
    const calculatedTotal = invoiceItems.reduce(
      (sum, item) => sum + item.total,
      0
    );
    setTotalAmount(parseFloat(calculatedTotal.toFixed(2)));
  }, [invoiceItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (!invoiceNumber.trim()) {
      setError("Please enter an invoice number.");
      setLoading(false);
      return;
    }

    if (invoiceItems.some((item) => !item.description.trim())) {
      setError("Please fill in all item descriptions.");
      setLoading(false);
      return;
    }

    if (invoiceItems.some((item) => item.quantity <= 0)) {
      setError("Please enter valid quantities (greater than 0).");
      setLoading(false);
      return;
    }

    if (invoiceItems.some((item) => item.unitPrice < 0)) {
      setError("Please enter valid unit prices (cannot be negative).");
      setLoading(false);
      return;
    }

    if (totalAmount <= 0) {
      setError("Invoice total must be greater than 0.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/invoices/${invoiceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoiceNumber,
            issueDate,
            dueDate,
            totalAmount,
            status,
            type,
            documentUrl,
            invoiceItems: invoiceItems.map(({ id, ...rest }) => rest),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Success animation before redirect
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push(`/admin/projects/${projectId}`);
    } catch (err: any) {
      console.error("Error updating invoice:", err);
      setError(err.message || "Failed to update invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (invoiceLoading) {
    return (
      <div className="dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 min-h-screen p-3 xs:p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Loading invoice data...
          </p>
        </div>
      </div>
    );
  }

  if (error && !invoiceNumber) {
    return (
      <div className="dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 min-h-screen p-3 xs:p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 dark:text-red-400 text-sm sm:text-base mb-4 break-words">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.back()}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 min-h-screen p-3 xs:p-4 sm:p-6 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col xs:flex-row xs:items-center gap-3 xs:gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group self-start"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-cyan-500 dark:from-white dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent break-words">
              Edit Invoice
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 flex items-center gap-2 text-sm sm:text-base">
              <Edit className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="break-words">
                Modify the details of invoice{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {invoiceNumber}
                </span>
              </span>
            </p>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8"
        >
          {/* Invoice Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Invoice Number */}
            <div>
              <label
                htmlFor="invoiceNumber"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
              >
                <Hash className="w-4 h-4 flex-shrink-0" />
                <span>Invoice Number *</span>
              </label>
              <input
                type="text"
                id="invoiceNumber"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="INV-2024-001"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
              />
            </div>

            {/* Document URL */}
            <div>
              <label
                htmlFor="documentUrl"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span>Document URL (Optional)</span>
              </label>
              <input
                type="text"
                id="documentUrl"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="https://example.com/invoice.pdf"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
              />
            </div>

            {/* Issue Date */}
            <div>
              <label
                htmlFor="issueDate"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
              >
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Issue Date *</span>
              </label>
              <input
                type="date"
                id="issueDate"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
              />
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
              >
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Due Date *</span>
              </label>
              <input
                type="date"
                id="dueDate"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span>Status *</span>
              </label>
              <select
                id="status"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,<svg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%204%205%22><path%20fill%3D%22%236B7280%22%20d%3D%22M2%200L0%202h4zm0%205L0%203h4z%22%2F><%2Fsvg>')] bg-no-repeat bg-right-3 bg-center bg-size-3 sm:bg-right-4 sm:bg-size-4"
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                required
              >
                {Object.values(InvoiceStatus).map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label
                htmlFor="type"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3"
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span>Type *</span>
              </label>
              <select
                id="type"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,<svg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%204%205%22><path%20fill%3D%22%236B7280%22%20d%3D%22M2%200L0%202h4zm0%205L0%203h4z%22%2F><%2Fsvg>')] bg-no-repeat bg-right-3 bg-center bg-size-3 sm:bg-right-4 sm:bg-size-4"
                value={type}
                onChange={(e) => setType(e.target.value as InvoiceType)}
                required
              >
                {Object.values(InvoiceType).map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Invoice Items Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Invoice Items
              </h3>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddItem}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden xs:inline">Add Item</span>
              </motion.button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {invoiceItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
                    {/* Description */}
                    <div className="lg:col-span-5">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    {/* Quantity */}
                    <div className="lg:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Qty *
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "quantity",
                            parseInt(e.target.value) || 0
                          )
                        }
                        min={1}
                        required
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="lg:col-span-3">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Unit Price ($) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "unitPrice",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    {/* Total and Remove */}
                    <div className="lg:col-span-2 flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Total
                        </label>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-600 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-500">
                          ${item.total.toFixed(2)}
                        </div>
                      </div>

                      {invoiceItems.length > 1 && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2"
                          title="Remove Item"
                        >
                          <XCircle className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Grand Total */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 sm:mb-8 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
          >
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                Grand Total:
              </span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 mb-4 sm:mb-6"
              >
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <p className="text-sm break-words">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 group relative overflow-hidden text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                <span>Updating Invoice...</span>
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                <span>Update Invoice</span>
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 sm:mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">
                Editing Invoice
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Update any field to modify the invoice</li>
                <li>• Changes will be reflected immediately after saving</li>
                <li>
                  • Use clear descriptions for better client understanding
                </li>
                <li>• Adjust due dates based on updated payment terms</li>
                <li>• Double-check all calculations before saving</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Cancel Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-center"
        >
          <button
            onClick={() => router.back()}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium transition-colors"
          >
            ← Back to Project
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default EditInvoicePage;
