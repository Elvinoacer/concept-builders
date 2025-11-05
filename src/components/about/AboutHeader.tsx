import { aboutHeader } from "@/lib/dummydata";

const AboutHeader = () => {
  return (
    <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-14">
      <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight xs:leading-tight sm:leading-tight tracking-tight xs:tracking-tight mb-3 xs:mb-4 sm:mb-5 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400">
        {aboutHeader.title}
      </h1>
      <p className="text-gray-600 text-sm xs:text-base sm:text-lg md:text-xl max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed sm:leading-normal dark:text-gray-400 px-2 xs:px-0">
        {aboutHeader.description}
      </p>
    </div>
  );
};

export default AboutHeader;
