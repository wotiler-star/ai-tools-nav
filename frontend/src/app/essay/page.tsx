// /essay 1:1 复刻目标站 https://ai.codefather.cn/essay（craft-anything 2026-11-25 抓取）
// 采用社区信息流：发帖框 + 分类 tab + 帖子卡片列表 + 右侧栏（推荐教程 / AI 资讯 / 公众号）
// 目标站原始文章画廊保留在 EssayArticlesGallery.tsx，供后续文章详情对照使用。
import CommunityFeed from "./CommunityFeed";

export const metadata = {
  title: "AI学习交流社区 - toolly，AI工具提示词大全",
  description: "分享最新最有趣的 AI 工具、资源、信息"
};

export default function EssayPage() {
  return <CommunityFeed />;
}
