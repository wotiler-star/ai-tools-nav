import ToolGrid from "@/components/ToolGrid";
import Rankings from "@/components/Rankings";
import { tools } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 工具排行榜",
  description:
    "AI 工具热榜：按热度、收藏与评分排名，快速发现当下最受欢迎的 AI 写作、绘画、编程、办公等工具。",
  keywords: ["AI排行榜", "AI工具热榜", "热门AI工具", "AI工具排名"],
  alternates: { canonical: "/rankings" },
};

export default function RankingsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-5">📊 排行榜</h1>
      <Rankings tools={tools} />
    </main>
  );
}
