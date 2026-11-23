"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SearchOutlined } from "@ant-design/icons";
import { AiTool, Category } from "@/types";

const BRAND = "#3874F7";

/**
 * /tool 工具大全页「交互壳」（客户端组件）。
 * 卡片网格本身由服务端组件 ToolGrid 直出并作为 children 注入（SSR/SEO 友好）；
 * 本组件只负责：顶部搜索框（原生 form，无需 JS 即可提交）、分类/标签导航（<Link>，URL 驱动、可爬取）、
 * 侧边栏、滚动高亮等交互。筛选通过 URL 完成，Next 客户端导航即时刷新网格。
 */
export default function ToolCatalog({
  categories = [],
  activeCat = 0,
  activeTag = "",
  keyword = "",
  children
}: {
  categories?: Category[];
  activeCat?: number;
  activeTag?: string;
  keyword?: string;
  children?: React.ReactNode;
}) {
  const [kw, setKw] = useState(keyword);

  useEffect(() => {
    setKw(keyword);
  }, [keyword]);

  // 全局混合标签云（跨分类聚合，pill chip）
  const allTags = (() => {
    const result: { label: string; catId: number }[] = [];
    for (const c of categories) {
      const quota = c.cloudCount ?? 0;
      if (!c.tags || quota <= 0) continue;
      for (let i = 0; i < Math.min(quota, c.tags.length); i++) {
        result.push({ label: c.tags[i], catId: c.id });
      }
    }
    return result;
  })();

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <h1
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0
        }}
      >
        AI 工具大全
      </h1>

      {/*
        左侧分类导航栏（对齐目标站实测：position:fixed; left:0; top:50%; translateY(-50%);
        width:109px; 透明背景无边框; 仅 ≥1600px 宽屏显示）。
        之前误删——目标站侧栏是响应式的，1440px 隐藏、≥1600px 显示（craft 引擎多宽度实测 ev_ 证据）。
      */}
      <aside className="tool-sidebar" style={{ position: "fixed", left: 0, top: "50%",
        transform: "translateY(-50%)", zIndex: 10, width: 109, padding: "0 0 0 8px" }}>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/tool/all/${encodeURIComponent(c.name)}`}
            style={sideCatStyle(activeCat === c.id && !activeTag)}
          >
            {c.name}
          </Link>
        ))}
      </aside>

      {/* 顶部导航区：搜索框 + 分类 tab + 全局标签云（sticky） */}
      <div
        style={{
          position: "sticky",
          top: 64,
          zIndex: 20,
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #eef0f2"
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 20px 0" }}>
          {/* 分类横向 tab（对齐目标站线上：无「全部」项、无 ▾，纯文字平铺） */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              marginBottom: 14,
              alignItems: "center"
            }}
          >
            {categories.map((c) => {
              const catActive = activeCat === c.id && !activeTag;
              return (
                <Link
                  key={c.id}
                  href={`/tool/all/${encodeURIComponent(c.name)}`}
                  style={navTabStyle(catActive)}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>

          {/* 搜索框（对齐目标站线上：w199 灰底圆角 md，搜索按钮 sr-only，回车提交） */}
          <form action="/tool" method="get" style={{ width: 199, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8,
              background: "#f4f4f5", border: "1px solid #e2e8f0", borderRadius: 6,
              padding: "4px 8px", height: 29, boxSizing: "border-box" }}>
              <SearchOutlined style={{ color: "#64748b", fontSize: 13, flexShrink: 0 }} />
              <input
                name="keyword"
                value={kw}
                onChange={(e) => setKw(e.target.value)}
                placeholder="在「AI工具」中搜索"
                style={{ border: "none", outline: "none", background: "transparent",
                  flex: 1, minWidth: 0, fontSize: 14, color: "#000", padding: 0 }}
              />
              <button type="submit" style={{ position: "absolute", width: 1, height: 1,
                overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
                搜索
              </button>
            </div>
          </form>

          {/* 全局混合标签云（对齐目标站线上：pill 圆角 full、灰底 #f4f4f5、13px/500） */}
          {allTags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {allTags.map((t) => {
                const active = activeTag === t.label && activeCat === t.catId;
                return (
                  <Link
                    key={`${t.catId}-${t.label}`}
                    href={`/tool?cat=${t.catId}&tag=${encodeURIComponent(t.label)}`}
                    style={cloudChipStyle(active)}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 内容区：对齐目标站线上版——无左侧栏，内容宽 1400 居中，分类 tab 下直接是分区网格 */}
      <div style={{ padding: "16px 0 60px" }}>
        <div style={{ maxWidth: 1400, width: "100%", margin: "0 auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ========== 样式 ========== */
function navTabStyle(active: boolean): React.CSSProperties {
  return {
    padding: "6px 12px",
    border: "none",
    background: "transparent",
    color: active ? BRAND : "var(--text-2)",
    fontSize: 14,
    fontWeight: active ? 600 : 500,
    cursor: "pointer",
    borderBottom: active ? `2px solid ${BRAND}` : "2px solid transparent",
    transition: "all .15s",
    lineHeight: 1.4,
    borderRadius: 0,
    whiteSpace: "nowrap"
  };
}

function cloudChipStyle(active: boolean): React.CSSProperties {
  // 对齐目标站线上：rounded-full pill、bg #f4f4f5、13px/500、ring-1 slate-200
  return {
    padding: "4px 10px",
    borderRadius: 9999,
    border: `1px solid ${active ? BRAND : "#e2e8f0"}`,
    background: active ? "var(--brand-tint)" : "#f4f4f5",
    color: active ? BRAND : "#000",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    lineHeight: 1.4,
    transition: "all .15s",
    whiteSpace: "nowrap"
  };
}


/* 左侧固定分类导航项：对齐目标站（纯文字、小号、激活蓝色，无背景框） */
function sideCatStyle(active: boolean): React.CSSProperties {
  return {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "4px 0",
    color: active ? BRAND : "#4b5563",
    fontSize: 12,
    fontWeight: active ? 600 : 400,
    textDecoration: "none",
    lineHeight: 1.5,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  };
}
