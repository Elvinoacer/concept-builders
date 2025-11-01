import Link from "next/link";
import { motion } from "framer-motion";
import { designDetailPageData } from "@/lib/dummydata/designDetailPage";

const Breadcrumbs = ({ designName }: { designName: string }) => {
  return (
    <motion.nav
      aria-label="Breadcrumb"
      className="text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <ol className="list-none p-0 inline-flex items-center space-x-2">
        <motion.li
          className="flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/designs"
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-300 group font-medium px-3 py-2 rounded-lg hover:bg-primary/5"
            >
              <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:-translate-x-0.5">
                arrow_back
              </span>
              <span>Back to Designs</span>
            </Link>
          </motion.div>
        </motion.li>

        <motion.li
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center text-gray-300 dark:text-gray-600 mx-2">
            <span className="material-symbols-outlined">chevron_right</span>
          </div>
        </motion.li>

        <motion.li
          className="flex items-center"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
            <span className="material-symbols-outlined text-primary text-lg">
              design_services
            </span>
            <span className="text-slate-800 dark:text-white font-semibold max-w-[250px] truncate">
              {designName}
            </span>
          </div>
        </motion.li>
      </ol>
    </motion.nav>
  );
};

export default Breadcrumbs;
