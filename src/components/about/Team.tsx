
import { team } from "@/lib/about-data";
import Image from "next/image";

const Team = () => {
  return (
    <div className="text-center">
      <h2
        className="text-4xl font-bold leading-tight tracking-tighter mb-10"
        style={{
          background: "linear-gradient(to right, #0B2545, #134E4A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Meet the Team
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
        {team.map((member, index) => (
          <div key={index} className="flex flex-col items-center gap-4 text-center">
            <div className="w-40 h-40">
              <Image
                src={member.image}
                alt={member.name}
                width={160}
                height={160}
                className="rounded-full shadow-lg"
              />
            </div>
            <div>
              <p className="text-gray-900 text-lg font-bold dark:text-white">{member.name}</p>
              <p className="text-primary text-sm font-medium">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-gray-600 text-lg max-w-3xl mx-auto mt-10 dark:text-gray-400">
        Our team comprises experienced architects, designers, project managers,
        and construction professionals who are passionate about creating
        exceptional homes. With a commitment to excellence and a client-centric
        approach, we work collaboratively to bring your vision to life.
      </p>
    </div>
  );
};

export default Team;
