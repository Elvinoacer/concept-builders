import React from "react";
import AuthForm from "@/components/auth/AuthForm";

const AuthPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-ink px-6 py-12 safe-area-inset">
      <AuthForm />
    </div>
  );
};

export default AuthPage;
