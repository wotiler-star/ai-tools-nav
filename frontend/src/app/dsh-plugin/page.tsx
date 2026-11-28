import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { DSH_PLUGIN_TAGS } from "@/lib/dshPluginData";

interface PluginItem {
  id: string;
  title: string;
  desc: string;
  tag: string;
  time: number;
}

/** 服务端读取全量插件 JSON（不进客户端 bundle，SSR 直出） */
function loadAllPlugins(): PluginItem[] {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "data", "dsh-plugins.json"), "utf8");
    return JSON.parse(raw) as PluginItem[];
  } catch {
    return [];
  }
}

const PAGE_SIZE = 24;
const BRAND = "#1677ff";

export const metadata: Metadata = {
  title: "DeepSeek Harness 插件大全 - toolly，AI工具资源交流社区",
  description: "发现好用的 DeepSeek Harness 插件，一切皆插件，定制你的 AI 编程工具。",
  alternates: { canonical: "/dsh-plugin" }
};

/**
 * DSH 插件板块 —— 1:1 对齐目标站 ai.codefather.cn/dsh-plugin（2026-11-28 实测）
 * 目标页：h1「发现好用的 DeepSeek Harness 插件」+ 副标题 + 搜索框(带搜索按钮) +
 * 信息条(最近更新/本周新增/共N条) + 20 个分类 chip + 精选/最新 tab +
 * 4 列卡片网格(标题 + geekblue tag + 2行描述) + 分页。
 * Server Component：正文 SSR 直出，SEO 友好。
 */
export default function DshPluginPage({
  searchParams
}: {
  searchParams?: { tab?: string; tag?: string; current?: string; q?: string };
}) {
  const sp = searchParams || {};
  const tab = sp.tab === "latest" ? "latest" : "featured";
  const tag = sp.tag || "";
  const q = sp.q || "";
  const current = Math.max(1, Number(sp.current) || 1);

  const all = loadAllPlugins();
  // latest 按时间倒序；featured 保持实测精选顺序（首页24条与目标站逐字一致）
  const ordered = tab === "latest" ? [...all].sort((a, b) => b.time - a.time) : all;
  let filtered = tag ? ordered.filter((c) => c.tag === tag) : ordered;
  if (q.trim()) {
    const kw = q.trim().toLowerCase();
    filtered = filtered.filter((c) => `${c.title} ${c.desc} ${c.tag}`.toLowerCase().includes(kw));
  }
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(current, totalPages);
  const cards = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const buildHref = (opts: { tab?: string; tag?: string; current?: number; q?: string }) => {
    const p = new URLSearchParams();
    p.set("tab", opts.tab ?? tab);
    if (opts.tag !== undefined ? opts.tag : tag) p.set("tag", opts.tag !== undefined ? opts.tag : tag);
    if (opts.q !== undefined ? opts.q : q) p.set("q", opts.q !== undefined ? opts.q : q);
    if (opts.current && opts.current > 1) p.set("current", String(opts.current));
    const s = p.toString();
    return `/dsh-plugin${s ? `?${s}` : ""}`;
  };
  const chipHref = (cat: string) => buildHref({ tag: cat, current: 1 });

  return (
    <div style={{ background: "#fff", minHeight: "100vh", paddingBottom: 60 }}>
      {/* 头部：标题 + 副标题 + 搜索框 */}
      <div style={{ maxWidth: 1312, margin: "0 auto", padding: "36px 16px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 30, fontWeight: 600, color: "#0f172a", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
          发现好用的 DeepSeek Harness 插件
        </h1>
        <p style={{ margin: "0 0 20px", fontSize: 18, color: "#64748b" }}>
          一切皆插件，定制你的 AI 编程工具
        </p>
        <form action="/dsh-plugin" method="get"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, maxWidth: 600, margin: "0 auto" }}>
          <input type="hidden" name="tab" value={tab} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0, height: 40,
            background: "#fff", border: "1px solid #e2e8f0", borderRadius: 9999, padding: "0 16px" }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
            </svg>
            <input name="q" placeholder="搜索 DSH 插件" defaultValue={q}
              style={{ border: "none", outline: "none", background: "transparent", flex: 1, minWidth: 0, fontSize: 14, color: "#0f172a" }} />
          </div>
          <button type="submit" style={{ height: 40, padding: "0 22px", borderRadius: 9999, border: "none",
            background: BRAND, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>搜索</button>
        </form>

        {/* 信息条 */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 16,
          fontSize: 13, color: "#64748b", flexWrap: "wrap" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
          <span>最近更新 <b style={{ color: "#0f172a" }}>11月22日（周日）</b></span>
          <span>|</span>
          <span>本周新增 <b style={{ color: "#0f172a" }}>20 条</b></span>
          <span>|</span>
          <span>共 <b style={{ color: "#0f172a" }}>{tag || q ? total : 3427}</b> 条</span>
          <Link href="/dsh-plugin?tab=latest&current=1" style={{ color: BRAND, background: "#eff6ff", borderRadius: 9999,
            padding: "2px 10px", textDecoration: "none", fontSize: 12, fontWeight: 500 }}>查看新内容 →</Link>
        </div>
      </div>

      {/* 分类 chip（20 个，两行） */}
      <div style={{ maxWidth: 1280, margin: "24px auto 0", padding: "0 16px", display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {DSH_PLUGIN_TAGS.map((cat) => {
          const active = cat === tag;
          return (
            <Link key={cat} href={chipHref(cat)} style={{
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

      {/* 精选/最新 tab（灰底圆角容器） */}
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

      {/* 4 列卡片网格（gap 12px，卡片圆角 8px） */}
      <div style={{ maxWidth: 1312, margin: "20px auto 0", padding: "0 16px",
        display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        {cards.map((c) => (
          <Link key={c.id} href={`/dsh-plugin/${c.id}`} className="nav-item-card"
            style={{ background: "#fff", borderRadius: 8, border: "1px solid #f1f5f9",
              padding: 16, textDecoration: "none", display: "block", minWidth: 0,
              boxShadow: "0 1px 2px rgba(0,0,0,.03)" }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: "#0f172a", lineHeight: 1.4,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 8 }}>
              {c.title}
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", height: 22, padding: "0 7px",
                borderRadius: 4, border: "none", background: "#f0f5ff", color: "#1d39c4", fontSize: 12 }}>
                {c.tag}
              </span>
            </div>
            <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, height: 40,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {c.desc}
            </div>
          </Link>
        ))}
      </div>
      {cards.length === 0 && (
        <div style={{ textAlign: "center", color: "#94a3b8", padding: 60 }}>该分类暂无插件</div>
      )}

      {/* 分页：antd 风格，对齐目标站 */}
      {totalPages > 1 && (
        <div style={{ maxWidth: 1312, margin: "28px auto 0", padding: "0 16px", display: "flex", justifyContent: "center", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Link href={buildHref({ current: Math.max(1, safePage - 1) })}
            aria-disabled={safePage <= 1}
            style={{ minWidth: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center",
              border: "1px solid #e2e8f0", borderRadius: 6, color: safePage <= 1 ? "#cbd5e1" : "#475569", textDecoration: "none",
              pointerEvents: safePage <= 1 ? "none" : "auto" }}>‹</Link>
          {(() => {
            const pages: (number | string)[] = [];
            const span = 2;
            let start = Math.max(1, safePage - span);
            let end = Math.min(totalPages, safePage + span);
            if (safePage <= span + 1) end = Math.min(totalPages, 2 * span + 2);
            if (safePage >= totalPages - span) start = Math.max(1, totalPages - 2 * span - 1);
            if (start > 1) { pages.push(1); if (start > 2) pages.push("…"); }
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages) { if (end < totalPages - 1) pages.push("…"); pages.push(totalPages); }
            return pages.map((p, i) => typeof p === "number" ? (
              <Link key={`p${p}`} href={buildHref({ current: p })}
                style={{ minWidth: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "0 8px", border: `1px solid ${p === safePage ? BRAND : "#e2e8f0"}`, borderRadius: 6,
                  background: p === safePage ? BRAND : "#fff", color: p === safePage ? "#fff" : "#475569",
                  fontSize: 13, textDecoration: "none" }}>{p}</Link>
            ) : <span key={`e${i}`} style={{ color: "#94a3b8", padding: "0 4px" }}>{p}</span>);
          })()}
          <Link href={buildHref({ current: Math.min(totalPages, safePage + 1) })}
            aria-disabled={safePage >= totalPages}
            style={{ minWidth: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center",
              border: "1px solid #e2e8f0", borderRadius: 6, color: safePage >= totalPages ? "#cbd5e1" : "#475569", textDecoration: "none",
              pointerEvents: safePage >= totalPages ? "none" : "auto" }}>›</Link>
          <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 8 }}>第 {safePage} / {totalPages} 页</span>
        </div>
      )}
    </div>
  );
}
