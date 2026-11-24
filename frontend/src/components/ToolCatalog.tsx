"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SearchOutlined } from "@ant-design/icons";
import { AiTool, Category } from "@/types";
import { DROPDOWN_CATEGORIES, GLOBAL_TAG_CLOUD, SECTION_TABS } from "@/lib/toolCatalogAlign";

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

  // 全局混合标签云：1:1 对齐目标站线上固定的 20 个标签（tools/rea/_target_tool_live.html 实测）。
  // 旧逻辑按 categories.cloudCount 动态取，会混入「AI客服机器人/AI文字转语音/AI金融应用」等非目标站标签。
  // 目标站点击全局标签是「关键词」语义（form GET keyword），不是 cat+tag，故这里统一链到 /tool?keyword=。
  const allTags: { label: string; catId: number }[] = GLOBAL_TAG_CLOUD.map((label) => ({ label, catId: 0 }));

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
        左侧分类导航栏——1:1 对齐目标站实测（浏览器 getComputedStyle 2026-11-24）：
        外层 fixed left:0/top:50%/translateY(-50%)，内层 nav 为 rounded-lg(8px) + shadow
        双层阴影 + overflow:hidden 的卡片容器（这就是红框里看到的「边框」效果），width:109;
        选中项蓝字 #1777ff / 蓝底 #e6f4ff、14px/600、高 40px、padding 0 16px；仅 ≥1600px 显示。
      */}
      <div className="tool-sidebar" style={{ position: "fixed", left: 0, top: "50%",
        transform: "translateY(-50%)", zIndex: 10, width: 109 }}>
        <nav aria-label="工具分类导航" role="navigation" className="tool-sidebar-nav"
          style={{ borderRadius: 8, overflow: "hidden", background: "#fff",
            boxShadow: "rgba(0,0,0,.1) 0 1px 3px 0, rgba(0,0,0,.1) 0 1px 2px -1px" }}>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/tool/all/${encodeURIComponent(c.name)}`}
              role="menuitem"
              aria-current={activeCat === c.id && !activeTag ? "page" : undefined}
              className="tool-sidebar-item"
              style={sideCatStyle(activeCat === c.id && !activeTag)}
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </div>

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
          {/* 分类横向 tab：1:1 对齐目标站 antd Menu——14 项，其中 6 项带 ▾ 下拉箭头，
              悬停展开该分类的分区 tab 子项（aria-haspopup/aria-expanded 语义齐全）。 */}
          <ul className="tool-top-menu" role="menu" style={{
            display: "flex", flexWrap: "wrap", gap: 2, margin: "0 0 14px",
            padding: 0, listStyle: "none", alignItems: "center"
          }}>
            {categories.map((c) => {
              const catActive = activeCat === c.id && !activeTag;
              const subs: readonly string[] = DROPDOWN_CATEGORIES.includes(c.name as any)
                ? (SECTION_TABS[c.name] ?? [])
                : [];
              return (
                <li key={c.id} role="none" className={subs.length ? "has-sub" : ""} style={{ position: "relative" }}>
                  <Link
                    href={`/tool/all/${encodeURIComponent(c.name)}`}
                    role="menuitem"
                    aria-haspopup={subs.length ? "true" : undefined}
                    style={navTabStyle(catActive)}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      {c.name}
                      {subs.length > 0 && <ChevronDown />}
                    </span>
                  </Link>
                  {subs.length > 0 && (
                    <ul role="menu" className="tool-submenu" style={{
                      display: "none", position: "absolute", top: "100%", left: 0,
                      zIndex: 40, minWidth: 168, margin: 0, padding: "4px 0", listStyle: "none",
                      background: "#fff", border: "1px solid #f0f0f0", borderRadius: 8,
                      boxShadow: "0 6px 16px rgba(0,0,0,.08)"
                    }}>
                      {subs.map((s) => (
                        <li key={s} role="none">
                          <Link
                            href={`/tool?cat=${c.id}&tag=${encodeURIComponent(s)}`}
                            role="menuitem"
                            style={{ display: "block", padding: "6px 14px", fontSize: 13,
                              color: "#374151", textDecoration: "none", whiteSpace: "nowrap" }}
                            className="tool-submenu-item"
                          >
                            {s}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

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
                const active = keyword === t.label;
                return (
                  <Link
                    key={t.label}
                    href={`/tool?keyword=${encodeURIComponent(t.label)}`}
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


/* 目标站 antd 分类下拉箭头：size-5 opacity-70 的 chevron-down path */
function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={0}
      width={20} height={20} style={{ opacity: 0.7, flexShrink: 0 }} aria-hidden="true">
      <path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z" />
    </svg>
  );
}

/* 左侧固定分类导航项：对齐目标站（纯文字、小号、激活蓝色，无背景框） */
function sideCatStyle(active: boolean): React.CSSProperties {
  // 1:1 目标站 antd 竖排菜单项：选中蓝字#1777ff/蓝底#e6f4ff、14px/600、高40px、padding 0 16px
  return {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: 40,
    marginBottom: 4,
    boxSizing: "border-box",
    textAlign: "left",
    padding: "0 16px",
    color: active ? "#1777ff" : "#4b5563",
    background: active ? "#e6f4ff" : "transparent",
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    textDecoration: "none",
    lineHeight: "40px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  };
}
