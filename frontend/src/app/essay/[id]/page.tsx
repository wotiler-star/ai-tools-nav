import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { ESSAY_ARTICLES } from "@/lib/essayArticles";
import EssayArticleDetail, { type PostDetail } from "./EssayArticleDetail";

// 详情全文在服务端 JSON（不进客户端 bundle）
type DetailMap = Record<string, PostDetail>;
let detailCache: DetailMap | null = null;
function getDetail(id: string): PostDetail {
  if (!detailCache) {
    try {
      const file = path.join(process.cwd(), "data", "post-details.json");
      detailCache = JSON.parse(fs.readFileSync(file, "utf-8")) as DetailMap;
    } catch { detailCache = {}; }
  }
  return detailCache[id] || {};
}

// /essay 详情页：列表已切换为 666 条真实文章（ESSAY_ARTICLES），详情必须同源。
// 旧实现走 /ai_post/get（社区帖表），19 位真实文章 id 查不到 → 标题/正文兜底、SEO 全错、列表→详情断链。
// craft-anything Check 实证：线上用真实 id 打开详情，title=「社区帖子｜toolly」、真实标题命中 0。
function findArticle(id: string) {
  return ESSAY_ARTICLES.find((a) => String(a.id) === String(id));
}

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const article = findArticle(params.id);
  if (!article) {
    return {
      title: `文章未找到｜${SITE.name}`,
      description: `该 AI 文章不存在或已下线——${SITE.name}。`
    };
  }
  const summary = article.description.replace(/\s+/g, " ").slice(0, 120);
  return {
    title: `${article.title}｜${SITE.name}`,
    description: summary,
    alternates: { canonical: `/essay/${params.id}` },
    openGraph: {
      title: `${article.title}｜${SITE.name}`,
      description: summary,
      url: `/essay/${params.id}`,
      type: "article"
    }
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const article = findArticle(params.id);

  if (!article) {
    return (
      <div style={{ maxWidth: 820, margin: "0 auto", padding: 60, textAlign: "center", color: "#9ca3af" }}>
        文章不存在或已下线
        <div style={{ marginTop: 16 }}>
          <a href="/essay" style={{ color: "#3874F7" }}>返回文章列表</a>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "首页", item: `https://${SITE.domain}/` },
          { "@type": "ListItem", position: 2, name: "AI社区", item: `https://${SITE.domain}/essay` },
          { "@type": "ListItem", position: 3, name: article.title, item: `https://${SITE.domain}/essay/${params.id}` }
        ]
      },
      {
        "@type": "Article",
        headline: article.title,
        description: article.description.replace(/\s+/g, " ").slice(0, 160),
        url: `https://${SITE.domain}/essay/${params.id}`,
        datePublished: article.createTime ? new Date(article.createTime).toISOString() : undefined,
        keywords: article.tags.join(", ")
      }
    ]
  };

  return (
    <>
      <EssayArticleDetail article={article} detail={getDetail(params.id)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
