"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Printer, Download, Send } from "lucide-react";
import Image from "next/image";

const InvoicePage = () => {
  const params = useParams();
  const invoiceId = params?.invoiceId as string;
  const [invoice, setInvoice] = useState<any>(null);
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
      <div className="flex justify-center items-center h-screen bg-ink">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-ink text-center">
        <h2 className="text-2xl font-semibold text-cream mb-4">
          Invoice Not Found
        </h2>
        <p className="text-cream-dim">
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
    <div className="bg-ink min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Invoice Actions */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-cream">Invoice</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gold text-ink px-4 py-2 rounded-lg hover:bg-gold-light transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button className="flex items-center gap-2 bg-surface text-cream px-4 py-2 rounded-lg hover:bg-card transition-colors">
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button className="flex items-center gap-2 bg-surface text-cream-dim px-4 py-2 rounded-lg hover:bg-card transition-colors">
              <Send className="w-4 h-4" />
              <span>Send via Email</span>
            </button>
          </div>
        </div>

        {/* Invoice */}
        <div
          id="invoice-content"
          className="bg-card rounded-2xl shadow-lg p-8 md:p-12"
        >
          {/* Header */}
          <div className="flex justify-between items-start pb-8 border-b border-cb-border">
            <div>
              <Image
                src="/images/concept-builders-logo-free-bg.png"
                alt="Concept Builders Logo"
                width={150}
                height={40}
                className="dark:invert"
              />
              <p className="text-sm text-muted mt-2">
                123 Design Lane, Archville, 12345
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-cream">INVOICE</h2>
              <p className="text-sm text-muted"># {invoice.invoiceNumber}</p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase mb-3">
                Billed To
              </h3>
              <p className="font-medium text-cream">{invoice.user.name}</p>
              <p className="text-cream-dim">{invoice.user.email}</p>
            </div>
            <div className="text-left md:text-right">
              <h3 className="text-sm font-semibold text-muted uppercase mb-3">
                Invoice Details
              </h3>
              <p className="text-cream">
                <span className="font-medium">Date of Issue:</span>{" "}
                {new Date(invoice.date).toLocaleDateString()}
              </p>
              <p className="text-cream">
                <span className="font-medium">Due Date:</span>{" "}
                {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
              <p
                className={`font-semibold ${
                  invoice.status === "Paid" ? "text-green-500" : "text-red-500"
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
                <tr className="bg-surface">
                  <th className="p-4 text-sm font-semibold text-cream-dim rounded-l-lg">
                    Item
                  </th>
                  <th className="p-4 text-sm font-semibold text-cream-dim text-center">
                    Qty
                  </th>
                  <th className="p-4 text-sm font-semibold text-cream-dim text-right">
                    Rate
                  </th>
                  <th className="p-4 text-sm font-semibold text-cream-dim text-right rounded-r-lg">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-cb-border">
                    <td className="p-4">
                      <p className="font-medium text-cream">{item.name}</p>
                      <p className="text-sm text-cream-dim">
                        {item.description}
                      </p>
                    </td>
                    <td className="p-4 text-center text-cream-dim">
                      {item.quantity}
                    </td>
                    <td className="p-4 text-right text-cream-dim">
                      ${item.rate.toFixed(2)}
                    </td>
                    <td className="p-4 text-right font-medium text-cream">
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
                <span className="text-cream-dim">Subtotal</span>
                <span className="text-cream">
                  ${invoice.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-cream-dim">
                  Tax ({invoice.taxRate * 100}%)
                </span>
                <span className="text-cream">${invoice.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-cb-border my-2"></div>
              <div className="flex justify-between py-2">
                <span className="text-lg font-bold text-cream">Total</span>
                <span className="text-lg font-bold text-cream">
                  ${invoice.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 mt-8 border-t border-cb-border">
            <p className="text-sm text-cream-dim">
              Thank you for your business!
            </p>
            <p className="text-xs text-muted mt-1">
              Concept Builders | www.conceptbuilders.com |
              support@conceptbuilders.co.ke
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
