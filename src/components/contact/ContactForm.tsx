"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Sending message...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(result.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  return (
    <div className="rounded-xl xs:rounded-2xl bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="text-center mb-6 xs:mb-8">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white leading-tight mb-2 xs:mb-3">
          Send Us a Message
        </h2>
        <p className="text-sm xs:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Get in touch with our team. We'll respond within 24 hours.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 xs:space-y-5 sm:space-y-6"
      >
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 sm:gap-5">
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-800 dark:text-gray-300"
              htmlFor="name"
            >
              Your Name *
            </label>
            <Input
              className="dark:bg-gray-700/50 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 text-sm xs:text-base py-2.5 xs:py-3"
              id="name"
              name="name"
              placeholder="Enter your name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-800 dark:text-gray-300"
              htmlFor="email"
            >
              Email Address *
            </label>
            <Input
              className="dark:bg-gray-700/50 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 text-sm xs:text-base py-2.5 xs:py-3"
              id="email"
              name="email"
              placeholder="Enter your email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Phone & Subject Row */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 sm:gap-5">
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-800 dark:text-gray-300"
              htmlFor="phone"
            >
              Mobile Number
            </label>
            <Input
              className="dark:bg-gray-700/50 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 text-sm xs:text-base py-2.5 xs:py-3"
              id="phone"
              name="phone"
              placeholder="Enter your mobile number"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-800 dark:text-gray-300"
              htmlFor="subject"
            >
              Subject *
            </label>
            <Input
              className="dark:bg-gray-700/50 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 text-sm xs:text-base py-2.5 xs:py-3"
              id="subject"
              name="subject"
              placeholder="Enter the subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-800 dark:text-gray-300"
            htmlFor="message"
          >
            Message *
          </label>
          <Textarea
            className="dark:bg-gray-700/50 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 text-sm xs:text-base min-h-[120px] xs:min-h-[140px] sm:min-h-[160px] resize-vertical"
            id="message"
            name="message"
            placeholder="Tell us about your project or inquiry..."
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 xs:pt-3">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white font-semibold py-3 xs:py-3.5 text-sm xs:text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed min-h-[3rem] xs:min-h-[3.5rem]"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 xs:w-5 xs:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Send Message
              </span>
            )}
          </Button>
        </div>

        {/* Required Fields Note */}
        <div className="text-center">
          <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">
            * Required fields
          </p>
        </div>
      </form>

      {/* Additional Contact Methods - Mobile Only */}
      <div className="xs:hidden mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Prefer to contact us directly?
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="https://wa.me/254741360865"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.187-3.55-8.444" />
              </svg>
              WhatsApp
            </a>
            <a
              href="tel:254741360865"
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
