"use client";

import { useMemo, useState } from "react";
import { Input, Tag } from "antd";
import { SearchOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { SKILLS, SKILL_CATEGORIES } from "@/lib/mockData";

const BRAND = "#3874F7";

export default function SkillsPage() {
  const [cat, setCat] = useState("全部");
  const [kw, setKw] = useState("");

  const cats = ["全部", ...SKILL_CATEGORIES];

  const list = useMemo(() => {
    let arr = SKILLS;
    if (cat !== "全部") arr = arr.filter((s) => s.category === cat);
    if (kw.trim()) {
      const k = kw.trim();
      arr = arr.filter((s) => s.name.includes(k) || s.description.includes(k));
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
          发现让 AI 更好用的 Skills
        </h1>
        <p style={{ color: "#6b7280", marginBottom: 20 }}>
          记录全球 Agent Skills，释放 AI 执行潜力
        </p>
        <Input
          allowClear
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          placeholder="搜索 Skills"
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

        {/* Skill 卡片网格 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16
          }}
        >
          {list.map((s) => (
            <div
              key={s.id}
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
                    background: "#fff7e6",
                    color: "#fa8c16",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0
                  }}
                >
                  <ThunderboltOutlined />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }} className="hover-brand-title">{s.name}</div>
                  <Tag style={{ marginTop: 2, fontSize: 11 }}>{s.category}</Tag>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#4e5969", lineHeight: 1.7, minHeight: 44 }}>
                {s.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
