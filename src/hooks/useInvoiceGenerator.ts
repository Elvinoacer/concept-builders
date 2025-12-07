import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Order, OrderItem, Design } from "@/generated/prisma";

interface OrderWithDetails extends Order {
  items: (OrderItem & { design: Design })[];
  user: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
}

export const useInvoiceGenerator = () => {
  const generateInvoice = (order: OrderWithDetails) => {
    const doc = new jsPDF();

    // Company Logo/Header
    doc.setFontSize(20);
    doc.text("Concept Builders", 14, 22);
    doc.setFontSize(10);
    doc.text("P.O. Box 12345", 14, 28);
    doc.text("Nairobi, Kenya", 14, 32);
    doc.text("Email: info@conceptbuilders.co.ke", 14, 36);

    // Invoice Details
    doc.setFontSize(16);
    doc.text("INVOICE", 140, 22);
    doc.setFontSize(10);
    doc.text(`Invoice No: ${order.id.substring(0, 8).toUpperCase()}`, 140, 28);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 32);
    doc.text(`Status: ${order.status}`, 140, 36);

    // Bill To
    doc.text("Bill To:", 14, 50);
    doc.setFont("helvetica", "bold");
    doc.text(order.user.name || "Valued Customer", 14, 55);
    doc.setFont("helvetica", "normal");
    doc.text(order.user.email || "", 14, 60);
    if (order.user.phone) {
      doc.text(order.user.phone, 14, 65);
    }

    // Items Table
    const tableColumn = ["Item", "Type", "Price (USD)"];
    const tableRows: any[] = [];

    order.items.forEach((item) => {
      const designData = [
        item.design.name,
        "Design Package",
        item.design.basePrice.toFixed(2),
      ];
      tableRows.push(designData);

      // Add extras/files if needed, or just lump sum based on logic
      // For simplicity, we list the main design. 
      // If there are specific priced extras, we should list them.
      // But currently price is calculated as a total.
      // Let's try to reconstruct the breakdown if possible, or just show the total.
      // Since we don't store individual item prices in OrderItem (only quantity), 
      // and the total order amount is stored, we might just show the design name and the total order amount.
      // However, for a proper invoice, line items are better.
      // We can list the design and its base price.
      // And then list "Customizations & Extras" as the difference?
      // Or just list the design and the total amount for that line item (if we had it).
      // Given the schema, we only have `order.amount`.
      // So we will list the items without individual prices if we can't calculate them easily,
      // OR we just show the total at the bottom.
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      theme: "grid",
      headStyles: { fillColor: [66, 133, 244] }, // Blue color
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 75;
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: $${order.amount.toFixed(2)}`, 140, finalY + 15);

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      "Thank you for your business!",
      105,
      280,
      { align: "center" }
    );

    doc.save(`Invoice-${order.id.substring(0, 8)}.pdf`);
  };

  return { generateInvoice };
};
