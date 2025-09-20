"use client";
import React from "react";

interface Milestone {
  id: number;
  name: string;
  status: string;
  statusColor: string;
  dueDate: string;
}

const Milestones = ({ milestones }: { milestones: Milestone[] }) => {
  const getStatusClasses = (statusColor: string) => {
    switch (statusColor) {
      case "green":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "blue":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "gray":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      <div className="p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
          Milestones
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                scope="col"
              >
                Milestone
              </th>
              <th
                className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                scope="col"
              >
                Status
              </th>
              <th
                className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                scope="col"
              >
                Due Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-800 dark:divide-gray-700">
            {milestones.map((milestone) => (
              <tr
                key={milestone.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {milestone.name}
                </td>
                <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-sm text-gray-500 dark:text-gray-400">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                      milestone.statusColor
                    )}`}
                  >
                    {milestone.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-sm text-gray-500 dark:text-gray-400">
                  {milestone.dueDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Milestones;
