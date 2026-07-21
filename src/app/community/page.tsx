import type { Metadata } from "next";
import CommunityClient from "@/components/CommunityClient";

export const metadata: Metadata = {
  title: "AI 交流社区",
  description:
    "AI 导航社区：和开发者、创作者一起聊 Claude Code、Midjourney、AI 工作流，分享教程、提问与作品展示。",
  keywords: ["AI社区", "AI交流", "AI论坛", "Claude Code", "AI教程分享"],
  alternates: { canonical: "/community" },
  openGraph: {
    title: "AI 交流社区 · AI 导航",
    description:
      "AI 导航社区：和开发者、创作者一起聊 Claude Code、Midjourney、AI 工作流，分享教程、提问与作品展示。",
    url: "/community",
  },
};

export default function CommunityPage() {
  return <CommunityClient />;
}
