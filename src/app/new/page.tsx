import ToolGrid from "@/components/ToolGrid";
import { tools } from "@/lib/mock-data";

export default function NewPage() {
  const latest = [...tools].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-5">🆕 最新收录</h1>
      <ToolGrid title="最新上架" items={latest} />
    </main>
  );
}
