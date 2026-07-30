"use client";

import { useEffect } from "react";

/**
 * 首页 Tab 切换控制器（唯一需要水合的客户端组件，自身渲染 null）。
 * 所有 Tab 面板均在服务端直出（默认面板可见、其余 hidden），
 * 本组件仅通过事件委托在点击时切换可见性，完全不依赖 SSR 内容。
 * 这样首页全部内容（含各 Tab 默认数据）在 dev/生产都能拿到完整 SSR HTML。
 */
export default function TabController() {
  useEffect(() => {
    const roots = document.querySelectorAll<HTMLElement>("[data-tabs]");
    const cleanups: Array<() => void> = [];

    roots.forEach((root) => {
      const bar = root.querySelector<HTMLElement>(".tab-bar");
      if (!bar) return;

      const onClick = (e: Event) => {
        const target = e.target as HTMLElement;
        const btn = target.closest<HTMLElement>("button[data-tab]");
        if (!btn || !root.contains(btn)) return;
        const tab = btn.dataset.tab;
        if (!tab) return;

        root.querySelectorAll<HTMLElement>("button[data-tab]").forEach((b) => {
          b.dataset.active = String(b.dataset.tab === tab);
        });
        root.querySelectorAll<HTMLElement>("[data-panel]").forEach((p) => {
          p.classList.toggle("hidden", p.dataset.panel !== tab);
        });
      };

      bar.addEventListener("click", onClick);
      cleanups.push(() => bar.removeEventListener("click", onClick));
    });

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
