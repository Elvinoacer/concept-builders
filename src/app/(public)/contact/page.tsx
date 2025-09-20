
import ContactForm from "@/components/contact/ContactForm";
import ContactHeader from "@/components/contact/ContactHeader";
import ContactInfo from "@/components/contact/ContactInfo";
import Location from "@/components/contact/Location";

const ContactPage = () => {
  return (
    <main className="flex-1 bg-gray-50 py-8 md:py-12 lg:py-16 dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col">
            <ContactHeader />
            <ContactInfo />
            <Location />
          </div>
          <ContactForm />
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
