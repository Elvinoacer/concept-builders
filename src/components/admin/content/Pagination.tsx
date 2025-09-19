
"use client";

import { motion } from "framer-motion";

const Pagination = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex items-center justify-between mt-6"
    >
      <p className="text-sm text-muted-foreground">
        Showing 1 to 5 of 50 results
      </p>
      <div className="flex items-center gap-1">
        <a
          href="#"
          className="flex size-9 items-center justify-center rounded-md hover:bg-muted text-muted-foreground"
        >
          <svg
            fill="currentColor"
            height="18px"
            viewBox="0 0 256 256"
            width="18px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
          </svg>
        </a>
        <a
          href="#"
          className="text-sm font-medium flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground"
        >
          1
        </a>
        <a
          href="#"
          className="text-sm font-medium flex size-9 items-center justify-center rounded-md hover:bg-muted text-muted-foreground"
        >
          2
        </a>
        <a
          href="#"
          className="text-sm font-medium flex size-9 items-center justify-center rounded-md hover:bg-muted text-muted-foreground"
        >
          3
        </a>
        <span className="text-sm font-medium flex size-9 items-center justify-center text-muted-foreground">
          ...
        </span>
        <a
          href="#"
          className="text-sm font-medium flex size-9 items-center justify-center rounded-md hover:bg-muted text-muted-foreground"
        >
          10
        </a>
        <a
          href="#"
          className="flex size-9 items-center justify-center rounded-md hover:bg-muted text-muted-foreground"
        >
          <svg
            fill="currentColor"
            height="18px"
            viewBox="0 0 256 256"
            width="18px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
          </svg>
        </a>
      </div>
    </motion.div>
  );
};

export default Pagination;
