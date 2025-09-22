import { versionData } from "@/lib/version-data";
import { motion } from "framer-motion";

const VersionControl = () => {
  return (
    <>
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-4">
        Version Control
      </h2>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-muted-foreground uppercase bg-muted">
            <tr>
              <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
                Version
              </th>
              <th scope="col" className="hidden md:table-cell px-2 py-2 md:px-4 md:py-3 sm:px-6">
                Date
              </th>
              <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
                Changes
              </th>
              <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {versionData.map((version, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border-b border-border hover:bg-muted"
              >
                <th
                  scope="row"
                  className="px-2 py-2 md:px-4 md:py-4 sm:px-6 font-medium text-foreground whitespace-nowrap"
                >
                  {version.version}
                </th>
                <td className="hidden md:table-cell px-2 py-2 md:px-4 md:py-4 sm:px-6 whitespace-nowrap">
                  {version.date}
                </td>
                <td className="px-2 py-2 md:px-4 md:py-4 sm:px-6 max-w-[150px] sm:max-w-[300px] truncate">
                  {version.changes}
                </td>
                <td className="px-2 py-2 md:px-4 md:py-4 sm:px-6 text-right">
                  <a
                    href="#"
                    className="font-medium text-primary hover:underline whitespace-nowrap"
                  >
                    Download
                  </a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default VersionControl;
