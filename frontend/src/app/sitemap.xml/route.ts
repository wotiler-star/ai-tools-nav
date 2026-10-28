import { SITE } from "@/config/site";
import { AI_NEWS } from "@/lib/mockData";
import type { AiArticle, AiColumn, AiTool, BaseResponsePage, Category } from "@/types";

/**
 * 运行时动态 sitemap.xml
 *
 * 背景：原先的 app/sitemap.ts 直接引用 mockData 的假数据生成 URL，
 * 而生产环境 NEXT_PUBLIC_USE_MOCK=false 走真实数据库，两套 id 完全错位，
 * 导致提交给 Google 的 /tool/{id}、/library/{id} 指向错误内容甚至 404。
 * 这里改为运行时从后端真实接口拉取，保证与线上内容一致。
 *
 * 为什么用 Route Handler 而不是 app/sitemap.ts：
 * sitemap.ts 在构建期执行，而 docker build 阶段 backend 尚未启动，
 * 拉不到数据；运行时生成还能让新增内容自动进入 sitemap。
 */

/** 容器内网直连后端（同属 ainav-net），不经 nginx 回环 */
const INTERNAL_API = process.env.SITEMAP_API_BASE || "http://backend:8123/api";

/**
 * 必须强制运行时动态执行：该路由要在容器内网访问 backend 拉真实数据。
 * 若用 export const revalidate，Next 会在 docker build 阶段预渲染（此时 backend
 * 在构建网络里不可达）并缓存空 sitemap，导致线上长期只输出静态页。
 */
export const dynamic = "force-dynamic";

/** 单个数据源最多翻多少页，防止异常分页把 sitemap 拖垮 */
const MAX_PAGES = 20;
/** sitemap 单文件上限 5 万条，留足余量 */
const MAX_URLS = 45000;

type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface Entry {
  loc: string;
  lastmod?: string;
  changefreq?: Freq;
  priority?: number;
}

/** 社区帖子最小结构（用于 sitemap，字段对齐 AiPost） */
interface AiPostLite {
  id?: string | number;
  status?: number;
}

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;"
};

function esc(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => XML_ESCAPES[c]);
}

/** 只接受 http(s) 绝对地址，且必须是本站域名，避免把脏数据写进 sitemap */
function safeUrl(base: string, path: string): string | null {
  try {
    const u = new URL(path, base);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    if (u.host !== new URL(base).host) return null;
    return u.toString();
  } catch {
    return null;
  }
}

async function getJSON<T>(path: string, params: Record<string, unknown>): Promise<T | null> {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.append(k, String(v));
  });
  const url = `${INTERNAL_API}${path}?${usp.toString()}`;
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { code?: number };
    if (json?.code !== undefined && json.code !== 0) return null;
    return json as T;
  } catch {
    return null;
  }
}

/** 翻页拉全量；任一页失败即停止，返回已拿到的数据 */
async function fetchAll<T>(
  path: string,
  extra: Record<string, unknown> = {},
  pageSize = 100
): Promise<T[]> {
  const out: T[] = [];
  for (let current = 1; current <= MAX_PAGES; current++) {
    const res = await getJSON<BaseResponsePage<T>>(path, { current, pageSize, ...extra });
    const records = res?.data?.records;
    const total = res?.data?.total;
    if (!Array.isArray(records) || records.length === 0) break;
    out.push(...records);
    if (typeof total === "number" && out.length >= total) break;
  }
  return out;
}

function toEntry(
  base: string,
  path: string,
  opts: { lastmod?: string; changefreq?: Freq; priority?: number }
): Entry | null {
  const loc = safeUrl(base, path);
  if (!loc) return null;
  return { loc, ...opts };
}

function render(entries: Entry[]): string {
  const body = entries
    .map((e) => {
      let s = "  <url>\n";
      s += `    <loc>${esc(e.loc)}</loc>\n`;
      if (e.lastmod) s += `    <lastmod>${esc(e.lastmod)}</lastmod>\n`;
      if (e.changefreq) s += `    <changefreq>${e.changefreq}</changefreq>\n`;
      if (e.priority !== undefined) s += `    <priority>${e.priority.toFixed(1)}</priority>\n`;
      s += "  </url>";
      return s;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

export async function GET() {
  const base = `https://${SITE.domain}`;
  const today = new Date().toISOString().slice(0, 10);

  // 静态路由
  const staticPaths: Array<[string, Freq, number]> = [
    ["/", "daily", 1.0],
    ["/tool", "daily", 0.9],
    ["/essay", "daily", 0.8],
    ["/painting", "weekly", 0.7],
    ["/news", "daily", 0.7],
    ["/mcp", "weekly", 0.7],
    ["/skills", "weekly", 0.7],
    ["/resource/learn", "weekly", 0.7],
    ["/library", "weekly", 0.8]
  ];

  const entries: Entry[] = [];
  for (const [p, f, pr] of staticPaths) {
    const e = toEntry(base, p, { lastmod: today, changefreq: f, priority: pr });
    if (e) entries.push(e);
  }

  // 动态：工具详情
  for (const t of await fetchAll<AiTool>("/ai_tool/list/page")) {
    const e = toEntry(base, `/tool/${t.id}`, { lastmod: today, changefreq: "weekly", priority: 0.6 });
    if (e) entries.push(e);
  }

  // 动态：知识库专栏（仅已发布 status=1）
  const columns = await fetchAll<AiColumn>("/ai_column/list");
  for (const c of columns) {
    if (c.status !== undefined && c.status !== 1) continue;
    const e = toEntry(base, `/library/${c.id}`, {
      lastmod: c.createTime ? String(c.createTime).slice(0, 10) : today,
      changefreq: "weekly",
      priority: 0.7
    });
    if (e) entries.push(e);
  }

  // 动态：知识库文章（仅已发布 status=1，需 columnId 拼二级路径）
  const articles = await fetchAll<AiArticle>("/ai_column/article/list");
  for (const a of articles) {
    if (a.status !== undefined && a.status !== 1) continue;
    if (!a.columnId) continue;
    const e = toEntry(base, `/library/${a.columnId}/${a.id}`, {
      lastmod: a.createTime ? String(a.createTime).slice(0, 10) : today,
      changefreq: "monthly",
      priority: 0.5
    });
    if (e) entries.push(e);
  }

  // 动态：分类页（/category/list 返回 { code, data: Category[] }，data 直接是数组）
  const catRes = await getJSON<{ code: number; data: Category[] }>("/category/list", {});
  for (const c of catRes?.data ?? []) {
    const e = toEntry(base, `/category/${c.id}`, { lastmod: today, changefreq: "weekly", priority: 0.5 });
    if (e) entries.push(e);
  }

  // 动态：社区帖子（/essay/{id}，仅已发布 status=1）
  for (const p of await fetchAll<AiPostLite>("/ai_post/list/page")) {
    if (p.status !== undefined && p.status !== 1) continue;
    const e = toEntry(base, `/essay/${p.id}`, { lastmod: today, changefreq: "weekly", priority: 0.5 });
    if (e) entries.push(e);
  }

  // 动态：资讯详情（AI_NEWS 为前端 mock，生产同样稳定，id 固定）
  for (const n of AI_NEWS) {
    const e = toEntry(base, `/news/${n.id}`, { lastmod: today, changefreq: "daily", priority: 0.6 });
    if (e) entries.push(e);
  }

  const finalEntries = entries.slice(0, MAX_URLS);

  return new Response(render(finalEntries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600"
    }
  });
}
