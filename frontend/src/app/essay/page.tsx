// 社区页改为服务端取数：把首屏帖子作为 SWR fallbackData 注入客户端交互组件，
// 让 <article>/<h2> 直接进入原始 HTML（对齐目标站 SSR 直出），同时保留
// 排序 / 搜索 / 发帖弹窗 / 乐观更新等全部客户端能力。
import { ESSAY_POSTS } from "@/lib/mockData";
import { serverFetch, type PageResult } from "@/lib/serverApi";
import type { AiPost, BaseResponsePage } from "@/types";
import EssayFeed from "./EssayFeed";

export const dynamic = "force-dynamic";

/** 后端不可用时的兜底：复用社区 mock，保证首屏永远不是空 Spin */
function fallbackRecords(): AiPost[] {
  return ESSAY_POSTS.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.summary || p.title,
    authorName: p.authorName,
    authorAvatar: p.authorAvatar || "",
    thumbUrl: "",
    createTime: p.createTime,
    viewNum: 0,
    likeNum: p.likeNum,
    commentNum: p.commentNum
  }));
}

export default async function EssayPage() {
  const page = await serverFetch<PageResult<AiPost>>("/ai_post/list/page", {
    current: 1,
    pageSize: 50
  });
  const records =
    page?.records && page.records.length ? page.records : fallbackRecords();

  const initialData: BaseResponsePage<AiPost> = {
    code: 0,
    message: "ok",
    data: {
      records,
      total: page?.total || records.length,
      size: 50,
      current: 1,
      pages: 1
    }
  };

  return <EssayFeed initialData={initialData} />;
}
