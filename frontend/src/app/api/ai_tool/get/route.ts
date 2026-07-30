import { NextRequest, NextResponse } from "next/server";
import { AI_TOOLS } from "@/lib/mockData";

// GET /api/ai_tool/get?id=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  const tool = AI_TOOLS.find((t) => t.id === id);
  if (!tool) {
    return NextResponse.json({ code: 404, data: null, message: "工具不存在" });
  }
  // 相关推荐：同分类其他工具
  const related = AI_TOOLS.filter(
    (t) => t.categoryId === tool.categoryId && t.id !== tool.id
  ).slice(0, 5);
  return NextResponse.json({
    code: 0,
    data: { ...tool, related },
    message: "ok"
  });
}
