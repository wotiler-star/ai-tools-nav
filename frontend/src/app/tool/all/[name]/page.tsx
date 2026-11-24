import type { Metadata } from "next";
import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import type { AiTool, Category } from "@/types";

/**
 * /tool/all/{分类名} 分类独立页 —— 1:1 对齐目标站 ai.codefather.cn/tool/all/{name}
 * 目标站页型：标题「XX相关工具全站搜索」+ 搜索表单(q/current/pageSize 隐藏字段)
 *            + 50 卡/页(5列网格) + ant 分页；pathname 段是 URL 编码中文，标题原样显示编码串。
 * 本站用真实后端数据分页，统计口径用本站真实 total（不照抄目标 750）。
 */
export const dynamic = "force-dynamic";

const SERVER_API = process.env.INTERNAL_API_BASE || "http://backend:8123";
const PAGE_SIZE = 50;

interface PageResult<T> {
  records: T[];
  total: number;
  size?: number;
  current?: number;
  pages?: number;
}

async function serverFetch<T = any>(path: string, params?: Record<string, any>): Promise<T | null> {
  try {
    const url = new URL(`${SERVER_API}/api${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
      });
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url.toString(), { cache: "no-store", signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.code !== 0 && json?.code !== undefined) return null;
    return (json.data as T) ?? null;
  } catch {
    return null;
  }
}

/** pathname 段 → 解码分类名（目标站查询用解码值，标题用原样编码串） */
function decodeName(name: string): string {
  try { return decodeURIComponent(name); } catch { return name; }
}

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const raw = params.name;
  return {
    title: `${raw}相关工具全站搜索 - AI工具`,
    description: `在 toolly 搜索「${decodeName(raw)}」相关的全部 AI 工具，收录全球 AI 工具网站应用。`,
    alternates: { canonical: `/tool/all/${raw}` }
  };
}

export default async function ToolCategoryPage({
  params,
  searchParams
}: {
  params: { name: string };
  searchParams: { q?: string; current?: string; pageSize?: string };
}) {
  const rawName = params.name;
  const catName = decodeName(rawName);
  const sp = searchParams || {};
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const current = Math.max(1, Number(sp.current) || 1);
  const pageSize = Math.min(200, Math.max(1, Number(sp.pageSize) || PAGE_SIZE));

  // 单次取分类，再按分类名解析 categoryId（只发一次 /category/list，降低 TTFB）
  const cats = await serverFetch<Category[]>("/category/list");
  const cat = cats?.find((c) => c.name === catName);
  const toolRes = await serverFetch<PageResult<AiTool>>("/ai_tool/list/page", {
    categoryId: cat?.id || 0,
    keyword: q || undefined,
    current,
    pageSize
  });

  const total = toolRes?.total ?? 0;
  const records: AiTool[] = toolRes?.records ?? [];
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageBase = `/tool/all/${rawName}`;
  const queryPrefix = q ? `q=${encodeURIComponent(q)}&` : "";

  // ant 分页页码列表（最多展示 7 个，首尾省略）
  const pageNumbers: number[] = [];
  const span = 3;
  let start = Math.max(1, current - span);
  let end = Math.min(totalPages, current + span);
  if (current <= span + 1) end = Math.min(totalPages, 2 * span + 2);
  if (current >= totalPages - span) start = Math.max(1, totalPages - 2 * span - 1);
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px 64px" }}>
      {/* 1:1 目标站：标题为解码分类名 + 「相关工具全站搜索」同一行，text-4xl/font-semibold/my-4 */}
      <h1 style={{ fontSize: 36, fontWeight: 600, margin: "16px 0", padding: "0 4px" }}>
        {catName}<span style={{ fontWeight: 400 }}>相关工具全站搜索</span>
      </h1>

      {/* 搜索表单：GET 提交，q/current/pageSize 与目标站一致；目标 placeholder 动态含类目名、搜索按钮 sr-only */}
      <form action={pageBase} method="get" style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder={`搜索 ${catName} 工具`}
          style={{ flex: 1, maxWidth: 460, padding: "8px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
        />
        <input type="hidden" name="current" value="1" />
        <input type="hidden" name="pageSize" value={String(pageSize)} />
        <button type="submit" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>搜索</button>
      </form>

      {/* 5 列网格（对齐目标站 lg:grid-cols-5 gap-4） */}
      <div className="tool-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
        {records.map((t) => <ToolCard key={t.id} tool={t} />)}
      </div>
      {records.length === 0 && (
        <div style={{ textAlign: "center", color: "#9ca3af", padding: 60 }}>暂无数据<br />搜索结果为空</div>
      )}

      {/* ant 风格分页（对齐目标站 mt-4 flex justify-end） */}
      {totalPages > 1 && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4 }}>
          <Link
            href={current <= 1 ? "#" : `${pageBase}?${queryPrefix}current=${current - 1}&pageSize=${pageSize}`}
            aria-disabled={current <= 1}
            title="上一页"
            style={{ padding: "5px 10px", border: "1px solid #d9d9d9", borderRadius: 6, color: current <= 1 ? "#bfbfbf" : "#3874F7", textDecoration: "none", pointerEvents: current <= 1 ? "none" : "auto" }}
          >‹</Link>
          {start > 1 && <span style={{ padding: "0 4px", color: "#8c8c8c" }}>1 …</span>}
          {pageNumbers.map((p) => (
            <Link
              key={p}
              href={`${pageBase}?${queryPrefix}current=${p}&pageSize=${pageSize}`}
              style={{
                minWidth: 30, textAlign: "center", padding: "5px 9px", borderRadius: 6, fontSize: 13, textDecoration: "none",
                border: `1px solid ${p === current ? "#3874F7" : "#d9d9d9"}`,
                background: p === current ? "#3874F7" : "#fff",
                color: p === current ? "#fff" : "#434343"
              }}
            >{p}</Link>
          ))}
          {end < totalPages && <span style={{ padding: "0 4px", color: "#8c8c8c" }}>… {totalPages}</span>}
          <Link
            href={current >= totalPages ? "#" : `${pageBase}?${queryPrefix}current=${current + 1}&pageSize=${pageSize}`}
            aria-disabled={current >= totalPages}
            title="下一页"
            style={{ padding: "5px 10px", border: "1px solid #d9d9d9", borderRadius: 6, color: current >= totalPages ? "#bfbfbf" : "#3874F7", textDecoration: "none", pointerEvents: current >= totalPages ? "none" : "auto" }}
          >›</Link>
        </div>
      )}
      <div style={{ textAlign: "right", marginTop: 8, fontSize: 12, color: "#9ca3af" }}>
        共 {total} 个工具 · 第 {current} / {totalPages} 页
      </div>

    </div>
  );
}
