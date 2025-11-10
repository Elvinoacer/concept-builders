"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Printer, Download, Send } from "lucide-react";
import Image from "next/image";

const InvoicePage = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceId) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/invoices/${invoiceId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch invoice");
        }
        const data = await response.json();
        setInvoice(data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        // Handle error state here, e.g., show a notification
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Invoice Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          The invoice you are looking for does not exist or could not be
          retrieved.
        </p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Invoice Actions */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Invoice
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              <Send className="w-4 h-4" />
              <span>Send via Email</span>
            </button>
          </div>
        </div>

        {/* Invoice */}
        <div
          id="invoice-content"
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 md:p-12"
        >
          {/* Header */}
          <div className="flex justify-between items-start pb-8 border-b border-gray-200 dark:border-gray-700">
            <div>
              <Image
                src="/images/concept-builders-logo-free-bg.png"
                alt="Concept Builders Logo"
                width={150}
                height={40}
                className="dark:invert"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                123 Design Lane, Archville, 12345
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                INVOICE
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                # {invoice.invoiceNumber}
              </p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                Billed To
              </h3>
              <p className="font-medium text-gray-800 dark:text-white">
                {invoice.user.name}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {invoice.user.email}
              </p>
            </div>
            <div className="text-left md:text-right">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                Invoice Details
              </h3>
              <p className="text-gray-800 dark:text-white">
                <span className="font-medium">Date of Issue:</span>{" "}
                {new Date(invoice.date).toLocaleDateString()}
              </p>
              <p className="text-gray-800 dark:text-white">
                <span className="font-medium">Due Date:</span>{" "}
                {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
              <p
                className={`font-semibold ${
                  invoice.status === "Paid"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                Status: {invoice.status}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 rounded-l-lg">
                    Item
                  </th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-center">
                    Qty
                  </th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">
                    Rate
                  </th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right rounded-r-lg">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className="p-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </td>
                    <td className="p-4 text-center text-gray-700 dark:text-gray-300">
                      {item.quantity}
                    </td>
                    <td className="p-4 text-right text-gray-700 dark:text-gray-300">
                      ${item.rate.toFixed(2)}
                    </td>
                    <td className="p-4 text-right font-medium text-gray-900 dark:text-white">
                      ${(item.quantity * item.rate).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-8">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-300">
                  Subtotal
                </span>
                <span className="text-gray-800 dark:text-white">
                  ${invoice.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-300">
                  Tax ({invoice.taxRate * 100}%)
                </span>
                <span className="text-gray-800 dark:text-white">
                  ${invoice.tax.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              <div className="flex justify-between py-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Total
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${invoice.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Thank you for your business!
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Concept Builders | www.conceptbuilders.com |
              support@conceptbuilders.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
