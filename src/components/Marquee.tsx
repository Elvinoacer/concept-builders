import React from "react";
import { marqueeItems as dummyMarqueeItems } from "@/lib/dummydata";
import { MarqueeItem } from "@/generated/prisma";

interface MarqueeProps {
  marqueeItems: MarqueeItem[];
}

const Marquee = ({ marqueeItems }: MarqueeProps) => {
  const itemsToUse = marqueeItems.length > 0 ? marqueeItems : dummyMarqueeItems;

  return (
    <section className="relative py-6 md:py-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-y border-gray-200/60 dark:border-gray-700/50 overflow-hidden group">
      {/* Shine Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-10" />

      {/* Gradient Edge Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-20" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-20" />

      <div className="relative flex">
        {/* First Marquee Row */}
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {itemsToUse.map((item, index) => (
            <div
              key={item.id || `first-${index}`}
              className="flex items-center mx-6 md:mx-8 lg:mx-10 px-3 py-2 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-white dark:hover:bg-gray-800 group/item"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg group-hover/item:shadow-xl transition-shadow duration-300">
                <span className="material-symbols-outlined text-white text-lg font-bold">
                  verified
                </span>
              </div>
              <span className="ml-3 text-base md:text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-100 text-transparent bg-clip-text tracking-tight">
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
              className="flex items-center mx-6 md:mx-8 lg:mx-10 px-3 py-2 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-white dark:hover:bg-gray-800 group/item"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg group-hover/item:shadow-xl transition-shadow duration-300">
                <span className="material-symbols-outlined text-white text-lg font-bold">
                  verified
                </span>
              </div>
              <span className="ml-3 text-base md:text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-100 text-transparent bg-clip-text tracking-tight">
                {item.content}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pulse Animation Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-60 animate-pulse"
            style={{ animationDelay: `${dot * 0.2}s` }}
          />
        ))}
      </div>
    </section>
  );
};

export default Marquee;
