"use client";

import { motion } from "framer-motion";

export default function DashboardLoading() {
  const monoSystem =
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-8">
      <div className="relative flex flex-col items-center">
        {/* Spinner */}
        <div className="relative h-12 w-12">
          <motion.div
            className="absolute inset-0 rounded-full border-t-2 border-gold opacity-30"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-1.5 rounded-full border-r-2 border-gold opacity-60"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-3 rounded-full border-b-2 border-gold"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Text */}
        <motion.p
          className="mt-6 text-[10px] uppercase tracking-[0.2em] text-gold"
          style={{ fontFamily: monoSystem }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          Loading Dashboard...
        </motion.p>
      </div>
    </div>
  );
}
