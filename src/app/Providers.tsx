"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { Toaster } from "sonner";
import ImpersonationBanner from "@/components/admin/ImpersonationBanner";
import { CartSync } from "@/components/cart/CartSync";
import type { Socket } from "socket.io-client";

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
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (session?.error === "UserNotFound") {
      signOut({ callbackUrl: "/auth?error=account-deleted" });
    }
  }, [session?.error]);

  useEffect(() => {
    let mounted = true;
    let cleanupSocket: (() => void) | null = null;

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
  }, [session?.user?.id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SocketProvider>
        <CartSync />
        <ImpersonationBanner />
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
