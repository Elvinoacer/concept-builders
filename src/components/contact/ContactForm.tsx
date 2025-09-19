
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactForm = () => {
  return (
    <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
      <form action="#" className="space-y-6" method="POST">
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-300" htmlFor="name">
            Your Name
          </label>
          <div className="mt-1">
            <Input
              id="name"
              name="name"
              placeholder="Enter your name"
              type="text"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-300" htmlFor="email">
            Email Address
          </label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              placeholder="Enter your email"
              type="email"
            />
          </div>
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-800 dark:text-gray-300"
            htmlFor="subject"
          >
            Subject
          </label>
          <div className="mt-1">
            <Input
              id="subject"
              name="subject"
              placeholder="Enter the subject"
              type="text"
            />
          </div>
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-800 dark:text-gray-300"
            htmlFor="message"
          >
            Message
          </label>
          <div className="mt-1">
            <Textarea
              id="message"
              name="message"
              placeholder="Enter your message"
              rows={4}
            />
          </div>
        </div>
        <div>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white hover:from-blue-700 hover:to-cyan-500"
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
