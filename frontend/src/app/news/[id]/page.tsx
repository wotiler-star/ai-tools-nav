import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { serverFetch, type PageResult } from "@/lib/serverApi";
import { SITE } from "@/config/site";
import type { NewsItem } from "@/types";
import NewsDetail from "./NewsDetail";

interface Props {
  params: { id: string };
}

// 单次请求内复用同一份后端列表，generateMetadata 与 Page 只取一次
const getNews = cache(async () => {
  const raw = await serverFetch<PageResult<any>>("/ai_news/list/page", {
    current: 1,
    pageSize: 50
  });
  return raw?.records || [];
});

function norm(raw: any, i: number): NewsItem {
  return {
    id: raw.id,
    rank: typeof raw.sort === "number" && raw.sort > 0 ? raw.sort : i + 1,
    title: raw.title,
    hot: !!raw.hot,
    content: raw.content,
    summary: raw.summary,
    createTime: raw.createTime,
    source: raw.source,
    viewNum: raw.viewNum
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const records = await getNews();
  const idx = records.findIndex((r) => r.id === Number(params.id));
  if (idx < 0) {
    return { title: "资讯不存在", description: SITE.description };
  }
  const item = norm(records[idx], idx);
  const source = item.source || SITE.name;
  const desc = `AI 行业动态：${item.title}。来源 ${source}，${SITE.name} 为你持续追踪最新 AI 资讯。`;
  return {
    title: item.title,
    description: desc,
    alternates: { canonical: `/news/${item.id}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: desc,
      url: `https://${SITE.domain}/news/${item.id}`
    }
  };
}

export default async function Page({ params }: Props) {
  const records = await getNews();
  const idx = records.findIndex((r) => r.id === Number(params.id));
  if (idx < 0) notFound();
  const item = norm(records[idx], idx);
  const related: NewsItem[] = records
    .filter((_, i) => i !== idx)
    .slice(0, 5)
    .map((r, i) => norm(r, i));

  const source = item.source || SITE.name;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: `AI 行业动态：${item.title}`,
    datePublished: String(item.createTime || "").slice(0, 10) || new Date().toISOString().slice(0, 10),
    author: { "@type": "Organization", name: source },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `https://${SITE.domain}/icon.svg` }
    },
    mainEntityOfPage: `https://${SITE.domain}/news/${item.id}`
  };

  return (
    <>
      <NewsDetail item={item} related={related} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
