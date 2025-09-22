
import { mission, vision } from "@/lib/about-data";

const MissionVision = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8 md:mb-16">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm dark:bg-gray-800">
        <h2
          className="text-xl md:text-2xl font-bold leading-tight tracking-[-0.015em] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400"
        >
          {mission.title}
        </h2>
        <p className="text-gray-600 text-base font-normal leading-relaxed dark:text-gray-400">
          {mission.description}
        </p>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-sm dark:bg-gray-800">
        <h2
          className="text-2xl font-bold leading-tight tracking-[-0.015em] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400"
        >
          {vision.title}
        </h2>
        <p className="text-gray-600 text-base font-normal leading-relaxed dark:text-gray-400">
          {vision.description}
        </p>
      </div>
    </div>
  );
};

export default MissionVision;
