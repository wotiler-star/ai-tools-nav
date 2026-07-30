"use client";

import Link from "next/link";
import { Tag } from "antd";
import { BookOutlined, RightOutlined } from "@ant-design/icons";
import { KB_COLUMNS } from "@/lib/mockData";

const BRAND = "#3874F7";

function coverColor(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h}, 58%, 58%)`;
}

export default function LibraryPage() {
  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>AI 知识库</h1>
        <p style={{ color: "#6b7280" }}>系统化的 AI 学习专栏，从入门到实战</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16
        }}
      >
        {KB_COLUMNS.map((c) => (
          <Link key={c.id} href={`/library/${c.id}`}>
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                overflow: "hidden",
                cursor: "pointer",
                height: "100%"
              }}
              className="group hover-brand tool-card"
            >
              <div
                style={{
                  height: 120,
                  background: `linear-gradient(135deg, ${coverColor(c.title)}, #fff)`,
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
                  <span style={{ fontWeight: 700, fontSize: 16 }} className="hover-brand-title">{c.title}</span>
                  {c.free ? (
                    <Tag color="green">免费</Tag>
                  ) : (
                    <Tag color="gold">会员</Tag>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "#4e5969", lineHeight: 1.7, minHeight: 44 }}>
                  {c.description}
                </div>
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
                  <span>{c.articleCount} 篇文章</span>
                  <span style={{ color: BRAND }}>
                    进入专栏 <RightOutlined />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
