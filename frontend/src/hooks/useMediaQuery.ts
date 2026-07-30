import { useEffect, useState } from "react";

/**
 * 响应式媒体查询 Hook。
 * 用于客户端组件做移动端条件渲染（如 Header 抽屉导航、工具详情操作行换行），
 * 避免给内联样式写媒体查询（内联样式无法承载 @media）。
 *
 * 例：const isMobile = useMediaQuery("(max-width: 767px)");
 */
export function useMediaQuery(query: string): boolean {
  // 默认 false，避免 SSR/首屏闪烁时误判；挂载后在 effect 中读取真实值
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const handler = () => setMatches(mql.matches);
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
