import { designs } from "@/lib/designs";

const CostEstimate = ({ design }: { design: (typeof designs)[0] }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cost Estimate</h2>
      <p className="text-gray-600 dark:text-gray-400">{design.cost_estimate}</p>
    </div>
  );
};

export default CostEstimate;