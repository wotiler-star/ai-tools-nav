import type { Metadata } from "next";
import { serverGet } from "@/lib/server-api";
import { SITE } from "@/config/site";
import { ArticleClient } from "./ArticleClient";

interface ArtLite {
  id?: string | number;
  title?: string;
  columnId?: string | number;
  content?: string;
}

export async function generateMetadata({
  params
}: {
  params: { id: string; articleId: string };
}): Promise<Metadata> {
  const art = await serverGet<ArtLite>(`/ai_column/article/get/${params.articleId}`);
  const colId = art?.columnId ?? params.id;
  if (!art || !art.title) {
    return {
      title: `知识库文章｜${SITE.name}`,
      description: `AI 知识库优质文章，系统整理工具用法与实战教程——${SITE.name}。`
    };
  }
  const summary = art.content
    ? art.content.replace(/\s+/g, " ").slice(0, 90)
    : "（暂无简介）";
  const url = `/library/${colId}/${params.articleId}`;
  return {
    title: `${art.title}｜${SITE.name}`,
    description: summary,
    alternates: { canonical: url },
    openGraph: {
      title: `${art.title}｜${SITE.name}`,
      description: summary,
      url,
      type: "article"
    }
  };
}

export default async function Page({
  params
}: {
  params: { id: string; articleId: string };
}) {
  const art = await serverGet<ArtLite>(`/ai_column/article/get/${params.articleId}`);
  const colId = art?.columnId ?? params.id;
  const jsonLd =
    art && art.title
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "首页", item: `https://${SITE.domain}/` },
                { "@type": "ListItem", position: 2, name: "AI知识库", item: `https://${SITE.domain}/library` },
                { "@type": "ListItem", position: 3, name: art.title, item: `https://${SITE.domain}/library/${colId}/${params.articleId}` }
              ]
            },
            {
              "@type": "Article",
              headline: art.title,
              description: art.content ? art.content.replace(/\s+/g, " ").slice(0, 160) : "",
              url: `https://${SITE.domain}/library/${colId}/${params.articleId}`
            }
          ]
        }
      : null;
  return (
    <>
      <ArticleClient params={params} />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
}
