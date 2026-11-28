import type { Metadata } from "next";
import { findMcp } from "@/lib/mcpLookup";
import { SITE } from "@/config/site";

/** MCP 详情页 SSR SEO：服务端按 19 位 id 从全量数据取真实标题/描述 */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const mcp = findMcp(params.id);
  if (!mcp) {
    return {
      title: `MCP 服务器｜${SITE.name}`,
      description: `在 ${SITE.name} 浏览优质 MCP 服务器，为 AI 客户端扩展外部能力。`
    };
  }
  const desc = `${mcp.description || ""} 分类：${mcp.category}。在 ${SITE.name} 发现更多优质 MCP 服务器。`;
  return {
    title: `${mcp.name}｜${SITE.name}`,
    description: desc.slice(0, 160),
    keywords: [mcp.name, mcp.category, ...(mcp.tags || []), "MCP", SITE.name],
    alternates: { canonical: `/mcp/${mcp.id}` },
    openGraph: {
      title: `${mcp.name}｜${SITE.name}`,
      description: desc.slice(0, 160),
      url: `/mcp/${mcp.id}`,
      type: "article"
    }
  };
}

export default function McpDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
