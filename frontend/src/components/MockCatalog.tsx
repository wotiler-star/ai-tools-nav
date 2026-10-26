"use client";

import { useMemo, useState } from "react";
import { Input } from "antd";
import { SearchOutlined, RightOutlined } from "@ant-design/icons";

/**
 * 通用「全量列表 / 分类页」组件（对标 ai.codefather.cn 的 /tool 列表页）。
 * 采用与 ToolCatalog 完全一致的视觉语言：
 *  - 吸顶筛选区：分类横向 tab（纯文字 + 蓝色下划线 active）+ 搜索框 + 全局标签云
 *  - 内容区：按分类分块，每块含「分类标题 + 数量 + 二级子标签行 + 全部> + 卡片网格」
 *  - 搜索 / 分类 / 子标签 三态过滤
 * 用于纯前端 mock 数据频道（MCP、Skills 等），与后端 /tool 页面视觉对齐、保持全站一致。
 */

export interface CatalogItem {
  id: number;
  name: string;
  description: string;
  category: string;
  tag?: string;
  url?: string;
}

interface MockCatalogProps {
  heroTitle: React.ReactNode;
  heroSubtitle: React.ReactNode;
  categories: string[];
  items: CatalogItem[];
  /** 取该条目的二级子标签（用于全局标签云与分类子标签行），MCP→[tag]，Skills→[] */
  getTags: (item: CatalogItem) => string[];
  /** 渲染单张卡片（含外层 <a>/<Link> 与 hover-brand-lift 样式） */
  renderCard: (item: CatalogItem) => React.ReactNode;
  /** 空状态文案 */
  placeholder?: string;
  /** 搜索框占位符（默认为「搜索」） */
  searchPlaceholder?: string;
  /** Hero 区搜索框下方的额外内容（如「写文章」快捷操作） */
  headerExtra?: React.ReactNode;
  /**
   * 数据加载中：仅在内容区显示 spinner，Hero/筛选区照常渲染。
   * （避免调用方用 `if (isLoading) return <Spin/>` 导致整页空白、首屏白闪）
   */
  loading?: boolean;
}

const BRAND = "#1777ff";

export default function MockCatalog({
  heroTitle,
  heroSubtitle,
  categories,
  items,
  getTags,
  renderCard,
  placeholder = "没有找到相关条目",
  searchPlaceholder = "搜索",
  headerExtra,
  loading = false
}: MockCatalogProps) {
  const [keyword, setKeyword] = useState("");
  const [activeCat, setActiveCat] = useState<string>("全部");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // 全局混合标签云：聚合所有条目的子标签（去重）
  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const it of items) getTags(it).forEach((t) => set.add(t));
    return Array.from(set);
  }, [items, getTags]);

  // 按分类分组（保持传入 categories 顺序，过滤掉空分类）
  const grouped = useMemo(() => {
    return categories
      .map((c) => ({
        name: c,
        tools: items.filter((t) => t.category === c)
      }))
      .filter((g) => g.tools.length > 0);
  }, [categories, items]);

  const kw = keyword.trim().toLowerCase();

  // 搜索结果（跨全部）
  const searchResults = useMemo(() => {
    if (!kw) return [];
    return items.filter(
      (t) =>
        t.name.toLowerCase().includes(kw) ||
        t.description.toLowerCase().includes(kw) ||
        (t.tag ? t.tag.toLowerCase().includes(kw) : false)
    );
  }, [kw, items]);

  // 分类 + 二级标签过滤
  const filtered = useMemo(() => {
    let list = items;
    if (activeCat !== "全部") list = list.filter((t) => t.category === activeCat);
    if (activeTag) list = list.filter((t) => getTags(t).includes(activeTag));
    return list;
  }, [items, activeCat, activeTag, getTags]);

  const isFiltered = activeCat !== "全部" || !!activeTag;

  const selectCat = (c: string) => {
    setActiveCat(c);
    setActiveTag(null);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const selectTag = (c: string, tag: string) => {
    setActiveCat(c);
    setActiveTag(tag);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const selectGlobalTag = (tag: string) => {
    setActiveCat("全部");
    setActiveTag(tag);
  };
  const clearFilter = () => {
    setActiveCat("全部");
    setActiveTag(null);
  };

  const activeCatName = activeCat;
  const filteredTitle = activeTag
    ? `${activeCatName} / ${activeTag}`
    : activeCatName === "全部"
    ? "全部"
    : activeCatName;

  return (
    <div style={{ background: "#f5f6f8", minHeight: "100vh" }}>
      {/* ===== Hero ===== */}
      <section
        style={{
          background: "linear-gradient(135deg,#eaf1fe,#f7faff)",
          padding: "40px 16px 32px",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0, color: "#1f2937" }}>
          {heroTitle}
        </h1>
        <p style={{ color: "#6b7280", margin: "10px 0 20px" }}>{heroSubtitle}</p>
        <div style={{ display: "flex", maxWidth: 560, margin: "0 auto" }}>
          <Input
            size="large"
            allowClear
            value={keyword}
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            placeholder={searchPlaceholder}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ borderRadius: "999px 0 0 999px", borderRight: 0 }}
          />
          <button
            onClick={() => setKeyword(keyword)}
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
        </div>
        {headerExtra && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            {headerExtra}
          </div>
        )}
      </section>

      {/* ===== 吸顶筛选区：分类 tab + 全局标签云 ===== */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          // 实心不透明背景：内容滚动时被完全遮住。旧值 rgba(...,0.92)+blur 会让滚动内容半透明透出（滑动遮挡乱影）。
          background: "#f5f6f8",
          borderBottom: "1px solid #eef0f2"
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 20px 0" }}>
          {/* 分类横向 tab（纯文字 + 蓝色下划线 active） */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              marginBottom: 14,
              alignItems: "center"
            }}
          >
            <button onClick={clearFilter} style={navTabStyle(activeCat === "全部" && !activeTag)}>
              全部
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => selectCat(c)}
                style={navTabStyle(activeCat === c && !activeTag)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* 全局混合标签云（直角 chip） */}
          {allTags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                padding: "10px 0 14px",
                borderTop: "1px dashed #e5e7eb",
                alignItems: "center"
              }}
            >
              <button onClick={clearFilter} style={cloudChipStyle(activeCat === "全部" && !activeTag)}>
                全部
              </button>
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => selectGlobalTag(t)}
                  style={cloudChipStyle(activeTag === t && activeCat === "全部")}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== 内容区 ===== */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 20px 60px" }}>
        {loading ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <span className="spinner" />
          </div>
        ) : kw ? (
          <section>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>“{keyword}” 的搜索结果</h2>
              <span style={{ color: "#9ca3af", fontSize: 13 }}>共 {searchResults.length} 个</span>
            </div>
            {searchResults.length === 0 ? (
              <EmptyHint text={placeholder} />
            ) : (
              <div style={gridStyle}>{searchResults.map((it) => renderCard(it))}</div>
            )}
          </section>
        ) : isFiltered ? (
          <section>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>{filteredTitle}</h2>
              <button
                onClick={clearFilter}
                style={{
                  border: "none",
                  background: "transparent",
                  color: BRAND,
                  cursor: "pointer",
                  fontSize: 13
                }}
              >
                清除筛选
              </button>
            </div>
            {filtered.length === 0 ? (
              <EmptyHint text={placeholder} />
            ) : (
              <div style={gridStyle}>{filtered.map((it) => renderCard(it))}</div>
            )}
          </section>
        ) : (
          // 全部分类分块
          grouped.map(({ name, tools }) => {
            const subTags = Array.from(
              new Set(tools.flatMap((t) => getTags(t)))
            );
            return (
              <section
                key={name}
                style={{ marginBottom: 36, scrollMarginTop: 130 }}
              >
                <div style={sectionHeaderStyle}>
                  <h2 style={sectionTitleStyle}>
                    {name}
                    <span
                      style={{
                        marginLeft: 10,
                        fontSize: 13,
                        fontWeight: 400,
                        color: "#9ca3af"
                      }}
                    >
                      {tools.length}
                    </span>
                  </h2>
                  <button
                    onClick={() => selectCat(name)}
                    style={{
                      color: BRAND,
                      fontSize: 13,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 2,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer"
                    }}
                  >
                    全部 <RightOutlined style={{ fontSize: 11 }} />
                  </button>
                </div>

                {/* 该分类的二级子标签行 */}
                {subTags.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 4,
                      marginBottom: 14,
                      alignItems: "center"
                    }}
                  >
                {subTags.map((t) => {
                  const active = !!activeTag && activeCat === name && activeTag === t;
                      return (
                        <button
                          key={t}
                          onClick={() => selectTag(name, t)}
                          style={sectionTagStyle(active)}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div style={gridStyle}>{tools.map((it) => renderCard(it))}</div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div
      style={{
        textAlign: "center",
        color: "#9ca3af",
        fontSize: 14,
        padding: "60px 0"
      }}
    >
      {text}
    </div>
  );
}

/* ===== 样式（与 ToolCatalog 对齐） ===== */
function navTabStyle(active: boolean): React.CSSProperties {
  return {
    padding: "6px 12px",
    border: "none",
    background: "transparent",
    color: active ? BRAND : "#4b5563",
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
    border: active ? `1px solid ${BRAND}` : "1px solid #e5e7eb",
    background: active ? "#eaf1fe" : "#fff",
    color: active ? BRAND : "#6b7280",
    fontSize: 12,
    cursor: "pointer",
    lineHeight: 1.7,
    transition: "all .15s",
    whiteSpace: "nowrap"
  };
}

function sectionTagStyle(active: boolean): React.CSSProperties {
  return {
    padding: "2px 8px",
    borderRadius: 4,
    border: "none",
    background: active ? "#eaf1fe" : "transparent",
    color: active ? BRAND : "#6b7280",
    fontSize: 13,
    cursor: "pointer",
    lineHeight: 1.7,
    transition: "all .15s",
    whiteSpace: "nowrap"
  };
}

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 12
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  margin: 0,
  color: "#1f2937",
  display: "flex",
  alignItems: "center"
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: 16
};
