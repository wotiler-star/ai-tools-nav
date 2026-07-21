import FeaturedTop from "@/components/FeaturedTop";
import CommunityPreview from "@/components/CommunityPreview";
import NewsSection from "@/components/NewsSection";
import HotArticles from "@/components/HotArticles";
import PromptSquare from "@/components/PromptSquare";
import McpSection from "@/components/McpSection";
import SkillSection from "@/components/SkillSection";
import Recommend from "@/components/Recommend";
import LearnResources from "@/components/LearnResources";

// 首页区块顺序完全对齐鱼皮导航站，并在「AI提示词」后新增 MCP / Skills 两大区块：
// 精选推荐 → AI交流社区 → AI资讯 → 热门文章 → AI提示词 → MCP 服务广场 → Skills 技能库 → 推荐内容 → AI学习教程
export default function HomePage() {
  return (
    <main>
      <FeaturedTop />
      <CommunityPreview />
      <NewsSection />
      <HotArticles />
      <PromptSquare />
      <McpSection />
      <SkillSection />
      <Recommend />
      <LearnResources />
    </main>
  );
}
