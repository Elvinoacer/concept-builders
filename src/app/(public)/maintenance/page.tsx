"use client";
import Image from "next/image";

const MaintenancePage = () => {
  return (
    <main className="flex flex-1 items-center justify-center py-12 md:py-20 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="w-full max-w-lg text-center">
        <Image
          alt="Under Maintenance Illustration"
          className="mx-auto h-48 md:h-64 w-auto dark:invert"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkPkMBONXZcs5CeSgLF5eAYNN1SRdPacpcgdHtTZAkAmObRSFRuAvoQbN4tpEfWiIZraNQg5UzTqeYVqOs-fIpvv38VE7hFusBkMzCdIlCycVXAZyEIl4MWv5OYKLEyP_zNu74DHzu6reQAhwLtGQg1dZtFCSWnFDiTi61sIOzeH1hyhl09DAUn92clLEn-xV9KVTU_GE3ugdlbGasguZ1XQJvACobPQ9331HldA3qEhhiLbZ0fZNvahTvW_-N1T"
          width={256}
          height={256}
        />
        <div className="mt-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Under Maintenance
          </h1>
          <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
            We&apos;re currently performing scheduled maintenance. We&apos;ll be back
            online shortly. Thank you for your patience.
          </p>
        </div>
        <div className="mt-10">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-3 text-base font-medium text-white shadow-sm hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <span className="material-symbols-outlined mr-2"> refresh </span>
            Refresh
          </button>
        </div>
      </div>
    </main>
  );
};

export default MaintenancePage;
