
import { contactInfo } from "@/lib/contact-data";

const ContactInfo = () => {
  return (
    <div className="space-y-8">
      {contactInfo.map((item, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-primary dark:bg-gray-800 dark:text-primary">
            <span className="material-symbols-outlined">{item.icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactInfo;
