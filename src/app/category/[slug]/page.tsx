import type { Metadata } from "next";
import ToolGrid from "@/components/ToolGrid";
import JsonLd from "@/components/JsonLd";
import { tools, getCategoryName } from "@/lib/mock-data";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = getCategoryName(slug);
  const base = siteConfig.url.replace(/\/$/, "");
  return {
    title: `${name} - AI 工具`,
    description: `精选 ${name} 类 AI 工具合集，覆盖主流与新兴产品，帮助你快速找到最合适的 ${name} 工具。`,
    keywords: [name, `${name} AI 工具`, "AI工具分类"],
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: `${name} - AI 工具 · AI 导航`,
      description: `精选 ${name} 类 AI 工具合集，覆盖主流与新兴产品，帮助你快速找到最合适的 ${name} 工具。`,
      url: `/category/${slug}`,
    },
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = getCategoryName(slug);
  const list = tools.filter((t) => t.category === slug);
  const base = siteConfig.url.replace(/\/$/, "");

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: base },
      { "@type": "ListItem", position: 2, name: "AI 工具", item: `${base}/category` },
      { "@type": "ListItem", position: 3, name, item: `${base}/category/${slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">{name}</h1>
        <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
          共 {list.length} 个工具
        </p>
        <ToolGrid title="该分类工具" items={list} />
      </main>
    </>
  );
}
