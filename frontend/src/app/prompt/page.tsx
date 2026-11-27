import type { Metadata } from "next";
import Link from "next/link";
import { PROMPT_CARDS, PROMPT_CATEGORIES } from "@/lib/promptData";

export const metadata: Metadata = {
  title: "AI提示词指令大全 - toolly，AI工具资源交流社区",
  description: "一句好提示，搞定AI。收录海量优质 AI 提示词，涵盖学习成长、教育学习、职场工作、技术、写作、设计等全品类。",
  alternates: { canonical: "/prompt" }
};

/**
 * AI 提示词板块 —— 1:1 对齐目标站 ai.codefather.cn/prompt（2026-11-27 实测）。
 * 目标页：h1「一句好提示，搞定AI」+ 搜索框 + 分享/我的按钮 + 最近更新条 +
 * 19 个分类 chip（带 emoji）+ 精选/最新 tab + 4 列 article 卡片网格 + 共1845条。
 * 数据为从目标站 SSR DOM 逐字提取的 24 张真实卡片（src/lib/promptData.ts）。
 * Server Component：正文 SSR 直出，SEO 友好。
 */

const BRAND = "#1677ff";

export default function PromptPage({
  searchParams
}: {
  searchParams?: { tab?: string; tag?: string; current?: string };
}) {
  const sp = searchParams || {};
  const tab = sp.tab === "latest" ? "latest" : "featured";
  const tag = sp.tag || "";
  const current = Math.max(1, Number(sp.current) || 1);
  const total = 1845;

  // 分类筛选：chip 文本形如「📚 学习成长」，取空格后部分与卡片 tags 比对
  const tagName = tag.replace(/^\S+\s/, "");
  const cards = tagName
    ? PROMPT_CARDS.filter((c) => c.tags.includes(tagName))
    : PROMPT_CARDS;

  const chipHref = (cat: string) => {
    if (cat === "全部") return `/prompt?tab=${tab}`;
    return `/prompt?tab=${tab}&tag=${encodeURIComponent(cat)}`;
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh", paddingBottom: 60 }}>
      {/* 头部：标题 + 搜索 + 按钮 */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 30, fontWeight: 700, color: "#0f172a", margin: "0 0 20px", letterSpacing: "-0.02em" }}>
          一句好提示，搞定AI
        </h1>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <form action="/prompt" method="get" style={{ display: "flex", alignItems: "center", gap: 8,
            background: "#fff", border: "1px solid #e2e8f0", borderRadius: 9999, padding: "6px 14px",
            width: 200, boxShadow: "0 1px 2px rgba(0,0,0,.04)" }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
            </svg>
            <input name="q" placeholder="搜索 prompt" style={{ border: "none", outline: "none", background: "transparent",
              flex: 1, minWidth: 0, fontSize: 14, color: "#0f172a" }} />
            <button type="submit" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>搜索</button>
          </form>
          <Link href="/prompt?tab=latest" style={{ display: "inline-flex", alignItems: "center", height: 34, padding: "0 18px",
            borderRadius: 9999, background: BRAND, color: "#fff", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
            分享Prompt
          </Link>
          <Link href="/prompt?tab=latest" style={{ display: "inline-flex", alignItems: "center", height: 34, padding: "0 18px",
            borderRadius: 9999, background: BRAND, color: "#fff", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
            我的Prompt
          </Link>
        </div>
        {/* 最近更新条 */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 16,
          fontSize: 13, color: "#64748b", flexWrap: "wrap" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
          <span>最近更新 <b style={{ color: "#0f172a" }}>11月23日（周一）</b></span>
          <span>|</span>
          <span>本周新增 <b style={{ color: "#0f172a" }}>12 条</b></span>
          <span>|</span>
          <span>共 <b style={{ color: "#0f172a" }}>{total}</b> 条</span>
          <Link href="/prompt?tab=latest&current=1" style={{ color: BRAND, background: "#eff6ff", borderRadius: 9999,
            padding: "2px 10px", textDecoration: "none", fontSize: 12, fontWeight: 500 }}>看看新内容 →</Link>
        </div>
      </div>

      {/* 分类 chip 两行 */}
      <div style={{ maxWidth: 1100, margin: "24px auto 0", padding: "0 16px", display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {PROMPT_CATEGORIES.map((cat) => {
          const active = cat === "全部" ? !tag : cat === tag;
          return (
            <Link key={cat} href={chipHref(cat)} style={{
              display: "inline-flex", alignItems: "center", height: 32, padding: "0 12px", borderRadius: 6,
              fontSize: 13, textDecoration: "none", whiteSpace: "nowrap",
              border: `1px solid ${active ? BRAND : "#e2e8f0"}`,
              background: active ? "#eff6ff" : "#fff",
              color: active ? BRAND : "#475569",
              boxShadow: "0 1px 2px rgba(0,0,0,.03)"
            }}>{cat}</Link>
          );
        })}
      </div>

      {/* 精选/最新 tab + 总数 */}
      <div style={{ maxWidth: 1200, margin: "24px auto 0", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {(["featured", "latest"] as const).map((t) => (
            <Link key={t} href={`/prompt?tab=${t}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}
              style={{ display: "inline-flex", alignItems: "center", height: 32, padding: "0 16px", borderRadius: 8,
                fontSize: 14, fontWeight: 500, textDecoration: "none",
                background: tab === t ? "#f1f5f9" : "transparent", color: tab === t ? "#0f172a" : "#64748b" }}>
              {t === "featured" ? "精选" : "最新"}
            </Link>
          ))}
        </div>
        <span style={{ fontSize: 13, color: "#94a3b8" }}>共 {total} 条</span>
      </div>

      {/* 4 列卡片网格 */}
      <div style={{ maxWidth: 1200, margin: "12px auto 0", padding: "0 16px",
        display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
        {cards.map((c, i) => (
          <article key={`${c.title}-${i}`} style={{ background: "#fff", borderRadius: 6, border: "1px solid #f1f5f9",
            padding: "14px 14px 12px", boxShadow: "0 1px 3px rgba(0,0,0,.04)", display: "flex", flexDirection: "column", minHeight: 150 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", lineHeight: 1.4,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</div>
            <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.6, color: "#475569",
              display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 63 }}>
              {c.desc}
            </p>
            <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden" }}>
              <span style={{ maxWidth: "50%", overflow: "hidden", textOverflow: "ellipsis" }}>{c.author}</span>
              <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", background: "#f1f5f9",
                borderRadius: 4, padding: "1px 6px", fontSize: 11, color: "#94a3b8" }}>{c.source}</span>
            </div>
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {c.tags.map((t) => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 6px",
                  borderRadius: 4, background: "#f3e8ff", color: "#7e22ce", fontSize: 13 }}>{t}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      {cards.length === 0 && (
        <div style={{ textAlign: "center", color: "#94a3b8", padding: 60 }}>该分类暂无提示词</div>
      )}
    </div>
  );
}
