"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Tag, Spin, Empty } from "antd";
import { BookOutlined, RightOutlined, FireOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { api, swrFetcher } from "@/lib/api";
import { AiColumn, AiColumnCategory } from "@/types";

const BRAND = "#3874F7";
const GRAD = ["#3874F7", "#7C3AED", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#EC4899", "#22C55E"];

function coverBg(color?: string, idx = 0) {
  const c = color && color.startsWith("#") ? color : GRAD[idx % GRAD.length];
  return `linear-gradient(135deg, ${c}, ${c}cc)`;
}

export default function LibraryPage() {
  const [activeCat, setActiveCat] = useState<number>(0); // 0 = 全部
  const [sort, setSort] = useState<"default" | "hot" | "new">("default");

  const { data: catData } = useSWR<{ data: AiColumnCategory[] }>(
    "/ai_column/category/list",
    swrFetcher
  );
  const cats: AiColumnCategory[] = useMemo(() => catData?.data || [], [catData]);

  const { data, isLoading } = useSWR<{ data: { records: AiColumn[]; total: number } }>(
    `/ai_column/list?current=1&pageSize=30&categoryId=${activeCat || ""}&sort=${sort}`,
    swrFetcher
  );
  const columns: AiColumn[] = useMemo(() => data?.data?.records || [], [data]);

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 16px" }}>
      {/* ===== 顶部 Banner ===== */}
      <div
        style={{
          background: "linear-gradient(120deg, #3874F7 0%, #7C3AED 100%)",
          borderRadius: 16,
          padding: "36px 32px",
          color: "#fff",
          marginBottom: 24,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 8 }}>AI 知识库</div>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0, marginBottom: 10 }}>
          系统化的 AI 学习专栏，从入门到实战
        </h1>
        <p style={{ fontSize: 15, opacity: 0.92, margin: 0, maxWidth: 640, lineHeight: 1.7 }}>
          精选新手入门、DeepSeek、AI 编程、工具测评等主题，汇总量身筛选的优质教程与实战项目，
          帮你少走弯路，快速用 AI 做出自己的产品。
        </p>
        <BookOutlined
          style={{ position: "absolute", right: 24, bottom: -20, fontSize: 160, opacity: 0.12 }}
        />
      </div>

      {/* ===== 分类 Tab + 排序 ===== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap"
        }}
      >
        <div role="tablist" aria-label="专栏分类" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <CatChip label="全部" active={activeCat === 0} onClick={() => setActiveCat(0)} />
          {cats.map((c) => (
            <CatChip
              key={c.id}
              label={c.name}
              active={activeCat === c.id}
              onClick={() => setActiveCat(c.id)}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <SortChip label="默认" active={sort === "default"} onClick={() => setSort("default")} icon={null} />
          <SortChip label="最热" active={sort === "hot"} onClick={() => setSort("hot")} icon={<FireOutlined />} />
          <SortChip label="最新" active={sort === "new"} onClick={() => setSort("new")} icon={<ClockCircleOutlined />} />
        </div>
      </div>

      {/* ===== 专栏卡片网格 ===== */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Spin />
        </div>
      ) : columns.length === 0 ? (
        <Empty description="该分类下暂无专栏" style={{ padding: 60 }} />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16
          }}
        >
          {columns.map((c, idx) => (
            <Link key={c.id} href={`/library/${c.id}`}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  overflow: "hidden",
                  cursor: "pointer",
                  height: "100%",
                  border: "1px solid #eaecef",
                  transition: "box-shadow .2s, transform .2s"
                }}
                className="group hover-brand tool-card"
              >
                <div
                  style={{
                    height: 120,
                    background: coverBg(c.coverColor, idx),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 34
                  }}
                >
                  <BookOutlined />
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 16, margin: 0 }} className="hover-brand-title">
                      {c.title}
                    </h3>
                    {c.needVip === 1 ? (
                      <Tag color="gold">会员</Tag>
                    ) : (
                      <Tag color="green">免费</Tag>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#4e5969",
                      lineHeight: 1.7,
                      minHeight: 44,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    {c.description}
                  </div>
                  {c.tags && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "10px 0 6px" }}>
                      {c.tags
                        .split(/[,，]/)
                        .filter(Boolean)
                        .slice(0, 4)
                        .map((t) => (
                          <span
                            key={t}
                            style={{
                              fontSize: 11,
                              color: BRAND,
                              background: "#eef3ff",
                              borderRadius: 6,
                              padding: "2px 8px"
                            }}
                          >
                            {t}
                          </span>
                        ))}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 12,
                      fontSize: 12,
                      color: "#9ca3af"
                    }}
                  >
                    <span>
                      {c.articleCount || 0} 篇文章 · {c.viewNum || 0} 阅读
                    </span>
                    <span style={{ color: BRAND }}>
                      进入专栏 <RightOutlined />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function CatChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <span
      role="tab"
      aria-selected={active}
      tabIndex={0}
      onClick={onClick}
      style={{
        padding: "7px 16px",
        borderRadius: 999,
        fontSize: 14,
        cursor: "pointer",
        fontWeight: active ? 700 : 500,
        color: active ? "#fff" : "#4e5969",
        background: active ? BRAND : "#fff",
        border: `1px solid ${active ? BRAND : "#eaecef"}`
      }}
    >
      {label}
    </span>
  );
}

function SortChip({
  label,
  active,
  onClick,
  icon
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <span
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: 8,
        fontSize: 13,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontWeight: active ? 700 : 500,
        color: active ? BRAND : "#86909c",
        background: active ? "#eef3ff" : "#fff",
        border: `1px solid ${active ? BRAND : "#eaecef"}`
      }}
    >
      {icon}
      {label}
    </span>
  );
}
