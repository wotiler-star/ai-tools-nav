import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 资讯",
  description:
    "每日更新 AI 行业热点资讯与动态，聚合 OpenAI、Anthropic、Google 等最新发布，支持按日期查询 AI 新闻。",
  alternates: { canonical: "/news" }
};

export default function NewsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
