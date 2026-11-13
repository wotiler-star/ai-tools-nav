// 提示词页改为服务端取数：把首屏卡片作为 SWR fallbackData 注入客户端交互组件，
// 让 <h3>/分类 tab/卡片直接进入原始 HTML（对齐目标站 SSR 直出），
// 同时保留分类筛选、搜索、一键复制、收藏等客户端能力。
import { PROMPT_TEMPLATES } from "@/lib/mockData";
import { serverFetch, type PageResult } from "@/lib/serverApi";
import type { AiPrompt, BaseResponsePage } from "@/types";
import PaintingGallery from "./PaintingGallery";

export const dynamic = "force-dynamic";

/** 后端不可用时的兜底：复用提示词模板 mock，保证首屏永远不是空 Spin */
function fallbackRecords(): AiPrompt[] {
  return PROMPT_TEMPLATES.map((p) => ({
    id: p.id,
    title: p.title,
    content: `${p.tags.join("、")}风格的${p.title}，一键复制即可使用。`,
    categoryName: p.kind === "draw" ? "AI绘画" : "文案写作",
    useCount: p.useCount
  }));
}

export default async function PaintingPage() {
  const page = await serverFetch<PageResult<AiPrompt>>("/ai_prompt/list/page", {
    current: 1,
    pageSize: 50
  });
  const records =
    page?.records && page.records.length ? page.records : fallbackRecords();

  const initialData: BaseResponsePage<AiPrompt> = {
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

  return <PaintingGallery initialData={initialData} />;
}
