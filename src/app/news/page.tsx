import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import NewsCard from "@/components/NewsCard";
import { parseJsonTags } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI 资讯",
  description: "每日 AI 行业资讯、产品动态、技术发布与深度解读，一站式掌握人工智能前沿。",
  alternates: { canonical: "/news" },
};

const PAGE_SIZE = 12;

type SP = { q?: string; tag?: string; sort?: string; page?: string };

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const tag = (sp.tag || "").trim();
  const sort = sp.sort === "hot" ? "hot" : "latest";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const where: any = { published: true };
  if (q) where.OR = [{ title: { contains: q } }, { summary: { contains: q } }];
  if (tag) where.tags = { contains: tag };

  const [items, total, allTags] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: sort === "hot" ? { views: "desc" } : { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.news.count({ where }),
    prisma.news.findMany({
      where: { published: true },
      select: { tags: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // 汇总全部标签用于筛选
  const tagSet = new Set<string>();
  allTags.forEach((n) => parseJsonTags(n.tags).forEach((t) => tagSet.add(t)));
  const tags = Array.from(tagSet);

  const buildHref = (over: Record<string, string | undefined>) => {
    const cur: Record<string, string | undefined> = { q, tag, sort, page: undefined };
    const merged = { ...cur, ...over };
    const p = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    const s = p.toString();
    return "/news" + (s ? "?" + s : "");
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">🌟 AI 资讯</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        每日追踪 AI 行业动态、产品发布与技术趋势。
      </p>

      {/* 搜索 + 排序 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <form
          action="/news"
          method="get"
          className="flex-1 flex items-center gap-2 px-3 h-10 rounded-full border"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        >
          {tag && <input type="hidden" name="tag" value={tag} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="搜索资讯标题或摘要…"
            className="bg-transparent outline-none text-sm flex-1"
          />
          <button type="submit" className="text-sm font-medium" style={{ color: "var(--primary)" }}>
            搜索
          </button>
        </form>
        <div className="flex items-center gap-1 text-sm">
          <Link
            href={buildHref({ sort: "latest", page: undefined })}
            className="px-3 py-1.5 rounded-full"
            style={
              sort === "latest"
                ? { background: "var(--primary)", color: "#fff" }
                : { border: "1px solid var(--border)" }
            }
          >
            最新
          </Link>
          <Link
            href={buildHref({ sort: "hot", page: undefined })}
            className="px-3 py-1.5 rounded-full"
            style={
              sort === "hot"
                ? { background: "var(--primary)", color: "#fff" }
                : { border: "1px solid var(--border)" }
            }
          >
            最热
          </Link>
        </div>
      </div>

      {/* 标签筛选 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href={buildHref({ tag: undefined, page: undefined })}
            className="text-xs px-3 py-1 rounded-full"
            style={
              !tag
                ? { background: "var(--bg-subtle)", color: "var(--primary)", fontWeight: 600 }
                : { border: "1px solid var(--border)" }
            }
          >
            全部
          </Link>
          {tags.map((t) => (
            <Link
              key={t}
              href={buildHref({ tag: t, page: undefined })}
              className="text-xs px-3 py-1 rounded-full"
              style={
                tag === t
                  ? { background: "var(--bg-subtle)", color: "var(--primary)", fontWeight: 600 }
                  : { border: "1px solid var(--border)" }
              }
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      {/* 列表 */}
      {items.length === 0 ? (
        <div
          className="card p-10 text-center text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          没有找到符合条件的资讯。
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((n) => (
            <NewsCard key={n.id} item={n} />
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8 text-sm">
          {page > 1 ? (
            <Link href={buildHref({ page: String(page - 1) })} className="px-3 py-1.5 rounded-full border" style={{ borderColor: "var(--border)" }}>
              ← 上一页
            </Link>
          ) : (
            <span className="px-3 py-1.5 rounded-full border opacity-40" style={{ borderColor: "var(--border)" }}>
              ← 上一页
            </span>
          )}
          <span style={{ color: "var(--text-muted)" }}>
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={buildHref({ page: String(page + 1) })} className="px-3 py-1.5 rounded-full border" style={{ borderColor: "var(--border)" }}>
              下一页 →
            </Link>
          ) : (
            <span className="px-3 py-1.5 rounded-full border opacity-40" style={{ borderColor: "var(--border)" }}>
              下一页 →
            </span>
          )}
        </div>
      )}
    </main>
  );
}
