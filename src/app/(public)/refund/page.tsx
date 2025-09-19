import { refund } from "@/lib/refund-data";

const RefundPage = () => {
  return (
    <main className="flex flex-1 justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 md:p-12">
          <div className="mb-10 text-center">
            <h1
              className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-slate-900 to-teal-900 bg-clip-text text-transparent dark:from-slate-200 dark:to-teal-400"
            >
              Refund Policy
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="space-y-8 text-base leading-7 text-gray-600 dark:text-gray-400">
            <p>
              At Concept Builders, we strive to provide exceptional
              architectural designs and construction services. However, we
              understand that circumstances may arise where a refund is
              necessary. This Refund Policy outlines the terms and conditions
              under which refunds may be issued for our services.
            </p>
            {refund.map((section, index) => (
              <section key={index}>
                <h2
                  className="text-2xl font-bold tracking-tight mb-4 bg-gradient-to-r from-slate-900 to-teal-900 bg-clip-text text-transparent dark:from-slate-200 dark:to-teal-400"
                >
                  {section.title}
                </h2>
                <div
                  dangerouslySetInnerHTML={{ __html: section.content }}
                  className="space-y-4 list-disc list-inside"
                />
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default RefundPage;
