import { motion } from "framer-motion";
import { FiDownload, FiEye } from "react-icons/fi"; // Import icons

interface File {
  id: string;
  url: string;
  type: string;
  version: number;
  isLatest: boolean;
  originalFileName: string;
  fileIdentifier: string;
  createdAt: string; // Assuming createdAt is a string from the API
}

interface VersionControlProps {
  files: File[];
}

const VersionControl = ({ files }: VersionControlProps) => {
  // Group files by fileIdentifier and then sort versions
  const groupedFiles: Record<string, File[]> = (files || []).reduce((acc, file) => {
    if (!acc[file.fileIdentifier]) {
      acc[file.fileIdentifier] = [];
    }
    acc[file.fileIdentifier].push(file);
    return acc;
  }, {});

  const truncateFileName = (name: string, length = 30) => {
    if (name.length <= length) return name;
    return `${name.substring(0, length / 2)}...${name.substring(name.length - length / 2)}`;
  };

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-4">
        File Versions
      </h2>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-muted-foreground uppercase bg-muted">
            <tr>
              <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
                File Name
              </th>
              <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
                Version
              </th>
              <th scope="col" className="hidden md:table-cell px-2 py-2 md:px-4 md:py-3 sm:px-6">
                Uploaded Date
              </th>
              <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
                Status
              </th>
              <th scope="col" className="px-2 py-2 md:px-4 md:py-3 sm:px-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedFiles).map(([fileIdentifier, versions]) => (
              // Sort versions from newest to oldest
              versions.sort((a, b) => b.version - a.version).map((file, index) => (
                <motion.tr
                  key={file.id} // Use file.id as key
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border-b border-border hover:bg-muted"
                >
                  <th
                    scope="row"
                    className="px-2 py-2 md:px-4 md:py-4 sm:px-6 font-medium text-foreground whitespace-nowrap"
                  >
                    <span title={decodeURIComponent(file.url.split('/').pop() || '')}>
                      {truncateFileName(decodeURIComponent(file.url.split('/').pop() || ''))}
                    </span>
                  </th>
                  <td className="px-2 py-2 md:px-4 md:py-4 sm:px-6 whitespace-nowrap">
                    v{file.version} {file.isLatest && <span className="text-xs text-green-500">(Latest)</span>}
                  </td>
                  <td className="hidden md:table-cell px-2 py-2 md:px-4 md:py-4 sm:px-6 whitespace-nowrap">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-2 md:px-4 md:py-4 sm:px-6 whitespace-nowrap">
                    {file.isLatest ? "Active" : "Archived"}
                  </td>
                  <td className="px-2 py-2 md:px-4 md:py-4 sm:px-6 text-right">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline whitespace-nowrap mr-2"
                    >
                      <FiEye className="inline-block w-4 h-4 mr-1" /> View
                    </a>
                    <button
                      onClick={() => handleDownload(file.url, decodeURIComponent(file.url.split('/').pop() || ''))}
                      className="font-medium text-green-500 hover:underline whitespace-nowrap"
                    >
                      <FiDownload className="inline-block w-4 h-4 mr-1" /> Download
                    </button>
                  </td>
                </motion.tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VersionControl;