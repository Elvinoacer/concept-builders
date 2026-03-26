"use client";

import React from "react";
import AuthForm from "@/components/auth/AuthForm";

const AuthPage = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-ink px-6 py-12 safe-area-inset">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_80%_0%,rgba(200,137,42,0.18),transparent_62%),radial-gradient(ellipse_55%_40%_at_15%_20%,rgba(200,137,42,0.1),transparent_68%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(200,137,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,137,42,0.03)_1px,transparent_1px)] bg-[size:84px_84px] [mask-image:linear-gradient(to_bottom,transparent,rgba(0,0,0,0.55)_18%,rgba(0,0,0,0.55)_82%,transparent)]" />

      <div className="relative z-10 w-full max-w-6xl">
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;
