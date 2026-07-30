"use client";

import { useMemo, useState } from "react";
import { Input, Tag, message } from "antd";
import { SearchOutlined, FireOutlined } from "@ant-design/icons";
import { PROMPT_TEMPLATES } from "@/lib/mockData";

const BRAND = "#3874F7";

function colorFromName(name: string): string {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h}, 60%, 62%)`;
}

export default function PaintingPage() {
  const [kind, setKind] = useState<"draw" | "text">("draw");
  const [kw, setKw] = useState("");

  const list = useMemo(() => {
    const base = PROMPT_TEMPLATES.filter((p) => p.kind === kind);
    if (!kw.trim()) return base;
    return base.filter(
      (p) => p.title.includes(kw.trim()) || p.tags.some((t) => t.includes(kw.trim()))
    );
  }, [kind, kw]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      {/* 标题与切换 */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>AI 提示词大全</h1>
        <p style={{ color: "#6b7280" }}>精选高质量绘图与文字提示词，一键复用</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div
          style={{
            display: "inline-flex",
            background: "#f3f4f6",
            borderRadius: 999,
            padding: 4
          }}
        >
          {(
            [
              { k: "draw", label: "AI 绘图提示词" },
              { k: "text", label: "AI 文字提示词" }
            ] as const
          ).map((x) => (
            <span
              key={x.k}
              onClick={() => setKind(x.k)}
              style={{
                padding: "8px 22px",
                borderRadius: 999,
                fontSize: 14,
                cursor: "pointer",
                fontWeight: kind === x.k ? 700 : 500,
                color: kind === x.k ? "#fff" : "#4e5969",
                background: kind === x.k ? BRAND : "transparent"
              }}
            >
              {x.label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <Input
          allowClear
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          placeholder="搜索提示词模板"
          prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          style={{ maxWidth: 420, borderRadius: 999 }}
        />
      </div>

      {/* 模板网格 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16
        }}
      >
        {list.map((p) => (
          <div
            key={p.id}
            onClick={() => message.success(`已复制「${p.title}」提示词（演示）`)}
            style={{
              background: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              cursor: "pointer"
            }}
            className="group hover-brand tool-card"
          >
            {/* 封面 */}
            <div
              style={{
                height: 130,
                background: `linear-gradient(135deg, ${colorFromName(p.title)}, #ffffff)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 30,
                fontWeight: 800
              }}
            >
              {kind === "draw" ? "🎨" : "✍️"}
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }} className="hover-brand-title">{p.title}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                {p.tags.map((t) => (
                  <Tag key={t} color="blue" style={{ margin: 0, fontSize: 12 }}>
                    #{t}
                  </Tag>
                ))}
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>
                <FireOutlined style={{ color: "#ff7a45" }} /> 使用 {p.useCount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
