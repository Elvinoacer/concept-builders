"use client";
import React from "react";

const kpis = [
  {
    title: "Total Revenue",
    key: "totalSales",
    prefix: "$",
    change: "+12.5%",
    icon: "monetization_on",
    positive: true,
  },
  {
    title: "Total Visitors",
    key: "totalVisitors",
    prefix: "",
    change: "+8.2%",
    icon: "people",
    positive: true,
  },
  {
    title: "Conversion Rate",
    key: "conversionRate",
    suffix: "%",
    change: "-1.8%",
    icon: "touch_app",
    positive: false,
  },
  {
    title: "Total Orders",
    key: "totalOrders",
    prefix: "",
    change: "+5.3%",
    icon: "shopping_cart",
    positive: true,
  },
];

const KPISkeleton = () => {
  return (
    <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/80 dark:border-gray-700/80 shadow-xs sm:shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 mb-2"></div>
              <div className="h-7 sm:h-8 w-1/2 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
          <div className="h-4 w-2/3 mt-3 sm:mt-4 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
        </div>
      ))}
    </section>
  );
};

const KPIs = ({ stats }) => {
  if (!stats) {
    return <KPISkeleton />;
  }

  return (
    <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
      {kpis.map((kpi) => {
        const value = stats[kpi.key];
        const formattedValue =
          typeof value === "number" ? value.toLocaleString() : value;
        const changeIsPositive = kpi.positive;
        const changeValue = kpi.change;

        return (
          <div
            key={kpi.title}
            className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/80 dark:border-gray-700/80 shadow-xs sm:shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
          >
            {/* Main Content */}
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Icon Container */}
              <div
                className={`p-2 sm:p-3 rounded-xl transition-colors duration-300 flex-shrink-0 ${
                  changeIsPositive
                    ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/30"
                    : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30"
                }`}
              >
                <span className="material-symbols-outlined text-xl sm:text-2xl">
                  {kpi.icon}
                </span>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium truncate">
                  {kpi.title}
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 dark:text-white tracking-tight break-words">
                  {kpi.prefix}
                  {formattedValue}
                  {kpi.suffix}
                </p>
              </div>
            </div>

            {/* Change Indicator */}
            <div
              className={`flex items-center gap-1 text-xs sm:text-sm font-medium mt-3 sm:mt-4 ${
                changeIsPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              <span className="material-symbols-outlined text-base sm:text-lg">
                {changeIsPositive ? "arrow_upward" : "arrow_downward"}
              </span>
              <span className="whitespace-nowrap">
                {changeValue} vs last month
              </span>
            </div>

            {/* Progress Bar Indicator */}
            <div className="mt-2 sm:mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${
                    changeIsPositive
                      ? "bg-green-500 dark:bg-green-400"
                      : "bg-red-500 dark:bg-red-400"
                  }`}
                  style={{
                    width: changeIsPositive ? "75%" : "40%",
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default KPIs;
