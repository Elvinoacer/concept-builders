const BlogHeader = () => {
  return (
    <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between w-full mb-6 sm:mb-8 lg:mb-12 gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-6 lg:px-8 max-w-[100vw]">
      {/* Page Title Section */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight sm:leading-tight lg:leading-tight">
          Our Blog
        </h1>
        <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mt-2 sm:mt-3 lg:mt-4 leading-relaxed max-w-4xl">
          Discover the latest insights, tutorials, and updates from our team
        </p>
      </div>

      {/* Action Buttons/Controls Section */}
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-end gap-2 sm:gap-3 lg:gap-4 w-full xs:w-auto">
        {/* Subscribe Button */}
        <button className="inline-flex items-center justify-center px-4 xs:px-5 sm:px-6 py-2.5 sm:py-3 lg:py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium text-sm xs:text-base sm:text-lg rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] sm:min-h-[48px] order-2 xs:order-1">
          <span className="whitespace-nowrap">Subscribe</span>
        </button>

        {/* Filter/Sort Dropdown */}
        <div className="relative order-1 xs:order-2">
          <select className="appearance-none w-full xs:w-auto min-w-[140px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white py-2.5 sm:py-3 px-4 pr-8 sm:pr-10 rounded-lg text-sm xs:text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[44px] sm:min-h-[48px]">
            <option value="latest">Latest</option>
            <option value="popular">Most Popular</option>
            <option value="trending">Trending</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2 sm:right-3 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
