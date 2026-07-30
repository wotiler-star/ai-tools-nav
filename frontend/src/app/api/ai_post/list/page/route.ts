import { NextRequest, NextResponse } from "next/server";
import { AI_POSTS } from "@/lib/mockData";

// GET /api/ai_post/list/page?current=&pageSize=&keyword=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const current = Number(searchParams.get("current") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "12");
  const keyword = (searchParams.get("keyword") || "").trim().toLowerCase();

  let list = AI_POSTS;
  if (keyword) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        p.content.toLowerCase().includes(keyword)
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
