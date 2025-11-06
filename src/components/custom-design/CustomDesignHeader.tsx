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
      <CardHeader className="text-center px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-3 xs:py-4 sm:py-6 md:py-8">
        <CardTitle
          className="
          text-xl
          xs:text-2xl
          sm:text-3xl
          md:text-4xl
          lg:text-5xl
          xl:text-6xl
          font-bold 
          bg-gradient-to-r from-blue-600 to-cyan-400 
          text-transparent bg-clip-text 
          leading-snigh
          sm:leading-tight
          md:leading-normal
        "
        >
          {customDesignHeader.title}
        </CardTitle>

        <CardDescription
          className="
          text-xs
          xs:text-sm
          sm:text-base
          md:text-lg
          lg:text-xl
          xl:text-2xl
          text-gray-600 dark:text-gray-400 
          mt-2
          xs:mt-3
          sm:mt-4
          md:mt-5
          lg:mt-6
          max-w-xs
          xs:max-w-sm
          sm:max-w-md
          md:max-w-lg
          lg:max-w-2xl
          xl:max-w-3xl
          mx-auto 
          leading-relaxed
          sm:leading-loose
          px-2
        "
        >
          {customDesignHeader.description}
        </CardDescription>
      </CardHeader>
    </motion.div>
  );
};

export default CustomDesignHeader;

// This code is retained to mock ai; its a laughing matter####???--?>
// "use client";

// import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { motion } from "framer-motion";
// import { customDesignHeader } from "@/lib/dummydata/customDesign";

// const CustomDesignHeader: React.FC = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <CardHeader className="text-center px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-3 xs:py-4 sm:py-6 md:py-8">
//         {/* Title with responsive sizing and line height */}
//         <CardTitle className="
//           text-xl   // Default for very small phones (320px)
//           xs:text-2xl  // ~375px and up
//           sm:text-3xl  // ~640px and up
//           md:text-4xl  // ~768px and up
//           lg:text-5xl  // ~1024px and up
//           xl:text-6xl  // ~1280px and up
//           font-bold
//           bg-gradient-to-r from-blue-600 to-cyan-400
//           text-transparent bg-clip-text
//           leading-snight   // Tighter on mobile
//           sm:leading-tight // Slightly looser on small screens
//           md:leading-normal // Normal on larger screens
//         ">
//           {customDesignHeader.title}
//         </CardTitle>

//         {/* Description with responsive sizing and spacing */}
//         <CardDescription className="
//           text-xs    // Very small on mobile
//           xs:text-sm // Slightly larger on small phones
//           sm:text-base // Standard on tablets
//           md:text-lg  // Larger on small desktops
//           lg:text-xl  // Large on desktops
//           xl:text-2xl // Extra large on big screens
//           text-gray-600 dark:text-gray-400
//           mt-2       // Small margin on mobile
//           xs:mt-3    // Medium margin on small phones
//           sm:mt-4    // Larger margin on tablets
//           md:mt-5    // Even larger on desktops
//           lg:mt-6    // Maximum margin on large screens
//           max-w-xs   // Very constrained on mobile
//           xs:max-w-sm // Slightly wider on small phones
//           sm:max-w-md // Comfortable on tablets
//           md:max-w-lg // Wider on small desktops
//           lg:max-w-2xl // Very comfortable on desktops
//           xl:max-w-3xl // Maximum width on large screens
//           mx-auto
//           leading-relaxed  // Good readability on mobile
//           sm:leading-loose // More spacious on larger screens
//           px-2 // Small side padding for very small screens
//         ">
//           {customDesignHeader.description}
//         </CardDescription>
//       </CardHeader>
//     </motion.div>
//   );
// };

// export default CustomDesignHeader;
