
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactForm = () => {
  return (
    <div className="rounded-2xl bg-white p-6 md:p-10 shadow-2xl dark:bg-gray-800/50 dark:backdrop-blur-sm">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Send Us a Message
      </h2>
      <form action="#" className="space-y-6" method="POST">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2"
              htmlFor="name"
            >
              Your Name
            </label>
            <Input
              className="dark:bg-gray-700/50 dark:border-gray-600 focus:ring-blue-500"
              id="name"
              name="name"
              placeholder="Enter your name"
              type="text"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <Input
              className="dark:bg-gray-700/50 dark:border-gray-600 focus:ring-blue-500"
              id="email"
              name="email"
              placeholder="Enter your email"
              type="email"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2"
              htmlFor="phone"
            >
              Mobile Number
            </label>
            <Input
              className="dark:bg-gray-700/50 dark:border-gray-600 focus:ring-blue-500"
              id="phone"
              name="phone"
              placeholder="Enter your mobile number"
              type="tel"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2"
              htmlFor="subject"
            >
              Subject
            </label>
            <Input
              className="dark:bg-gray-700/50 dark:border-gray-600 focus:ring-blue-500"
              id="subject"
              name="subject"
              placeholder="Enter the subject"
              type="text"
            />
          </div>
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2"
            htmlFor="message"
          >
            Message
          </label>
          <Textarea
            className="dark:bg-gray-700/50 dark:border-gray-600 focus:ring-blue-500"
            id="message"
            name="message"
            placeholder="Enter your message"
            rows={5}
          />
        </div>
        <div>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white py-3 text-lg font-semibold hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105"
            type="submit"
          >
            Send Message
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
