// /essay 1:1 复刻目标站 https://ai.codefather.cn/essay（craft-anything 2026-11-25 抓取）
// 2026-11-26 扩采：服务端真分页。数据 = 13 条精选帖（11-25 DOM 抓取，推荐 tab 首屏 1:1）
//   + 907 条真实社区帖（api.codefather.cn /api/essay/list/page/vo，92 页全量，Temp/essay_expand/）
//   = 920 条 = 92 页 × 10 条/页，与目标站分页总数完全一致。
// 数据文件 frontend/data/essay-feed.json（630KB），Server Component 用 fs 读取
//（复用 painting-details.json 模式；Dockerfile runner 层已 COPY data）。
// 目标站原始文章画廊保留在 EssayArticlesGallery.tsx，供后续文章详情对照使用。
import fs from "fs";
import path from "path";
import CommunityFeed from "./CommunityFeed";
import { FEED_POSTS, FEED_TABS, type FeedPost } from "@/lib/essayFeedData";

export const metadata = {
  title: "AI学习交流社区 - toolly，AI工具提示词大全",
  description: "分享最新最有趣的 AI 工具、资源、信息"
};

type FeedPostEx = FeedPost & { createTime: number };

const PAGE_SIZE = 10;
/** 13 + 907 = 920 = 92 页，与目标站分页总数一致 */
const API_POSTS_LIMIT = 907;

function loadApiPosts(): FeedPostEx[] {
  const raw = fs.readFileSync(path.join(process.cwd(), "data", "essay-feed.json"), "utf-8");
  return JSON.parse(raw) as FeedPostEx[];
}

/** tab 过滤：与目标站各 tab 内容域对齐（启发式，11-25 抓取对齐口径） */
function filterByTab(list: FeedPostEx[], tab: string): FeedPostEx[] {
  if (tab === "精选") return list.filter(p => p.favorites >= 4);
  if (tab === "AI编程") return list.filter(p => p.tags.includes("AI编程"));
  if (tab === "AI智能体") return list.filter(p => p.title.includes("Agent") || p.tags.includes("AI智能体"));
  if (tab === "资源教程") return list.filter(p => p.tags.includes("编程") && p.tags.includes("程序员"));
  if (tab === "创意玩法") return list.filter(p => p.tags.includes("AI工具"));
  if (tab === "AI工具") return list.filter(p => p.title.includes("工具") || p.tags.includes("AI工具"));
  return list;
}

export default function EssayPage({
  searchParams
}: {
  searchParams?: { current?: string; tab?: string };
}) {
  const curated = FEED_POSTS as FeedPostEx[];
  const all: FeedPostEx[] = [...curated, ...loadApiPosts().slice(0, API_POSTS_LIMIT)];

  const tabParam = searchParams?.tab || "推荐";
  const activeTab = FEED_TABS.includes(tabParam) ? tabParam : "推荐";
  const filtered = filterByTab(all, activeTab);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const reqPage = parseInt(searchParams?.current || "1", 10) || 1;
  const page = Math.min(Math.max(1, reqPage), totalPages);
  const posts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return <CommunityFeed posts={posts} page={page} totalPages={totalPages} activeTab={activeTab} />;
}
