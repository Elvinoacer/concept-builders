
import { contactInfo } from "@/lib/contact-data";

const ContactInfo = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      {contactInfo.map((item, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="flex size-10 md:size-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-primary dark:bg-gray-800 dark:text-primary">
            <span className="material-symbols-outlined">{item.icon}</span>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white">{item.title}</h3>
            {item.title === "Live Chat" ? (
              <a href="https://wa.me/254725869507" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                {item.value}
              </a>
            ) : item.title === "Phone" ? (
              <a href="tel:254725869507" className="text-blue-600 hover:underline dark:text-blue-400">
                {item.value}
              </a>
            ) : item.title === "Email" ? (
              <a href="mailto:support@conceptbuilders.com" className="text-blue-600 hover:underline dark:text-blue-400">
                {item.value}
              </a>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">{item.value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactInfo;
