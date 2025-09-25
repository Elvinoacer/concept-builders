import { aboutHeader } from "@/lib/dummydata";

const AboutHeader = () => {
  return (
    <div className="text-center mb-8 md:mb-12">
      <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400">
        {aboutHeader.title}
      </h1>
      <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto dark:text-gray-400">
        {aboutHeader.description}
      </p>
    </div>
  );
};

export default AboutHeader;
