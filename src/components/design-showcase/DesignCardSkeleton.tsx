import { motion } from "framer-motion";

const DesignCardSkeleton = ({ index }: { index: number }) => {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-card border-2 border-cb-border shadow-xl w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
    >
      <div className="relative h-48 sm:h-56 w-full bg-surface animate-pulse overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
      <div className="p-5 xs:p-6">
        <div className="h-6 xs:h-7 w-3/4 bg-surface rounded-lg animate-pulse mb-3 opacity-60"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-surface rounded-md animate-pulse opacity-40"></div>
          <div className="h-4 w-5/6 bg-surface rounded-md animate-pulse opacity-40"></div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="h-10 w-1/3 bg-surface rounded-xl animate-pulse opacity-50"></div>
          <div className="h-10 w-1/3 bg-surface rounded-xl animate-pulse opacity-50"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default DesignCardSkeleton;
