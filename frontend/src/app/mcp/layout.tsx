import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP 服务器",
  description:
    "发现全球好用的 MCP（Model Context Protocol）服务器，按分类浏览可接入大模型的工具与数据源。",
  alternates: { canonical: "/mcp" }
};

export default function McpLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
