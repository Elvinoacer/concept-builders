
import AboutHeader from "@/components/about/AboutHeader";
import MissionVision from "@/components/about/MissionVision";
import Team from "@/components/about/Team";

const AboutPage = () => {
  return (
    <div className="px-4 py-8 md:px-10 lg:px-20 xl:px-40 md:py-12 lg:py-16 flex flex-1 justify-center bg-gray-50 dark:bg-gray-950">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <AboutHeader />
        <MissionVision />
        <Team />
      </div>
    </div>
  );
};

export default AboutPage;
