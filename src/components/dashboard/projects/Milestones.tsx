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
        return "bg-emerald-900/30 text-emerald-300";
      case "blue":
        return "bg-gold/20 text-gold";
      case "gray":
        return "bg-surface text-cream-dim";
      default:
        return "bg-surface text-cream-dim";
    }
  };

  return (
    <div className="rounded-lg border border-cb-border bg-card shadow-sm overflow-hidden">
      <div className="p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-cream">
          Milestones
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-cb-border">
          <thead className="bg-surface">
            <tr>
              <th
                className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-cream-dim"
                scope="col"
              >
                Milestone
              </th>
              <th
                className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-cream-dim"
                scope="col"
              >
                Status
              </th>
              <th
                className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium uppercase tracking-wider text-cream-dim"
                scope="col"
              >
                Due Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cb-border bg-card">
            {milestones.map((milestone) => (
              <tr
                key={milestone.id}
                className="hover:bg-surface"
              >
                <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-sm font-medium text-cream">
                  {milestone.name}
                </td>
                <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-sm text-cream-dim">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                      milestone.statusColor
                    )}`}
                  >
                    {milestone.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-2 md:px-6 md:py-4 text-sm text-cream-dim">
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
