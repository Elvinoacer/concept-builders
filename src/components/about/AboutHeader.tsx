import { aboutHeader } from "@/lib/dummydata";

const AboutHeader = () => {
  return (
    <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-14">
      <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight xs:leading-tight sm:leading-tight tracking-tight xs:tracking-tight mb-3 xs:mb-4 sm:mb-5 text-gold">
        {aboutHeader.title}
      </h1>
      <p className="text-cream-dim text-sm xs:text-base sm:text-lg md:text-xl max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed sm:leading-normal px-2 xs:px-0">
        {aboutHeader.description}
      </p>
    </div>
  );
};

export default AboutHeader;
