import React from "react";
import AuthForm from "@/components/auth/AuthForm";

const AuthPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-ink px-6 py-12 safe-area-inset">
      <div className="w-full max-w-md lg:max-w-xl mx-auto">
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;
