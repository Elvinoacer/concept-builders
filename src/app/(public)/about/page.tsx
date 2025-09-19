
import AboutHeader from "@/components/about/AboutHeader";
import MissionVision from "@/components/about/MissionVision";
import Team from "@/components/about/Team";

const AboutPage = () => {
  return (
    <div className="px-40 flex flex-1 justify-center py-16 bg-gray-50 dark:bg-gray-950">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <AboutHeader />
        <MissionVision />
        <Team />
      </div>
    </div>
  );
};

export default AboutPage;
