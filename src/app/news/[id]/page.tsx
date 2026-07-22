import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Eye, ArrowLeft, ExternalLink, Calendar, Tag } from "lucide-react";
import { parseJsonTags, formatDate } from "@/lib/format";
import NewsCard from "@/components/NewsCard";

export const dynamic = "force-dynamic";

async function getNews(id: string) {
  return prisma.news.findFirst({
    where: { OR: [{ id }, { slug: id }], published: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const n = await getNews(id).catch(() => null);
  if (!n) return { title: "资讯未找到" };
  return {
    title: n.title,
    description: n.summary,
    keywords: parseJsonTags(n.tags),
    alternates: { canonical: `/news/${n.id}` },
    openGraph: {
      type: "article",
      title: n.title,
      description: n.summary,
      url: `/news/${n.id}`,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = await getNews(id);
  if (!news) notFound();

  // 浏览量 +1（写操作放在渲染内，生产环境每次访问计一次）
  try {
    await prisma.news.update({
      where: { id: news.id },
      data: { views: { increment: 1 } },
    });
  } catch {
    /* 忽略计数失败 */
  }

  const tags = parseJsonTags(news.tags);
  const related = await prisma.news
    .findMany({
      where: {
        published: true,
        id: { not: news.id },
        ...(tags[0] ? { tags: { contains: tags[0] } } : {}),
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    })
    .catch(() => []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/news"
        className="inline-flex items-center gap-1 text-sm hover:underline mb-5"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={14} /> 返回资讯列表
      </Link>

      {/* 封面 */}
      {news.cover && (
        <div
          className="h-48 rounded-xl flex items-center justify-center text-6xl mb-6"
          style={news.cover.includes("gradient") ? { background: news.cover } : undefined}
        >
          {news.cover.includes("gradient") ? "" : news.cover}
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{news.title}</h1>

      <div
        className="flex flex-wrap items-center gap-3 mt-3 text-sm"
        style={{ color: "var(--text-muted)" }}
      >
        <span>{news.source || "AI 导航"}</span>
        <span className="flex items-center gap-1">
          <Calendar size={13} /> {formatDate(news.publishedAt)}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={13} /> {news.views} 阅读
        </span>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((t) => (
            <Link
              key={t}
              href={`/news?tag=${encodeURIComponent(t)}`}
              className="text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1 hover:underline"
              style={{ background: "var(--bg-subtle)" }}
            >
              <Tag size={11} /> {t}
            </Link>
          ))}
        </div>
      )}

      <article
        className="mt-6 text-[15px] leading-7 whitespace-pre-wrap"
        style={{ color: "var(--text)" }}
      >
        {news.content || news.summary}
      </article>

      {news.sourceUrl && (
        <div className="mt-6">
          <a
            href={news.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-1.5 text-sm"
          >
            <ExternalLink size={15} /> 查看原文（{news.source}）
          </a>
        </div>
      )}

      {/* 相关推荐 */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold mb-4">相关推荐</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <NewsCard key={r.id} item={r} compact />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
