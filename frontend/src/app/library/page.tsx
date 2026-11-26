import LibraryIndex from "@/components/LibraryIndex";
import { serverGet } from "@/lib/server-api";
import type { AiColumn, AiColumnCategory } from "@/types";

/**
 * /library 知识库索引页 —— 1:1 对齐目标站 ai.codefather.cn/library（308→/library/{id}）
 * 目标站页型：内容落地页（🚀启航 Banner + 🧭知识库导航表格 + 长文叙事模块），
 * 组件基线：h1=2 h2=6 h3=7 h4=10 table=5 tr=31 a=97。
 * 本站用后端真实专栏数据映射：小节=分类、表格行=该分类下专栏；SSR 直出，语义层完整。
 * 专栏详情仍在 /library/[id]（本站结构化系统，保留）。
 */
export const dynamic = "force-dynamic";

interface PageResult<T> {
  records: T[];
  total: number;
}

export default async function LibraryPage() {
  const [catRes, colRes] = await Promise.all([
    serverGet<AiColumnCategory[]>("/ai_column/category/list"),
    serverGet<PageResult<AiColumn>>("/ai_column/list", { current: 1, pageSize: 200, sort: "default" })
  ]);

  const cats: AiColumnCategory[] = (catRes ?? [])
    .slice()
    .sort((a, b) => (a.sort || 0) - (b.sort || 0));

  const columns: AiColumn[] = colRes?.records ?? [];

  return <LibraryIndex columns={columns} cats={cats} />;
}
