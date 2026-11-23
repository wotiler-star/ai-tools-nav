import type { Metadata } from "next";
import { serverGet } from "@/lib/server-api";
import { TOOL_NUM_IDS } from "@/lib/toolRealIds";
import { SITE } from "@/config/site";

// 目标站真实 19 位 id → 本站数字 id 取数；对外 slug 仍用 URL 传入值（SEO 可对照目标站）
function resolveId(routeId: string): string {
  return /^\d{19}$/.test(routeId) ? (TOOL_NUM_IDS[routeId] || "0") : routeId;
}

interface ToolSEO {
  id?: string | number;
  name?: string;
  description?: string;
  tags?: string[];
  logo?: string;
  website?: string;
}

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const tool = await serverGet<ToolSEO>(`/ai_tool/get`, { id: resolveId(params.id) });
  if (!tool || !tool.name) {
    return {
      title: "AI 工具详情",
      description: `在 ${SITE.name} 浏览与发现优质 AI 工具、功能特点与使用方式。`
    };
  }
  const desc = `${tool.name}——${tool.description || ""} 功能、特点与使用方式，尽在 ${SITE.name}。`;
  const slug = params.id; // 对外 URL 保持目标站 19 位 id（可对照），数字 id 也原样保留
  return {
    title: tool.name,
    description: desc,
    keywords: [tool.name, ...(tool.tags || []), "AI工具", SITE.name],
    alternates: { canonical: `/tool/${slug}` },
    openGraph: {
      title: `${tool.name}｜${SITE.name}`,
      description: desc,
      url: `/tool/${slug}`,
      type: "article"
    }
  };
}

export default async function ToolDetailLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const tool = await serverGet<ToolSEO>(`/ai_tool/get`, { id: resolveId(params.id) });
  const slug = params.id;
  const jsonLd =
    tool && tool.name
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "首页", item: `https://${SITE.domain}/` },
                { "@type": "ListItem", position: 2, name: "AI工具", item: `https://${SITE.domain}/tool` },
                { "@type": "ListItem", position: 3, name: tool.name, item: `https://${SITE.domain}/tool/${slug}` }
              ]
            },
            {
              "@type": "SoftwareApplication",
              name: tool.name,
              description: tool.description || "",
              applicationCategory: "AIApplication",
              url: `https://${SITE.domain}/tool/${slug}`,
              ...(tool.logo ? { image: tool.logo } : {}),
              ...(tool.website ? { sameAs: tool.website } : {})
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
