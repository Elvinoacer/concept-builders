import { terms } from "@/lib/terms-data";

const TermsPage = () => {
  return (
    <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-10 text-center">
          <h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-slate-900 to-teal-900 bg-clip-text text-transparent dark:from-slate-200 dark:to-teal-400"
          >
            Terms of Service
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="space-y-6 md:space-y-8 rounded-lg bg-white dark:bg-gray-800 p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 sm:p-12">
          {terms.map((section, index) => (
            <section key={index} className="space-y-4">
              <h2
                className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-900 to-teal-900 bg-clip-text text-transparent dark:from-slate-200 dark:to-teal-400"
              >
                {section.title}
              </h2>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TermsPage;
