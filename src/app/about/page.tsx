import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于 AI 导航",
  description:
    "AI 导航是一个面向中文用户的 AI 工具发现与社区平台，聚合精选工具、热榜、最新收录，并配套交流社区、AI 资讯与提示词广场。",
  keywords: ["关于AI导航", "AI导航介绍", "AI工具平台"],
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">关于 AI 导航</h1>
      <div className="card p-6 space-y-4 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
        <p>
          AI 导航是一个面向中文用户的 AI 工具发现与社区平台，聚合精选工具、热榜、最新收录，
          并配套交流社区、AI 资讯与提示词广场。
        </p>
        <p id="privacy">
          <strong style={{ color: "var(--text)" }}>隐私政策：</strong>
          本站演示项目仅在前端存储主题偏好，不收集任何个人敏感信息。
        </p>
        <p id="contact">
          <strong style={{ color: "var(--text)" }}>联系我们：</strong>
          hello@example.com
        </p>
      </div>
    </main>
  );
}
