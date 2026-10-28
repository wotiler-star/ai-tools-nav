import LearnFeed from "@/components/LearnFeed";

/**
 * AI 项目课程（导航「AI学习资源 → AI项目课程」）
 * 与 /resource/learn 同构：两栏 + h1「AI 项目课程」+ 搜索 + 文章流
 */
export default function CoursePage() {
  return (
    <LearnFeed
      title="AI 项目课程"
      category="course"
      searchPlaceholder="在「AI课程」中搜索"
      emoji="🧑‍💻"
      hotTitle="热门课程"
      basePath="/resource/course"
    />
  );
}
