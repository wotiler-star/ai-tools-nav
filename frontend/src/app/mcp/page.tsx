"use client";

import { useMemo, useState } from "react";
import { Input, Tag } from "antd";
import { SearchOutlined, ApiOutlined } from "@ant-design/icons";
import { MCP_SERVERS, MCP_CATEGORIES } from "@/lib/mockData";

const BRAND = "#3874F7";

export default function McpPage() {
  const [cat, setCat] = useState("全部");
  const [kw, setKw] = useState("");

  const cats = ["全部", ...MCP_CATEGORIES];

  const list = useMemo(() => {
    let arr = MCP_SERVERS;
    if (cat !== "全部") arr = arr.filter((m) => m.category === cat);
    if (kw.trim()) {
      const k = kw.trim();
      arr = arr.filter((m) => m.name.includes(k) || m.description.includes(k));
    }
    return arr;
  }, [cat, kw]);

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg,#eaf1fe,#f7faff)",
          padding: "40px 16px 32px",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>
          发现全球好用的 MCP 服务器
        </h1>
        <p style={{ color: "#6b7280", marginBottom: 20 }}>
          持续更新优质 MCP，重塑你的 AI 工作流
        </p>
        <Input
          allowClear
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          placeholder="搜索 MCP 服务器"
          prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          style={{ maxWidth: 460, borderRadius: 999, height: 44 }}
        />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
        {/* 分类 Tab */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {cats.map((c) => (
            <span
              key={c}
              onClick={() => setCat(c)}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 13,
                cursor: "pointer",
                fontWeight: cat === c ? 700 : 500,
                color: cat === c ? "#fff" : "#4e5969",
                background: cat === c ? BRAND : "#fff",
                border: `1px solid ${cat === c ? BRAND : "#eaecef"}`
              }}
            >
              {c}
            </span>
          ))}
        </div>

        {/* MCP 卡片网格 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16
          }}
        >
          {list.map((m) => (
            <div
              key={m.id}
              className="group hover-brand tool-card"
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 16,
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "#eaf1fe",
                    color: BRAND,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0
                  }}
                >
                  <ApiOutlined />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }} className="hover-brand-title">{m.name}</div>
                  <Tag color="blue" style={{ marginTop: 2, fontSize: 11 }}>
                    {m.tag}
                  </Tag>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#4e5969", lineHeight: 1.7, minHeight: 44 }}>
                {m.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
