"use client";

import { useState } from "react";
import Link from "next/link";
import { Input, Tag } from "antd";
import { SearchOutlined, RightOutlined, FireOutlined } from "@ant-design/icons";
import { TUTORIALS, LEARN_HOT_TOOLS, KB_COLUMNS } from "@/lib/mockData";

const BRAND = "#3874F7";

function coverColor(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h}, 58%, 60%)`;
}

export default function LearnPage() {
  const [kw, setKw] = useState("");
  const list = kw.trim()
    ? TUTORIALS.filter((t) => t.title.includes(kw.trim()))
    : TUTORIALS;

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>AI 学习教程</h1>
        <Input
          allowClear
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          placeholder="搜索教程"
          prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          style={{ maxWidth: 260, borderRadius: 999 }}
        />
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* 左侧：教程列表 */}
        <section style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {list.map((t) => (
              <article
                key={t.id}
                className="group hover-brand tool-card bg-white rounded-xl"
                style={{
                  padding: 12,
                  display: "flex",
                  gap: 14,
                  cursor: "pointer"
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 72,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: `linear-gradient(135deg, ${coverColor(t.title)}, #fff)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 26
                  }}
                >
                  🎓
                </div>
                <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 8px", lineHeight: 1.5 }} className="hover-brand-title">
                    {t.title}
                  </h3>
                  <Tag color="default" style={{ width: "fit-content" }}>
                    来源：{t.source}
                  </Tag>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 右侧：推荐教程 + 热门工具 */}
        <aside style={{ width: 300, flexShrink: 0 }}>
          <div style={{ position: "sticky", top: 84, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#fff", border: "1px solid #eaecef", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ fontWeight: 700, margin: 0, fontSize: 16 }}>推荐教程</h2>
                <Link href="/library" style={{ fontSize: 12, color: "#9ca3af" }}>
                  更多 <RightOutlined />
                </Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {KB_COLUMNS.slice(0, 4).map((c) => (
                  <div key={c.id} style={{ fontSize: 13, color: "#4e5969", cursor: "pointer" }}>
                    <span style={{ color: BRAND, marginRight: 6 }}>·</span>
                    {c.title}
                    {c.free && <Tag color="green" style={{ marginLeft: 6, fontSize: 11 }}>免费</Tag>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #eaecef", borderRadius: 12, padding: 16 }}>
              <h2 style={{ fontWeight: 700, margin: "0 0 12px", fontSize: 16 }}>
                <FireOutlined style={{ color: "#ff7a45", marginRight: 6 }} />
                热门工具
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {LEARN_HOT_TOOLS.map((name) => (
                  <Link key={name} href="/tool">
                    <Tag style={{ cursor: "pointer", padding: "3px 10px", borderRadius: 999 }}>
                      {name}
                    </Tag>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
