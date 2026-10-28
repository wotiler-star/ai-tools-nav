import LearnFeed from "@/components/LearnFeed";

/**
 * AI 知识百科（导航「AI学习资源 → AI知识百科」）
 * 与 /resource/learn 同构：两栏 + h1「AI 知识百科」+ 搜索 + 文章流
 */
export default function EncyclopediaPage() {
  return (
    <LearnFeed
      title="AI 知识百科"
      category="wiki"
      searchPlaceholder="在「AI百科」中搜索"
      emoji="📚"
      hotTitle="热门百科"
      basePath="/resource/encyclopedia"
    />
  );
}
