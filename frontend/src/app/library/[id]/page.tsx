import { serverGet } from "@/lib/server-api";
import LibraryDetailView from "./LibraryDetailView";
import type { AiColumn, AiArticle } from "@/types";

/**
 * /library/{id} 服务端壳 —— 首屏取数直出 DOM（SEO/Googlebot）。
 * 原先 page.tsx 整个是 "use client" + 3 个 useSWR，SSR 只有骨架（实测 DOM 正文 195 字）。
 * 改为 server 取数注入 client 组件 fallbackData 后正文直出，交互仍由 SWR 接管。
 */
export const dynamic = "force-dynamic";

interface ArticlePage {
  records: AiArticle[];
  total: number;
}
interface ColumnPage {
  records: AiColumn[];
  total: number;
}

export default async function LibraryDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [col, articles, siblings] = await Promise.all([
    serverGet<AiColumn>(`/ai_column/get/${id}`),
    serverGet<ArticlePage>("/ai_column/article/list", {
      current: 1, pageSize: 50, columnId: id, sort: "default"
    }),
    serverGet<ColumnPage>("/ai_column/list", {
      current: 1, pageSize: 20
    })
  ]);

  const allSiblings = siblings?.records ?? [];
  const catId = col?.categoryId;
  const filteredSiblings = catId
    ? allSiblings.filter((c) => c.categoryId === catId && String(c.id) !== String(id))
    : [];

  return (
    <LibraryDetailView
      params={{ id }}
      initialCol={col ?? null}
      initialArticles={articles ?? null}
      initialSiblings={filteredSiblings}
    />
  );
}
