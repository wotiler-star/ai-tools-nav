import type { Metadata } from "next";
import { listMcpServers, getMcpCategories } from "@/lib/entries";
import McpGrid from "@/components/McpGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "MCP 服务广场",
  description:
    "Model Context Protocol（MCP）服务广场：汇集文件、数据库、GitHub、搜索等各类 MCP 服务，让 AI 大模型连接真实世界工具与数据源。",
  keywords: ["MCP", "Model Context Protocol", "MCP 服务", "AI 工具协议", "AI 连接工具"],
  alternates: { canonical: "/mcp" },
  openGraph: {
    title: "MCP 服务广场 · AI 导航",
    description:
      "Model Context Protocol（MCP）服务广场：汇集文件、数据库、GitHub、搜索等各类 MCP 服务，让 AI 大模型连接真实世界工具与数据源。",
    url: "/mcp",
  },
};

export default async function McpPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const [items, categories] = await Promise.all([
    listMcpServers(),
    getMcpCategories(),
  ]);
  const sp = await searchParams;

  return <McpGrid items={items} categories={categories} submitted={sp.submitted === "1"} />;
}
