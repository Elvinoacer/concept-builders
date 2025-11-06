import { contactInfo } from "@/lib/dummydata";

const ContactInfo = () => {
  return (
    <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8">
      {contactInfo.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-3 xs:gap-4 group hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 xs:p-4 rounded-xl transition-colors duration-200"
        >
          {/* Icon Container */}
          <div className="flex size-8 xs:size-10 sm:size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-white group-hover:scale-110 transition-transform duration-200 shadow-sm">
            <span className="material-symbols-outlined text-lg xs:text-xl">
              {item.icon}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base xs:text-lg font-semibold text-gray-800 dark:text-white mb-1 xs:mb-2">
              {item.title}
            </h3>
            {item.title === "Live Chat" ? (
              <a
                href="https://wa.me/254741360865"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors text-sm xs:text-base break-words"
              >
                {item.value}
              </a>
            ) : item.title === "Phone" ? (
              <a
                href="tel:254741360865"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors text-sm xs:text-base"
              >
                {item.value}
              </a>
            ) : item.title === "Email" ? (
              <a
                href="mailto:support@conceptbuilders.com"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors text-sm xs:text-base break-words"
              >
                {item.value}
              </a>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm xs:text-base leading-relaxed">
                {item.value}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactInfo;
