import ToolGrid from "@/components/ToolGrid";
import { tools, getCategoryName } from "@/lib/mock-data";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const list = tools.filter((t) => t.category === slug);
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">{getCategoryName(slug)}</h1>
      <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
        共 {list.length} 个工具
      </p>
      <ToolGrid title="该分类工具" items={list} />
    </main>
  );
}
