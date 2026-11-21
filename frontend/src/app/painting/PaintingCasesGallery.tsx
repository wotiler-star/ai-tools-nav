"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input, Tag } from "antd";
import { SearchOutlined, CopyOutlined, EyeOutlined } from "@ant-design/icons";
import { App } from "antd";
import { PAINTING_CASES, type PaintingCase } from "@/lib/paintingCases";
import SafeCover from "@/components/SafeCover";
import FavoriteButton from "@/components/FavoriteButton";

const BRAND = "#3874F7";

// 1:1 对齐目标站 /painting 的筛选维度（SSR evidence 2026-11-20）
const MODELS = ["全部", "Nano Banana Pro", "GPT-Image-2"];
const SCENES = [
  "全部场景", "🎨 人像写真", "📸 产品海报", "🎬 奇幻场景", "🍓 美食摄影",
  "📸 时尚大片", "👗 时尚人像", "🎨 角色设计", "🎨 平面设计", "📸 街拍人像",
  "☕ 室内人像", "🎨 艺术海报", "✈️ 旅行插画", "🌧️ 城市街景", "🚉 城市景观", "🎭 角色设定"
];
const sceneKey = (s: string) => s.replace(/^[^\u4e00-\u9fa5]+/, ""); // 去 emoji 前缀

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "5px 14px", borderRadius: 999, fontSize: 13, cursor: "pointer",
        fontWeight: active ? 700 : 400, color: active ? "#fff" : "#4e5969",
        background: active ? BRAND : "#f5f6f8", border: `1px solid ${active ? BRAND : "transparent"}`
      }}
    >
      {children}
    </button>
  );
}

export default function PaintingCasesGallery() {
  const { message } = App.useApp();
  const [sort, setSort] = useState<"featured" | "latest">("featured");
  const [type, setType] = useState("全部");
  const [model, setModel] = useState("全部");
  const [scene, setScene] = useState("全部场景");
  const [kw, setKw] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 24;

  const list = useMemo(() => {
    let arr = [...PAINTING_CASES];
    if (type === "模板") arr = arr.filter((c) => c.models.length === 0);
    if (type === "案例") arr = arr.filter((c) => c.models.length > 0);
    if (model !== "全部") arr = arr.filter((c) => {
      const m = model === "GPT-Image-2" ? "GPT-Image-2" : "Nano Banana Pro";
      return c.models.some((x) => x.toLowerCase().includes(m.toLowerCase().split(" ")[0]));
    });
    if (scene !== "全部场景") arr = arr.filter((c) => c.tags.includes(sceneKey(scene)));
    if (kw.trim()) {
      const q = kw.trim();
      arr = arr.filter((c) => c.title.includes(q) || c.description.includes(q) || c.tags.some((t) => t.includes(q)));
    }
    if (sort === "latest") arr.reverse();
    return arr;
  }, [sort, type, model, scene, kw]);

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const cur = Math.min(page, totalPages);
  const shown = list.slice((cur - 1) * pageSize, cur * pageSize);

  const onCopy = (e: React.MouseEvent, c: PaintingCase) => {
    e.preventDefault();
    e.stopPropagation();
    const text = c.description || c.title;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => message.success(`已复制「${c.title}」提示词`)).catch(() => message.info(text));
    } else message.info(text);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
          AI 绘图提示词大全，<span style={{ color: BRAND }}>一键出图</span>
        </h1>
        <p style={{ color: "#6b7280" }}>精选 AI 绘图提示词模板和案例，复制即可使用</p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
        <Input
          allowClear value={kw} onChange={(e) => { setKw(e.target.value); setPage(1); }}
          placeholder="搜索 AI 绘图提示词、风格"
          prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          style={{ maxWidth: 420, borderRadius: 999 }}
        />
        <button type="submit" style={{ padding: "0 20px", borderRadius: 999, border: "none", background: BRAND, color: "#fff", cursor: "pointer" }}>搜索</button>
      </form>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 12 }}>
        <Pill active={sort === "featured"} onClick={() => { setSort("featured"); setPage(1); }}>精选</Pill>
        <Pill active={sort === "latest"} onClick={() => { setSort("latest"); setPage(1); }}>最新</Pill>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: "#86909c", alignSelf: "center" }}>类型</span>
        {["全部", "模板", "案例"].map((t) => <Pill key={t} active={type === t} onClick={() => { setType(t); setPage(1); }}>{t}</Pill>)}
        <span style={{ fontSize: 13, color: "#86909c", alignSelf: "center", marginLeft: 12 }}>模型</span>
        {MODELS.map((m) => <Pill key={m} active={model === m} onClick={() => { setModel(m); setPage(1); }}>{m}</Pill>)}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {SCENES.map((s) => <Pill key={s} active={scene === s} onClick={() => { setScene(s); setPage(1); }}>{s}</Pill>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {shown.map((c) => (
          <Link key={c.id} href={`/painting/template/${c.id}`} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", display: "block", textDecoration: "none" }} className="group hover-brand tool-card">
            <div style={{ position: "relative", height: 150, overflow: "hidden", background: "#f5f6f8" }}>
              <SafeCover src={c.cover} alt={c.title} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
              <span style={{ position: "absolute", left: 8, top: 8, background: "rgba(0,0,0,.55)", color: "#fff", fontSize: 11, borderRadius: 4, padding: "2px 6px" }}>案例</span>
            </div>
            <div style={{ padding: 14 }}>
              <h3 style={{ fontWeight: 600, fontSize: 15, margin: "0 0 8px" }} className="hover-brand-title">{c.title}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                {c.tags.slice(0, 3).map((t) => <Tag key={t} color="blue" style={{ margin: 0, fontSize: 11 }}>#{t}</Tag>)}
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.description}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, fontSize: 12, color: "#9ca3af" }}>
                <span><EyeOutlined /> 查看详情</span>
                <span onClick={(e) => onCopy(e, c)} title="复制提示词" style={{ cursor: "pointer", padding: "0 4px" }}><CopyOutlined /></span>
                <FavoriteButton targetType="prompt" targetId={Number(c.id.slice(-6))} size={12} />
              </div>
            </div>
          </Link>
        ))}
      </div>
      {shown.length === 0 && <div style={{ textAlign: "center", color: "#9ca3af", padding: 40 }}>暂无匹配的绘图案例</div>}

      {/* 分页：目标站 pageSize=24 */}
      {list.length > pageSize && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 28 }}>
          <button type="button" disabled={cur <= 1} onClick={() => setPage(cur - 1)}
            style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid #eaecef", background: "#fff", cursor: cur <= 1 ? "not-allowed" : "pointer", opacity: cur <= 1 ? 0.5 : 1 }}>上一页</button>
          <span style={{ fontSize: 13, color: "#6b7280" }}>第 {cur} / {totalPages} 页 · 共 {list.length} 条</span>
          <button type="button" disabled={cur >= totalPages} onClick={() => setPage(cur + 1)}
            style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid #eaecef", background: "#fff", cursor: cur >= totalPages ? "not-allowed" : "pointer", opacity: cur >= totalPages ? 0.5 : 1 }}>下一页</button>
        </div>
      )}
    </div>
  );
}
