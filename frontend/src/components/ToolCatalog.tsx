"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

export default function ToolCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlKw = searchParams.get("keyword") || "";

  const [keyword, setKeyword] = useState(urlKw);
  const [activeCat, setActiveCat] = useState<number>(0);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    setKeyword(urlKw);
  }, [urlKw]);

  // 分类
  const { data: catRes } = useSWR<BaseResponse<Category[]>>(
    "/category/list",
    swrFetcher
  );
  const categories = useMemo(
    () => (catRes?.data || []).slice().sort((a, b) => a.sort - b.sort),
    [catRes]
  );

  // 一次性拉取全部工具
  const { data: toolRes, isLoading } = useSWR<BaseResponsePage<AiTool>>(
    "/ai_tool/list/page?categoryId=0&pageSize=200",
    swrFetcher
  );
  const allTools = useMemo(() => toolRes?.data?.records || [], [toolRes]);

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
        if (el && el.getBoundingClientRect().top <= 150) cur = c.id;
      }
      setActiveCat(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [categories, kw, isFiltered]);

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
      {/* 顶部导航区：分类行 + 搜索框 + 全局标签云（sticky，对齐目标红框） */}
      <div
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
              active={activeCat === 0 && !activeTag}
              onClick={clearFilter}
            />
            {categories.map((c) => {
              const hasTags = (c.tags || []).length > 0;
              const catActive = activeCat === c.id && !activeTag;
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
                gap: 8,
                padding: "10px 0 14px",
                borderTop: "1px dashed #e5e7eb",
                alignItems: "center"
              }}
            >
              <CloudChip
                label="全部"
                active={activeCat === 0 && !activeTag}
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

      {/* 内容区 */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 20px 60px" }}>
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
                style={{ marginBottom: 36, scrollMarginTop: 130 }}
              >
                <div style={sectionHeaderStyle}>
                  <h2 style={sectionTitleStyle}>
                    {cat.name}
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
                  <Link
                    href={`/tool?keyword=${encodeURIComponent(cat.name)}`}
                    style={{
                      color: BRAND,
                      fontSize: 13,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 2
                    }}
                  >
                    全部 <RightOutlined style={{ fontSize: 11 }} />
                  </Link>
                </div>
                {/* 该分类的二级子标签行（目标红框里"AI写作"区块下面那行 chip） */}
                {(cat.tags || []).length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 4,
                      marginBottom: 14,
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

/* ========== 样式 ========== */
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