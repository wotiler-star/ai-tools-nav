"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "antd";
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
  const router = useRouter();

  const [kw, setKw] = useState(keyword);
  const [highlightCat, setHighlightCat] = useState<number>(0);
  const topNavRef = useRef<HTMLDivElement>(null);
  const [navH, setNavH] = useState(190);
  const sideTop = 64 + navH + 12;

  useEffect(() => {
    setKw(keyword);
  }, [keyword]);

  // 测量顶部 sticky 导航区高度，供侧栏 sticky top 与滚动高亮使用
  useEffect(() => {
    const measure = () => setNavH(topNavRef.current?.offsetHeight || 190);
    measure();
  }, []);

  // 全局混合标签云（跨分类聚合，直角 chip）
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

  // 滚动监听：当前浏览到的分类区块自动高亮
  useEffect(() => {
    const onScroll = () => {
      let cur = 0;
      for (const c of categories) {
        const el = document.getElementById(`cat-${c.id}`);
        if (el && el.getBoundingClientRect().top <= sideTop + 20) cur = c.id;
      }
      setHighlightCat(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [categories, sideTop]);

  const shownCat = activeCat || highlightCat;
  const activeCatName =
    categories.find((c) => c.id === activeCat)?.name || "";
  const filteredTitle = activeTag
    ? `${activeCatName} / ${activeTag}`
    : activeCatName || "全部 AI 工具";

  return (
    <div style={{ background: "#f5f6f8", minHeight: "100vh" }}>
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

      {/* 顶部导航区：搜索框 + 分类 tab + 全局标签云（sticky） */}
      <div
        ref={topNavRef}
        style={{
          position: "sticky",
          top: 64,
          zIndex: 20,
          background: "rgba(245,246,248,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #eef0f2"
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 20px 0" }}>
          {/* 分类横向 tab（纯文字 + 蓝色下划线 active，▾ 标注有子标签的分类） */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              marginBottom: 14,
              alignItems: "center"
            }}
          >
            <Link
              href="/tool"
              style={navTabStyle(activeCat === 0 && !activeTag)}
            >
              全部
            </Link>
            {categories.map((c) => {
              const hasTags = (c.tags || []).length > 0;
              const catActive = activeCat === c.id && !activeTag;
              return (
                <Link
                  key={c.id}
                  href={`/tool?cat=${c.id}`}
                  style={navTabStyle(catActive)}
                >
                  {c.name}
                  {hasTags && (
                    <span style={{ marginLeft: 3, fontSize: 10, opacity: 0.7 }}>
                      ▾
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* 搜索框（原生 form，GET 提交到 /tool?keyword=，无需 JS 即可筛选） */}
          <div style={{ display: "flex", maxWidth: 560, marginBottom: 14 }}>
            <form
              action="/tool"
              method="get"
              style={{ display: "flex", width: "100%" }}
            >
              <Input
                size="large"
                name="keyword"
                allowClear
                value={kw}
                prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
                placeholder="在「AI工具」中搜索"
                onChange={(e) => setKw(e.target.value)}
                style={{ borderRadius: "999px 0 0 999px", borderRight: 0 }}
              />
              <button
                type="submit"
                style={{
                  padding: "0 22px",
                  background: BRAND,
                  color: "#fff",
                  border: `1px solid ${BRAND}`,
                  borderLeft: "none",
                  borderRadius: "0 999px 999px 0",
                  fontSize: 14,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                搜索
              </button>
            </form>
          </div>

          {/* 全局混合标签云 */}
          {allTags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                padding: "8px 0 10px",
                borderTop: "1px dashed var(--chip-border)",
                alignItems: "center"
              }}
            >
              <Link
                href="/tool"
                style={cloudChipStyle(activeCat === 0 && !activeTag)}
              >
                全部
              </Link>
              {allTags.map((t) => {
                const active = activeTag === t.label && activeCat === t.catId;
                return (
                  <Link
                    key={`${t.catId}-${t.label}`}
                    href={`/tool?cat=${t.catId}&tag=${encodeURIComponent(
                      t.label
                    )}`}
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

      {/* 内容区：左侧 sticky 分类侧边栏 + 右侧工具网格（SSR 直出，children 注入） */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "20px 20px 60px",
          display: "flex",
          gap: 24,
          alignItems: "flex-start"
        }}
      >
        <aside
          style={{
            position: "sticky",
            top: sideTop,
            width: 220,
            flexShrink: 0,
            background: "var(--surface)",
            border: "1px solid var(--chip-border)",
            borderRadius: 12,
            padding: 12,
            maxHeight: `calc(100vh - ${sideTop + 16}px)`,
            overflowY: "auto"
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text-2)",
              margin: "4px 8px 10px"
            }}
          >
            分类导航
          </div>
          <Link
            href="/tool"
            style={sideCatStyle(activeCat === 0 && !activeTag)}
          >
            全部
          </Link>
          {categories.map((c) => (
            <div key={c.id}>
              <Link
                href={`/tool?cat=${c.id}`}
                style={sideCatStyle(shownCat === c.id && !activeTag)}
              >
                {c.name}
              </Link>
              {shownCat === c.id && (c.tags || []).length > 0 && (
                <div style={{ margin: "2px 0 6px 10px" }}>
                  {c.tags!.map((t) => (
                    <Link
                      key={t}
                      href={`/tool?cat=${c.id}&tag=${encodeURIComponent(t)}`}
                      style={sideTagStyle(activeTag === t && shownCat === c.id)}
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 16 }}>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                margin: 0,
                color: "var(--text-1)"
              }}
            >
              {filteredTitle}
            </h2>
          </div>
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
  return {
    padding: "2px 10px",
    borderRadius: 4,
    border: active ? `1px solid ${BRAND}` : "1px solid var(--chip-border)",
    background: active ? "var(--brand-tint)" : "var(--surface)",
    color: active ? BRAND : "var(--text-2)",
    fontSize: 12,
    cursor: "pointer",
    lineHeight: 1.7,
    transition: "all .15s",
    whiteSpace: "nowrap"
  };
}

function sideCatStyle(active: boolean): React.CSSProperties {
  return {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "8px 10px",
    marginBottom: 2,
    borderRadius: 8,
    border: "none",
    background: active ? "var(--brand-tint)" : "transparent",
    color: active ? BRAND : "var(--text-1)",
    fontSize: 14,
    fontWeight: active ? 600 : 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: "all .15s"
  };
}

function sideTagStyle(active: boolean): React.CSSProperties {
  return {
    display: "inline-block",
    padding: "2px 8px",
    margin: "0 4px 4px 0",
    borderRadius: 4,
    border: active ? `1px solid ${BRAND}` : "1px solid transparent",
    background: active ? "var(--brand-tint)" : "transparent",
    color: active ? BRAND : "var(--text-2)",
    fontSize: 12,
    cursor: "pointer",
    transition: "all .15s"
  };
}
