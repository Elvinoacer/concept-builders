"use client";

import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { customDesignHeader } from "@/lib/dummydata/customDesign";

const CustomDesignHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardHeader className="px-2 py-5 text-center sm:px-4 sm:py-8 md:px-6">
        <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-gold sm:text-[11px]">
          Bespoke Project Request
        </p>
        <CardTitle
          className="text-3xl font-light leading-[1.02] text-cream sm:text-4xl md:text-5xl lg:text-6xl"
          style={{
            fontFamily:
              'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
          }}
        >
          {customDesignHeader.title}
        </CardTitle>

        <CardDescription
          className="mx-auto mt-4 max-w-3xl px-2 text-sm leading-[1.9] text-cream-dim sm:text-base"
          style={{
            fontFamily: 'var(--font-outfit), "Outfit", sans-serif',
          }}
        >
          {customDesignHeader.description}
        </CardDescription>
      </CardHeader>
    </motion.div>
  );
};

export default CustomDesignHeader;
