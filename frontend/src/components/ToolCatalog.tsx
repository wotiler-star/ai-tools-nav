"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { Input, Menu } from "antd";
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

  // 全局混合标签云：聚合并去重所有分类的二级子标签（复刻目标站搜索框下方的标签云）
  const allTags = useMemo(() => {
    const set = new Set<string>();
    categories.forEach((c) => (c.tags || []).forEach((t) => set.add(t)));
    return Array.from(set);
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

  // 按分类 + 二级标签过滤后的工具（复刻目标站『分类→子标签』筛选）
  const filteredTools = useMemo(() => {
    let list = allTools;
    if (activeCat > 0) list = list.filter((t) => t.categoryId === activeCat);
    if (activeTag) list = list.filter((t) => t.tags.includes(activeTag));
    return list;
  }, [allTools, activeCat, activeTag]);

  // 按分类分组（全部视图）
  const grouped = useMemo(() => {
    return categories.map((c) => ({
      cat: c,
      tools: allTools.filter((t) => t.categoryId === c.id)
    }));
  }, [categories, allTools]);

  // 交互：分类 / 子标签 筛选
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

  // 滚动监听：当前浏览到的分类区块自动高亮（仅在『全部』目录视图生效）
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
    <div style={{ background: "#f9fafb", minHeight: "100vh" }}>
      {/* 左侧固定分类导航（宽屏显示，点击即筛选该分类） */}
      {!kw && categories.length > 0 && (
        <div className="fixed left-0 top-1/2 z-10 -translate-y-1/2">
          <div
            role="navigation"
            aria-label="工具分类导航"
            className="hidden overflow-hidden rounded-lg bg-white shadow min-[1460px]:block"
          >
            <Menu
              mode="vertical"
              selectedKeys={activeCat ? [String(activeCat)] : []}
              style={{ border: "none", width: 132 }}
              items={categories.map((c) => ({
                key: String(c.id),
                label: c.name
              }))}
              onClick={({ key }) => selectCat(Number(key))}
            />
          </div>
        </div>
      )}

      {/* 顶部：分类锚点 + 搜索 + 全局标签云（sticky） */}
      <div
        style={{
          position: "sticky",
          top: 64,
          zIndex: 20,
          background: "rgba(249,250,251,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #eef0f2"
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 20px" }}>
          {/* 分类横向锚点（带 ▾ 下拉子标签，hover 展开竖向子标签菜单） */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 12
            }}
          >
            <button
              onClick={clearFilter}
              style={chipStyle(activeCat === 0 && !activeTag)}
            >
              全部
            </button>
            {categories.map((c) => {
              const hasTags = (c.tags || []).length > 0;
              const catActive = activeCat === c.id && !activeTag;
              return (
                <div key={c.id} className="relative group">
                  <button onClick={() => selectCat(c.id)} style={chipStyle(catActive)}>
                    <span style={{ marginRight: 4 }}>{c.icon}</span>
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
                      {c.tags!.map((t) => {
                        const at = activeTag === t && activeCat === c.id;
                        return (
                          <div
                            key={t}
                            onClick={() => selectTag(c.id, t)}
                            title={t}
                            className={`cursor-pointer truncate rounded px-2.5 py-1.5 text-[13px] ${
                              at
                                ? "bg-blue-50 font-medium text-[#3874F7]"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {t}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 搜索框 */}
          <Input
            size="large"
            allowClear
            value={keyword}
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            placeholder="搜索 AI 工具，如 ChatGPT、绘画、编程…"
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={(e) =>
              onSearch((e.target as HTMLInputElement).value)
            }
            style={{ borderRadius: 999, maxWidth: 560 }}
          />

          {/* 全局混合标签云（复刻目标站：搜索框下方聚合所有分类子标签，点击即跨分类筛选） */}
          {allTags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 12
              }}
            >
              <button onClick={clearFilter} style={tagCloudStyle(activeCat === 0 && !activeTag)}>
                全部
              </button>
              {allTags.map((t) => (
                <button
                  key={t}
                  onClick={() => selectGlobalTag(t)}
                  style={tagCloudStyle(activeTag === t && activeCat === 0)}
                >
                  {t}
                </button>
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
          // 搜索结果：扁平网格
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
          // 分类 / 子标签筛选结果
          <section>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>{filteredTitle}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ color: "#9ca3af", fontSize: 13 }}>
                  共 {filteredTools.length} 个工具
                </span>
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
            </div>
            {filteredTools.length === 0 ? (
              <EmptyState description="该分类下暂无此标签的工具" style={{ padding: 80 }} />
            ) : (
              <div style={gridStyle}>
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </section>
        ) : (
          // 全部分类区块平铺
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
                    <span style={{ marginRight: 8 }}>{cat.icon}</span>
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
                    查看全部 <RightOutlined style={{ fontSize: 11 }} />
                  </Link>
                </div>
                {tools.length === 0 ? (
                  <div style={{ color: "#9ca3af", fontSize: 13, padding: "8px 0" }}>
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

function chipStyle(active: boolean): React.CSSProperties {
  return {
    padding: "5px 14px",
    borderRadius: 999,
    border: active ? `1px solid ${BRAND}` : "1px solid #e5e7eb",
    background: active ? "#eaf1fe" : "#fff",
    color: active ? BRAND : "#4b5563",
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    transition: "all .15s",
    lineHeight: 1.5
  };
}

function tagCloudStyle(active: boolean): React.CSSProperties {
  return {
    padding: "3px 10px",
    borderRadius: 999,
    border: active ? `1px solid ${BRAND}` : "1px solid #e5e7eb",
    background: active ? "#eaf1fe" : "#fff",
    color: active ? BRAND : "#6b7280",
    fontSize: 12,
    cursor: "pointer",
    lineHeight: 1.6,
    transition: "all .15s"
  };
}

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 14
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
