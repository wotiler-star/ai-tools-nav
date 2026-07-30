import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 学习资源",
  description:
    "精选 AI 学习教程、课程与实战指南，搭配推荐教程与热门工具，助你系统入门人工智能。",
  alternates: { canonical: "/resource/learn" }
};

export default function LearnLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
