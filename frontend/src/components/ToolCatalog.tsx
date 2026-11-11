"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { Input } from "antd";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonGrid } from "@/components/Loading";
import { SearchOutlined, RightOutlined } from "@ant-design/icons";
import { swrFetcher } from "@/lib/api";
import ToolCard from "@/components/ToolCard";
import RecentTools from "@/components/RecentTools";
import { AiTool, BaseResponse, BaseResponsePage, Category } from "@/types";

const BRAND = "#3874F7";

export default function ToolCatalog({
  initialTools = [],
  initialCategories = [],
  initialKeyword = ""
}: {
  initialTools?: AiTool[];
  initialCategories?: Category[];
  initialKeyword?: string;
}) {
  const router = useRouter();
  // 初始 keyword 由服务端 searchParams 注入（避免 useSearchParams 触发 SSR 降级）。
  const urlKw = initialKeyword || "";

  const [keyword, setKeyword] = useState(urlKw);
  const [activeCat, setActiveCat] = useState<number>(0);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // 顶部 sticky 导航区（分类行 + 搜索框 + 标签云）实际高度。
  // 侧边栏 sticky top 必须大于 Header(64) + 导航区高度，否则滚动时侧栏顶部会被导航遮住。
  const topNavRef = useRef<HTMLDivElement>(null);
  const [navH, setNavH] = useState(190);
  const sideTop = 64 + navH + 12;

  useEffect(() => {
    setKeyword(urlKw);
  }, [urlKw]);

  // 分类：服务端直出数据作为 fallbackData，保证 HTML 首屏即含分类（SSR），
  // 客户端水合后再静默 revalidate，与后端保持一致。
  const { data: catRes } = useSWR<BaseResponse<Category[]>>(
    "/category/list",
    swrFetcher,
    {
      fallbackData: { code: 0, data: initialCategories, message: "" } as BaseResponse<Category[]>
    }
  );
  const categories = useMemo(
    () => (catRes?.data || initialCategories).slice().sort((a, b) => (a.sort || 0) - (b.sort || 0)),
    [catRes]
  );

  // 测量顶部 sticky 导航区实际高度（分类数据加载完成后高度会变，故依赖 categories）
  useEffect(() => {
    const measure = () => setNavH(topNavRef.current?.offsetHeight || 190);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [categories]);

  // 一次性拉取全部工具：服务端直出数据作为 fallbackData，HTML 首屏即渲染全部工具卡（SEO 友好），
  // 客户端水合后静默 revalidate 保持一致。fallbackData 已存在 → isLoading 初始为 false，直接出卡片而非骨架屏。
  const { data: toolRes, isLoading } = useSWR<BaseResponsePage<AiTool>>(
    "/ai_tool/list/page?categoryId=0&pageSize=1000",
    swrFetcher,
    {
      fallbackData: {
        code: 0,
        message: "",
        data: {
          records: initialTools,
          total: initialTools.length,
          size: initialTools.length,
          current: 1,
          pages: 1
        }
      } as BaseResponsePage<AiTool>
    }
  );
  const allTools = useMemo(() => toolRes?.data?.records || initialTools, [toolRes]);

  // 全局混合标签云：每个分类按 cloudCount 配额从 tags 数组前 N 个取（对齐目标红框第 3 行约 20 个精选）
  const allTags = useMemo(() => {
    const result: string[] = [];
    for (const c of categories) {
      const quota = c.cloudCount ?? 0;
      if (!c.tags || quota <= 0) continue;
      for (let i = 0; i < Math.min(quota, c.tags.length); i++) {
        result.push(c.tags[i]);
      }
    }
    return result;
  }, [categories]);

  const isFiltered = activeCat > 0 || !!activeTag;
  // 滚动高亮分类（仅驱动高亮样式，绝不参与筛选/渲染分支 —— activeCat 是用户点击筛选，
  // 二者必须分离，否则滚动监听会把页面"锁"进单分类过滤视图，内容塌缩、无法继续下滚）
  const [highlightCat, setHighlightCat] = useState<number>(0);
  const shownCat = isFiltered ? activeCat : highlightCat;

  // 搜索结果（跨全部工具）
  const kw = keyword.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!kw) return [];
    return allTools.filter(
      (t) =>
        t.name.toLowerCase().includes(kw) ||
        t.description.toLowerCase().includes(kw) ||
        t.tags.some((tag) => tag.toLowerCase().includes(kw))
    );
  }, [kw, allTools]);

  // 按分类 + 二级标签过滤
  const filteredTools = useMemo(() => {
    let list = allTools;
    if (activeCat > 0) list = list.filter((t) => t.categoryId === activeCat);
    if (activeTag) list = list.filter((t) => t.tags.includes(activeTag));
    return list;
  }, [allTools, activeCat, activeTag]);

  // 按分类分组
  const grouped = useMemo(() => {
    return categories.map((c) => ({
      cat: c,
      tools: allTools.filter((t) => t.categoryId === c.id)
    }));
  }, [categories, allTools]);

  // 交互
  const selectCat = (id: number) => {
    setActiveCat(id);
    setActiveTag(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const selectTag = (catId: number, tag: string) => {
    setActiveCat(catId);
    setActiveTag(tag);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const selectGlobalTag = (tag: string) => {
    setActiveCat(0);
    setActiveTag(tag);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const clearFilter = () => {
    setActiveCat(0);
    setActiveTag(null);
  };

  // 滚动监听：当前浏览到的分类区块自动高亮
  useEffect(() => {
    if (kw || isFiltered) return;
    const onScroll = () => {
      let cur = 0;
      for (const c of categories) {
        const el = document.getElementById(`cat-${c.id}`);
        // 阈值 = 侧栏 sticky top + 一点缓冲，保证当前区块标题不被 sticky 导航遮挡时就高亮
        if (el && el.getBoundingClientRect().top <= sideTop + 20) cur = c.id;
      }
      setHighlightCat(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [categories, kw, isFiltered, sideTop]);

  const onSearch = (v: string) => {
    setKeyword(v);
    const q = v.trim();
    router.replace(q ? `/tool?keyword=${encodeURIComponent(q)}` : "/tool");
  };

  const activeCatName = categories.find((c) => c.id === activeCat)?.name || "";
  const filteredTitle = activeTag
    ? `${activeCatName} / ${activeTag}`
    : activeCatName || "全部 AI 工具";

  return (
    <div style={{ background: "#f5f6f8", minHeight: "100vh" }}>
      {/*
        /tool 工具大全页此前缺 h1：内部各区块（搜索结果 / 分类筛选 / 各分类名）用 h2，
        ToolCard 用 h3，会形成 h2→h3 跳级。这里补一个视觉隐藏的 h1 作为页面主标题
        （与 ToolExplorer / search 页同款视觉隐藏写法），让 h1→h2→h3 层级成立，版式不变。
      */}
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
      {/* 顶部导航区：分类行 + 搜索框 + 全局标签云（sticky，对齐目标红框） */}
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
          {/* 红框第 1 行：分类横向 tab（纯文字 + 蓝色下划线 active，▾ 标注有子标签的分类） */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              marginBottom: 14,
              alignItems: "center"
            }}
          >
            <NavTab
              label="全部"
              active={shownCat === 0 && !activeTag}
              onClick={clearFilter}
            />
            {categories.map((c) => {
              const hasTags = (c.tags || []).length > 0;
              const catActive = shownCat === c.id && !activeTag;
              return (
                <div key={c.id} className="relative group">
                  <button
                    onClick={() => selectCat(c.id)}
                    style={navTabStyle(catActive)}
                  >
                    {c.name}
                    {hasTags && (
                      <span style={{ marginLeft: 3, fontSize: 10, opacity: 0.7 }}>
                        ▾
                      </span>
                    )}
                  </button>
                  {hasTags && (
                    <div
                      className="absolute left-0 top-full z-30 hidden w-44 rounded-lg bg-white p-1 shadow-lg group-hover:block"
                      style={{ maxHeight: 288, overflowY: "auto" }}
                    >
                      {c.tags!.map((t) => (
                        <div
                          key={t}
                          onClick={() => selectTag(c.id, t)}
                          title={t}
                          className="cursor-pointer truncate rounded px-2.5 py-1.5 text-[13px] text-gray-600 hover:bg-blue-50 hover:text-[#3874F7]"
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 红框第 2 行：搜索框（占位"在「AI工具」中搜索" + 独立蓝底"搜索"按钮） */}
          <div style={{ display: "flex", maxWidth: 560, marginBottom: 14 }}>
            <Input
              size="large"
              allowClear
              value={keyword}
              prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
              placeholder="在「AI工具」中搜索"
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={(e) =>
                onSearch((e.target as HTMLInputElement).value)
              }
              style={{ borderRadius: "999px 0 0 999px", borderRight: 0 }}
            />
            <button
              onClick={() => onSearch(keyword)}
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

          {/* 红框第 3 行：全局混合标签云（直角 chip，跨分类子标签聚合） */}
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
              <CloudChip
                label="全部"
                active={shownCat === 0 && !activeTag}
                onClick={clearFilter}
              />
              {allTags.map((t) => (
                <CloudChip
                  key={t}
                  label={t}
                  active={activeTag === t && activeCat === 0}
                  onClick={() => selectGlobalTag(t)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 内容区：左侧 sticky 分类侧边栏 + 右侧工具网格 */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 20px 60px", display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* 左侧分类侧边栏（sticky，对齐红框“侧边栏导航”） */}
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
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)", margin: "4px 8px 10px" }}>分类导航</div>
          <button onClick={clearFilter} style={sideCatStyle(shownCat === 0 && !activeTag)}>全部</button>
          {categories.map((c) => (
            <div key={c.id}>
              <button onClick={() => selectCat(c.id)} style={sideCatStyle(shownCat === c.id && !activeTag)}>{c.name}</button>
              {shownCat === c.id && (c.tags || []).length > 0 && (
                <div style={{ margin: "2px 0 6px 10px" }}>
                  {c.tags!.map((t) => (
                    <button key={t} onClick={() => selectTag(c.id, t)} style={sideTagStyle(activeTag === t && shownCat === c.id)}>{t}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>
        <div style={{ flex: 1, minWidth: 0 }}>
        {isLoading ? (
          <SkeletonGrid count={12} />
        ) : kw ? (
          // 搜索结果
          <section>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>“{keyword}” 的搜索结果</h2>
              <span style={{ color: "#9ca3af", fontSize: 13 }}>
                共 {searchResults.length} 个工具
              </span>
            </div>
            {searchResults.length === 0 ? (
              <EmptyState description="没有找到相关工具" style={{ padding: 80 }} />
            ) : (
              <div style={gridStyle}>
                {searchResults.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </section>
        ) : isFiltered ? (
          // 分类 / 子标签筛选
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
            {filteredTools.length === 0 ? (
              <EmptyState description="该筛选下暂无工具" style={{ padding: 80 }} />
            ) : (
              <div style={gridStyle}>
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </section>
        ) : (
          // 全部分类区块（每个分类带子标签行 + 工具网格 + 全部>，对齐目标样式）
          <>
            <RecentTools />
            {grouped.map(({ cat, tools }) => (
              <section
                key={cat.id}
                id={`cat-${cat.id}`}
                style={{ marginBottom: 36, scrollMarginTop: sideTop + 20 }}
              >
                <div style={sectionHeaderStyle}>
                  <h2 style={sectionTitleStyle}>{cat.name}</h2>
                  <Link
                    href={`/tool?keyword=${encodeURIComponent(cat.name)}`}
                    style={{
                      color: "var(--text-2)",
                      fontSize: 13,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 2
                    }}
                  >
                    全部 <RightOutlined style={{ fontSize: 11 }} />
                  </Link>
                </div>
                {/* 该分类的二级子标签行：带边框圆角容器，激活 chip 蓝边 + 浅蓝底（对齐红框样式） */}
                {(cat.tags || []).length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 4,
                      marginBottom: 10,
                      padding: "6px 10px",
                      border: "1px solid var(--chip-border)",
                      borderRadius: 8,
                      background: "var(--surface)",
                      alignItems: "center"
                    }}
                  >
                    {cat.tags!.map((t) => {
                      const active = activeTag === t && activeCat === cat.id;
                      return (
                        <button
                          key={t}
                          onClick={() => selectTag(cat.id, t)}
                          style={sectionTagStyle(active)}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                )}
                {tools.length === 0 ? (
                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: 13,
                      padding: "20px 0"
                    }}
                  >
                    暂无工具
                  </div>
                ) : (
                  <div style={gridStyle}>
                    {tools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </>
        )}
        </div>
      </div>
    </div>
  );
}

/* ========== 子组件：导航 tab（纯文字 + 蓝下划线 active） ========== */
function NavTab({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={navTabStyle(active)}>
      {label}
    </button>
  );
}

/* ========== 子组件：全局标签云 chip（直角小 chip） ========== */
function CloudChip({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={cloudChipStyle(active)}>
      {label}
    </button>
  );
}

/* ========== 样式（颗粒度对齐目标站：全部消费站点语义 token，暗色模式自动跟随） ========== */
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

function sectionTagStyle(active: boolean): React.CSSProperties {
  return {
    padding: "3px 10px",
    borderRadius: 4,
    border: active ? `1px solid ${BRAND}` : "1px solid transparent",
    background: active ? "var(--brand-tint)" : "transparent",
    color: active ? BRAND : "var(--text-2)",
    fontSize: 13,
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

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 10
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  margin: 0,
  color: "var(--text-1)",
  display: "flex",
  alignItems: "center"
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: 12
};