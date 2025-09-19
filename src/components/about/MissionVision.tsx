
import { mission, vision } from "@/lib/about-data";

const MissionVision = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
      <div className="bg-white p-8 rounded-lg shadow-sm dark:bg-gray-800">
        <h2
          className="text-2xl font-bold leading-tight tracking-[-0.015em] mb-4"
          style={{
            background: "linear-gradient(to right, #0B2545, #134E4A)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {mission.title}
        </h2>
        <p className="text-gray-600 text-base font-normal leading-relaxed dark:text-gray-400">
          {mission.description}
        </p>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-sm dark:bg-gray-800">
        <h2
          className="text-2xl font-bold leading-tight tracking-[-0.015em] mb-4"
          style={{
            background: "linear-gradient(to right, #0B2545, #134E4A)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
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
