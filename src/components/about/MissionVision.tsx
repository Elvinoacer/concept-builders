import { mission, vision } from "@/lib/dummydata";

const MissionVision = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 md:gap-12 mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-16">
      {/* Mission Card */}
      <div className="bg-card p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 rounded-lg xs:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-cb-border">
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-tight mb-3 xs:mb-4 text-gold">
          {mission.title}
        </h2>
        <p className="text-cream-dim text-sm xs:text-base font-normal leading-relaxed xs:leading-relaxed">
          {mission.description}
        </p>
      </div>

      {/* Vision Card */}
      <div className="bg-card p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 rounded-lg xs:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-cb-border">
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-tight mb-3 xs:mb-4 text-gold">
          {vision.title}
        </h2>
        <p className="text-cream-dim text-sm xs:text-base font-normal leading-relaxed xs:leading-relaxed">
          {vision.description}
        </p>
      </div>
    </div>
  );
};

export default MissionVision;
