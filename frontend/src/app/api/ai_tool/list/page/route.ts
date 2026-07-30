import { NextRequest, NextResponse } from "next/server";
import { AI_TOOLS } from "@/lib/mockData";

// GET /api/ai_tool/list/page?categoryId=&keyword=&current=&pageSize=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const keyword = (searchParams.get("keyword") || "").trim().toLowerCase();
  const current = Number(searchParams.get("current") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "60");

  let list = AI_TOOLS;
  if (categoryId && categoryId !== "0") {
    list = list.filter((t) => t.categoryId === Number(categoryId));
  }
  if (keyword) {
    list = list.filter(
      (t) =>
        t.name.toLowerCase().includes(keyword) ||
        t.description.toLowerCase().includes(keyword) ||
        t.tags.some((tag) => tag.toLowerCase().includes(keyword))
    );
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
