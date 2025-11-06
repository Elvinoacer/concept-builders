import { contactHeader } from "@/lib/dummydata";

const ContactHeader = () => {
  return (
    <div className="mb-4 xs:mb-6 sm:mb-8">
      <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text leading-tight">
        {contactHeader.title}
      </h1>
      <p className="mt-3 xs:mt-4 text-sm xs:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
        {contactHeader.description}
      </p>
    </div>
  );
};

export default ContactHeader;
