import { NextRequest, NextResponse } from "next/server";
import { KB_COLUMNS } from "@/lib/mockData";

// GET /api/ai_column/list?categoryId=&sort=hot|new&current=&pageSize=
// 对齐后端 /ai_column/list：返回知识库专栏（mock 数据源 KB_COLUMNS）。
// 排序：hot = 按文章数降序（热门专栏）；new = 保持原顺序。
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sort = (searchParams.get("sort") || "hot").toLowerCase();
  const current = Number(searchParams.get("current") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "20");

  let list = KB_COLUMNS;
  if (sort === "hot") {
    list = list.slice().sort((a, b) => b.articleCount - a.articleCount);
  }

  const total = list.length;
  const start = (current - 1) * pageSize;
  const records = list.slice(start, start + pageSize);

  return NextResponse.json({
    code: 0,
    data: { records, total, size: pageSize, current, pages: Math.ceil(total / pageSize) },
    message: "ok"
  });
}
