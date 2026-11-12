"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Tag, Spin, Empty } from "antd";
import { BookOutlined, RightOutlined, FireOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { swrFetcher } from "@/lib/api";
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
  const cats: AiColumnCategory[] = useMemo(
    () => (catData?.data || []).slice().sort((a, b) => (a.sort || 0) - (b.sort || 0)),
    [catData]
  );

  // 全量专栏：用于「AI 知识库导航」目录分组 + 精选教程
  const { data: allData } = useSWR<{ data: { records: AiColumn[]; total: number } }>(
    "/ai_column/list?current=1&pageSize=200&sort=default",
    swrFetcher
  );
  const allColumns: AiColumn[] = useMemo(() => allData?.data?.records || [], [allData]);

  // 精选教程：优先 Vibe Coding 零基础教程（与鱼皮标杆一致），否则取首个专栏
  const featured: AiColumn | undefined = useMemo(() => {
    return (
      allColumns.find((c) => /vibe\s*coding/i.test(c.title) || c.id === 31) ||
      allColumns[0]
    );
  }, [allColumns]);

  // 有编程基础的学习路径：与 featured 同分类内（默认 AI 编程）articleCount 最高的专栏
  const advancedCol: AiColumn | undefined = useMemo(() => {
    if (!featured) return undefined;
    const pool = allColumns.filter(
      (c) => c.id !== featured.id && (c.categoryId || 0) === (featured.categoryId || 0)
    );
    const sorted = pool
      .slice()
      .sort((a, b) => (b.articleCount || 0) - (a.articleCount || 0));
    return sorted[0] || allColumns.find((c) => c.id !== featured.id);
  }, [allColumns, featured]);

  // 导航目录：按分类分组（含未分类的「更多专题」）
  const grouped = useMemo(() => {
    const map = new Map<number, AiColumn[]>();
    const uncat: AiColumn[] = [];
    for (const c of allColumns) {
      if (c.categoryId) {
        if (!map.has(c.categoryId)) map.set(c.categoryId, []);
        map.get(c.categoryId)!.push(c);
      } else {
        uncat.push(c);
      }
    }
    return { map, uncat };
  }, [allColumns]);

  // 原有：按分类 + 排序筛选（服务端分页）
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
          完全免费开放的 AI 知识共享平台，精选新手入门、DeepSeek、AI 编程、工具测评等主题，
          汇总量身筛选的优质教程与实战项目，减少信息差，帮你少走弯路。
        </p>
        <BookOutlined
          style={{ position: "absolute", right: 24, bottom: -20, fontSize: 160, opacity: 0.12 }}
        />
      </div>

      {/* ===== AI 知识库导航（复刻鱼皮落地页概念：主题分区目录） ===== */}
      {allColumns.length > 0 && (
        <section aria-label="AI 知识库导航" style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>AI 知识库导航</h2>
          <p style={{ fontSize: 14, color: "#86909c", margin: "0 0 16px" }}>
            按主题快速找到适合你的学习专栏，从通识概念到编程实战一站直达。
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 16
            }}
          >
            {cats.map((cat) => {
              const items = (grouped.map.get(cat.id) || [])
                .slice()
                .sort((a, b) => (a.sort || 0) - (b.sort || 0));
              return (
                <div
                  key={cat.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #eaecef",
                    borderRadius: 14,
                    padding: 18
                  }}
                >
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{cat.name}</h3>
                  <p style={{ fontSize: 12, color: "#86909c", margin: "0 0 12px", minHeight: 32, lineHeight: 1.5 }}>
                    {cat.description}
                  </p>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {items.length === 0 && (
                      <li style={{ fontSize: 12, color: "#c9cdd4" }}>敬请期待</li>
                    )}
                    {items.map((col) => (
                      <li key={col.id}>
                        <Link
                          href={`/library/${col.id}`}
                          className="kb-nav-link"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 13,
                            color: "#1d2129",
                            textDecoration: "none"
                          }}
                        >
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {col.title}
                          </span>
                          <span style={{ color: "#c9cdd4", fontSize: 12, flexShrink: 0 }}>
                            {col.articleCount || 0} 篇
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {grouped.uncat.length > 0 && (
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #eaecef",
                  borderRadius: 14,
                  padding: 18
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>更多专题</h3>
                <p style={{ fontSize: 12, color: "#86909c", margin: "0 0 12px", minHeight: 32, lineHeight: 1.5 }}>
                  跨主题的精选合集与行业观察。
                </p>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {grouped.uncat
                    .slice()
                    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
                    .map((col) => (
                      <li key={col.id}>
                        <Link
                          href={`/library/${col.id}`}
                          className="kb-nav-link"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 13,
                            color: "#1d2129",
                            textDecoration: "none"
                          }}
                        >
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {col.title}
                          </span>
                          <span style={{ color: "#c9cdd4", fontSize: 12, flexShrink: 0 }}>
                            {col.articleCount || 0} 篇
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== 精选教程（复刻鱼皮落地页概念：特色教程 + 学习路径推荐） ===== */}
      {featured && (
        <section aria-label="精选教程" style={{ marginBottom: 32 }}>
          <div
            style={{
              background: "linear-gradient(120deg, #0EA5E9 0%, #3874F7 100%)",
              borderRadius: 16,
              padding: "28px 28px",
              color: "#fff",
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              alignItems: "flex-start",
              justifyContent: "space-between"
            }}
          >
            <div style={{ flex: "1 1 320px", minWidth: 280 }}>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>🔥 精选教程</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 10px" }}>{featured.title}</h2>
              <p style={{ fontSize: 14, opacity: 0.92, margin: "0 0 14px", lineHeight: 1.7 }}>
                {featured.description}
              </p>
              {featured.tags && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                  <span style={{ fontSize: 12, opacity: 0.85 }}>教程包含：</span>
                  {featured.tags
                    .split(/[,，]/)
                    .filter(Boolean)
                    .slice(0, 6)
                    .map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: 11,
                          background: "rgba(255,255,255,0.18)",
                          borderRadius: 6,
                          padding: "2px 8px"
                        }}
                      >
                        {t}
                      </span>
                    ))}
                </div>
              )}
              <Link
                href={`/library/${featured.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#fff",
                  color: BRAND,
                  fontWeight: 700,
                  fontSize: 14,
                  borderRadius: 999,
                  padding: "8px 18px",
                  textDecoration: "none"
                }}
              >
                开始学习 <RightOutlined />
              </Link>
            </div>

            <div style={{ flex: "1 1 240px", minWidth: 220 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px", opacity: 0.95 }}>
                学习路径推荐
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link
                  href={`/library/${featured.id}`}
                  className="kb-path-link"
                  style={{
                    display: "block",
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "12px 14px",
                    textDecoration: "none",
                    color: "#fff"
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700 }}>零基础新手</div>
                  <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
                    从零开始，循序渐近搞定 AI 编程
                  </div>
                </Link>
                <Link
                  href={`/library/${advancedCol ? advancedCol.id : featured.id}`}
                  className="kb-path-link"
                  style={{
                    display: "block",
                    background: "rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "12px 14px",
                    textDecoration: "none",
                    color: "#fff"
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700 }}>有编程基础</div>
                  <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
                    {advancedCol ? `直击 ${advancedCol.title}` : "深入实战，做出自己的产品"}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

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
