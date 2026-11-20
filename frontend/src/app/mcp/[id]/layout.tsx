import type { Metadata } from "next";
import { MCP_SERVERS } from "@/lib/mockData";
import type { McpServer } from "@/types";
import { SITE } from "@/config/site";

// MCP 详情页 SSR SEO：列表与详情同源（MCP_SERVERS 1291 条真实数据）。
// 旧实现是纯 client 组件，靠 useEffect 改 document.title —— 爬虫只能拿到 layout 的通用
// 「MCP 服务器｜toolly」，搜索引擎无法索引具体 MCP 条目。本 layout 在 server 端按 id
// 从本地数据取真实标题/描述生成 metadata + JSON-LD，零编造。
function findMcp(id: string): McpServer | undefined {
  const n = Number(id);
  return MCP_SERVERS.find((t) => t.id === n);
}

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const mcp = findMcp(params.id);
  if (!mcp) {
    return {
      title: `MCP 服务器｜${SITE.name}`,
      description: `在 ${SITE.name} 浏览优质 MCP 服务器，为 AI 客户端扩展外部能力。`
    };
  }
  const desc = `${mcp.description || ""} 分类：${mcp.category}。在 ${SITE.name} 发现更多优质 MCP 服务器。`;
  const slug = mcp.id;
  return {
    title: `${mcp.name}｜${SITE.name}`,
    description: desc.slice(0, 160),
    keywords: [mcp.name, mcp.category, ...(mcp.tags || []), "MCP", SITE.name],
    alternates: { canonical: `/mcp/${slug}` },
    openGraph: {
      title: `${mcp.name}｜${SITE.name}`,
      description: desc.slice(0, 160),
      url: `/mcp/${slug}`,
      type: "article"
    }
  };
}

// JSON-LD 由 client page.tsx 注入（内容更丰富：含 author/publisher），
// 此 layout 只负责 server 端 metadata，避免重复 schema。
export default function McpDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
