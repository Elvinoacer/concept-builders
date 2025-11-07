// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import Image from "next/image";
// import { signOut } from "next-auth/react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";

// const navSections = [
//   {
//     title: "Main",
//     links: [
//       { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
//       {
//         href: "/dashboard/purchases",
//         label: "My Purchases",
//         icon: "shopping_bag",
//       },
//       {
//         href: "/dashboard/projects",
//         label: "Projects",
//         icon: "business_center",
//       },
//       { href: "/dashboard/wishlist", label: "Wishlist", icon: "favorite" },
//     ],
//   },
//   {
//     title: "Tools",
//     links: [
//       { href: "/designs", label: "Browse Designs", icon: "search" },
//       { href: "/custom-design", label: "Custom Design", icon: "edit" },
//     ],
//   },
//   {
//     title: "Communication",
//     links: [
//       { href: "/dashboard/messages", label: "Messages", icon: "chat" },
//       {
//         href: "/dashboard/notifications",
//         label: "Notifications",
//         icon: "notifications",
//       },
//     ],
//   },
// ];

// const bottomLinks = [
//   { href: "/dashboard/settings", label: "Settings", icon: "settings" },
//   { href: "/dashboard/help", label: "Help and Support", icon: "help" },
//   { href: "/dashboard/feedback", label: "Feedback", icon: "campaign" },
//   { href: "/dashboard/my-feedback", label: "My Feedback", icon: "reviews" },
// ];

// interface SidebarProps {
//   isSidebarOpen: boolean;
//   setIsSidebarOpen: (isOpen: boolean) => void;
//   isMobile: boolean;
//   sidebarWidth: number;
//   setSidebarWidth: (width: number) => void;
// }

// const Sidebar = ({
//   isSidebarOpen,
//   setIsSidebarOpen,
//   isMobile,
//   sidebarWidth,
//   setSidebarWidth,
// }: SidebarProps) => {
//   const pathname = usePathname();
//   const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
//     {}
//   );

//   // Calculate default heights based on window height - 2/3 for top, 1/3 for bottom
//   const calculateDefaultHeights = () => {
//     const windowHeight = window.innerHeight;
//     const headerHeight = 120; // Approximate header height
//     const availableHeight = windowHeight - headerHeight - 100; // Reserve space for padding and logout

//     return {
//       scrollable: Math.floor(availableHeight * 0.67), // 2/3 of available space
//       bottom: Math.floor(availableHeight * 0.33), // 1/3 of available space
//     };
//   };

//   const [scrollableHeight, setScrollableHeight] = useState(400);
//   const [bottomSectionHeight, setBottomSectionHeight] = useState(200);
//   const [isResizingWidth, setIsResizingWidth] = useState(false);
//   const [isResizingScrollable, setIsResizingScrollable] = useState(false);
//   const [isResizingBottom, setIsResizingBottom] = useState(false);

//   const sidebarRef = useRef<HTMLDivElement>(null);
//   const resizeWidthRef = useRef<HTMLDivElement>(null);
//   const resizeScrollableRef = useRef<HTMLDivElement>(null);
//   const resizeBottomRef = useRef<HTMLDivElement>(null);

//   // Set default heights on mount and window resize
//   useEffect(() => {
//     const setHeights = () => {
//       const defaults = calculateDefaultHeights();
//       setScrollableHeight(defaults.scrollable);
//       setBottomSectionHeight(defaults.bottom);
//     };

//     setHeights();
//     window.addEventListener("resize", setHeights);

//     return () => window.removeEventListener("resize", setHeights);
//   }, []);

//   const toggleCategory = (title: string) => {
//     setOpenCategories((prev) => ({ ...prev, [title]: !prev[title] }));
//   };

//   const handleLinkClick = () => {
//     if (isMobile) {
//       setIsSidebarOpen(false);
//     }
//   };

//   const handleLogout = async () => {
//     await signOut({ callbackUrl: "/" });
//     if (isMobile) {
//       setIsSidebarOpen(false);
//     }
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   // Width resizing handler
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isResizingWidth) return;

//       const newWidth = Math.max(200, Math.min(500, e.clientX));
//       setSidebarWidth(newWidth);
//     };

//     const handleMouseUp = () => {
//       setIsResizingWidth(false);
//     };

//     if (isResizingWidth) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//     }

//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isResizingWidth, setSidebarWidth]);

//   // Scrollable section height resizing handler
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isResizingScrollable || !sidebarRef.current) return;

//       const sidebarRect = sidebarRef.current.getBoundingClientRect();
//       const newHeight = e.clientY - sidebarRect.top - 100; // Account for header
//       const minHeight = 200;
//       const maxHeight = window.innerHeight - 250; // Reserve minimum space for bottom section

//       if (newHeight >= minHeight && newHeight <= maxHeight) {
//         setScrollableHeight(newHeight);
//       }
//     };

//     const handleMouseUp = () => {
//       setIsResizingScrollable(false);
//     };

//     if (isResizingScrollable) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//     }

//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isResizingScrollable]);

//   // Bottom section height resizing handler
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isResizingBottom || !sidebarRef.current) return;

//       const sidebarRect = sidebarRef.current.getBoundingClientRect();
//       const newHeight = sidebarRect.bottom - e.clientY - 60; // Account for logout section
//       const minHeight = 120;
//       const maxHeight = 400;

//       if (newHeight >= minHeight && newHeight <= maxHeight) {
//         setBottomSectionHeight(newHeight);
//       }
//     };

//     const handleMouseUp = () => {
//       setIsResizingBottom(false);
//     };

//     if (isResizingBottom) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//     }

//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isResizingBottom]);

//   const sidebarVariants = {
//     open: {
//       x: 0,
//       transition: {
//         type: "spring",
//         stiffness: 400,
//         damping: 40,
//       },
//     },
//     closed: {
//       x: "-100%",
//       transition: {
//         type: "spring",
//         stiffness: 400,
//         damping: 40,
//       },
//     },
//   };

//   // Reset to default sizes
//   const resetSizes = () => {
//     setSidebarWidth(280);
//     const defaults = calculateDefaultHeights();
//     setScrollableHeight(defaults.scrollable);
//     setBottomSectionHeight(defaults.bottom);
//   };

//   // Icon component for material icons
//   const Icon = ({
//     name,
//     className = "",
//   }: {
//     name: string;
//     className?: string;
//   }) => (
//     <span className={`material-symbols-outlined ${className}`}>{name}</span>
//   );

//   return (
//     <>
//       {/* Mobile Backdrop */}
//       <AnimatePresence>
//         {isSidebarOpen && isMobile && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setIsSidebarOpen(false)}
//             className="fixed inset-0 bg-black/60 dark:bg-black/80 z-40 md:hidden backdrop-blur-sm"
//           />
//         )}
//       </AnimatePresence>

//       {/* Sidebar */}
//       <motion.aside
//         ref={sidebarRef}
//         variants={sidebarVariants}
//         initial="closed"
//         animate={isSidebarOpen ? "open" : "closed"}
//         className="fixed top-0 left-0 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 z-50 md:relative md:translate-x-0"
//         style={{ width: sidebarWidth }}
//       >
//         {/* Width Resize Handle */}
//         {!isMobile && isSidebarOpen && (
//           <div
//             ref={resizeWidthRef}
//             className="absolute top-0 right-0 w-2 h-full cursor-col-resize z-10 hover:bg-blue-300/30 active:bg-blue-400/50 transition-colors group"
//             onMouseDown={(e) => {
//               e.preventDefault();
//               setIsResizingWidth(true);
//             }}
//           >
//             <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1 h-8 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
//           </div>
//         )}

//         <div className="flex flex-col h-full p-4 overflow-hidden">
//           {/* Header with Toggle Button */}
//           <div className="flex items-center justify-between gap-3 text-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700 dark:text-white flex-shrink-0">
//             <div className="flex items-center gap-3 flex-1 min-w-0">
//               <Image
//                 src="/images/concept-builders-logo-free-bg.png"
//                 alt="Concept Builders Logo"
//                 width={48}
//                 height={48}
//                 className="w-10 h-10 flex-shrink-0"
//                 priority
//               />
//               <h2 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 leading-tight truncate">
//                 Concept Builders
//               </h2>
//             </div>

//             {/* Collapse Button */}
//             {!isMobile && (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={toggleSidebar}
//                 className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
//                 title="Collapse sidebar"
//               >
//                 <ChevronLeft
//                   size={20}
//                   className="text-gray-600 dark:text-gray-400"
//                 />
//               </motion.button>
//             )}
//           </div>

//           {/* Navigation - Scrollable area with resize handle */}
//           <div className="relative" style={{ height: scrollableHeight }}>
//             {/* Scrollable Section Resize Handle */}
//             {!isMobile && isSidebarOpen && (
//               <div
//                 ref={resizeScrollableRef}
//                 className="absolute bottom-0 left-0 right-0 h-2 cursor-row-resize z-10 hover:bg-blue-300/30 active:bg-blue-400/50 transition-colors flex items-center justify-center"
//                 onMouseDown={(e) => {
//                   e.preventDefault();
//                   setIsResizingScrollable(true);
//                 }}
//               >
//                 <GripVertical size={16} className="text-gray-400 rotate-90" />
//               </div>
//             )}

//             <nav className="flex flex-col gap-3 h-full overflow-hidden hover:overflow-y-auto pr-1">
//               {navSections.map((section) => (
//                 <div key={section.title} className="flex flex-col gap-1">
//                   <button
//                     onClick={() => toggleCategory(section.title)}
//                     className="w-full flex justify-between items-center px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
//                   >
//                     <span>{section.title}</span>
//                     <Icon
//                       name={
//                         openCategories[section.title]
//                           ? "expand_less"
//                           : "expand_more"
//                       }
//                       className="text-lg transition-transform duration-200"
//                     />
//                   </button>

//                   <AnimatePresence>
//                     {openCategories[section.title] && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         exit={{ opacity: 0, height: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="flex flex-col gap-1 overflow-hidden"
//                       >
//                         {section.links.map((link) => {
//                           const isActive =
//                             pathname === link.href ||
//                             pathname.startsWith(link.href + "/");
//                           return (
//                             <Link
//                               key={link.href}
//                               href={link.href}
//                               onClick={handleLinkClick}
//                               className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
//                                 isActive
//                                   ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/25"
//                                   : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
//                               }`}
//                             >
//                               <Icon
//                                 name={link.icon}
//                                 className="text-xl flex-shrink-0"
//                               />
//                               <span className="leading-tight flex-1">
//                                 {link.label}
//                               </span>
//                               {isActive && (
//                                 <motion.span
//                                   initial={{ scale: 0 }}
//                                   animate={{ scale: 1 }}
//                                   className="w-2 h-2 bg-white rounded-full"
//                                 />
//                               )}
//                             </Link>
//                           );
//                         })}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               ))}
//             </nav>
//           </div>

//           {/* Bottom Links - Resizable section */}
//           <div
//             className="relative flex flex-col gap-1 border-t border-gray-200 dark:border-gray-700 pt-3 flex-shrink-0"
//             style={{ height: bottomSectionHeight }}
//           >
//             {/* Bottom Section Resize Handle */}
//             {!isMobile && isSidebarOpen && (
//               <div
//                 ref={resizeBottomRef}
//                 className="absolute top-0 left-0 right-0 h-2 cursor-row-resize z-10 hover:bg-blue-300/30 active:bg-blue-400/50 transition-colors flex items-center justify-center"
//                 onMouseDown={(e) => {
//                   e.preventDefault();
//                   setIsResizingBottom(true);
//                 }}
//               >
//                 <GripVertical size={16} className="text-gray-400 rotate-90" />
//               </div>
//             )}

//             <div className="h-full overflow-hidden hover:overflow-y-auto pr-1">
//               {bottomLinks.map((link) => {
//                 const isActive = pathname === link.href;
//                 return (
//                   <Link
//                     key={link.href}
//                     href={link.href}
//                     onClick={handleLinkClick}
//                     className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 mb-1 ${
//                       isActive
//                         ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/25"
//                         : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
//                     }`}
//                   >
//                     <Icon name={link.icon} className="text-xl flex-shrink-0" />
//                     <span className="leading-tight flex-1">{link.label}</span>
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Logout Button */}
//           <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 w-full group"
//             >
//               <Icon name="logout" className="text-xl flex-shrink-0" />
//               <span className="leading-tight flex-1 text-left">Logout</span>
//             </button>
//           </div>

//           {/* Quick Controls */}
//           {!isMobile && isSidebarOpen && (
//             <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={resetSizes}
//                 className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
//                 title="Reset to default sizes"
//               >
//                 Reset Sizes
//               </button>
//               <div className="text-xs text-gray-400">
//                 {Math.round(scrollableHeight)}px /{" "}
//                 {Math.round(bottomSectionHeight)}px
//               </div>
//             </div>
//           )}
//         </div>
//       </motion.aside>

//       {/* Collapsed Sidebar Toggle Button */}
//       {!isSidebarOpen && !isMobile && (
//         <motion.button
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           onClick={toggleSidebar}
//           className="fixed top-4 left-4 z-40 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all md:block hidden"
//           title="Expand sidebar"
//         >
//           <ChevronRight
//             size={20}
//             className="text-gray-600 dark:text-gray-400"
//           />
//         </motion.button>
//       )}
//     </>
//   );
// };

// export default Sidebar;

"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";

const navSections = [
  {
    title: "Main",
    links: [
      { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
      {
        href: "/dashboard/purchases",
        label: "My Purchases",
        icon: "shopping_bag",
      },
      {
        href: "/dashboard/projects",
        label: "Projects",
        icon: "business_center",
      },
      { href: "/dashboard/wishlist", label: "Wishlist", icon: "favorite" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/designs", label: "Browse Designs", icon: "search" },
      { href: "/custom-design", label: "Custom Design", icon: "edit" },
    ],
  },
  {
    title: "Communication",
    links: [
      { href: "/dashboard/messages", label: "Messages", icon: "chat" },
      {
        href: "/dashboard/notifications",
        label: "Notifications",
        icon: "notifications",
      },
    ],
  },
];

const bottomLinks = [
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
  { href: "/dashboard/help", label: "Help and Support", icon: "help" },
  { href: "/dashboard/feedback", label: "Feedback", icon: "campaign" },
  { href: "/dashboard/my-feedback", label: "My Feedback", icon: "reviews" },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isMobile: boolean;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
}

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isMobile,
  sidebarWidth,
  setSidebarWidth,
}: SidebarProps) => {
  const pathname = usePathname();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );

  // Calculate default heights based on window height - 2/3 for top, 1/3 for bottom
  const calculateDefaultHeights = () => {
    const windowHeight = window.innerHeight;
    const headerHeight = 80; // Reduced header height
    const availableHeight = windowHeight - headerHeight - 80; // Less padding reserve

    return {
      scrollable: Math.floor(availableHeight * 0.67), // 2/3 of available space
      bottom: Math.floor(availableHeight * 0.33), // 1/3 of available space
    };
  };

  const [scrollableHeight, setScrollableHeight] = useState(400);
  const [bottomSectionHeight, setBottomSectionHeight] = useState(200);
  const [isResizingWidth, setIsResizingWidth] = useState(false);
  const [isResizingScrollable, setIsResizingScrollable] = useState(false);
  const [isResizingBottom, setIsResizingBottom] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeWidthRef = useRef<HTMLDivElement>(null);
  const resizeScrollableRef = useRef<HTMLDivElement>(null);
  const resizeBottomRef = useRef<HTMLDivElement>(null);

  // Set default heights on mount and window resize
  useEffect(() => {
    const setHeights = () => {
      const defaults = calculateDefaultHeights();
      setScrollableHeight(defaults.scrollable);
      setBottomSectionHeight(defaults.bottom);
    };

    setHeights();
    window.addEventListener("resize", setHeights);

    return () => window.removeEventListener("resize", setHeights);
  }, []);

  const toggleCategory = (title: string) => {
    setOpenCategories((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Width resizing handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingWidth) return;

      const newWidth = Math.max(200, Math.min(500, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingWidth(false);
    };

    if (isResizingWidth) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingWidth, setSidebarWidth]);

  // Scrollable section height resizing handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingScrollable || !sidebarRef.current) return;

      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const newHeight = e.clientY - sidebarRect.top - 80; // Reduced header allowance
      const minHeight = 200;
      const maxHeight = window.innerHeight - 200; // Less reserve space

      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setScrollableHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizingScrollable(false);
    };

    if (isResizingScrollable) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingScrollable]);

  // Bottom section height resizing handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingBottom || !sidebarRef.current) return;

      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const newHeight = sidebarRect.bottom - e.clientY - 60;
      const minHeight = 120;
      const maxHeight = 350;

      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setBottomSectionHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizingBottom(false);
    };

    if (isResizingBottom) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingBottom]);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  // Reset to default sizes
  const resetSizes = () => {
    setSidebarWidth(280);
    const defaults = calculateDefaultHeights();
    setScrollableHeight(defaults.scrollable);
    setBottomSectionHeight(defaults.bottom);
  };

  // Icon component for material icons
  const Icon = ({
    name,
    className = "",
  }: {
    name: string;
    className?: string;
  }) => (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        variants={sidebarVariants}
        initial="closed"
        animate={isSidebarOpen ? "open" : "closed"}
        className="h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 z-50 md:relative md:translate-x-0 fixed top-0 left-0"
        style={{ width: sidebarWidth }}
      >
        {/* Width Resize Handle */}
        {!isMobile && isSidebarOpen && (
          <div
            ref={resizeWidthRef}
            className="absolute top-0 right-0 w-2 h-full cursor-col-resize z-10 hover:bg-blue-300/30 active:bg-blue-400/50 transition-colors group"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizingWidth(true);
            }}
          >
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1 h-8 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        <div className="flex flex-col h-full p-4 overflow-hidden">
          {/* Header with Toggle Button - Reduced padding */}
          <div className="flex items-center justify-between gap-3 text-gray-800 pb-3 border-b border-gray-200 dark:border-gray-700 dark:text-white flex-shrink-0">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Image
                src="/images/concept-builders-logo-free-bg.png"
                alt="Concept Builders Logo"
                width={40}
                height={40}
                className="w-8 h-8 flex-shrink-0"
                priority
              />
              <h2 className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 leading-tight truncate">
                Concept Builders
              </h2>
            </div>

            {/* Collapse Button */}
            {!isMobile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                title="Collapse sidebar"
              >
                <ChevronLeft
                  size={18}
                  className="text-gray-600 dark:text-gray-400"
                />
              </motion.button>
            )}
          </div>

          {/* Navigation - Scrollable area with resize handle */}
          <div className="relative" style={{ height: scrollableHeight }}>
            {/* Scrollable Section Resize Handle */}
            {!isMobile && isSidebarOpen && (
              <div
                ref={resizeScrollableRef}
                className="absolute bottom-0 left-0 right-0 h-2 cursor-row-resize z-10 hover:bg-blue-300/30 active:bg-blue-400/50 transition-colors flex items-center justify-center"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsResizingScrollable(true);
                }}
              >
                <GripVertical size={14} className="text-gray-400 rotate-90" />
              </div>
            )}

            <nav className="flex flex-col gap-2 h-full overflow-hidden hover:overflow-y-auto pr-1 pt-2">
              {navSections.map((section) => (
                <div key={section.title} className="flex flex-col gap-1">
                  <button
                    onClick={() => toggleCategory(section.title)}
                    className="w-full flex justify-between items-center px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <span>{section.title}</span>
                    <Icon
                      name={
                        openCategories[section.title]
                          ? "expand_less"
                          : "expand_more"
                      }
                      className="text-base transition-transform duration-200"
                    />
                  </button>

                  <AnimatePresence>
                    {openCategories[section.title] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-0.5 overflow-hidden mt-1"
                      >
                        {section.links.map((link) => {
                          const isActive = pathname === link.href;
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={handleLinkClick}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                isActive
                                  ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/25"
                                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                              }`}
                            >
                              <Icon
                                name={link.icon}
                                className="text-lg flex-shrink-0"
                              />
                              <span className="leading-tight flex-1 text-sm">
                                {link.label}
                              </span>
                              {isActive && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-1.5 h-1.5 bg-white rounded-full"
                                />
                              )}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>

          {/* Bottom Links - Resizable section */}
          <div
            className="relative flex flex-col gap-0.5 border-t border-gray-200 dark:border-gray-700 pt-2 flex-shrink-0"
            style={{ height: bottomSectionHeight }}
          >
            {/* Bottom Section Resize Handle */}
            {!isMobile && isSidebarOpen && (
              <div
                ref={resizeBottomRef}
                className="absolute top-0 left-0 right-0 h-2 cursor-row-resize z-10 hover:bg-blue-300/30 active:bg-blue-400/50 transition-colors flex items-center justify-center"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsResizingBottom(true);
                }}
              >
                <GripVertical size={14} className="text-gray-400 rotate-90" />
              </div>
            )}

            <div className="h-full overflow-hidden hover:overflow-y-auto pr-1">
              {bottomLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 mb-0.5 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon name={link.icon} className="text-lg flex-shrink-0" />
                    <span className="leading-tight flex-1 text-sm">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 w-full group"
            >
              <Icon name="logout" className="text-lg flex-shrink-0" />
              <span className="leading-tight flex-1 text-left text-sm">
                Logout
              </span>
            </button>
          </div>

          {/* Quick Controls */}
          {!isMobile && isSidebarOpen && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={resetSizes}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                title="Reset to default sizes"
              >
                Reset
              </button>
              <div className="text-xs text-gray-400">
                {Math.round(scrollableHeight / 100) * 100} /{" "}
                {Math.round(bottomSectionHeight / 100) * 100}
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Collapsed Sidebar Toggle Button */}
      {!isSidebarOpen && !isMobile && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all md:block hidden"
          title="Expand sidebar"
        >
          <ChevronRight
            size={18}
            className="text-gray-600 dark:text-gray-400"
          />
        </motion.button>
      )}
    </>
  );
};

export default Sidebar;
