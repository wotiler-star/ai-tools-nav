import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 社区",
  description:
    "AI 爱好者的交流社区，分享 AI 使用心得、提示词技巧、AI 编程与智能体实践，发现最新最有趣的 AI 玩法。",
  alternates: { canonical: "/essay" }
};

export default function EssayLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
