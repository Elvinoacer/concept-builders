import AboutHeader from "@/components/about/AboutHeader";
import MissionVision from "@/components/about/MissionVision";
import OurValues from "@/components/about/OurValues";

const AboutPage = () => {
  return (
    <div className="px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 xs:py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 bg-gray-50 dark:bg-gray-950 min-h-screen safe-area-inset">
      <div className="layout-content-container flex flex-col max-w-full xs:max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto flex-1 w-full">
        <AboutHeader />
        <MissionVision />
        <OurValues />
      </div>
    </div>
  );
};

export default AboutPage;
