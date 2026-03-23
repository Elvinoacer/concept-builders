import AboutHeader from "@/components/about/AboutHeader";
import MissionVision from "@/components/about/MissionVision";
import OurValues from "@/components/about/OurValues";

const AboutPage = () => {
  return (
    <div className="px-6 lg:px-8 py-12 lg:py-16 bg-ink min-h-screen safe-area-inset">
      <div className="layout-content-container flex flex-col max-w-5xl lg:max-w-6xl mx-auto flex-1 w-full">
        <AboutHeader />
        <MissionVision />
        <OurValues />
      </div>
    </div>
  );
};

export default AboutPage;
