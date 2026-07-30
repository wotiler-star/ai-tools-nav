"use client";

import Link from "next/link";
import { Tag } from "antd";
import { EmptyState } from "@/components/EmptyState";
import { LeftOutlined, FileTextOutlined } from "@ant-design/icons";
import { KB_COLUMNS } from "@/lib/mockData";

const BRAND = "#3874F7";

export default function LibraryDetailPage({
  params
}: {
  params: { id: string };
}) {
  const { id } = params;
  const col = KB_COLUMNS.find((c) => String(c.id) === id);

  if (!col) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 40 }}>
        <EmptyState description="专栏不存在" />
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/library" style={{ color: BRAND }}>
            返回知识库
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      <Link href="/library" style={{ color: "#86909c", fontSize: 13 }}>
        <LeftOutlined /> 返回知识库
      </Link>

      <div
        className="group hover-brand bg-white rounded-xl"
        style={{
          padding: 24,
          margin: "16px 0"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }} className="hover-brand-title">{col.title}</h1>
          {col.free ? <Tag color="green">免费</Tag> : <Tag color="gold">会员</Tag>}
        </div>
        <p style={{ color: "#4e5969", marginBottom: 8 }}>{col.description}</p>
        <div style={{ fontSize: 13, color: "#9ca3af" }}>共 {col.articleCount} 篇文章</div>
      </div>

      {/* 文章目录（占位） */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Array.from({ length: Math.min(col.articleCount, 12) }).map((_, i) => (
          <div
            key={i}
            className="group hover-brand tool-card bg-white"
            style={{
              borderRadius: 10,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer"
            }}
          >
            <FileTextOutlined style={{ color: BRAND }} />
            <span style={{ fontSize: 14 }} className="hover-brand-title">
              第 {i + 1} 章 · {col.title}（内容建设中）
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
