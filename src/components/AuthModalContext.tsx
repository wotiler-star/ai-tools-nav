"use client";

import { createContext, useContext, useState, useCallback } from "react";

type AuthTab = "login" | "register";

interface AuthModalCtx {
  open: (tab?: AuthTab) => void;
  close: () => void;
  isOpen: boolean;
  tab: AuthTab;
  setTab: (t: AuthTab) => void;
}

const Ctx = createContext<AuthModalCtx | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [tab, setTab] = useState<AuthTab>("login");

  const open = useCallback((t: AuthTab = "login") => {
    setTab(t);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <Ctx.Provider value={{ open, close, isOpen, tab, setTab }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuthModal 必须在 AuthModalProvider 内使用");
  return ctx;
}
