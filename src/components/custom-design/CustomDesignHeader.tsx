"use client";

import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { customDesignHeader } from "@/lib/dummydata/customDesign";

const CustomDesignHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardHeader
        className="
          px-4
          py-8
          text-center
          sm:px-6
          sm:py-12
          md:px-10
        "
      >
        <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-gold sm:text-[11px]">
          Bespoke Project Request
        </p>
        <CardTitle
          className="
text-4xl
font-light
leading-tight
text-cream
sm:text-5xl
lg:text-7xl
"
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

        <div className="mt-8 flex justify-center">
          <Button
            onClick={() =>
              document.getElementById("custom-design-form")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="
              h-12
              rounded-full
              bg-gold
              px-8
              text-sm
              font-medium
              text-black
              shadow-lg
              transition-all
              hover:bg-gold/90
              hover:scale-[1.03]
              focus-visible:ring-2
              focus-visible:ring-gold
            "
          >
            Request Design
          </Button>
        </div>
      </CardHeader>
    </motion.div>
  );
};

export default CustomDesignHeader;
