"use client";

import { createContext, useContext } from "react";

export type ThemeMode = "light" | "dark";

/** 主题上下文（独立模块，避免在被 Server 端 layout 引入的 provider.tsx 中导出函数） */
export const ThemeCtx = createContext<{
  theme: ThemeMode;
  toggle: () => void;
}>({ theme: "light", toggle: () => {} });

/** 主题上下文：在 Header 等客户端组件里调用 useTheme() 读取/切换 */
export const useTheme = () => useContext(ThemeCtx);
