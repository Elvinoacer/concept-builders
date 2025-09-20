
"use client";

import { designsData } from "@/lib/designs-data";
import { motion } from "framer-motion";

const DesignsTable = () => {
  const getStatusChip = (status: string) => {
    switch (status) {
      case "Published":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success text-success-foreground">
            {status}
          </span>
        );
      case "Draft":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-warning text-warning-foreground">
            {status}
          </span>
        );
      case "Archived":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-muted text-muted-foreground">
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-md border border-border overflow-hidden"
    >
      <div className="mb-4 p-3 md:mb-6 md:p-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            search
          </span>
          <input
            className="form-input w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-ring focus:border-ring bg-card"
            placeholder="Search designs"
            type="text"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Design Name
              </th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Price
              </th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {designsData.map((design, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  {design.name}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
                  {getStatusChip(design.status)}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {design.price}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {design.lastUpdated}
                </td>
                <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-primary hover:text-opacity-80">
                    Edit
                  </a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DesignsTable;
