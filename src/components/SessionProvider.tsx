"use client";

import { SessionProvider } from "next-auth/react";
import { AuthModalProvider } from "@/components/AuthModalContext";
import AuthModal from "@/components/AuthModal";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthModalProvider>
        {children}
        <AuthModal />
      </AuthModalProvider>
    </SessionProvider>
  );
}
