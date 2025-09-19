
const AboutHeader = () => {
  return (
    <div className="text-center mb-12">
      <h1
        className="text-5xl font-bold leading-tight tracking-tighter mb-4"
        style={{
          background: "linear-gradient(to right, #0B2545, #134E4A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Building Dreams, One Home at a Time
      </h1>
      <p className="text-gray-600 text-lg max-w-3xl mx-auto dark:text-gray-400">
        Concept Builders is a leading architectural design and construction
        platform dedicated to transforming your dream home into a reality. We
        offer a comprehensive suite of services, from initial design concepts to
        final construction, ensuring a seamless and personalized experience for
        every client.
      </p>
    </div>
  );
};

export default AboutHeader;
