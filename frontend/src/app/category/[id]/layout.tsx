import type { Metadata } from "next";
import { serverGet } from "@/lib/server-api";
import { SITE } from "@/config/site";

interface CatSEO {
  id?: string | number;
  name?: string;
}

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const list = await serverGet<CatSEO[]>(`/category/list`);
  const cat = list?.find((c) => String(c.id) === String(params.id));
  const name = cat?.name || "分类";
  return {
    title: `${name} 工具｜${SITE.name}`,
    description: `收录「${name}」分类下的优质 AI 工具，功能、特点与直达链接——${SITE.name}。`,
    alternates: { canonical: `/category/${params.id}` },
    openGraph: {
      title: `${name} 工具｜${SITE.name}`,
      description: `收录 ${name} 分类下的优质 AI 工具。`,
      url: `/category/${params.id}`,
      type: "website"
    }
  };
}

export default async function CategoryDetailLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const list = await serverGet<CatSEO[]>(`/category/list`);
  const cat = list?.find((c) => String(c.id) === String(params.id));
  const name = cat?.name || "分类";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: `https://${SITE.domain}/` },
      { "@type": "ListItem", position: 2, name: "AI工具分类", item: `https://${SITE.domain}/tool` },
      { "@type": "ListItem", position: 3, name: name, item: `https://${SITE.domain}/category/${params.id}` }
    ]
  };
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
