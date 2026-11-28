import { notFound } from "next/navigation";
import { findMcp, detailSidebar } from "@/lib/mcpLookup";
import McpDetailClient from "./McpDetailClient";

/** MCP 详情：服务端按 19 位 id 查全量数据，只传主条目 + 侧栏切片给 client */
export default function McpDetailPage({ params }: { params: { id: string } }) {
  const tool = findMcp(params.id);
  if (!tool) notFound();
  const { latest, related } = detailSidebar(params.id, tool.category);
  return <McpDetailClient tool={tool} latest={latest} related={related} />;
}
