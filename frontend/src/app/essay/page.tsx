// /essay 1:1 对齐目标站 ai.codefather.cn/essay（craft-anything Study 2026-11-20）：
// 目标站是官方资讯文章流（recommend/list/page/vo，907 条），旧实现用社区帖 mock（周报/面经）。
// 改用采集到的 666 条真实文章数据 + 文章流组件。
import EssayArticlesGallery from "./EssayArticlesGallery";

export const metadata = {
  title: "AI学习交流社区 - toolly，AI工具提示词大全",
  description: "分享最新最有趣的 AI 工具、资源、信息"
};

export default function EssayPage({ searchParams }: { searchParams: { page?: string } }) {
  const initialPage = Math.max(1, Number(searchParams?.page) || 1);
  return <EssayArticlesGallery initialPage={initialPage} />;
}
