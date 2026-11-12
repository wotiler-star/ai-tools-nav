import LearnFeed from "@/components/LearnFeed";

/**
 * AI 学习教程（导航「AI学习资源 → AI 学习教程」）
 * 1:1 对齐 ai.codefather.cn/resource/learn：两栏 + h1 + 搜索 + 12 篇真实文章流
 * （真实标题/摘要/封面来自 ARTICLES.tutorial），与 /resource/course、/encyclopedia 同构。
 */
export default function LearnPage() {
  return (
    <LearnFeed
      title="AI 学习教程"
      category="tutorial"
      searchPlaceholder="在「AI教程」中搜索"
      emoji="📘"
      hotTitle="热门教程"
      basePath="/resource/learn"
    />
  );
}
