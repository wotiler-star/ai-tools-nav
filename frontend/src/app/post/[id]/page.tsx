import type { Metadata } from "next";
import { serverGet } from "@/lib/server-api";
import { SITE } from "@/config/site";
import { EssayClient } from "@/app/essay/[id]/EssayClient";

interface PostLite {
  id?: string | number;
  title?: string;
  content?: string;
}

/**
 * 帖子详情页（/post/[id]）
 * 对标站的帖子详情路由为 /post/{id}，此处与 /essay/[id] 共用同一套详情渲染，
 * 保证两条链接都能正常访问，canonical 指向 /post/{id}。
 */
export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = await serverGet<PostLite>(`/ai_post/get`, { id: params.id });
  if (!post || !post.title) {
    return {
      title: { absolute: `社区帖子｜${SITE.name}` },
      description: `AI 社区优质帖子分享，涵盖 AI 编程、工具与实战经验——${SITE.name}。`
    };
  }
  const summary = post.content
    ? post.content.replace(/\s+/g, " ").slice(0, 90)
    : "（暂无简介）";
  return {
    title: { absolute: `${post.title}｜${SITE.name}` },
    description: summary,
    alternates: { canonical: `/post/${params.id}` },
    openGraph: {
      title: `${post.title}｜${SITE.name}`,
      description: summary,
      url: `/post/${params.id}`,
      type: "article"
    }
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const post = await serverGet<PostLite>(`/ai_post/get`, { id: params.id });
  const jsonLd =
    post && post.title
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "首页", item: `https://${SITE.domain}/` },
                { "@type": "ListItem", position: 2, name: "AI社区", item: `https://${SITE.domain}/essay` },
                { "@type": "ListItem", position: 3, name: post.title, item: `https://${SITE.domain}/post/${params.id}` }
              ]
            },
            {
              "@type": "Article",
              headline: post.title,
              description: post.content ? post.content.replace(/\s+/g, " ").slice(0, 160) : "",
              url: `https://${SITE.domain}/post/${params.id}`
            }
          ]
        }
      : null;
  return (
    <>
      <EssayClient params={params} />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
}
