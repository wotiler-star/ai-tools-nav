import Link from "next/link";
import type { Metadata } from "next";
import ToolGrid from "@/components/ToolGrid";
import { tools, getCategoryName } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "搜索 AI 工具",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const kw = q.trim();
  const results = kw
    ? tools.filter(
        (t) =>
          t.name.includes(kw) ||
          t.summary.includes(kw) ||
          t.tags.some((tag) => tag.includes(kw))
      )
    : [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">
        搜索：<span style={{ color: "var(--primary)" }}>{kw || "（空）"}</span>
      </h1>
      <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
        共找到 {results.length} 个工具
      </p>
      {results.length ? (
        <ToolGrid title="结果" items={results} />
      ) : (
        <div className="card p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          没有匹配结果。换个关键词，或
          <Link href="/submit" className="mx-1 hover:underline" style={{ color: "var(--primary)" }}>
            提交一个工具
          </Link>
          。
        </div>
      )}
    </main>
  );
}
