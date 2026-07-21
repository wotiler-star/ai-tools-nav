import ToolGrid from "@/components/ToolGrid";
import { tools } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "最新收录的 AI 工具",
  description: "第一时间查看 AI 导航最新收录的 AI 工具，抢先体验新上架的 AI 写作、绘画、编程与办公产品。",
  keywords: ["最新AI工具", "新上架AI", "AI工具收录"],
  alternates: { canonical: "/new" },
};

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
