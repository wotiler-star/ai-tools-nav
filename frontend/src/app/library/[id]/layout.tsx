import type { Metadata } from "next";
import { serverGet } from "@/lib/server-api";
import { SITE } from "@/config/site";

interface ColSEO {
  id?: string | number;
  title?: string;
  description?: string;
}

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const col = await serverGet<ColSEO>(`/ai_column/get/${params.id}`);
  if (!col || !col.title) {
    return {
      title: `AI 知识库专栏｜${SITE.name}`,
      description: `AI 知识库专栏与文章——${SITE.name}。`
    };
  }
  return {
    title: `${col.title}｜${SITE.name}`,
    description: `${col.title}——${col.description || ""} 精选 AI 知识库文章与实战教程，尽在 ${SITE.name}。`,
    alternates: { canonical: `/library/${params.id}` },
    openGraph: {
      title: `${col.title}｜${SITE.name}`,
      description: col.description || "",
      url: `/library/${params.id}`,
      type: "article"
    }
  };
}

export default async function LibraryDetailLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const col = await serverGet<ColSEO>(`/ai_column/get/${params.id}`);
  const jsonLd =
    col && col.title
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "首页", item: `https://${SITE.domain}/` },
                { "@type": "ListItem", position: 2, name: "AI知识库", item: `https://${SITE.domain}/library` },
                { "@type": "ListItem", position: 3, name: col.title, item: `https://${SITE.domain}/library/${params.id}` }
              ]
            },
            {
              "@type": "Article",
              headline: col.title,
              description: col.description || "",
              url: `https://${SITE.domain}/library/${params.id}`
            }
          ]
        }
      : null;
  return (
    <>
      {children}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
}
