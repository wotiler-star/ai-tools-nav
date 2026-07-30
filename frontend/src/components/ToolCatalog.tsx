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

  // 按分类分组
  const grouped = useMemo(() => {
    return categories.map((c) => ({
      cat: c,
      tools: allTools.filter((t) => t.categoryId === c.id)
    }));
  }, [categories, allTools]);

  // 滚动定位到分类区块
  const scrollToCat = (id: number) => {
    setActiveCat(id);
    if (id === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(`cat-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // 滚动监听：当前浏览到的分类区块自动高亮（对齐真站左侧导航选中态）
  useEffect(() => {
    if (kw) return;
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
  }, [categories, kw]);

  const onSearch = (v: string) => {
    setKeyword(v);
    const q = v.trim();
    router.replace(q ? `/tool?keyword=${encodeURIComponent(q)}` : "/tool");
  };

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh" }}>
      {/* 左侧固定分类导航（对齐真站：fixed 左缘垂直居中 + 圆角阴影 + 竖向菜单，宽屏显示） */}
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
              onClick={({ key }) => scrollToCat(Number(key))}
            />
          </div>
        </div>
      )}

      {/* 顶部：分类锚点 + 搜索（sticky） */}
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
          {/* 分类横向锚点 */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 12
            }}
          >
            <button
              onClick={() => scrollToCat(0)}
              style={chipStyle(activeCat === 0)}
            >
              全部
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => scrollToCat(c.id)}
                style={chipStyle(activeCat === c.id)}
              >
                <span style={{ marginRight: 4 }}>{c.icon}</span>
                {c.name}
              </button>
            ))}
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
        </div>
      </div>

      {/* 内容区 */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 20px 60px" }}>
        <RecentTools />
        {isLoading ? (
          <SkeletonGrid count={12} />
        ) : kw ? (
          // 搜索结果：扁平网格
          <section>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>
                “{keyword}” 的搜索结果
              </h2>
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
        ) : (
          // 全部分类区块平铺
          grouped.map(({ cat, tools }) => (
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
          ))
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
