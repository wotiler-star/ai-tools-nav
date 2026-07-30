"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonGrid } from "@/components/Loading";
import { useAppStore } from "@/store/useAppStore";
import { swrFetcher } from "@/lib/api";
import CategoryNav from "@/components/CategoryNav";
import ToolCard from "@/components/ToolCard";
import SectionTitle from "@/components/SectionTitle";
import { AiTool, BaseResponse, BaseResponsePage, Category } from "@/types";

export default function ToolExplorer({
  initialCategoryId = 0
}: {
  initialCategoryId?: number;
}) {
  const searchParams = useSearchParams();
  const { activeCategoryId, setActiveCategory, keyword: storeKw, setKeyword } =
    useAppStore();

  const urlKw = searchParams.get("keyword") || "";
  const keyword = urlKw || storeKw;

  useEffect(() => {
    if (urlKw) setKeyword(urlKw);
  }, [urlKw, setKeyword]);

  useEffect(() => {
    if (initialCategoryId) setActiveCategory(initialCategoryId);
  }, [initialCategoryId, setActiveCategory]);

  // 分类列表
  const { data: catRes } = useSWR<BaseResponse<Category[]>>(
    "/category/list",
    swrFetcher
  );
  const categories = catRes?.data || [];

  // 工具列表（按分类 + 关键字过滤，与后端分页结构一致）
  const toolKey = `/ai_tool/list/page?categoryId=${activeCategoryId}&keyword=${encodeURIComponent(
    keyword
  )}`;
  const { data: toolRes, isLoading } = useSWR<BaseResponsePage<AiTool>>(
    toolKey,
    swrFetcher
  );
  const tools = toolRes?.data?.records || [];

  const activeCat = categories.find((c) => c.id === activeCategoryId);
  const title = keyword
    ? `“${keyword}” 的搜索结果`
    : activeCat
      ? activeCat.name
      : "全部 AI 工具";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px", display: "flex", gap: 20 }}>
      <aside style={{ width: 220, flexShrink: 0 }}>
        <div style={{ position: "sticky", top: 84 }}>
          <CategoryNav
            categories={categories}
            activeId={activeCategoryId}
            onChange={setActiveCategory}
          />
        </div>
      </aside>

      <section style={{ flex: 1, minWidth: 0 }}>
        <SectionTitle
          title={title}
          extra={
            <span style={{ color: "#86909c", fontSize: 13 }}>
              共 {toolRes?.data?.total ?? 0} 个工具
            </span>
          }
        />

        {isLoading ? (
          <SkeletonGrid count={8} />
        ) : tools.length === 0 ? (
          <EmptyState description="没有找到相关工具" style={{ padding: 60 }} />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 16
            }}
          >
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
