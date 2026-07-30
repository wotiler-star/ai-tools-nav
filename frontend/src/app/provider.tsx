"use client";

import {
  AntdRegistry
} from "@ant-design/nextjs-registry";
import { App, ConfigProvider, theme } from "antd";
import { SWRConfig } from "swr";
import { swrFetcher } from "@/lib/api";
import zhCN from "antd/locale/zh_CN";
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

export type ThemeMode = "light" | "dark";

const ThemeCtx = createContext<{
  theme: ThemeMode;
  toggle: () => void;
}>({ theme: "light", toggle: () => {} });

/** 主题上下文：在 Header 等组件里调用 useTheme() 读取/切换 */
export const useTheme = () => useContext(ThemeCtx);

/**
 * 客户端 Provider：
 * - AntdRegistry：解决 AntD 5 + Next.js App Router 的 SSR 样式闪烁
 * - ConfigProvider：统一主题（品牌色、圆角、中文语言包、暗色算法）
 * - SWRConfig：全局数据请求配置（fetcher 走 request 层）
 * - ThemeCtx：明暗主题状态（localStorage 记忆，落到 <html data-theme>）
 */
export default function Provider({
  children
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);

  // 挂载时恢复用户主题偏好
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setIsDark(saved === "dark");
  }, []);

  // 同步到 <html data-theme> 与 localStorage
  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const token = isDark
    ? {
        colorPrimary: "#3874F7",
        colorLink: "#3874F7",
        colorInfo: "#3874F7",
        borderRadius: 8,
        fontSize: 14
      }
    : {
        colorPrimary: "#3874F7",
        colorLink: "#3874F7",
        colorInfo: "#3874F7",
        borderRadius: 8,
        fontSize: 14,
        colorTextBase: "#1f2937"
      };

  return (
    <ThemeCtx.Provider
      value={{ theme: isDark ? "dark" : "light", toggle: () => setIsDark((v) => !v) }}
    >
      <AntdRegistry>
        <ConfigProvider
          locale={zhCN}
          theme={{
            algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token
          }}
        >
          <App>
            <SWRConfig
              value={{
                fetcher: (path: string) => swrFetcher(path),
                revalidateOnFocus: false,
                dedupingInterval: 5000
              }}
            >
              {children}
            </SWRConfig>
          </App>
        </ConfigProvider>
      </AntdRegistry>
    </ThemeCtx.Provider>
  );
}
