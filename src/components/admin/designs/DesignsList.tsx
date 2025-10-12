"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const DesignsList = ({ designs }) => {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-muted-foreground uppercase bg-muted">
          <tr>
            <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
              Name
            </th>
            <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
              Price
            </th>
            <th scope="col" className="hidden md:table-cell px-2 py-2 md:px-4 md:py-3 sm:px-6">
              Created At
            </th>
            <th scope="col" className="hidden md:table-cell px-2 py-2 md:px-4 md:py-3 sm:px-6">
              Last Modified
            </th>
            <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {designs.map((design, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border-b border-border hover:bg-muted"
            >
              <td className="px-2 py-2 md:px-4 md:py-4 sm:px-6 font-medium text-foreground whitespace-nowrap">
                {design.name}
              </td>
              <td className="px-2 py-2 md:px-4 md:py-4 sm:px-6 whitespace-nowrap">
                {formatPrice(design.basePrice)}
              </td>
              <td className="hidden md:table-cell px-2 py-2 md:px-4 md:py-4 sm:px-6 whitespace-nowrap">
                {formatDate(design.createdAt)}
              </td>
              <td className="hidden md:table-cell px-2 py-2 md:px-4 md:py-4 sm:px-6 whitespace-nowrap">
                {formatDate(design.updatedAt)}
              </td>
              <td className="px-2 py-2 md:px-4 md:py-4 sm:px-6 text-right">
                <Link href={`/admin/designs/${design.id}`} className="font-medium text-primary hover:underline whitespace-nowrap">
                  View
                </Link>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesignsList;
