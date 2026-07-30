import { NextRequest, NextResponse } from "next/server";
import { updateCategoryMock } from "@/lib/mockData";

// PUT /api/admin/category/update
export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!body?.id) {
    return NextResponse.json({ code: 40000, data: null, message: "缺少分类 id" });
  }
  const ok = updateCategoryMock(body);
  return NextResponse.json({ code: 0, data: ok, message: "ok" });
}
