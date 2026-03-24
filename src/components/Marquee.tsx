"use client";
import React from "react";
import { marqueeItems as dummyMarqueeItems } from "@/lib/dummydata";
import { MarqueeItem } from "@/generated/prisma/browser";

interface MarqueeProps {
  marqueeItems: MarqueeItem[];
}

const Marquee = ({ marqueeItems }: MarqueeProps) => {
  const itemsToUse = marqueeItems.length > 0 ? marqueeItems : dummyMarqueeItems;

  return (
    <section className="relative py-4 xs:py-5 sm:py-6 md:py-7 lg:py-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-y border-gray-200/60 dark:border-gray-700/50 overflow-hidden group">
      {/* Shine Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10" />

      {/* Gradient Edge Fades - Responsive widths */}
      <div className="absolute left-0 top-0 bottom-0 w-8 xs:w-12 sm:w-16 md:w-20 lg:w-24 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-20" />
      <div className="absolute right-0 top-0 bottom-0 w-8 xs:w-12 sm:w-16 md:w-20 lg:w-24 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-20" />

      <div className="relative flex">
        {/* First Marquee Row */}
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {itemsToUse.map((item, index) => (
            <div
              key={item.id || `first-${index}`}
              className="flex items-center mx-3 xs:mx-4 sm:mx-5 md:mx-6 lg:mx-8 xl:mx-10 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-xs xs:shadow-sm sm:shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white dark:hover:bg-gray-800 group/item min-h-[2.5rem] xs:min-h-[3rem]"
            >
              <div className="flex items-center justify-center w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-md xs:shadow-lg group-hover/item:shadow-xl transition-all duration-300 flex-shrink-0">
                <span className="material-symbols-outlined text-white text-sm xs:text-base sm:text-lg font-bold">
                  verified
                </span>
              </div>
              <span className="ml-2 xs:ml-3 text-sm xs:text-base sm:text-lg font-medium xs:font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-100 text-transparent bg-clip-text tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] xs:max-w-[140px] sm:max-w-[160px] md:max-w-none">
                {item.content}
              </span>
            </div>
          ))}
        </div>

        {/* Second Marquee Row (Duplicate for seamless loop) */}
        <div className="absolute top-0 flex animate-marquee2 whitespace-nowrap items-center">
          {itemsToUse.map((item, index) => (
            <div
              key={item.id || `second-${index}`}
              className="flex items-center mx-3 xs:mx-4 sm:mx-5 md:mx-6 lg:mx-8 xl:mx-10 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-xs xs:shadow-sm sm:shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white dark:hover:bg-gray-800 group/item min-h-[2.5rem] xs:min-h-[3rem]"
            >
              <div className="flex items-center justify-center w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-md xs:shadow-lg group-hover/item:shadow-xl transition-all duration-300 flex-shrink-0">
                <span className="material-symbols-outlined text-white text-sm xs:text-base sm:text-lg font-bold">
                  verified
                </span>
              </div>
              <span className="ml-2 xs:ml-3 text-sm xs:text-base sm:text-lg font-medium xs:font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-100 text-transparent bg-clip-text tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] xs:max-w-[140px] sm:max-w-[160px] md:max-w-none">
                {item.content}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pulse Animation Dots - Responsive positioning and sizing */}
      <div className="absolute bottom-1 xs:bottom-1.5 sm:bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 xs:space-x-1.5">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className="w-1 h-1 xs:w-1.5 xs:h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-60 animate-pulse"
            style={{ animationDelay: `${dot * 0.2}s` }}
          />
        ))}
      </div>

      {/* Custom animations for responsive speeds */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee2 {
          0% {
            transform: translateX(50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 40s linear infinite;
        }

        /* Faster animation on mobile for better UX */
        @media (max-width: 640px) {
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee2 {
            animation: marquee2 30s linear infinite;
          }
        }

        /* Even faster on very small screens */
        @media (max-width: 375px) {
          .animate-marquee {
            animation: marquee 25s linear infinite;
          }
          .animate-marquee2 {
            animation: marquee2 25s linear infinite;
          }
        }

        /* Slower on larger screens */
        @media (min-width: 1024px) {
          .animate-marquee {
            animation: marquee 50s linear infinite;
          }
          .animate-marquee2 {
            animation: marquee2 50s linear infinite;
          }
        }
      `}</style>
    </section>
  );
};

export default Marquee;
