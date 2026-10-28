"use client";

import {
  AntdRegistry
} from "@ant-design/nextjs-registry";
import { App, ConfigProvider, theme } from "antd";
import { SWRConfig } from "swr";
import { swrFetcher } from "@/lib/api";
import zhCN from "antd/locale/zh_CN";
import { useEffect, useState } from "react";
import { ThemeCtx } from "@/app/theme-context";

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

  // 挂载时以 <html data-theme> 为准（该值已由 layout 的内联脚本在首屏渲染前设好），
  // 而不是从默认值 false 起步——否则暗色用户每次打开都会先闪一下白屏。
  useEffect(() => {
    setIsDark(document.documentElement.dataset.theme === "dark");
  }, []);

  // 只在值真正变化时才写回，避免挂载瞬间用默认 light 覆盖掉用户偏好
  useEffect(() => {
    const next = isDark ? "dark" : "light";
    if (document.documentElement.dataset.theme !== next) {
      document.documentElement.dataset.theme = next;
    }
    if (localStorage.getItem("theme") !== next) {
      localStorage.setItem("theme", next);
    }
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
