"use client";

import { motion } from "framer-motion";

export default function PublicLoading() {
  const monoSystem =
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_50%,rgba(200,137,42,0.05),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,137,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(200,137,42,0.035)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,transparent,rgba(0,0,0,0.45)_30%,rgba(0,0,0,0.45)_70%,transparent)]" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Spinner */}
        <div className="relative h-16 w-16">
          <motion.div
            className="absolute inset-0 rounded-full border-t-2 border-gold opacity-30"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-r-2 border-gold opacity-60"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border-b-2 border-gold"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Text */}
        <motion.p
          className="mt-6 text-[11px] uppercase tracking-[0.25em] text-gold"
          style={{ fontFamily: monoSystem }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}
