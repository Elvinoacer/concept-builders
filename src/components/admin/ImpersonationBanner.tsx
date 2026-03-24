"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ImpersonationBanner = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session || !session.impersonator) {
    return null;
  }

  const handleExitImpersonation = async () => {
    const response = await fetch("/api/users/unimpersonate", {
      method: "POST",
    });
    if (response.ok) {
      router.push("/admin/users");
    }
  };

  return (
    <div className="bg-yellow-500 text-white text-center p-2">
      You are currently impersonating {session.user.name} ({session.user.email}
      ).
      <button onClick={handleExitImpersonation} className="ml-4 underline">
        Exit Impersonation
      </button>
    </div>
  );
};

export default ImpersonationBanner;
