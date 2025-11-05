import React from "react";
import AuthForm from "@/components/auth/AuthForm";

const AuthPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950 px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-4 xs:py-6 sm:py-8 md:py-10 lg:py-12 safe-area-inset">
      <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;
