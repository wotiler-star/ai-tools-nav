"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Input, Tag, App, Spin } from "antd";
import { SearchOutlined, FireOutlined, CopyOutlined } from "@ant-design/icons";
import { AiPrompt, BaseResponsePage } from "@/types";
import { swrFetcher } from "@/lib/api";
import FavoriteButton from "@/components/FavoriteButton";

const BRAND = "#3874F7";

function colorFromName(name: string): string {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h}, 60%, 62%)`;
}

export default function PaintingPage() {
  const { message } = App.useApp();
  const [cat, setCat] = useState("全部");
  const [kw, setKw] = useState("");

  const { data, isLoading } = useSWR<BaseResponsePage<AiPrompt>>(
    "/ai_prompt/list/page?current=1&pageSize=50",
    swrFetcher
  );

  const records = useMemo(() => data?.data?.records || [], [data]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => r.categoryName && set.add(r.categoryName));
    return ["全部", ...Array.from(set)];
  }, [records]);

  const list = useMemo(() => {
    let base = records;
    if (cat !== "全部") base = base.filter((p) => p.categoryName === cat);
    if (kw.trim()) {
      const q = kw.trim();
      base = base.filter((p) => p.title.includes(q) || (p.content || "").includes(q));
    }
    return base;
  }, [records, cat, kw]);

  const onCopy = async (p: AiPrompt) => {
    const text = p.content || "";
    try {
      await navigator.clipboard.writeText(text);
      message.success(`已复制「${p.title}」提示词`);
    } catch {
      message.info(text);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      {/* 标题 */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>AI 提示词大全</h1>
        <p style={{ color: "#6b7280" }}>精选高质量提示词，一键复制复用</p>
      </div>

      {/* 分类 Tab */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        {categories.map((c) => (
          <span
            key={c}
            onClick={() => setCat(c)}
            style={{
              padding: "6px 16px",
              borderRadius: 999,
              fontSize: 14,
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

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <Input
          allowClear
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          placeholder="搜索提示词"
          prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          style={{ maxWidth: 420, borderRadius: 999 }}
        />
      </div>

      {/* 模板网格 */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin />
        </div>
      ) : (
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
              onClick={() => onCopy(p)}
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
                  background: `linear-gradient(135deg, ${colorFromName(
                    p.categoryName || p.title
                  )}, #ffffff)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 30,
                  fontWeight: 800
                }}
              >
                <CopyOutlined />
              </div>
              <div style={{ padding: 14 }}>
                <div
                  style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}
                  className="hover-brand-title"
                >
                  {p.title}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  <Tag color="blue" style={{ margin: 0, fontSize: 12 }}>
                    {p.categoryName || "通用"}
                  </Tag>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: 1.5,
                    marginBottom: 8
                  }}
                >
                  {p.content}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "#9ca3af"
                  }}
                >
                  <span>
                    <FireOutlined style={{ color: "#ff7a45" }} /> 使用 {p.useCount}
                  </span>
                  <FavoriteButton targetType="prompt" targetId={p.id} style={{ fontSize: 12 }} size={12} />
                </div>
              </div>
            </div>
          ))}

          {list.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#9ca3af", padding: 40 }}>
              暂无提示词
            </div>
          )}
        </div>
      )}
    </div>
  );
}
