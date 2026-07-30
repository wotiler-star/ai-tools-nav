import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 知识库",
  description:
    "系统化的 AI 知识专栏合集，涵盖 AI 工具、提示词工程、AI 编程等主题的深度内容与教程。",
  alternates: { canonical: "/library" }
};

export default function LibraryLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
