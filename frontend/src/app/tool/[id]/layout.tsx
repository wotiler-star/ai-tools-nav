import type { Metadata } from "next";
import { AI_TOOLS } from "@/lib/mockData";

export function generateMetadata({
  params
}: {
  params: { id: string };
}): Metadata {
  const tool = AI_TOOLS.find((t) => String(t.id) === params.id);
  if (!tool) {
    return {
      title: "工具详情",
      description: "AI 工具详情——鱼皮AI导航。"
    };
  }
  const desc = `${tool.name}——${tool.description}`;
  return {
    title: tool.name,
    description: desc,
    keywords: [tool.name, ...tool.tags, "AI工具"],
    alternates: { canonical: `/tool/${tool.id}` },
    openGraph: {
      title: `${tool.name}｜鱼皮AI导航`,
      description: desc,
      url: `/tool/${tool.id}`,
      type: "article"
    }
  };
}

export default function ToolDetailLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
