import { NextRequest, NextResponse } from "next/server";
import { addCategoryMock } from "@/lib/mockData";

// POST /api/admin/category/add
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!body?.name) {
    return NextResponse.json({ code: 40000, data: null, message: "分类名称不能为空" });
  }
  const id = addCategoryMock(body);
  return NextResponse.json({ code: 0, data: id, message: "ok" });
}
