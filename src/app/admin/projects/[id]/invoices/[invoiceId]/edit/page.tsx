"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { InvoiceStatus, InvoiceType } from "@prisma/client";
import { Edit, XCircle } from "lucide-react";
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
    { id: Date.now().toString(), description: "", quantity: 1, unitPrice: 0, total: 0 },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(true);

  useEffect(() => {
    if (!projectId || !invoiceId) return;

    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/admin/projects/${projectId}/invoices/${invoiceId}`);
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
        setInvoiceItems(data.invoiceItems.map(item => ({ ...item, id: item.id || Date.now().toString() }))); // Ensure items have a client-side ID
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
      { id: Date.now().toString(), description: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setInvoiceItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const calculatedTotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    setTotalAmount(calculatedTotal);
  }, [invoiceItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/invoices/${invoiceId}`, {
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
          invoiceItems: invoiceItems.map(({ id, ...rest }) => rest), // Remove temporary id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      router.push(`/admin/projects/${projectId}`);
    } catch (err: any) {
      console.error("Error updating invoice:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (invoiceLoading) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading invoice data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
          Edit Invoice: {invoiceNumber}
        </h2>
        <p className="text-gray-500 mt-1 dark:text-gray-400">
          Modify the details of this invoice.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Invoice Number</label>
            <input
              type="text"
              id="invoiceNumber"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Issue Date</label>
            <input
              type="date"
              id="issueDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
            <input
              type="date"
              id="dueDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              id="status"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
            <select
              id="type"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
          <div>
            <label htmlFor="documentUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Document URL (Optional)</label>
            <input
              type="text"
              id="documentUrl"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
            />
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Invoice Items</h3>
        <div className="space-y-4 mb-4">
          {invoiceItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <div className="md:col-span-2">
                <label htmlFor={`description-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <input
                  type="text"
                  id={`description-${item.id}`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor={`quantity-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Qty</label>
                <input
                  type="number"
                  id={`quantity-${item.id}`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, "quantity", parseInt(e.target.value) || 0)}
                  min={1}
                  required
                />
              </div>
              <div>
                <label htmlFor={`unitPrice-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit Price</label>
                <input
                  type="number"
                  id={`unitPrice-${item.id}`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                  step="0.01"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total: ${item.total.toFixed(2)}</span>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  title="Remove Item"
                >
                  <XCircle className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          ))}
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddItem}
          className="mb-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg text-sm flex items-center space-x-1"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Item</span>
        </motion.button>

        <div className="mb-6 text-right">
          <span className="text-lg font-bold text-gray-900 dark:text-white">Grand Total: ${totalAmount.toFixed(2)}</span>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-500 transition-colors flex items-center justify-center space-x-2"
          disabled={loading}
        >
          {loading ? "Updating..." : <><Edit className="w-5 h-5" /><span>Update Invoice</span></>}
        </motion.button>

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default EditInvoicePage;
