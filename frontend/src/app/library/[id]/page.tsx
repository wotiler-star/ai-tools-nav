"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Tag, Spin, Empty } from "antd";
import {
  LeftOutlined,
  FileTextOutlined,
  EyeOutlined,
  LikeOutlined,
  StarOutlined,
  BookOutlined,
  RightOutlined
} from "@ant-design/icons";
import { api, swrFetcher } from "@/lib/api";
import { AiArticle, AiColumn } from "@/types";

const BRAND = "#3874F7";
const GRAD = ["#3874F7", "#7C3AED", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#EC4899", "#22C55E"];

function coverBg(color?: string, idx = 0) {
  const c = color && color.startsWith("#") ? color : GRAD[idx % GRAD.length];
  return `linear-gradient(135deg, ${c}, ${c}cc)`;
}

export default function LibraryDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [sort, setSort] = useState<"default" | "hot" | "new">("default");

  const { data: colData, isLoading: colLoading } = useSWR<{ data: AiColumn }>(
    `/ai_column/get/${id}`,
    swrFetcher
  );
  const col = colData?.data;

  const { data, isLoading } = useSWR<{ data: { records: AiArticle[]; total: number } }>(
    `/ai_column/article/list?current=1&pageSize=50&columnId=${id}&sort=${sort}`,
    swrFetcher
  );
  const articles: AiArticle[] = useMemo(() => data?.data?.records || [], [data]);

  // 同分类的其他专栏（侧栏）
  const { data: siblingData } = useSWR<{ data: { records: AiColumn[] } }>(
    col?.categoryId
      ? `/ai_column/list?current=1&pageSize=20&categoryId=${col.categoryId}`
      : null,
    swrFetcher
  );
  const siblings: AiColumn[] = useMemo(
    () => (siblingData?.data?.records || []).filter((c) => c.id !== id),
    [siblingData, id]
  );

  if (colLoading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin />
      </div>
    );
  }

  if (!col) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 40 }}>
        <Empty description="专栏不存在" />
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/library" style={{ color: BRAND }}>
            返回知识库
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 16px" }}>
      {/* 面包屑 */}
      <div style={{ fontSize: 13, color: "#86909c", marginBottom: 16 }}>
        <Link href="/library" style={{ color: "#86909c" }}>
          <LeftOutlined /> 返回知识库
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span>{col.categoryName || "未分类"}</span>
      </div>

      {/* ===== 专栏信息卡 ===== */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #eaecef",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 20
        }}
      >
        <div
          style={{
            height: 100,
            background: coverBg(col.coverColor, Number(col.id) % 10)
          }}
        />
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{col.title}</h1>
            {col.needVip === 1 ? <Tag color="gold">会员</Tag> : <Tag color="green">免费</Tag>}
            {col.categoryName && <Tag color="blue">{col.categoryName}</Tag>}
          </div>
          <p style={{ color: "#4e5969", marginBottom: 14, lineHeight: 1.7 }}>{col.description}</p>
          <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#9ca3af", flexWrap: "wrap" }}>
            <span>
              <FileTextOutlined /> {col.articleCount || 0} 篇文章
            </span>
            <span>
              <EyeOutlined /> {col.viewNum || 0} 阅读
            </span>
            <span>
              <LikeOutlined /> {col.likeNum || 0} 点赞
            </span>
            <span>
              <StarOutlined /> {col.collectNum || 0} 收藏
            </span>
          </div>
        </div>
      </div>

      {/* ===== 主体：左侧栏 + 右文章列表 ===== */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* 左侧：同分类专栏 */}
        <div
          style={{
            width: 240,
            flexShrink: 0,
            background: "#fff",
            border: "1px solid #eaecef",
            borderRadius: 12,
            padding: 16
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
            {col.categoryName || "同分类专栏"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                background: "#eef3ff",
                color: BRAND,
                fontSize: 13,
                fontWeight: 700
              }}
            >
              {col.title}
            </div>
            {siblings.map((s) => (
              <Link key={s.id} href={`/library/${s.id}`}>
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "#4e5969",
                    cursor: "pointer"
                  }}
                  className="group hover-brand"
                >
                  {s.title}
                  <span style={{ float: "right", color: "#c9cdd4", fontSize: 11 }}>
                    {s.articleCount || 0} 篇
                  </span>
                </div>
              </Link>
            ))}
            {siblings.length === 0 && (
              <div style={{ fontSize: 12, color: "#c9cdd4", padding: "4px 10px" }}>
                暂无其他专栏
              </div>
            )}
          </div>
        </div>

        {/* 右侧：文章列表 */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              gap: 10,
              flexWrap: "wrap"
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 15 }}>文章目录</div>
            <div style={{ display: "flex", gap: 6 }}>
              {(
                [
                  { k: "default", label: "默认" },
                  { k: "hot", label: "最热" },
                  { k: "new", label: "最新" }
                ] as const
              ).map((s) => (
                <span
                  key={s.k}
                  onClick={() => setSort(s.k)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: sort === s.k ? 700 : 500,
                    color: sort === s.k ? BRAND : "#86909c",
                    background: sort === s.k ? "#eef3ff" : "#fff",
                    border: `1px solid ${sort === s.k ? BRAND : "#eaecef"}`
                  }}
                >
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin />
            </div>
          ) : articles.length === 0 ? (
            <Empty description="暂无文章" style={{ padding: 40 }} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {articles.map((a, idx) => (
                <Link key={a.id} href={`/library/${id}/${a.id}`}>
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #eaecef",
                      borderRadius: 10,
                      padding: 16,
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      cursor: "pointer"
                    }}
                    className="group hover-brand tool-card"
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        background: coverBg(col.coverColor, idx),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 18,
                        flexShrink: 0
                      }}
                    >
                      <BookOutlined />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          marginBottom: 6
                        }}
                        className="hover-brand-title"
                      >
                        {a.title}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#4e5969",
                          lineHeight: 1.7,
                          marginBottom: 8,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {a.summary}
                      </div>
                      <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#9ca3af" }}>
                        <span>
                          <EyeOutlined /> {a.viewNum || 0}
                        </span>
                        <span>
                          <LikeOutlined /> {a.likeNum || 0}
                        </span>
                        <span>
                          <StarOutlined /> {a.collectNum || 0}
                        </span>
                        <span style={{ marginLeft: "auto", color: BRAND }}>
                          阅读 <RightOutlined />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
