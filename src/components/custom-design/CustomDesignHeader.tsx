"use client";

import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const CustomDesignHeader: React.FC = () => {
  return (
    <CardHeader
      className="
        px-4
        py-5
        sm:px-6
        sm:py-6
        md:px-10
      "
    >
      <CardTitle
        className="text-2xl font-medium text-cream"
        style={{
          fontFamily:
            'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
        }}
      >
        Project Requirements
      </CardTitle>

      <CardDescription className="mt-2 text-sm text-cream-dim">
        Provide your project details and our architects will prepare a tailored
        proposal.
      </CardDescription>
    </CardHeader>
  );
};

export default CustomDesignHeader;
