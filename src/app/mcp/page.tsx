import { listMcpServers, getMcpCategories } from "@/lib/entries";
import McpGrid from "@/components/McpGrid";

export const dynamic = "force-dynamic";

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
