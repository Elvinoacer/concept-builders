"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Toaster } from "sonner";
import type { Socket } from "socket.io-client";

const CartSync = dynamic(
  () => import("@/components/cart/CartSync").then((mod) => mod.CartSync),
  { ssr: false },
);

const ImpersonationBanner = dynamic(
  () => import("@/components/admin/ImpersonationBanner"),
  { ssr: false },
);

// Create a SocketContext
interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | null>(null);

// Custom hook to use the socket
export const useSocket = () => {
  return useContext(SocketContext);
};

function SocketProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const isSocketEnabledRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/notifications");

  useEffect(() => {
    if (session?.error === "UserNotFound") {
      signOut({ callbackUrl: "/auth?error=account-deleted" });
    }
  }, [session?.error]);

  useEffect(() => {
    let mounted = true;
    let cleanupSocket: (() => void) | null = null;

    if (!isSocketEnabledRoute) {
      setOnlineUsers([]);
      setSocket(null);
      return;
    }

    if (session?.user?.id) {
      (async () => {
        const { getSocket, disconnectSocket } = await import("@/lib/socket");
        if (!mounted) return;

        const newSocket = getSocket(session.user.id as string);
        if (!newSocket) {
          setSocket(null);
          return;
        }

        setSocket(newSocket);

        const handleCurrentOnlineUsers = (users: string[]) => {
          setOnlineUsers(users);
        };

        const handleUserOnline = (userId: string) => {
          setOnlineUsers((prevUsers) => [...prevUsers, userId]);
        };

        const handleUserOffline = (userId: string) => {
          setOnlineUsers((prevUsers) =>
            prevUsers.filter((user) => user !== userId),
          );
        };

        const handleConnect = () => {
          newSocket.emit("join", session.user.id);
        };

        newSocket.on("currentOnlineUsers", handleCurrentOnlineUsers);
        newSocket.on("userOnline", handleUserOnline);
        newSocket.on("userOffline", handleUserOffline);
        newSocket.on("connect", handleConnect);

        cleanupSocket = () => {
          newSocket.off("currentOnlineUsers", handleCurrentOnlineUsers);
          newSocket.off("userOnline", handleUserOnline);
          newSocket.off("userOffline", handleUserOffline);
          newSocket.off("connect", handleConnect);
          disconnectSocket();
          if (mounted) {
            setSocket(null);
          }
        };
      })();
    }

    return () => {
      mounted = false;
      cleanupSocket?.();
    };
  }, [isSocketEnabledRoute, session?.user?.id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isLandingPage = pathname === "/";

  const showCartSync = pathname !== "/" && !pathname.startsWith("/auth");
  const showImpersonationBanner =
    pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  if (isLandingPage) {
    return (
      <>
        {children}
        <Toaster
          richColors
          toastOptions={{
            style: {
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            },
            classNames: {
              toast: "bg-card text-cream",
              title: "text-sm font-semibold",
              description: "text-sm",
              actionButton: "bg-gold text-ink",
              cancelButton: "bg-muted text-cream",
            },
          }}
        />
      </>
    );
  }

  return (
    <SessionProvider>
      <SocketProvider>
        {showCartSync ? <CartSync /> : null}
        {showImpersonationBanner ? <ImpersonationBanner /> : null}
        {children}
        <Toaster
          richColors
          toastOptions={{
            style: {
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            },
            classNames: {
              toast: "bg-card text-cream",
              title: "text-sm font-semibold",
              description: "text-sm",
              actionButton: "bg-gold text-ink",
              cancelButton: "bg-muted text-cream",
            },
          }}
        />
      </SocketProvider>
    </SessionProvider>
  );
}
