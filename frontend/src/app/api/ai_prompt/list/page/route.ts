import { NextRequest, NextResponse } from "next/server";
import { AI_PROMPTS } from "@/lib/mockData";

// GET /api/ai_prompt/list/page?current=&pageSize=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const current = Number(searchParams.get("current") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "20");

  const total = AI_PROMPTS.length;
  const start = (current - 1) * pageSize;
  const records = AI_PROMPTS.slice(start, start + pageSize);

  return NextResponse.json({
    code: 0,
    data: { records, total, size: pageSize, current, pages: Math.ceil(total / pageSize) },
    message: "ok"
  });
}
