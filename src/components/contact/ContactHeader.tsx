
import { contactHeader } from "@/lib/dummydata";

const ContactHeader = () => {
  return (
    <div className="mb-4 md:mb-8">
      <h1
        className="text-4xl font-extrabold tracking-tighter sm:text-5xl bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text"
      >
        {contactHeader.title}
      </h1>
      <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400">
        {contactHeader.description}
      </p>
    </div>
  );
};

export default ContactHeader;
