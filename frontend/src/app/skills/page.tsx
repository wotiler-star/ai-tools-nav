import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { SKILL_CATEGORIES_NEW } from "@/lib/skillsCategories";

interface SkillItem {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  time: number;
}

function loadAll(): SkillItem[] {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "skills-list.json"), "utf8"));
  } catch { return []; }
}

const PAGE_SIZE = 24;
const BRAND = "#1677ff";

export const metadata: Metadata = {
  title: "AI Skills 技能大全 - toolly，AI工具资源交流社区",
  description: "发现让 AI 更好用的 Skills，记录全球 Agent Skills，释放 AI 执行潜力。",
  alternates: { canonical: "/skills" }
};

/**
 * Skills 板块 —— 1:1 对齐目标站 ai.codefather.cn/skills（2026-11-28 实测）
 * 白底 + h1 + 搜索框(带按钮) + 信息条 + 14 个 emoji 分类 chip + 精选/最新 tab
 * + 4 列左对齐卡片(标题 + geekblue tag + 2 行描述) + antd 分页。
 */
export default function SkillsPage({
  searchParams
}: {
  searchParams?: { tab?: string; tag?: string; current?: string; q?: string };
}) {
  const sp = searchParams || {};
  const tab = sp.tab === "latest" ? "latest" : "featured";
  const tag = sp.tag || "";
  const q = sp.q || "";
  const current = Math.max(1, Number(sp.current) || 1);

  const all = loadAll();
  const ordered = tab === "latest" ? [...all].sort((a, b) => b.time - a.time) : all;
  // chip 文本带 emoji 前缀（如「🌟 Claude官方」），数据 tags 不带 → 去掉首个空格前部分
  const tagName = tag.replace(/^\S+\s/, "");
  let filtered = tagName ? ordered.filter((c) => c.tags.includes(tagName)) : ordered;
  if (q.trim()) {
    const kw = q.trim().toLowerCase();
    filtered = filtered.filter((c) => `${c.title} ${c.desc} ${c.tags.join(" ")}`.toLowerCase().includes(kw));
  }
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(current, totalPages);
  const cards = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const buildHref = (o: { tab?: string; tag?: string; current?: number; q?: string }) => {
    const p = new URLSearchParams();
    p.set("tab", o.tab ?? tab);
    if (o.tag !== undefined ? o.tag : tag) p.set("tag", o.tag !== undefined ? o.tag : tag);
    if (o.q !== undefined ? o.q : q) p.set("q", o.q !== undefined ? o.q : q);
    if (o.current && o.current > 1) p.set("current", String(o.current));
    const s = p.toString();
    return `/skills${s ? `?${s}` : ""}`;
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh", paddingBottom: 60 }}>
      <div style={{ maxWidth: 1312, margin: "0 auto", padding: "36px 16px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 30, fontWeight: 600, color: "#0f172a", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
          发现让 AI 更好用的 Skills
        </h1>
        <p style={{ margin: "0 0 20px", fontSize: 18, color: "#64748b" }}>
          记录全球 Agent Skills，释放 AI 执行潜力
        </p>
        <form action="/skills" method="get" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, maxWidth: 600, margin: "0 auto" }}>
          <input type="hidden" name="tab" value={tab} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0, height: 40,
            background: "#fff", border: "1px solid #e2e8f0", borderRadius: 9999, padding: "0 16px" }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
            </svg>
            <input name="q" placeholder="搜索 Skills" defaultValue={q}
              style={{ border: "none", outline: "none", background: "transparent", flex: 1, minWidth: 0, fontSize: 14, color: "#0f172a" }} />
          </div>
          <button type="submit" style={{ height: 40, padding: "0 22px", borderRadius: 9999, border: "none",
            background: BRAND, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>搜索</button>
        </form>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 16,
          fontSize: 13, color: "#64748b", flexWrap: "wrap" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
          <span>最近更新 <b style={{ color: "#0f172a" }}>11月4日（周三）</b></span>
          <span>|</span>
          <span>本周新增 <b style={{ color: "#0f172a" }}>3 条</b></span>
          <span>|</span>
          <span>共 <b style={{ color: "#0f172a" }}>{tag || q ? total : 16453}</b> 条</span>
          <Link href="/skills?tab=latest&current=1" style={{ color: BRAND, background: "#eff6ff", borderRadius: 9999,
            padding: "2px 10px", textDecoration: "none", fontSize: 12, fontWeight: 500 }}>查看新内容 →</Link>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "24px auto 0", padding: "0 16px", display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {SKILL_CATEGORIES_NEW.map((cat) => {
          const active = cat.replace(/^\S+\s/, "") === tagName;
          return (
            <Link key={cat} href={buildHref({ tag: cat, current: 1 })} style={{
              display: "inline-flex", alignItems: "center", height: 32, padding: "0 10px", borderRadius: 6,
              fontSize: 13, textDecoration: "none", whiteSpace: "nowrap",
              border: `1px solid ${active ? BRAND : "#e2e8f0"}`,
              background: active ? "#eff6ff" : "#fff",
              color: active ? BRAND : "#334155",
              boxShadow: "0 1px 2px rgba(0,0,0,.03)"
            }}>{cat}</Link>
          );
        })}
      </div>

      <div style={{ maxWidth: 1312, margin: "24px auto 0", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "inline-flex", gap: 2, background: "#f1f5f9", borderRadius: 10, padding: 3 }}>
          {(["featured", "latest"] as const).map((t) => (
            <Link key={t} href={buildHref({ tab: t, current: 1 })}
              style={{ display: "inline-flex", alignItems: "center", height: 32, padding: "0 16px", borderRadius: 8,
                fontSize: 14, fontWeight: 500, textDecoration: "none",
                background: tab === t ? "#fff" : "transparent", color: tab === t ? "#0f172a" : "#64748b",
                boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,.08)" : "none" }}>
              {t === "featured" ? "精选" : "最新"}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1312, margin: "20px auto 0", padding: "0 16px",
        display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        {cards.map((c) => (
          <Link key={c.id} href={`/skills/${c.id}`} className="nav-item-card"
            style={{ background: "#fff", borderRadius: 8, border: "1px solid #f1f5f9",
              padding: 16, textDecoration: "none", display: "block", minWidth: 0, boxShadow: "0 1px 2px rgba(0,0,0,.03)" }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: "#0f172a", lineHeight: 1.4,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 8 }}>{c.title}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
              {c.tags.slice(0, 4).map((t) => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", height: 22, padding: "0 7px",
                  borderRadius: 4, border: "none", background: "#f0f5ff", color: "#1d39c4", fontSize: 12 }}>{t}</span>
              ))}
            </div>
            <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, height: 40,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.desc}</div>
          </Link>
        ))}
      </div>
      {cards.length === 0 && <div style={{ textAlign: "center", color: "#94a3b8", padding: 60 }}>该分类暂无 Skills</div>}

      {totalPages > 1 && (
        <div style={{ maxWidth: 1312, margin: "28px auto 0", padding: "0 16px", display: "flex", justifyContent: "center", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Link href={buildHref({ current: Math.max(1, safePage - 1) })} aria-disabled={safePage <= 1}
            style={{ minWidth: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center",
              border: "1px solid #e2e8f0", borderRadius: 6, color: safePage <= 1 ? "#cbd5e1" : "#475569", textDecoration: "none",
              pointerEvents: safePage <= 1 ? "none" : "auto" }}>‹</Link>
          {(() => {
            const pages: (number | string)[] = [];
            const span = 2;
            let start = Math.max(1, safePage - span); let end = Math.min(totalPages, safePage + span);
            if (safePage <= span + 1) end = Math.min(totalPages, 2 * span + 2);
            if (safePage >= totalPages - span) start = Math.max(1, totalPages - 2 * span - 1);
            if (start > 1) { pages.push(1); if (start > 2) pages.push("…"); }
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages) { if (end < totalPages - 1) pages.push("…"); pages.push(totalPages); }
            return pages.map((p, i) => typeof p === "number" ? (
              <Link key={`p${p}`} href={buildHref({ current: p })}
                style={{ minWidth: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "0 8px", border: `1px solid ${p === safePage ? BRAND : "#e2e8f0"}`, borderRadius: 6,
                  background: p === safePage ? BRAND : "#fff", color: p === safePage ? "#fff" : "#475569", fontSize: 13, textDecoration: "none" }}>{p}</Link>
            ) : <span key={`e${i}`} style={{ color: "#94a3b8", padding: "0 4px" }}>{p}</span>);
          })()}
          <Link href={buildHref({ current: Math.min(totalPages, safePage + 1) })} aria-disabled={safePage >= totalPages}
            style={{ minWidth: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center",
              border: "1px solid #e2e8f0", borderRadius: 6, color: safePage >= totalPages ? "#cbd5e1" : "#475569", textDecoration: "none",
              pointerEvents: safePage >= totalPages ? "none" : "auto" }}>›</Link>
          <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 8 }}>第 {safePage} / {totalPages} 页</span>
        </div>
      )}
    </div>
  );
}
